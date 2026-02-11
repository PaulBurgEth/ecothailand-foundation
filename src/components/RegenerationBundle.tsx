'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain, useReadContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Loader2, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { BUNDLE_DATA, IMPACT_CONTRACT_ADDRESS, TIER_CELO_PRICES } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI } from '@/lib/abi';
import { ownsLevel } from '@/hooks/useImpactStats';

const TARGET_CHAIN_ID = 11142220;

interface RegenerationBundleProps {
    userLevelsMask: number;
    onMintSuccess: (levelId: number) => void;
    refetch: () => void;
}

export function RegenerationBundle({
    userLevelsMask,
    onMintSuccess,
    refetch,
}: RegenerationBundleProps) {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const [isMinting, setIsMinting] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const isOwned = (userLevelsMask & 31) === 31;
    const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

    // Fetch REAL-TIME price for the bundle ($60)
    const { data: requiredCeloWei } = useReadContract({
        address: IMPACT_CONTRACT_ADDRESS,
        abi: IMPACT_CONTRACT_ABI,
        functionName: 'getCeloPrice',
        args: [BigInt(6000)], // BUNDLE_DATA.priceUSD * 100
        query: {
            enabled: isConnected && !isOwned && !isWrongNetwork,
            refetchInterval: 10000,
        }
    });

    const { writeContractAsync: mintBatchAsync, data: mintTxHash } = useWriteContract();

    const handleMintBundle = useCallback(async () => {
        if (!address || !isConnected) return;
        if (isWrongNetwork) {
            switchChain({ chainId: TARGET_CHAIN_ID });
            return;
        }
        if (isOwned) return;

        setIsMinting(true);
        setLastError(null);
        try {
            const levelIds = [1n, 2n, 3n, 4n, 5n];
            let valueToSend = requiredCeloWei;

            if (!valueToSend) {
                const totalFallback = Object.values(TIER_CELO_PRICES).reduce((a, b) => a + Number(b), 0);
                valueToSend = parseEther(totalFallback.toString());
            }

            const bufferedValue = (valueToSend * 105n) / 100n;

            await mintBatchAsync({
                address: IMPACT_CONTRACT_ADDRESS,
                abi: IMPACT_CONTRACT_ABI,
                functionName: 'mintBatchLevels',
                args: [levelIds],
                value: bufferedValue,
            });
        } catch (error: any) {
            console.error('Bundle mint error:', error);
            setIsMinting(false);
            const msg = error.message || JSON.stringify(error);
            if (msg.toLowerCase().includes('alreadyownslevel')) {
                setLastError('You already own some levels. Please mint remaining tiers individually.');
            } else {
                setLastError('Transaction failed');
            }
        }
    }, [address, isConnected, isOwned, isWrongNetwork, switchChain, requiredCeloWei, mintBatchAsync]);

    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: mintTxHash });

    if (isConfirmed && isMinting) {
        setIsMinting(false);
        refetch();
        onMintSuccess(0);
    }

    const displayPriceCELO = requiredCeloWei ? formatEther(requiredCeloWei).slice(0, 5) : '---';

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-deep-forest">
            {/* Organic Glow Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-thai-gold/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="glass-organic p-8 md:p-16 border border-thai-gold/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[2.5rem] md:rounded-[4rem]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Content Side */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-thai-gold/20 text-thai-gold px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-thai-gold/30">
                                    Collector's Choice
                                </span>
                                <Sparkles className="w-4 h-4 text-thai-gold animate-pulse" />
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-none uppercase">
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-thai-gold to-orange-400">Regeneration</span> <br /> Bundle
                            </h2>

                            <p className="text-warm-sand/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-light">
                                {BUNDLE_DATA.description} Be the ultimate guardian of the Thai Gulf.
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-cyber-green/10 rounded-2xl text-cyber-green border border-cyber-green/20">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-warm-sand/50 uppercase tracking-widest font-bold">Benefit</p>
                                        <p className="text-white font-medium">Batch Gas Efficient</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-thai-gold/10 rounded-2xl text-thai-gold border border-thai-gold/20">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-warm-sand/50 uppercase tracking-widest font-bold">Impact</p>
                                        <p className="text-white font-medium">Full Restoration</p>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-12">
                                {BUNDLE_DATA.summaryPoints?.map((point, i) => (
                                    <li key={i} className="flex items-center gap-3 text-warm-sand/90 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-thai-gold shadow-[0_0_8px_#E09F3E]" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Side */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-full max-w-md glass-organic p-8 md:p-10 border-white/5 bg-white/[0.02] relative group">
                                {/* Price Tag */}
                                <div className="text-center mb-10">
                                    <p className="text-[10px] text-warm-sand/60 uppercase tracking-[0.2em] mb-2 font-bold">Total Collection Contribution</p>
                                    <h3 className="text-6xl font-black text-white mb-2 leading-none tracking-tighter">$60</h3>
                                    <p className="text-thai-gold font-mono text-sm">≈ {displayPriceCELO} CELO</p>
                                </div>

                                {/* Ownership Status */}
                                {isOwned && (
                                    <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-3 text-emerald-400">
                                        <Check className="w-5 h-5" />
                                        <span className="font-bold text-xs uppercase tracking-widest">Collection Complete</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleMintBundle}
                                    disabled={!isConnected || isOwned || isMinting}
                                    className={`
                                        w-full py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all duration-500
                                        flex items-center justify-center gap-3
                                        ${!isConnected || isOwned
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed grayscale'
                                            : isMinting
                                                ? 'bg-gradient-to-r from-gray-700 to-gray-600 animate-pulse text-white'
                                                : 'bg-gradient-to-r from-thai-gold to-orange-500 text-white shadow-[0_0_40px_rgba(224,159,62,0.3)] hover:shadow-[0_0_60px_rgba(224,159,62,0.5)] hover:-translate-y-1'
                                        }
                                    `}
                                >
                                    {isMinting ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Cultivating...
                                        </>
                                    ) : isOwned ? (
                                        <span className="flex items-center gap-2"><Check /> Master Guardian</span>
                                    ) : !isConnected ? (
                                        'Connect Wallet'
                                    ) : (
                                        'Secure The Bundle'
                                    )}
                                </button>

                                {lastError && (
                                    <p className="mt-4 text-[10px] text-red-300 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                        {lastError}
                                    </p>
                                )}
                            </div>

                            <p className="mt-8 text-[10px] text-warm-sand/40 uppercase tracking-widest font-mono">
                                Verified RWI Protocol // 00Batch01
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
