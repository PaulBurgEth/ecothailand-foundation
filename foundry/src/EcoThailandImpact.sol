// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ISortedOracles
 * @dev Celo Mento SortedOracles Interface for native pricing
 */
interface ISortedOracles {
    function medianRate(address token) external view returns (uint256, uint256);
}

/**
 * @title EcoThailandImpact
 * @dev Sequential & Batch ERC-1155 Impact NFTs with CELO payment and Mento pricing
 */
contract EcoThailandImpact is ERC1155, Ownable, ReentrancyGuard {
    // ============ Constants ============
    uint256 public constant LEVEL_1 = 1;
    uint256 public constant LEVEL_2 = 2;
    uint256 public constant LEVEL_3 = 3;
    uint256 public constant LEVEL_4 = 4;
    uint256 public constant LEVEL_5 = 5;

    // Address of the Token to query Oracle for (e.g. cUSD)
    // Mento Oracles use this token address to give rate in CELO.
    address public oracleToken;

    // ============ State Variables ============
    
    // Mento SortedOracles
    ISortedOracles public sortedOracles;
    
    // Prices in USD (with 2 decimals: $2.00 = 200, $8.00 = 800, etc.)
    // Prices in USD (with 2 decimals: $2.00 = 200, $5.00 = 500, etc.)
    uint256[5] public levelPricesUSD = [200, 500, 1000, 1700, 2600];
    
    // Fund recipients (80% / 10% / 10%) - Made immutable for gas efficiency
    address payable public immutable WALLET_ECO;
    address payable public immutable WALLET_SYN;
    address payable public immutable WALLET_REFI;
    
    // Split percentages (in basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    // Total supply tracking per level
    mapping(uint256 => uint256) public totalSupply;
    
    // ============ Events ============
    event ImpactMinted(
        address indexed user,
        uint256 indexed level,
        uint256 celoAmount,
        uint256 usdValue
    );
    event ImpactBatchMinted(
        address indexed user,
        uint256[] levels,
        uint256 totalCeloAmount
    );
    event FundsDistributed(
        uint256 toEcoThailand,
        uint256 toEcoSynthesisX,
        uint256 toRefiGreenPill
    );
    event OracleUpdated(address indexed newOracle);

    // ============ Errors ============
    error InvalidLevel();
    error InsufficientPayment();
    error OracleReverted();
    error InvalidPrice();
    error TransferFailed();
    error ZeroAddress();

    // ============ Constructor ============
    constructor(
        address _sortedOracles,
        address _oracleToken,
        address payable _ecoThailand,
        address payable _ecoSynthesisX,
        address payable _refiGreenPill,
        string memory _baseUri
    ) ERC1155(_baseUri) Ownable(msg.sender) {
        if (_sortedOracles == address(0) || _oracleToken == address(0)) revert ZeroAddress();
        if (_ecoThailand == address(0) || _ecoSynthesisX == address(0) || _refiGreenPill == address(0)) {
            revert ZeroAddress();
        }
        
        sortedOracles = ISortedOracles(_sortedOracles);
        oracleToken = _oracleToken;
        WALLET_ECO = _ecoThailand;
        WALLET_SYN = _ecoSynthesisX;
        WALLET_REFI = _refiGreenPill;
    }

    // ============ Core Functions ============

    /**
     * @notice Mint an Impact Level NFT
     * @param levelId The level to mint (1-5)
     */
    function mintLevel(uint256 levelId) external payable nonReentrant {
        if (levelId < LEVEL_1 || levelId > LEVEL_5) revert InvalidLevel();
        
        uint256 usdPrice = levelPricesUSD[levelId - 1]; // e.g. 200 ($2.00)
        uint256 requiredCelo = getCeloPrice(usdPrice);
        
        if (msg.value < requiredCelo) revert InsufficientPayment();
        
        // Distribute funds immediately (any excess is kept by protocol or we can refund. 
        // For simplicity, we distribute full msg.value to benefit the cause)
        _distributeFunds(msg.value);
        
        _mint(msg.sender, levelId, 1, "");
        totalSupply[levelId]++;
        
        emit ImpactMinted(msg.sender, levelId, msg.value, usdPrice);
    }

    /**
     * @notice Mint multiple Impact Levels in a single transaction
     * @param levelIds Array of levels to mint
     */
    function mintBatchLevels(uint256[] calldata levelIds) external payable nonReentrant {
        uint256 totalUsdPrice = 0;
        uint256[] memory amounts = new uint256[](levelIds.length);
        
        for (uint256 i = 0; i < levelIds.length; i++) {
            uint256 lid = levelIds[i];
            if (lid < LEVEL_1 || lid > LEVEL_5) revert InvalidLevel();
            
            totalUsdPrice += levelPricesUSD[lid - 1];
            amounts[i] = 1;
            totalSupply[lid]++;
        }
        
        uint256 requiredCelo = getCeloPrice(totalUsdPrice);
        if (msg.value < requiredCelo) revert InsufficientPayment();
        
        _distributeFunds(msg.value);
        
        _mintBatch(msg.sender, levelIds, amounts, "");
        
        emit ImpactBatchMinted(msg.sender, levelIds, msg.value);
    }

    /**
     * @notice Get the CELO amount required for a given USD price
     * @param usdAmount Price in USD cents (e.g., 200 = $2.00)
     */
    function getCeloPrice(uint256 usdAmount) public view returns (uint256) {
        // 1. Get CELO/cUSD rate from Mento
        // medianRate(cUSD) returns (num, denom) = Amount of CELO per 1 cUSD
        
        (uint256 num, uint256 denom) = sortedOracles.medianRate(oracleToken);
        if (num == 0 || denom == 0) revert OracleReverted();

        // Formula:
        // Wei Needed = (USD_Value_in_Wei) * Rate
        // Rate = num / denom (CELO per cUSD)
        // USD_Value_in_Wei = usdAmount * 1e16 (since usdAmount is cents: 200 * 1e16 = 2 * 1e18)
        
        // Wei = (usdAmount * 1e16 * denom) / num
        
        return (usdAmount * 1e16 * denom) / num;
    }

    // ============ Internal Functions ============

    function _distributeFunds(uint256 amount) internal {
        uint256 shareEco = (amount * 80) / 100;
        uint256 shareSyn = (amount * 10) / 100;
        uint256 shareReFi = amount - shareEco - shareSyn;
        
        (bool s1, ) = WALLET_ECO.call{value: shareEco}("");
        require(s1, "Split 1 Failed");
        
        (bool s2, ) = WALLET_SYN.call{value: shareSyn}("");
        require(s2, "Split 2 Failed");
        
        (bool s3, ) = WALLET_REFI.call{value: shareReFi}("");
        require(s3, "Split 3 Failed");
        
        emit FundsDistributed(shareEco, shareSyn, shareReFi);
    }

    // ============ Owner Functions ============

    function setSortedOracles(address _sortedOracles) external onlyOwner {
        if (_sortedOracles == address(0)) revert ZeroAddress();
        sortedOracles = ISortedOracles(_sortedOracles);
        emit OracleUpdated(_sortedOracles);
    }
    
    function setOracleToken(address _token) external onlyOwner {
        oracleToken = _token;
    }

    function setURI(string memory newUri) external onlyOwner {
        _setURI(newUri);
    }

    function withdrawStuckTokens(address token, uint256 amount) external onlyOwner {
        (bool s, ) = token.call(abi.encodeWithSignature("transfer(address,uint256)", owner(), amount));
        require(s, "Transfer Failed");
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
