
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const PINATA_JWT = process.env.PINATA_JWT ? process.env.PINATA_JWT.trim() : null;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

const metadataDir = path.resolve(__dirname, '../metadata_export');

async function uploadFolder() {
    console.log('Uploading folder to Pinata...');

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const data = new FormData();

    const files = fs.readdirSync(metadataDir);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(metadataDir, file);
            // We must set the filepath so Pinata treats it as a directory structure
            // The directory name 'metadata' will be the root of the IPFS folder
            data.append('file', fs.createReadStream(filePath), {
                filepath: `metadata/${file}`
            });
        }
    }

    const metadata = JSON.stringify({
        name: 'EcoThailand_Metadata_Folder',
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
        const { default: fetch } = await import('node-fetch');

        const headers = PINATA_JWT
            ? { Authorization: `Bearer ${PINATA_JWT}` }
            : { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_API_SECRET };

        const res = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                ...headers,
                ...data.getHeaders()
            }
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to upload folder: ${res.statusText} - ${text}`);
        }

        const json = await res.json();
        console.log('Folder Upload Success!');
        console.log('IpfsHash:', json.IpfsHash);
        console.log(`Gateway URL: https://gateway.pinata.cloud/ipfs/${json.IpfsHash}`);

        // Save the result
        fs.writeFileSync(path.resolve(__dirname, 'pinata-folder-result.json'), JSON.stringify(json, null, 2));

    } catch (error) {
        console.error('Error uploading folder:', error);
    }
}

uploadFolder();
