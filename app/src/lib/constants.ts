// Celo Mainnet Contract Addresses and Constants

// ============ Constants ============
export const PRODUCTION_URL = 'https://ecothailand.regenbazaar.com' as const;

// ============ Contract Addresses ============

// WETH Token on Celo Mainnet
export const WETH_ADDRESS = '0xD221812de1BD094f35587EE8E174B07B6167D9Af' as const;

// EcoThailand Impact Contract on Celo Mainnet (Mento Oracle Supported)
export const IMPACT_CONTRACT_ADDRESS = '0x95cD0E3bDbC670e057416D65C89B584a9a24d95d' as const;

// Mento ChainlinkRelayer for CELO/ETH on Celo L2 Mainnet
// Aggregates CELO/USD and ETH/USD feeds for WETH pricing
// NOTE: Contract now uses Mento SortedOracles directly for CELO/USD
export const CHAINLINK_RELAYER = '0xd5bAF8D2072B2dB54Bed9c4763D591a44C408A98' as const;

// Hardcoded CELO prices for fallback (Safety Net)
// Note: These should roughly align with $2, $5, $10, $17, $26 assuming ~$0.086 CELO
export const TIER_CELO_PRICES = {
  1: 23,
  2: 58,
  3: 115,
  4: 195,
  5: 300,
} as const;

// cUSD for fee currency support
export const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const;

// Fund Recipients (80/10/10 split)
export const RECIPIENTS = {
  ecoThailand: '0x35d46a6781d6e71b187786faaa98adcb331d4581',      // 80%
  ecoSynthesisX: '0x7380a42137d16a0e7684578d8b3d32e1fbd021b5',    // 10%
  refiGreenPill: '0xa8258ed271bb9be9d7e16c5818e45ef6f2577d92',    // 10%
} as const;

// ============ Level Metadata ============

