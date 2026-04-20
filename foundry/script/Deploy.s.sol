// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {EcoThailandImpact} from "../src/EcoThailandImpact.sol";

contract DeployEcoThailand is Script {
    // Celo Sepolia Mento Sorted Oracles (Verified via Registry)
    address constant SORTED_ORACLES = 0xAb077999e5fA13bCda1599926F8927dDEADe533C;
    // Celo Sepolia cUSD Token (StableToken - Verified via Registry)
    address constant CUSD_TOKEN = 0xEF4d55D6dE8e8d73232827Cd1e9b2F2dBb45bC80;
    
    // Fund Recipients (80/10/10 split)
    address payable constant ECO_THAILAND = payable(0x35D46A6781D6e71b187786fAAA98ADcb331D4581);
    address payable constant ECO_SYNTHESISX = payable(0x7380A42137D16a0E7684578d8b3d32e1fbD021B5);
    address payable constant REFI_GREENPILL = payable(0xa8258ED271BB9be9d7E16c5818E45eF6F2577d92);
    
    string constant BASE_URI = "ipfs://bafybeidxp3wd6pvnopsqbvja3q6mjofrtx7n6pzmjnghufprroaieiyuqy";

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("Deploying EcoThailandImpact (Mento V2)...");
        console.log("SortedOracles:", SORTED_ORACLES);
        console.log("cUSD Token:", CUSD_TOKEN);
        
        vm.startBroadcast(deployerPrivateKey);
        
        EcoThailandImpact impact = new EcoThailandImpact(
            SORTED_ORACLES,
            CUSD_TOKEN,
            ECO_THAILAND,
            ECO_SYNTHESISX,
            REFI_GREENPILL,
            BASE_URI
        );
        
        vm.stopBroadcast();
        
        console.log("\n====================================");
        console.log("EcoThailandImpact deployed to:", address(impact));
        console.log("====================================\n");
        console.log("Next steps:");
        console.log("1. Update IMPACT_CONTRACT_ADDRESS in app/src/lib/constants.ts");
        console.log("2. Verify contract on Celoscan");
    }
}
