'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Define Celo Sepolia Testnet (new L2 testnet)
export const celoSepolia = defineChain({
    id: 11142220,
    name: 'Celo Sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'CELO',
        symbol: 'CELO',
    },
    rpcUrls: {
        default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
    },
    blockExplorers: {
        default: { name: 'CeloScan', url: 'https://sepolia.celoscan.io' },
    },
    testnet: true,
});

// Create Wagmi config with RainbowKit
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '33a830dd93d80f9cab063b977b816c7a';

if (!projectId && typeof window !== 'undefined') {
    console.warn(
        'WalletConnect Project ID is missing. Minting and wallet features may fail. ' +
        'Please check your .env.local file and restart the dev server.'
    );
}

export const config = getDefaultConfig({
    appName: 'EcoThailand Impact Product',
    projectId: projectId || 'demo-project-id',
    chains: [celoSepolia],
    transports: {
        [celoSepolia.id]: http('https://forno.celo-sepolia.celo-testnet.org'),
    },
    ssr: true,
});
