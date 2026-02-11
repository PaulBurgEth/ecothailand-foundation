
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

const LEVELS = [
    {
        id: 1,
        name: 'Mangrove Seed',
        description: 'Plant a mangrove tree in the Thai Gulf to restore coastal ecosystems, sequester carbon, and protect biodiversity.',
        attributes: [
            { trait_type: 'Impact', value: '1 Mangrove Tree Planted' },
            { trait_type: 'Gardens', value: '5+' },
            { trait_type: 'Workshops', value: '3+' }
        ]
    },
    {
        id: 2,
        name: 'Coral Architect',
        description: 'Deploy a coral nursery frame to rebuild damaged reefs, providing habitat for marine life and protecting coastlines.',
        attributes: [
            { trait_type: 'Impact', value: '1 Coral Frame Deployed' },
            { trait_type: 'Sites Zoned', value: '5' },
            { trait_type: 'Trees ID\'d', value: '200' }
        ]
    },
    {
        id: 3,
        name: 'Coastal Guardian',
        description: 'Fund the removal of 50kg of ocean debris and ghost nets, cleaning the waters and saving marine animals from entanglement.',
        attributes: [
            { trait_type: 'Impact', value: '50kg Ocean Waste Removed' },
            { trait_type: 'Entities', value: '20+' },
            { trait_type: 'Programs', value: '5+' }
        ]
    },
    {
        id: 4,
        name: 'Educational Guardian',
        description: 'Sponsor an educational workshop for local students to learn about marine conservation and become future guardians of the sea.',
        attributes: [
            { trait_type: 'Impact', value: '1 Student Workshop Funded' },
            { trait_type: 'Students', value: '1,000+' },
            { trait_type: 'Events', value: '600+' }
        ]
    },
    {
        id: 5,
        name: 'Regeneration Master',
        description: 'Protect and restore 1000m² of seagrass meadows, a vital carbon sink and nursery ground.',
        attributes: [
            { trait_type: 'Impact', value: '1000m² Seagrass Protected' },
            { trait_type: 'Entities', value: '300+' },
            { trait_type: 'CO2 Saved', value: '2.5t' }
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