export interface LevelData {
  id: number;
  name: string;
  priceUSD: number;
  action: string;             // [NEW]
  impactAchievement: string;  // [NEW]
  impact: string;
  impactStats: { label: string; value: string }[];
  description: string;
  image: string;
  proofLink?: string;
  video?: string;
  summaryPoints?: string[];
  glowColor: string;
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'Mangrove Seed',
    priceUSD: 2,
    action: 'Community Gardening',
    impactAchievement: '5+ gardens and 3+ workshops done',
    impact: '1 Mangrove Tree Planted',
    impactStats: [
      { label: 'Gardens', value: '5+' },
      { label: 'Workshops', value: '3+' }
    ],
    description: 'Plant a mangrove tree in the Thai Gulf to restore coastal ecosystems, sequester carbon, and protect biodiversity. Community Garden Projects identify species, geo-locate them, measure size, and calculate carbon capture.',
    image: '/images/level-1.jpg',
    proofLink: 'https://youtu.be/Xnbm3vVQleI',
    video: 'https://www.youtube.com/embed/Xnbm3vVQleI?si=Xnbm3vVQleI',
    summaryPoints: [
      'Establishing community gardens for food security',
      'Deploying composting systems to reduce waste',
      'Engaging locals in sustainable agriculture'
    ],
    glowColor: '#00FFA3'
  },
  {
    id: 2,
    name: 'Coral Architect',
    priceUSD: 5,
    action: 'Tree Preservation',
    impactAchievement: '5 sites zoned, 42 rai surveyed, 200 trees identified',
    impact: '1 Coral Frame Deployed',
    impactStats: [
      { label: 'Sites Zoned', value: '5' },
      { label: 'Trees ID\'d', value: '200' }
    ],
    description: 'Deploy a coral nursery frame to rebuild damaged reefs, providing habitat for marine life and protecting coastlines. EcoThailand Foundation catalogs and preserves key trees on the Gulf Islands.',
    image: '/images/level-2.jpg',
    proofLink: 'https://greenarea.dcce.go.th/in_province.php?id=67&member_id=ecothailand',
    summaryPoints: [
      'Cataloging and monitoring key island trees',
      'Training locals in arboriculture and care',
      'Mapping carbon capture data online'
    ],
    glowColor: '#00D1FF'
  },
  {
    id: 3,
    name: 'Coastal Guardian',
    priceUSD: 10,
    action: 'Eco Tourism Initiatives',
    impactAchievement: '20+ entities engaged and 5+ eco programs done',
    impact: '50kg Ocean Waste Removed',
    impactStats: [
      { label: 'Entities', value: '20+' },
      { label: 'Programs', value: '5+' }
    ],
    description: 'Fund the removal of 50kg of ocean debris and ghost nets, cleaning the waters and saving marine animals from entanglement. EcoThailand supports Sustainable, Eco, Agro, and Community Tourism.',
    image: '/images/level-3.jpg',
    proofLink: 'https://youtu.be/a76a83dzlt0?si=1aTCKCGAM6qL1hq8',
    video: 'https://www.youtube.com/embed/a76a83dzlt0?si=1aTCKCGAM6qL1hq8',
    summaryPoints: [
      'Funding eco-tourism micro-grants',
      'Developing sustainable travel workshops',
      'Supporting community-led tour activities'
    ],
    glowColor: '#FF9F1C'
  },
  {
    id: 4,
    name: 'Educational Guardian',
    priceUSD: 17,
    action: 'Educational Programs',
    impactAchievement: '1,000+ students engaged',
    impact: '1 Student Workshop Funded',
    impactStats: [
      { label: 'Students', value: '1,000+' },
      { label: 'Events', value: '600+' }
    ],
    description: 'Sponsor an educational workshop for local students to learn about marine conservation and become future guardians of the sea. Over 600 children have participated in various events.',
    image: '/images/level-4.jpg',
    proofLink: 'https://youtu.be/H86hHZK6I2s?si=iM_LZRwFyQ1WWbMs',
    video: 'https://www.youtube.com/embed/H86hHZK6I2s?si=iM_LZRwFyQ1WWbMs',
    summaryPoints: [
      'Mentoring youth in environmental leadership',
      'Conducting hands-on eco-activity days',
      'Teaching recycling and pollution control'
    ],
    glowColor: '#FF4D4D'
  },
  {
    id: 5,
    name: 'Regeneration Master',
    priceUSD: 26,
    action: 'Bio Waste Management',
    impactAchievement: '300+ entities, 2.5t CO2 saved, 5t waste/mo saved',
    impact: '1000m² Seagrass Protected',
    impactStats: [
      { label: 'Entities', value: '300+' },
      { label: 'CO2 Saved', value: '2.5t' }
    ],
    description: 'Protect and restore 1000m² of seagrass meadows, a vital carbon sink and nursery ground. Supporting Koh Phangan in reducing bio waste through eco-friendly methods.',
    image: '/images/level-5.jpg',
    proofLink: 'https://youtu.be/ptMCsz8kTyQ?si=sUHbQvp_Jz3r5_K5',
    video: 'https://www.youtube.com/embed/ptMCsz8kTyQ?si=sUHbQvp_Jz3r5_K5',
    summaryPoints: [
      'Eliminating bio-waste from landfills',
      'Producing high-stability biochar locally',
      'Distributing free composting systems'
    ],
    glowColor: '#A020F0'
  },
];

export const BUNDLE_DATA: LevelData = {
  id: 0,
  name: 'The Regeneration Bundle',
  priceUSD: 60,
  action: 'Total Ecosystem Restoration',
  impactAchievement: 'Comprehensive Gulf Regeneration',
  impact: 'All 5 Impact Levels at Once',
  impactStats: [
    { label: 'NFTs', value: '5' },
    { label: 'Total Price', value: '$60' }
  ],
  description: 'Maximize your impact by supporting all five restoration initiatives at once. This bundle includes the Mangrove Seed, Coral Architect, Coastal Guardian, Educational Guardian, and Regeneration Master NFTs in a single transaction.',
  image: '/images/level-1.jpg',
  summaryPoints: [
    'Plant Mangroves & Deploy Coral Frames',
    'Remove Ocean Waste & Fund Workshops',
    'Restore Seagrass & Manage Bio Waste',
    'Gas efficient batch minting'
  ],
  glowColor: '#FFD700'
};

// ============ UI Constants ============

export const MILESTONE_USD = 5000;

export const TWITTER_SHARE_TEXT = encodeURIComponent(
  "I just supported @EcoThailand's mission to regenerate the Thai Gulf! 🌊🌱\n\nFund your own tRWI (Tokenized Real-World Impact) and join the movement:\n\n#ReFi #tRWI #Celo #EcoThailand"
);

export const TWITTER_INTENT_URL = `https://twitter.com/intent/tweet?text=${TWITTER_SHARE_TEXT}`;
