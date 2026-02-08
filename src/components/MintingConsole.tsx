'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Loader2, ExternalLink, AlertCircle, Check } from 'lucide-react';
import { LevelData, IMPACT_CONTRACT_ADDRESS, TIER_CELO_PRICES } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI } from '@/lib/abi';
import { ownsLevel, isLevelUnlocked } from '@/hooks/useImpactStats';

interface MintingConsoleProps {
    level: LevelData;
    userLevelsMask: number;
    celoPrice: bigint;
    onMintSuccess: (levelId: number) => void;
    refetch: () => void;
}

export function MintingConsole({
    level,
    userLevelsMask,
    celoPrice,
    onMintSuccess,
    refetch,
}: MintingConsoleProps) {
    const { address, isConnected } = useAccount();
    const [isMinting, setIsMinting] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const isOwned = ownsLevel(userLevelsMask, level.id);
    const isUnlocked = isLevelUnlocked(userLevelsMask, level.id);
    const isLocked = !isUnlocked && !isOwned;

    // Mint level
    const { writeContractAsync: mintAsync, data: mintTxHash } = useWriteContract();

    const handleMint = useCallback(async () => {
        if (!address || !isConnected || isOwned || !isUnlocked) return;

        setIsMinting(true);
        setLastError(null);
        try {
            await mintAsync({
                address: IMPACT_CONTRACT_ADDRESS,
                abi: IMPACT_CONTRACT_ABI,
                functionName: 'mintLevel',
                args: [BigInt(level.id)],
                value: parseEther(TIER_CELO_PRICES[level.id as keyof typeof TIER_CELO_PRICES].toString()),
            });
        } catch (error: any) {
            console.error('Mint error:', error);
            setIsMinting(false);

            const msg = error.message?.toLowerCase() || '';
            if (msg.includes('user rejected')) {
                setLastError('Transaction rejected');
            } else if (msg.includes('insufficient funds')) {
                setLastError('Insufficient CELO funds');
            } else {
                setLastError('Transaction failed');
            }
        }
    }, [address, isConnected, isOwned, isUnlocked, mintAsync, level.id]);

    // Transaction Receipt
    const { isSuccess: isConfirmed, isError: isReceiptError } = useWaitForTransactionReceipt({
        hash: mintTxHash,
    });

    useEffect(() => {
        if (isMinting && (isConfirmed || isReceiptError)) {
            setIsMinting(false);
            if (isConfirmed) {
                refetch();
                onMintSuccess(level.id);
            } else if (isReceiptError) {
                setLastError('Transaction execution failed');
            }
        }
    }, [isConfirmed, isReceiptError, isMinting, refetch, onMintSuccess, level.id]);

    return (
        <div className="glass-schematic p-6 border-cyber-green/20 w-full max-w-md mx-auto backdrop-blur-xl bg-deep-forest/60 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Header: Level & Status */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-cyber-green text-sm font-mono border border-cyber-green/30 px-2 py-1 uppercase tracking-widest">
                        Level {level.id.toString().padStart(2, '0')}
                    </span>
                    <h2 className="text-3xl font-bold mt-3 uppercase tracking-tighter leading-none text-white shadow-cyber-green drop-shadow-[0_0_10px_rgba(0,255,163,0.2)]">
                        {level.name}
                    </h2>
                </div>
                {isOwned && (
                    <div className="flex items-center gap-1 text-cyber-green text-xs font-mono border border-cyber-green px-2 py-1 bg-cyber-green/10">
                        <Check className="w-3 h-3" /> OWNED
                    </div>
                )}
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed mb-8 border-l-2 border-cyber-green/50 pl-4 font-medium drop-shadow-md">
                {level.description}
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {level.impactStats.map((stat, i) => (
                    <div key={i} className="bg-black/60 p-3 border border-cyber-green/20">
                        <p className="text-[10px] text-slate-400 font-mono uppercase mb-1">{stat.label}</p>
                        <p className="text-cyber-green font-mono text-lg">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                {/* Proof Link */}
                <a href={level.proofLink} target="_blank" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyber-green mb-6 transition-colors group">
                    VIEW ON-CHAIN PROOF <ExternalLink className="w-3 h-3 group-hover:stroke-cyber-green" />
                </a>

                {/* Price & Action */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] text-slate-400 font-mono uppercase mb-1">Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white drop-shadow-md">${level.priceUSD}</span>
                            <span className="text-xs text-slate-400 font-mono">
                                ≈ {celoPrice > 0n ? formatEther(celoPrice).slice(0, 5) : TIER_CELO_PRICES[level.id as keyof typeof TIER_CELO_PRICES]} CELO
                            </span>
                        </div>
                    </div>

                    {isOwned ? (
                        <button
                            onClick={() => onMintSuccess(level.id)}
                            className="btn-sharp btn-cyber-outline w-full max-w-[150px] py-3 text-xs flex items-center justify-center gap-2"
                        >
                            SHARE IMPACT
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 w-full max-w-[180px]">
                            <button
                                onClick={handleMint}
                                disabled={!isConnected || isLocked || isMinting}
                                className={`
                                    btn-sharp w-full py-4 text-sm font-bold flex items-center justify-center gap-2 btn-active-press transition-all
                                    ${!isConnected || isLocked
                                        ? 'bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed'
                                        : isMinting
                                            ? 'btn-cyber cyber-glow shimmer-effect cursor-wait'
                                            : 'btn-cyber cyber-glow'
                                    }
                                `}
                            >
                                {isMinting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        MINTING...
                                    </>
                                ) : !isConnected ? (
                                    'CONNECT WALLET'
                                ) : (
                                    'MINT NOW'
                                )}
                            </button>
                            {lastError && (
                                <span className="text-[10px] text-red-500 font-mono text-center block animate-pulse">
                                    {lastError}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
