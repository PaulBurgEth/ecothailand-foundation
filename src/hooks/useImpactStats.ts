'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { IMPACT_CONTRACT_ADDRESS, LEVELS, WETH_ADDRESS } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI, ERC20_ABI } from '@/lib/abi';

export interface ImpactStats {
    totalSupply: bigint[];
    totalRaisedUSD: number;
    userLevelsMask: number;
    celoPrices: bigint[]; // Renamed from wethPrices
    isLoading: boolean;
    refetch: () => void;
}

export function useImpactStats(): ImpactStats {
    const { address } = useAccount();

    const { data: totalRaisedRaw, isLoading: loadingTotal, refetch: refetchTotal } = useReadContract({
        address: IMPACT_CONTRACT_ADDRESS,
        abi: IMPACT_CONTRACT_ABI,
        functionName: 'getTotalRaisedUSD',
    });

    const { data: userLevelsRaw, isLoading: loadingUserLevels, refetch: refetchUser } = useReadContract({
        address: IMPACT_CONTRACT_ADDRESS,
        abi: IMPACT_CONTRACT_ABI,
        functionName: 'getUserLevels',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    const priceReads = LEVELS.map((level) => {
        // For bundle (id 0), we sum up the individual prices or just query the total if contract allows.
        // Contract getCeloPrice is generic, so we can just use the priceUSD * 100.
        // However, useReadContracts is used here to map 1:1.
        // Let's just have it return 0 for bundle here as MintingConsole handles its own price fetch.
        if (level.id === 0) return null;
        return {
            address: IMPACT_CONTRACT_ADDRESS,
            abi: IMPACT_CONTRACT_ABI,
            functionName: 'getLevelPrice' as const,
            args: [BigInt(level.id)] as const,
        };
    }).filter(Boolean);

    const { data: pricesData, isLoading: loadingPrices, refetch: refetchPrices } = useReadContracts({
        contracts: priceReads as any,
    });

    const supplyReads = LEVELS.map((level) => {
        if (level.id === 0) return null;
        return {
            address: IMPACT_CONTRACT_ADDRESS,
            abi: IMPACT_CONTRACT_ABI,
            functionName: 'totalSupply' as const,
            args: [BigInt(level.id)] as const,
        };
    }).filter(Boolean);

    const { data: supplyData, isLoading: loadingSupply, refetch: refetchSupply } = useReadContracts({
        contracts: supplyReads as any,
    });

    const celoPrices: bigint[] = pricesData
        ? pricesData.map((r) => (r.status === 'success' ? (r.result as bigint) : 0n))
        : LEVELS.map(() => 0n);

    const totalSupply: bigint[] = supplyData
        ? supplyData.map((r) => (r.status === 'success' ? (r.result as bigint) : 0n))
        : LEVELS.map(() => 0n);

    const totalRaisedUSD = totalRaisedRaw ? Number(totalRaisedRaw) / 100 : 0;

    const refetch = () => {
        refetchTotal();
        refetchUser();
        refetchPrices();
        refetchSupply();
    };

    return {
        totalSupply,
        totalRaisedUSD,
        userLevelsMask: userLevelsRaw ? Number(userLevelsRaw) : 0,
        celoPrices,
        isLoading: loadingTotal || loadingUserLevels || loadingPrices || loadingSupply,
        refetch,
    };
}

// Helper to check if user owns a specific level
export function ownsLevel(mask: number, levelId: number): boolean {
    if (levelId === 0) {
        // Bundle is "owned" if user owns ANY of the levels? 
        // Actually, the contract reverts if they own ANY.
        // So let's say "Impact Verified" if they own ALL FIVE.
        return (mask & 31) === 31;
    }
    return (mask & (1 << (levelId - 1))) !== 0;
}

// Helper to check if level is unlocked (can mint)
export function isLevelUnlocked(mask: number, levelId: number): boolean {
    // All tiers are now unlocked by default
    return true;
}
