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

    const priceReads = LEVELS.map((level) => ({
        address: IMPACT_CONTRACT_ADDRESS,
        abi: IMPACT_CONTRACT_ABI,
        functionName: 'getLevelPrice' as const,
        args: [BigInt(level.id)] as const,
    }));

    const { data: pricesData, isLoading: loadingPrices, refetch: refetchPrices } = useReadContracts({
        contracts: priceReads,
    });

    const supplyReads = LEVELS.map((level) => ({
        address: IMPACT_CONTRACT_ADDRESS,
        abi: IMPACT_CONTRACT_ABI,
        functionName: 'totalSupply' as const,
        args: [BigInt(level.id)] as const,
    }));

    const { data: supplyData, isLoading: loadingSupply, refetch: refetchSupply } = useReadContracts({
        contracts: supplyReads,
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
    return (mask & (1 << (levelId - 1))) !== 0;
}

// Helper to check if level is unlocked (can mint)
export function isLevelUnlocked(mask: number, levelId: number): boolean {
    // All tiers are now unlocked by default
    return true;
}
