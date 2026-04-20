// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {EcoThailandImpact} from "../src/EcoThailandImpact.sol";

// Define interface locally or import if available
interface ISortedOracles {
    function medianRate(address token) external view returns (uint256, uint256);
}

interface IRegistry {
    function getAddressForString(string calldata identifier) external view returns (address);
}

contract DebugOracle is Script {
    address constant IMPACT_CONTRACT = 0x52F3CEd54d083c1570107e06c5d52dEf1A866de2;
    address constant REGISTRY = 0x000000000000000000000000000000000000ce10;

    function run() external view {
        console.log("Debugging Mento Oracle via Registry...");

        IRegistry registry = IRegistry(REGISTRY);

        // 1. Get SortedOracles from Registry
        address sortedOracles = registry.getAddressForString("SortedOracles");
        console.log("Registry returned SortedOracles:", sortedOracles);

        // 2. Get cUSD (StableToken) from Registry
        address stableToken = registry.getAddressForString("StableToken");
        console.log("Registry returned StableToken (cUSD):", stableToken);

        if (sortedOracles == address(0) || stableToken == address(0)) {
            console.log("Error: Registry returned address(0)");
            return;
        }

        // 3. Direct Oracle Call for cUSD
        console.log("Querying medianRate(cUSD)...");
        try ISortedOracles(sortedOracles).medianRate(stableToken) returns (uint256 num, uint256 denom) {
            console.log("Oracle Direct Call SUCCESS:");
            console.log("Num:", num);
            console.log("Denom:", denom);
            
            if (denom > 0) {
                 // Check approximate rate
                 // If num/denom is units of cUSD per CELO (e.g. 0.6 * 1e18)
                 // num should be large, denom should be large.
                 // Let's print scaled values
            }
        } catch {
            console.log("Oracle Direct Call FAILED on address:", sortedOracles);
        }
        
        // 3. Contract Call (will fail if deployed with wrong address, but good to check)
        // ...
    }
}
