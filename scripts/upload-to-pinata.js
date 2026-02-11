
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
// node-fetch is ESM only in v3+, so we use dynamic import or use standard fetch if on Node 18+
// We'll use a helper to load it.

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const PINATA_JWT = process.env.PINATA_JWT ? process.env.PINATA_JWT.trim() : null;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_API_SECRET)) {
    console.error('Error: Missing Pinata credentials. Please set PINATA_JWT or PINATA_API_KEY/PINATA_API_SECRET in .env.local');
    process.exit(1);
}

console.log('Credentials loaded:');
console.log('JWT:', PINATA_JWT ? 'Yes' : 'No');
console.log('API Key:', PINATA_API_KEY ? `${PINATA_API_KEY.substring(0, 4)}...` : 'No');
console.log('API Secret:', PINATA_API_SECRET ? `${PINATA_API_SECRET.substring(0, 4)}...` : 'No');

const LEVELS = [
    {
        id: 1,
        name: 'Mangrove Seed',
        description: 'Plant a mangrove tree in the Thai Gulf to restore coastal ecosystems, sequester carbon, and protect biodiversity. Community Garden Projects identify species, geo-locate them, measure size, and calculate carbon capture.',
        imagePath: '../public/images/level-1-v2.jpg',
        attributes: [
            { trait_type: 'Impact', value: '1 Mangrove Tree Planted' },
            { trait_type: 'Gardens', value: '5+' },
            { trait_type: 'Workshops', value: '3+' }
        ]
    },
    {
        id: 2,
        name: 'Coral Architect',
        description: 'Deploy a coral nursery frame to rebuild damaged reefs, providing habitat for marine life and protecting coastlines. EcoThailand Foundation catalogs and preserves key trees on the Gulf Islands.',
        imagePath: '../public/images/level-2-v2.jpg',
        attributes: [
            { trait_type: 'Impact', value: '1 Coral Frame Deployed' },
            { trait_type: 'Sites Zoned', value: '5' },
            { trait_type: 'Trees ID\'d', value: '200' }
        ]
    },
    {
        id: 3,
        name: 'Coastal Guardian',
        description: 'Fund the removal of 50kg of ocean debris and ghost nets, cleaning the waters and saving marine animals from entanglement. EcoThailand supports Sustainable, Eco, Agro, and Community Tourism.',
        imagePath: '../public/images/level-3-v2.jpg',
        attributes: [
            { trait_type: 'Impact', value: '50kg Ocean Waste Removed' },
            { trait_type: 'Entities', value: '20+' },
            { trait_type: 'Programs', value: '5+' }
        ]
    },
    {
        id: 4,
        name: 'Educational Guardian',
        description: 'Sponsor an educational workshop for local students to learn about marine conservation and become future guardians of the sea. Over 600 children have participated in various events.',
        imagePath: '../public/images/level-4-v2.jpg',
        attributes: [
            { trait_type: 'Impact', value: '1 Student Workshop Funded' },
            { trait_type: 'Students', value: '1,000+' },
            { trait_type: 'Events', value: '600+' }
        ]
    },
    {
        id: 5,
        name: 'Regeneration Master',
        description: 'Protect and restore 1000m² of seagrass meadows, a vital carbon sink and nursery ground. Supporting Koh Phangan in reducing bio waste through eco-friendly methods.',
        imagePath: '../public/images/level-5-v2.jpg',
        attributes: [
            { trait_type: 'Impact', value: '1000m² Seagrass Protected' },
            { trait_type: 'Entities', value: '300+' },
            { trait_type: 'CO2 Saved', value: '2.5t' }
        ]
    }
];

async function uploadFileToPinata(filePath, name) {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const data = new FormData();
    data.append('file', fs.createReadStream(path.resolve(__dirname, filePath)));

    const metadata = JSON.stringify({
        name: name,
        keyvalues: {
            project: 'EcoThailand_IP'
        }
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 1,
    });
    data.append('pinataOptions', options);

    try {
        const headers = PINATA_JWT
            ? { Authorization: `Bearer ${PINATA_JWT}` }
            : { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_API_SECRET };

        // Need to add multipart headers from form-data
        const { default: fetch } = await import('node-fetch');
        const res = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                ...headers,
                ...data.getHeaders()
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to upload ${filePath}: ${res.statusText}`);
        }

        const json = await res.json();
        return json.IpfsHash;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

async function uploadJSONToPinata(jsonBody, name) {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    const body = {
        pinataContent: jsonBody,
        pinataMetadata: {
            name: name,
            keyvalues: {
                project: 'EcoThailand_IP_Metadata'
            }
        }
    };

    try {
        const headers = PINATA_JWT
            ? { Authorization: `Bearer ${PINATA_JWT}`, 'Content-Type': 'application/json' }
            : { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_API_SECRET, 'Content-Type': 'application/json' };

        const { default: fetch } = await import('node-fetch');
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: headers
        });

        if (!res.ok) {
            throw new Error(`Failed to upload JSON ${name}: ${res.statusText}`);
        }

        const json = await res.json();
        return json.IpfsHash;
    } catch (error) {
        console.error('Error uploading JSON:', error);
        throw error;
    }
}


async function main() {
    console.log('Starting upload to Pinata...');

    const results = {};

    for (const level of LEVELS) {
        console.log(`Processing Level ${level.id}: ${level.name}...`);

        // 1. Upload Image
        const imageHash = await uploadFileToPinata(level.imagePath, `EcoThailand_Level_${level.id}_Image`);
        const imageUri = `ipfs://${imageHash}`;
        console.log(`  - Image uploaded: ${imageUri}`);

        // 2. Create Metadata
        const metadata = {
            name: level.name,
            description: level.description,
            image: imageUri,
            external_url: 'https://ecothailand.org',
            attributes: level.attributes
        };

        // 3. Upload Metadata
        const metadataHash = await uploadJSONToPinata(metadata, `EcoThailand_Level_${level.id}_Metadata`);
        const metadataUri = `ipfs://${metadataHash}`;
        console.log(`  - Metadata uploaded: ${metadataUri}`);

        results[level.id] = {
            image: imageUri,
            metadata: metadataUri,
            imageGateway: `https://gateway.pinata.cloud/ipfs/${imageHash}`,
            metadataGateway: `https://gateway.pinata.cloud/ipfs/${metadataHash}`
        };
    }

    console.log('\n--- UPLOAD COMPLETE ---\n');
    console.log(JSON.stringify(results, null, 2));

    // Write results to file
    fs.writeFileSync(path.resolve(__dirname, 'pinata-results.json'), JSON.stringify(results, null, 2));
    console.log('\nResults saved to scripts/pinata-results.json');
}

main().catch(console.error);
