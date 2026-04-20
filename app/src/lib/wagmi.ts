'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { celo, celoSepolia } from 'wagmi/chains';

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
    chains: [celo, celoSepolia],
    transports: {
        [celo.id]: http('https://forno.celo.org'),
        [celoSepolia.id]: http('https://forno.celo-sepolia.celo-testnet.org'),
    },
    ssr: true,
});
