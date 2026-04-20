
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT ? process.env.PINATA_JWT.trim() : null;

async function testAuth() {
    console.log('Testing Pinata Authentication...');
    console.log('API Key:', PINATA_API_KEY ? `${PINATA_API_KEY.substring(0, 4)}...${PINATA_API_KEY.slice(-4)}` : 'Missing');

    // Test endpoint
    const url = 'https://api.pinata.cloud/data/testAuthentication';

    try {
        const { default: fetch } = await import('node-fetch');

        const headers = PINATA_JWT
            ? { Authorization: `Bearer ${PINATA_JWT}` }
            : { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_API_SECRET };

        const res = await fetch(url, { headers });

        console.log(`Status: ${res.status} ${res.statusText}`);

        if (res.ok) {
            const json = await res.json();
            console.log('Success:', json);
        } else {
            const text = await res.text();
            console.error('Failed:', text);
        }

    } catch (error) {
        console.error('Error:', error);
    }

    // Test JSON Upload
    const jsonUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    const body = {
        pinataContent: {
            test: 'Hello World'
        },
        pinataMetadata: {
            name: 'Test JSON'
        }
    };

    try {
        console.log('Testing JSON Upload...');
        const { default: fetch } = await import('node-fetch');

        const headers = PINATA_JWT
            ? { Authorization: `Bearer ${PINATA_JWT}`, 'Content-Type': 'application/json' }
            : { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_API_SECRET, 'Content-Type': 'application/json' };

        const res = await fetch(jsonUrl, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: headers
        });

        if (res.ok) {
            const json = await res.json();
            console.log('JSON Upload Success:', json);
        } else {
            const text = await res.text();
            console.error('JSON Upload Failed:', text);
        }
    } catch (error) {
        console.error('JSON Upload Error:', error);
    }
}

testAuth();
