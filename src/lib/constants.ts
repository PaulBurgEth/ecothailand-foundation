// Celo Mainnet Contract Addresses and Constants

// ============ Contract Addresses ============

// WETH Token on Celo Mainnet
export const WETH_ADDRESS = '0xD221812de1BD094f35587EE8E174B07B6167D9Af' as const;

// EcoThailand Impact Contract on Celo Sepolia Testnet
export const IMPACT_CONTRACT_ADDRESS = '0x6446cf9161f58a3fadef2f3711265054c5da84ac' as const;

// Mento ChainlinkRelayer for CELO/ETH on Celo L2 Mainnet
// Aggregates CELO/USD and ETH/USD feeds for WETH pricing
export const CHAINLINK_RELAYER = '0xd5bAF8D2072B2dB54Bed9c4763D591a44C408A98' as const;

// Hardcoded CELO prices for fallback (Safety Net)
// Tier 1 ($2): 3.5 CELO
// Tier 2 ($8): 14 CELO
// Tier 3 ($14): 24 CELO
// Tier 4 ($20): 34 CELO
// Tier 5 ($26): 44 CELO
export const TIER_CELO_PRICES = {
  1: 3.5,
  2: 14,
  3: 24,
  4: 34,
  5: 44,
} as const;

// cUSD for fee currency support
export const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const;

// Fund Recipients (80/10/10 split)
export const RECIPIENTS = {
  ecoThailand: '0x35d46a6781d6e71b187786faaa98adcb331d4581',      // 80%
  ecoSynthesisX: '0x7380a42137d16a0e7684578d8b3d32e1fbd021b5',    // 10%
  refiGreenPill: '0xa8258ed271bb9be9d7e16c5818e45ef6f2577d92',    // 10% (ReFi & GreenPill Phangan)
} as const;

// ============ Level Metadata ============

export interface LevelData {
  id: number;
  name: string;
  priceUSD: number;
  impact: string;
  impactStats: { label: string; value: string }[];
  description: string;
  image: string;
  proofLink: string;
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'Seed Sower',
    priceUSD: 2,
    impact: 'Community Garden Support',
    impactStats: [
      { label: 'Gardens', value: '5+' },
      { label: 'Workshops', value: '3+' }
    ],
    description:
      'Directly funds community gardens established in response to the COVID-19 crisis, providing sustainable food systems.',
    image: '/images/level-1.jpg',
    proofLink: 'https://cleanphangan.com',
  },
  {
    id: 2,
    name: 'Sapling Protector',
    priceUSD: 8,
    impact: 'Tree Nursery & Preservation',
    impactStats: [
      { label: 'Sites', value: '5' },
      { label: 'Trees', value: '200' }
    ],
    description:
      'Cataloging and preserving key trees on the Gulf Islands, identifying species and calculating carbon capture.',
    image: '/images/level-2.png',
    proofLink: 'https://cleanphangan.com',
  },
  {
    id: 3,
    name: 'Garden Guardian',
    priceUSD: 14,
    impact: 'Permaculture Maintenance',
    impactStats: [
      { label: 'Entities', value: '20+' },
      { label: 'Programs', value: '5+' }
    ],
    description:
      'Supporting Sustainable, Eco, Agro, and Community Tourism through workshops and MicroGrants.',
    image: '/images/level-3.png',
    proofLink: 'https://cleanphangan.com',
  },
  {
    id: 4,
    name: 'Ecosystem Architect',
    priceUSD: 20,
    impact: 'Water & Soil Systems',
    impactStats: [
      { label: 'Students', value: '1,000+' },
      { label: 'Programs', value: '1' }
    ],
    description:
      'Funding beach contaminant analysis and nature spy sessions for the Environmental Guardianship program.',
    image: '/images/level-4.png',
    proofLink: 'https://cleanphangan.com',
  },
  {
    id: 5,
    name: 'Waste Warrior',
    priceUSD: 26,
    impact: 'Ocean/Plastic Removal',
    impactStats: [
      { label: 'CO2 Saved', value: '2.5t' },
      { label: 'Waste/Mo', value: '5t' }
    ],
    description:
      'Reducing bio waste and ocean plastic through Bio Char and community composting facilities.',
    image: '/images/level-5.png',
    proofLink: 'https://cleanphangan.com',
  },
];

// ============ UI Constants ============

export const MILESTONE_USD = 5000; // $5,000 goal for progress bar

export const TWITTER_SHARE_TEXT = encodeURIComponent(
  "I just supported @EcoThailand's mission to regenerate the Thai Gulf! 🌊🌱\n\nCollect your own Impact Product and join the movement:\n\n#ReFi #ImpactNFT #Celo #EcoThailand"
);

export const TWITTER_INTENT_URL = `https://twitter.com/intent/tweet?text=${TWITTER_SHARE_TEXT}`;
