'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain, useReadContract } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { Loader2, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { LevelData, IMPACT_CONTRACT_ADDRESS, TIER_CELO_PRICES } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI } from '@/lib/abi';
import { ownsLevel, isLevelUnlocked } from '@/hooks/useImpactStats';

// Celo Sepolia Chain ID
const TARGET_CHAIN_ID = 11142220;

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
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    const [isMinting, setIsMinting] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const isOwned = ownsLevel(userLevelsMask, level.id);
    const isUnlocked = isLevelUnlocked(userLevelsMask, level.id);
    const isLocked = !isUnlocked && !isOwned;
    const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

    // Fetch REAL-TIME price requirement from contract
    // We converting level.priceUSD to cents for the contract call (e.g. 2 -> 200)
    const { data: requiredCeloWei, error: priceError } = useReadContract({
        address: IMPACT_CONTRACT_ADDRESS,
        abi: IMPACT_CONTRACT_ABI,
        functionName: 'getCeloPrice',
        args: [BigInt(level.priceUSD * 100)],
        query: {
            enabled: isConnected && !isOwned && !isWrongNetwork,
            refetchInterval: 10000, // Refresh every 10s
        }
    });

    // Mint level
    const { writeContractAsync: mintAsync, data: mintTxHash } = useWriteContract();

    const handleMint = useCallback(async () => {
        if (!address || !isConnected) return;

        // 1. Force network switch if wrong chain
        if (isWrongNetwork) {
            switchChain({ chainId: TARGET_CHAIN_ID });
            return;
        }

        if (isOwned || !isUnlocked) return;

        setIsMinting(true);
        setLastError(null);
        try {
            const levelId = BigInt(level.id);

            // Calculate Value to send:
            // 1. Start with Contract Requirement (or fallback to hardcoded if fetch failed)
            let valueToSend = requiredCeloWei;

            if (!valueToSend) {
                console.warn("Price fetch failed, using fallback constant.");
                const priceString = TIER_CELO_PRICES[level.id as keyof typeof TIER_CELO_PRICES].toString();
                valueToSend = parseEther(priceString);
            }

            // 2. Add 5% Slippage Buffer to prevent partial underpayment due to oracle updates during tx
            const bufferedValue = (valueToSend * 105n) / 100n;

            console.log(`[Mint Debug] Level: ${levelId}`);
            console.log(`[Mint Debug] Contract Req: ${valueToSend ? formatEther(valueToSend) : 'loading...'} CELO`);
            console.log(`[Mint Debug] Sending (+5%): ${formatEther(bufferedValue)} CELO`);

            await mintAsync({
                address: IMPACT_CONTRACT_ADDRESS,
                abi: IMPACT_CONTRACT_ABI,
                functionName: 'mintLevel',
                args: [levelId],
                value: bufferedValue,
            });
        } catch (error: any) {
            console.error('Mint error:', error);
            setIsMinting(false);

            const msg = error.message || JSON.stringify(error);

            if (msg.toLowerCase().includes('user rejected')) {
                setLastError('Transaction rejected');
            } else if (msg.toLowerCase().includes('insufficient funds')) {
                setLastError('Insufficient CELO funds');
            } else {
                setLastError('Transaction failed');
            }
        }
    }, [address, isConnected, isOwned, isUnlocked, mintAsync, level.id, isWrongNetwork, switchChain, requiredCeloWei]);

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

    // Display Price: Prefer dynamic, fallback to static
    const displayPriceCELO = requiredCeloWei
        ? formatEther(requiredCeloWei).slice(0, 5)
        : celoPrice > 0n
            ? formatEther(celoPrice).slice(0, 5)
            : TIER_CELO_PRICES[level.id as keyof typeof TIER_CELO_PRICES];

    return (
        <div className="glass-organic p-6 md:p-8 w-full mx-auto transition-all duration-500 rounded-[2rem] relative overflow-hidden group border border-white/10 hover:border-thai-gold/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">

            {/* Organic Glow Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-thai-gold/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-green/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>

            {/* NETWORK WARNING */}
            {isWrongNetwork && (
                <div className="mb-6 bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <div>
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wide">Wrong Network</p>
                        <p className="text-[10px] text-orange-200/80">Switch to Celo Sepolia to plant seeds.</p>
                    </div>
                </div>
            )}

            {/* Header: Level & Title */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-thai-gold text-[10px] font-bold uppercase tracking-[0.2em] bg-thai-gold/10 px-3 py-1 rounded-full border border-thai-gold/20">
                            Level {level.id.toString().padStart(2, '0')}
                        </span>
                        {isOwned && (
                            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                <Check className="w-3 h-3" /> Impact Verified
                            </div>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none drop-shadow-lg">
                        {level.name}
                    </h2>
                </div>

                {/* Price Display (Top Right) */}
                <div className="text-right hidden md:block">
                    <p className="text-[9px] text-warm-sand/60 font-medium uppercase tracking-widest mb-1">Contribution</p>
                    <div className="flex items-baseline justify-end gap-2">
                        <span className="text-3xl font-bold text-white tracking-tight">${level.priceUSD}</span>
                        <span className="text-[11px] text-warm-sand/50 font-mono">
                            ≈ {displayPriceCELO} CELO
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 mb-8 relative z-10">

                {/* Summarized Bullet Points */}
                <ul className="space-y-4">
                    {level.summaryPoints && level.summaryPoints.length > 0 ? (
                        level.summaryPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-4 text-warm-sand/90 text-sm leading-relaxed font-light">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-thai-gold shadow-[0_0_10px_#E09F3E] shrink-0 opacity-80"></span>
                                <span>{point}</span>
                            </li>
                        ))
                    ) : (
                        <li className="text-warm-sand/80 text-sm leading-relaxed">{level.description.slice(0, 150)}...</li>
                    )}
                </ul>

                {/* Stats Grid - Soft Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {level.impactStats.map((stat, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
                            <p className="text-[9px] text-warm-sand/50 font-bold uppercase tracking-widest mb-1.5">{stat.label}</p>
                            <p className="text-cyber-green font-mono text-xl md:text-2xl font-medium tracking-tight group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* VERIFIED IMPACT PROOF Button (External Link) */}
                {level.proofLink && (
                    <a
                        href={level.proofLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3.5 border border-white/10 rounded-xl text-xs font-medium text-warm-sand/70 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all group"
                    >
                        <ExternalLink className="w-3.5 h-3.5 group-hover:text-thai-gold transition-colors" />
                        View Verified Impact Proof
                    </a>
                )}
            </div>

            {/* Footer Action Bar */}
            <div className="pt-6 border-t border-white/5 relative z-10">

                {/* Mobile Price */}
                <div className="md:hidden flex items-center justify-between mb-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-xl font-bold text-white">${level.priceUSD}</span>
                    <span className="text-xs text-warm-sand/60 font-mono">
                        ≈ {displayPriceCELO} CELO
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="w-full">
                    {isOwned ? (
                        <button
                            onClick={() => onMintSuccess(level.id)}
                            className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-full transition-all duration-300 bg-cyber-green/10 text-cyber-green border border-cyber-green/30 hover:bg-cyber-green/20 hover:border-cyber-green/50 shadow-[0_0_20px_rgba(0,255,163,0.1)] hover:shadow-[0_0_30px_rgba(0,255,163,0.2)]"
                        >
                            Share Your Impact
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleMint}
                                disabled={!isConnected || (isLocked && !isWrongNetwork) || isMinting}
                                className={`
                                    w-full py-4 text-sm font-bold flex items-center justify-center gap-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                    ${!isConnected || (isLocked && !isWrongNetwork)
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none hover:translate-y-0'
                                        : isWrongNetwork
                                            ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/20'
                                            : isMinting
                                                ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white cursor-wait'
                                                : 'bg-gradient-to-r from-thai-gold to-orange-500 text-white shadow-orange-500/30'
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
                                ) : isWrongNetwork ? (
                                    'Switch Network'
                                ) : (
                                    'Plant This Seed'
                                )}
                            </button>
                            {lastError && (
                                <div className="text-[10px] text-red-300 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/10">
                                    {lastError}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
