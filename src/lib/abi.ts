export const IMPACT_CONTRACT_ABI = [
    // Read Functions
    {
        inputs: [{ name: 'account', type: 'address' }, { name: 'id', type: 'uint256' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'usdAmount', type: 'uint256' }],
        name: 'getCeloPrice',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getTotalRaisedUSD',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'user', type: 'address' }],
        name: 'getUserLevels',
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'user', type: 'address' }, { name: 'levelId', type: 'uint256' }],
        name: 'canMintLevel',
        outputs: [{ name: 'canMint', type: 'bool' }, { name: 'reason', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: '', type: 'uint256' }],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: '', type: 'uint256' }],
        name: 'levelPricesUSD',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    // Write Functions
    {
        inputs: [{ name: 'levelId', type: 'uint256' }],
        name: 'mintLevel',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [{ name: 'levelIds', type: 'uint256[]' }],
        name: 'mintBatchLevels',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    // Events
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'user', type: 'address' },
            { indexed: true, name: 'level', type: 'uint256' },
            { indexed: false, name: 'celoAmount', type: 'uint256' },
            { indexed: false, name: 'usdValue', type: 'uint256' },
        ],
        name: 'ImpactMinted',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'user', type: 'address' },
            { indexed: false, name: 'levels', type: 'uint256[]' },
            { indexed: false, name: 'totalCeloAmount', type: 'uint256' },
        ],
        name: 'ImpactBatchMinted',
        type: 'event',
    },
] as const;

export const ERC20_ABI = [
    {
        inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;
