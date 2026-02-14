
const fs = require('fs');
const path = require('path');

// Ensure the directory exists
const metadataDir = path.resolve(__dirname, '../metadata_export');
if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
}

// Data from constants (or derived)
// We use the IPFS images we just uploaded (hardcoded here for safety/speed based on previous step results)
const IPFS_IMAGES = {
    1: 'ipfs://bafybeih5poufyf2gb56wuxkxdtjxyxajpzxce7furkq2n2pqxkgxutgr6e',
    2: 'ipfs://bafybeia756vgg2vu5ctjgaffioy65jorfltd7qmmi3w62mwnkds3w7drwe',
    3: 'ipfs://bafybeifqqgvcp5vmfj77dcgo453mkhqxe7c3zuaxpbmwguw7bmzsr5ewka',
    4: 'ipfs://bafybeia6kfopep2ygsbw7hrbpcsvdrdl52rmusnrsnd7wg7usj3zr4qnjm',
    5: 'ipfs://bafybeiaxx6n6gt3afcglag6bq3tmlzxgjkjupfebrxagp77wyuq5cvxcxm'
};

const COMMON_ATTRIBUTES = [
    { trait_type: 'Type', value: 'Impact Product' },
    { trait_type: 'Entity', value: 'EcoThailand Foundation' },
    { trait_type: 'Field', value: 'Environmental Conservation, Educational & Social programs' }
];

const LEVELS = [
    {
        id: 1,
        name: 'Mangrove Seed',
        description: 'Plant a mangrove tree in the Thai Gulf to restore coastal ecosystems, sequester carbon, and protect biodiversity.',
        attributes: [
            ...COMMON_ATTRIBUTES,
            { trait_type: 'Action', value: 'Community Gardening' },
            { trait_type: 'Impact Achievement', value: '5+ gardens and 3+ workshops done' }
        ]
    },
    {
        id: 2,
        name: 'Coral Architect',
        description: 'Deploy a coral nursery frame to rebuild damaged reefs, providing habitat for marine life and protecting coastlines.',
        attributes: [
            ...COMMON_ATTRIBUTES,
            { trait_type: 'Action', value: 'Tree Preservation' },
            { trait_type: 'Impact Achievement', value: '5 sites zoned, around 42 rai surveyed and around total of 200 trees identified' }
        ]
    },
    {
        id: 3,
        name: 'Coastal Guardian',
        description: 'Fund the removal of 50kg of ocean debris and ghost nets, cleaning the waters and saving marine animals from entanglement.',
        attributes: [
            ...COMMON_ATTRIBUTES,
            { trait_type: 'Action', value: 'Eco tourism Initiatives' },
            { trait_type: 'Impact Achievement', value: '20+ entity engaged and 5+ eco programs done' }
        ]
    },
    {
        id: 4,
        name: 'Educational Guardian',
        description: 'Sponsor an educational workshop for local students to learn about marine conservation and become future guardians of the sea.',
        attributes: [
            ...COMMON_ATTRIBUTES,
            { trait_type: 'Action', value: 'Educational Programs' },
            { trait_type: 'Impact Achievement', value: '1,000+ students engaged' }
        ]
    },
    {
        id: 5,
        name: 'Regeneration Master',
        description: 'Protect and restore 1000m² of seagrass meadows, a vital carbon sink and nursery ground.',
        attributes: [
            ...COMMON_ATTRIBUTES,
            { trait_type: 'Action', value: 'Bio Waste Management' },
            { trait_type: 'Impact Achievement', value: '300+ entities participated, 2.5 tons of CO2 saved, saving over 5 tons of waste per month from incineration or landfill' }
        ]
    }
];

function main() {
    console.log('Generating metadata JSONs...');

    for (const level of LEVELS) {
        const payload = {
            name: level.name,
            description: level.description,
            image: IPFS_IMAGES[level.id],
            external_url: 'https://ecothailand.org',
            attributes: level.attributes
        };

        // Write simple {id}.json (e.g. 1.json)
        const filename = `${level.id}.json`;
        fs.writeFileSync(path.join(metadataDir, filename), JSON.stringify(payload, null, 2));
        console.log(`Generated ${filename}`);
    }

    console.log(`\nMetadata generated in ${metadataDir}`);
}

main();
