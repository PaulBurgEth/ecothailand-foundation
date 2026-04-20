import { ethers } from "hardhat";

async function main() {
    console.log("Starting deployment of EcoThailandImpact...");

    // ============ Network-specific Configuration ============
    // WETH Token addresses (same on all Celo networks)
    const WETH_ADDRESS = "0xD221812de1BD094f35587EE8E174B07B6167D9Af";

    // Mento ChainlinkRelayer for CELO/ETH pricing
    // This relayer aggregates CELO/USD and ETH/USD feeds
    const CHAINLINK_RELAYER = "0xd5bAF8D2072B2dB54Bed9c4763D591a44C408A98";

    // ============ Fund Recipients (80/10/10 split) ============
    const ECO_THAILAND = "0x35d46a6781d6e71b187786faaa98adcb331d4581";      // 80%
    const ECO_SYNTHESISX = "0x7380a42137d16a0e7684578d8b3d32e1fbd021b5";    // 10%
    const REFI_GREENPILL = "0xa8258ed271bb9be9d7e16c5818e45ef6f2577d92";    // 10% (ReFi & GreenPill Phangan)

    // Metadata Base URI (placeholder - update with IPFS/API endpoint)
    const BASE_URI = "https://ecothailand.org/api/metadata";

    console.log("Deploying with parameters:");
    console.log("  WETH:", WETH_ADDRESS);
    console.log("  Chainlink Relayer:", CHAINLINK_RELAYER);
    console.log("  EcoThailand (80%):", ECO_THAILAND);
    console.log("  EcoSynthesisX (10%):", ECO_SYNTHESISX);
    console.log("  ReFi & GreenPill (10%):", REFI_GREENPILL);

    const EcoThailandImpact = await ethers.getContractFactory("EcoThailandImpact");
    const contract = await EcoThailandImpact.deploy(
        WETH_ADDRESS,
        CHAINLINK_RELAYER,
        ECO_THAILAND,
        ECO_SYNTHESISX,
        REFI_GREENPILL,
        BASE_URI
    );

    await contract.waitForDeployment();

    const deployedAddress = await contract.getAddress();
    console.log("\n✅ EcoThailandImpact deployed to:", deployedAddress);
    console.log("\n📝 Next steps:");
    console.log("1. Update IMPACT_CONTRACT_ADDRESS in app/src/lib/constants.ts");
    console.log("2. Verify contract: npx hardhat verify --network <network> " + deployedAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
