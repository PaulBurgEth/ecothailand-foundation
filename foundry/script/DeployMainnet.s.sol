// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {EcoThailandImpact} from "../src/EcoThailandImpact.sol";

contract DeployMainnetEcoThailand is Script {
    // Celo Mainnet Mento Sorted Oracles
    address constant SORTED_ORACLES = 0xefB84935239dAcdecF7c5bA76d8dE40b077B7b33;
    // Celo Mainnet cUSD Token
    address constant CUSD_TOKEN = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    
    // Fund Recipients (80/10/10 split)
    address payable constant ECO_THAILAND = payable(0x35D46A6781D6e71b187786fAAA98ADcb331D4581);
    address payable constant ECO_SYNTHESISX = payable(0x7380A42137D16a0E7684578d8b3d32e1fbD021B5);
    address payable constant REFI_GREENPILL = payable(0xa8258ED271BB9be9d7E16c5818E45eF6F2577d92);
    
    // Updated Metadata CID from Pinata upload
    string constant BASE_URI = "ipfs://bafybeicze265osvmff4rizubt3n67s5je3udmsavch6g56qhexdvu5w5ha";

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("Deploying EcoThailandImpact to Celo Mainnet...");
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
    }
}
