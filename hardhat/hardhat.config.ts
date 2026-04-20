import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        // Celo L2 Mainnet (activated March 26, 2025)
        celo: {
            url: "https://forno.celo.org",
            chainId: 42220,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        // Celo Sepolia Testnet (replacement for Alfajores)
        celoSepolia: {
            url: "https://forno.celo.org/sepolia",
            chainId: 11142220,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        // Alfajores (deprecated Sept 2025, still operational)
        alfajores: {
            url: "https://alfajores-forno.celo-testnet.org",
            chainId: 44787,
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
    },
    etherscan: {
        apiKey: {
            celo: process.env.CELOSCAN_API_KEY || "",
            celoSepolia: process.env.CELOSCAN_API_KEY || "",
            alfajores: process.env.CELOSCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "celo",
                chainId: 42220,
                urls: {
                    apiURL: "https://api.celoscan.io/api",
                    browserURL: "https://celoscan.io",
                },
            },
            {
                network: "celoSepolia",
                chainId: 11142220,
                urls: {
                    apiURL: "https://api-sepolia.celoscan.io/api",
                    browserURL: "https://sepolia.celoscan.io",
                },
            },
            {
                network: "alfajores",
                chainId: 44787,
                urls: {
                    apiURL: "https://api-alfajores.celoscan.io/api",
                    browserURL: "https://alfajores.celoscan.io",
                },
            },
        ],
    },
};

export default config;
