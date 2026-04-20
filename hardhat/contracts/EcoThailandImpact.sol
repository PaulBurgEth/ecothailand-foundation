// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AggregatorV3Interface
 * @dev Chainlink Price Feed interface
 */
interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function decimals() external view returns (uint8);
}

/**
 * @title EcoThailandImpact
 * @dev Sequential ERC-1155 Impact NFTs with WETH payment and Chainlink pricing
 * @notice Users must own Level 1 to mint Level 2, Level 2 to mint Level 3, etc.
 */
contract EcoThailandImpact is ERC1155, Ownable, ReentrancyGuard {
    // ============ Constants ============
    uint256 public constant LEVEL_1 = 1;
    uint256 public constant LEVEL_2 = 2;
    uint256 public constant LEVEL_3 = 3;
    uint256 public constant LEVEL_4 = 4;
    uint256 public constant LEVEL_5 = 5;

    // ============ State Variables ============
    
    // WETH Token address on Celo Mainnet
    IERC20 public immutable weth;
    
    // Chainlink ETH/USD Price Feed
    AggregatorV3Interface public priceFeed;
    
    // Prices in USD (with 2 decimals: $2.00 = 200)
    uint256[5] public levelPricesUSD = [200, 500, 1000, 1700, 2600];
    
    // Fund recipients (80% / 10% / 10%)
    address public ecoThailand;
    address public ecoSynthesisX;
    address public refiGreenPill;
    
    // Split percentages (in basis points: 8000 = 80%)
    uint256 public constant ECO_THAILAND_SHARE = 8000;
    uint256 public constant ECO_SYNTHESISX_SHARE = 1000;
    uint256 public constant REFI_GREENPILL_SHARE = 1000;
    uint256 public constant BASIS_POINTS = 10000;
    
    // Total supply tracking per level
    mapping(uint256 => uint256) public totalSupply;
    
    // Fallback price if oracle fails (in USD with 8 decimals, e.g., 3000 * 1e8 = $3000)
    uint256 public fallbackEthPriceUSD;
    bool public useFallbackPrice;
    
    // Oracle staleness threshold (2 hours)
    uint256 public constant ORACLE_STALENESS_THRESHOLD = 2 hours;

    // ============ Events ============
    event ImpactMinted(
        address indexed user,
        uint256 indexed level,
        uint256 wethAmount,
        uint256 usdValue
    );
    event FundsDistributed(
        uint256 toEcoThailand,
        uint256 toEcoSynthesisX,
        uint256 toRefiGreenPill
    );
    event FallbackPriceSet(uint256 newPrice, bool enabled);
    event RecipientsUpdated(address ecoThailand, address ecoSynthesisX, address refiGreenPill);
    event PriceFeedUpdated(address newPriceFeed);

    // ============ Errors ============
    error InvalidLevel();
    error MustOwnPreviousLevel(uint256 requiredLevel);
    error AlreadyOwnsLevel(uint256 level);
    error InsufficientWETHAllowance();
    error InsufficientWETHBalance();
    error OracleStale();
    error InvalidPrice();
    error TransferFailed();
    error ZeroAddress();

    // ============ Constructor ============
    constructor(
        address _weth,
        address _priceFeed,
        address _ecoThailand,
        address _ecoSynthesisX,
        address _refiGreenPill,
        string memory _baseUri
    ) ERC1155(_baseUri) Ownable(msg.sender) {
        if (_weth == address(0) || _priceFeed == address(0)) revert ZeroAddress();
        if (_ecoThailand == address(0) || _ecoSynthesisX == address(0) || _refiGreenPill == address(0)) {
            revert ZeroAddress();
        }
        
        weth = IERC20(_weth);
        priceFeed = AggregatorV3Interface(_priceFeed);
        ecoThailand = _ecoThailand;
        ecoSynthesisX = _ecoSynthesisX;
        refiGreenPill = _refiGreenPill;
        
        // Set initial fallback price ($3000 ETH with 8 decimals)
        fallbackEthPriceUSD = 3000 * 1e8;
    }

    // ============ Core Functions ============

    /**
     * @notice Mint an Impact Level NFT
     * @param levelId The level to mint (1-5)
     * @dev Requires sequential ownership and WETH payment
     */
    function mintLevel(uint256 levelId) external nonReentrant {
        // Validate level
        if (levelId < LEVEL_1 || levelId > LEVEL_5) revert InvalidLevel();
        
        // Check user doesn't already own this level
        if (balanceOf(msg.sender, levelId) > 0) revert AlreadyOwnsLevel(levelId);
        
        // Sequential enforcement: must own previous level (except Level 1)
        if (levelId > LEVEL_1) {
            if (balanceOf(msg.sender, levelId - 1) == 0) {
                revert MustOwnPreviousLevel(levelId - 1);
            }
        }
        
        // Calculate WETH price
        uint256 usdPrice = levelPricesUSD[levelId - 1];
        uint256 wethAmount = getWethPrice(usdPrice);
        
        // Verify allowance and balance
        if (weth.allowance(msg.sender, address(this)) < wethAmount) {
            revert InsufficientWETHAllowance();
        }
        if (weth.balanceOf(msg.sender) < wethAmount) {
            revert InsufficientWETHBalance();
        }
        
        // Transfer WETH from user
        bool success = weth.transferFrom(msg.sender, address(this), wethAmount);
        if (!success) revert TransferFailed();
        
        // Distribute funds immediately (80/10/10)
        _distributeFunds(wethAmount);
        
        // Mint the NFT
        _mint(msg.sender, levelId, 1, "");
        totalSupply[levelId]++;
        
        emit ImpactMinted(msg.sender, levelId, wethAmount, usdPrice);
    }

    /**
     * @notice Get the WETH amount required for a given USD price
     * @param usdAmount Price in USD cents (e.g., 200 = $2.00)
     * @return wethAmount Amount of WETH required (18 decimals)
     */
    function getWethPrice(uint256 usdAmount) public view returns (uint256) {
        uint256 ethPriceUSD = _getEthPriceUSD();
        
        // Convert: usdAmount is in cents (2 decimals)
        // ethPriceUSD is from Chainlink (8 decimals)
        // Result should be in WETH (18 decimals)
        // Formula: (usdAmount / 100) / (ethPriceUSD / 1e8) * 1e18
        // Simplified: (usdAmount * 1e18 * 1e8) / (100 * ethPriceUSD)
        // = (usdAmount * 1e24) / (ethPriceUSD * 100)
        
        return (usdAmount * 1e24) / (ethPriceUSD * 100);
    }

    /**
     * @notice Get WETH price for a specific level
     * @param levelId The level (1-5)
     * @return wethAmount Amount of WETH required
     */
    function getLevelWethPrice(uint256 levelId) external view returns (uint256) {
        if (levelId < LEVEL_1 || levelId > LEVEL_5) revert InvalidLevel();
        return getWethPrice(levelPricesUSD[levelId - 1]);
    }

    /**
     * @notice Check if a user can mint a specific level
     * @param user Address to check
     * @param levelId Level to check
     * @return canMint Whether the user can mint
     * @return reason Reason code (0=can mint, 1=already owns, 2=missing previous)
     */
    function canMintLevel(address user, uint256 levelId) external view returns (bool canMint, uint8 reason) {
        if (levelId < LEVEL_1 || levelId > LEVEL_5) return (false, 3);
        
        if (balanceOf(user, levelId) > 0) return (false, 1);
        
        if (levelId > LEVEL_1 && balanceOf(user, levelId - 1) == 0) {
            return (false, 2);
        }
        
        return (true, 0);
    }

    /**
     * @notice Get user's owned levels as a bitmask
     * @param user Address to check
     * @return levels Bitmask of owned levels (bit 0 = level 1, etc.)
     */
    function getUserLevels(address user) external view returns (uint8 levels) {
        for (uint256 i = LEVEL_1; i <= LEVEL_5; i++) {
            if (balanceOf(user, i) > 0) {
                levels |= uint8(1 << (i - 1));
            }
        }
    }

    /**
     * @notice Calculate total USD raised across all levels
     * @return totalUSD Total USD raised (in cents)
     */
    function getTotalRaisedUSD() external view returns (uint256 totalUSD) {
        for (uint256 i = LEVEL_1; i <= LEVEL_5; i++) {
            totalUSD += totalSupply[i] * levelPricesUSD[i - 1];
        }
    }

    // ============ Internal Functions ============

    function _getEthPriceUSD() internal view returns (uint256) {
        if (useFallbackPrice) {
            return fallbackEthPriceUSD;
        }
        
        (
            uint80 roundId,
            int256 answer,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        
        // Validate oracle data
        if (answer <= 0) revert InvalidPrice();
        if (updatedAt == 0) revert OracleStale();
        if (block.timestamp - updatedAt > ORACLE_STALENESS_THRESHOLD) revert OracleStale();
        if (answeredInRound < roundId) revert OracleStale();
        
        return uint256(answer);
    }

    function _distributeFunds(uint256 amount) internal {
        uint256 toEcoThailand = (amount * ECO_THAILAND_SHARE) / BASIS_POINTS;
        uint256 toEcoSynthesisX = (amount * ECO_SYNTHESISX_SHARE) / BASIS_POINTS;
        uint256 toRefiGreenPill = amount - toEcoThailand - toEcoSynthesisX;
        
        bool success1 = weth.transfer(ecoThailand, toEcoThailand);
        bool success2 = weth.transfer(ecoSynthesisX, toEcoSynthesisX);
        bool success3 = weth.transfer(refiGreenPill, toRefiGreenPill);
        
        if (!success1 || !success2 || !success3) revert TransferFailed();
        
        emit FundsDistributed(toEcoThailand, toEcoSynthesisX, toRefiGreenPill);
    }

    // ============ Owner Functions ============

    /**
     * @notice Set fallback ETH price (for oracle failure)
     * @param priceUSD Price in USD with 8 decimals
     * @param enable Whether to use fallback price
     */
    function setFallbackPrice(uint256 priceUSD, bool enable) external onlyOwner {
        if (priceUSD == 0) revert InvalidPrice();
        fallbackEthPriceUSD = priceUSD;
        useFallbackPrice = enable;
        emit FallbackPriceSet(priceUSD, enable);
    }

    /**
     * @notice Update fund recipient addresses
     */
    function setRecipients(
        address _ecoThailand,
        address _ecoSynthesisX,
        address _refiGreenPill
    ) external onlyOwner {
        if (_ecoThailand == address(0) || _ecoSynthesisX == address(0) || _refiGreenPill == address(0)) {
            revert ZeroAddress();
        }
        ecoThailand = _ecoThailand;
        ecoSynthesisX = _ecoSynthesisX;
        refiGreenPill = _refiGreenPill;
        emit RecipientsUpdated(_ecoThailand, _ecoSynthesisX, _refiGreenPill);
    }

    /**
     * @notice Update Chainlink price feed address
     */
    function setPriceFeed(address _priceFeed) external onlyOwner {
        if (_priceFeed == address(0)) revert ZeroAddress();
        priceFeed = AggregatorV3Interface(_priceFeed);
        emit PriceFeedUpdated(_priceFeed);
    }

    /**
     * @notice Update base URI for metadata
     */
    function setURI(string memory newUri) external onlyOwner {
        _setURI(newUri);
    }

    /**
     * @notice Emergency withdraw if tokens get stuck
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }

    // ============ Metadata ============

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(tokenId), "/", _toString(tokenId), ".json"));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
