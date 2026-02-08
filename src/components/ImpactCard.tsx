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
        <div className="glass-schematic card-hover-effect flex flex-col h-full min-h-[520px]">
            {/* Header Data */}
            <div className="p-4 border-b border-cyber-green/10 flex justify-between items-start">
                <div>
                    <span className="tag-mono border-cyber-green/40 text-cyber-green">Tier {level.id}</span>
                </div>
                {isOwned && (
                    <span className="tag-mono bg-cyber-green text-deep-forest border-cyber-green">Verified Proof</span>
                )}
            </div>

            {/* Visual Block */}
            <div className="h-40 relative bg-black/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-5xl grayscale brightness-75 opacity-20">
                    {level.id === 1 && '🌱'}
                    {level.id === 2 && '🌳'}
                    {level.id === 3 && '🏝️'}
                    {level.id === 4 && '📚'}
                    {level.id === 5 && '♻️'}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src={level.image} alt={level.name} className="h-32 w-auto object-contain mix-blend-lighten opacity-80" />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">{level.name}</h3>

                    {/* Impact Link */}
                    <a href={level.proofLink} target="_blank" className="text-[10px] font-mono text-cyber-green/60 hover:text-cyber-green flex items-center gap-1 mb-4">
                        VIEW PROOF OF WORK <ExternalLink className="w-2 h-2" />
                    </a>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {level.impactStats.map((stat, i) => (
                            <div key={i} className="p-2 border border-cyber-green/10 bg-cyber-green/5">
                                <p className="text-[9px] font-mono text-slate-500 uppercase">{stat.label}</p>
                                <p className="text-sm font-mono text-cyber-green leading-none">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-slate-400 text-[11px] mb-6 leading-relaxed">
                        {level.description}
                    </p>
                </div>

                {/* Price Display */}
                <div className="flex items-center justify-between mb-4 font-mono mt-auto">
                    <span className="text-xl font-bold text-cyber-green">${level.priceUSD}</span>
                    {celoPrice > 0n ? (
                        <span className="text-[10px] text-slate-500">
                            ≈ {formatEther(celoPrice).slice(0, 8)} CELO
                        </span>
                    ) : (
                        <span className="text-[10px] text-slate-500">
                            ≈ {TIER_CELO_PRICES[level.id as keyof typeof TIER_CELO_PRICES]} CELO
                        </span>
                    )}
                </div>

                {/* Action Button */}
                {isOwned ? (
                    <button
                        onClick={() => onMintSuccess(level.id)}
                        className="btn-sharp btn-cyber-outline btn-active-press w-full py-2 flex items-center justify-center gap-2"
                    >
                        Share Impact
                    </button>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleMint}
                            disabled={!isConnected || isLocked || isMinting}
                            className={`
                                btn-sharp w-full py-3 flex items-center justify-center gap-2 btn-active-press
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
                                    Processing
                                </>
                            ) : !isConnected ? (
                                'Connect Wallet'
                            ) : (
                                `Mint ($${level.priceUSD})`
                            )}
                        </button>

                        {lastError && (
                            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-mono">
                                <AlertCircle className="w-3 h-3" />
                                <span className="uppercase">{lastError}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
