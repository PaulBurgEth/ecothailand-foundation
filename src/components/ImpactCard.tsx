'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Lock, Check, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { LevelData, IMPACT_CONTRACT_ADDRESS, WETH_ADDRESS, TIER_CELO_PRICES } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI, ERC20_ABI } from '@/lib/abi';
import { ownsLevel, isLevelUnlocked } from '@/hooks/useImpactStats';

interface ImpactCardProps {
    level: LevelData;
    userLevelsMask: number;
    celoPrice: bigint;
    onMintSuccess: (levelId: number) => void;
    refetch: () => void;
}

export function ImpactCard({
    level,
    userLevelsMask,
    celoPrice,
    onMintSuccess,
    refetch,
}: ImpactCardProps) {
    const { address, isConnected } = useAccount();
    const [isMinting, setIsMinting] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const isOwned = ownsLevel(userLevelsMask, level.id);
    const isUnlocked = isLevelUnlocked(userLevelsMask, level.id);

    // Mint level
    const { writeContractAsync: mintAsync, data: mintTxHash, error: mintError } = useWriteContract();

    const handleMint = useCallback(async () => {
        if (!address || !isConnected || isOwned || !isUnlocked) return;

        setIsMinting(true);
        setLastError(null);
        try {
            console.log('Requesting mint level...', level.id);
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

            // Parse common errors
            const msg = error.message?.toLowerCase() || '';
            if (msg.includes('user rejected')) {
                setLastError('Transaction rejected by user');
            } else if (msg.includes('insufficient funds')) {
                setLastError('Insufficient CELO funds');
            } else {
                setLastError('Transaction failed. Please try again.');
            }
        }
    }, [address, isConnected, isOwned, isUnlocked, mintAsync, celoPrice, level.id]);

    // Reset minting state if transaction fails or succeeds
    const { isError: isReceiptError, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
        hash: mintTxHash,
    });

    // Handle state transitions
    if (isMinting && (isConfirmed || isReceiptError)) {
        setIsMinting(false);
        if (isConfirmed) {
            refetch();
            onMintSuccess(level.id);
        } else if (isReceiptError) {
            console.error('Receipt error:', receiptError);
            setLastError('Transaction execution failed.');
        }
    }

    const isLocked = !isUnlocked && !isOwned;

    return (
        <div className="glass-organic flex flex-col h-full min-h-[520px] transition-transform duration-300 hover:scale-[1.01] group">
            {/* Header Data */}
            <div className="p-5 border-b border-white/5 flex justify-between items-start">
                <div>
                    <span className="text-[10px] font-medium font-mono uppercase tracking-widest text-thai-gold/90 bg-thai-gold/10 px-3 py-1 rounded-full border border-thai-gold/20">Tier {level.id}</span>
                </div>
                {isOwned && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                        <Check className="w-3 h-3" /> Impact Verified
                    </span>
                )}
            </div>

            {/* Organic Visual Block */}
            <div className="h-48 relative overflow-hidden group-hover:bg-white/5 transition-colors duration-500">
                {/* Background Shapes */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 to-transparent rounded-[40%] animate-spin-slow opacity-30"></div>

                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img
                        src={level.image}
                        alt={level.name}
                        className="h-full w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 filter saturate-[1.1]"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-grow relative bg-gradient-to-t from-black/20 to-transparent">
                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{level.name}</h3>

                    {/* Stats Grid - Soft Layout */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {level.impactStats.map((stat, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group/stat">
                                <p className="text-[10px] font-medium text-warm-sand/60 uppercase tracking-wide mb-1">{stat.label}</p>
                                <p className="text-lg font-semibold text-cyber-green group-hover/stat:text-white transition-colors">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* NEW: Action/Impact Badges */}
                    <div className="flex flex-col gap-2 mb-6">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-thai-gold/5 border border-thai-gold/10">
                            <span className="text-[10px] uppercase font-bold text-thai-gold whitespace-nowrap">Action:</span>
                            <span className="text-xs text-white/90 truncate">{level.action}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-cyber-green/5 border border-cyber-green/10">
                            <span className="text-[10px] uppercase font-bold text-cyber-green whitespace-nowrap">Impact:</span>
                            <span className="text-xs text-white/90 truncate">{level.impactAchievement}</span>
                        </div>
                    </div>

                    <p className="text-warm-sand/80 text-sm mb-6 leading-relaxed line-clamp-3 font-light">
                        {level.description}
                    </p>

                    {/* Funds Allocation - Organic Bar */}
                    <div className="mb-6 pt-5 border-t border-white/5">
                        <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mb-3">Seed Allocation</p>
                        <div className="flex items-center w-full h-2 rounded-full overflow-hidden bg-black/30 mb-2">
                            <div className="h-full bg-gradient-to-r from-thai-gold to-orange-500 w-[80%]"></div>
                            <div className="h-full bg-blue-400 w-[10%] opacity-70"></div>
                            <div className="h-full bg-purple-400 w-[10%] opacity-70"></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-medium text-slate-500">
                            <span className="text-thai-gold">80% Impact</span>
                            <span className="text-blue-400/80">10% Protocol</span>
                            <span className="text-purple-400/80">10% Community</span>
                        </div>
                    </div>
                </div>

                {/* Price Display */}
                <div className="flex items-center justify-between mb-4 mt-auto bg-black/20 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-xl font-bold text-white tracking-tight">${level.priceUSD}</span>
                    {celoPrice > 0n ? (
                        <span className="text-xs text-warm-sand/60 font-mono">
                            ≈ {formatEther(celoPrice).slice(0, 7)} CELO
                        </span>
                    ) : (
                        <span className="text-xs text-warm-sand/60 font-mono">
                            Loading Price...
                        </span>
                    )}
                </div>

                {/* Action Button - Organic Pill */}
                {isOwned ? (
                    <button
                        onClick={() => onMintSuccess(level.id)}
                        className="w-full py-4 rounded-full border border-cyber-green/30 text-cyber-green hover:bg-cyber-green/10 transition-colors font-bold text-sm flex items-center justify-center gap-2"
                    >
                        Share Your Impact <ExternalLink className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleMint}
                            disabled={!isConnected || isLocked || isMinting}
                            className={`
                                w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                ${!isConnected || isLocked
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none hover:translate-y-0 border border-white/5'
                                    : isMinting
                                        ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white cursor-wait'
                                        : 'bg-gradient-to-r from-thai-gold to-orange-500 text-white shadow-orange-500/20'
                                }
                            `}
                        >
                            {isMinting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Cultivating...
                                </>
                            ) : !isConnected ? (
                                'Connect Wallet to Plant'
                            ) : (
                                `Plant Seed ($${level.priceUSD})`
                            )}
                        </button>

                        {lastError && (
                            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg border border-red-500/10 text-[10px] text-red-300">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                <span>{lastError}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
