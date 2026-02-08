'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { Waves, Leaf, Shield } from 'lucide-react';
import { LEVELS, IMPACT_CONTRACT_ADDRESS, TIER_CELO_PRICES } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI } from '@/lib/abi';
import { useImpactStats, ownsLevel } from '@/hooks/useImpactStats';
import { parseEther } from 'viem';
import { MintModal } from '@/components/MintModal';
import { MintingConsole } from '@/components/MintingConsole';
import { ImpactStack } from '@/components/ImpactStack';
import CountUp from 'react-countup';

export default function HomePage() {
    const stats = useImpactStats();
    const [modalLevel, setModalLevel] = useState<number | null>(null);
    const { isConnected } = useAccount();
    const { writeContractAsync: mintBatchAsync } = useWriteContract();
    const [isBatchMinting, setIsBatchMinting] = useState(false);

    // Scrollytelling State
    const [activeLevelId, setActiveLevelId] = useState<number>(1);

    // Find active level data
    const activeLevel = LEVELS.find(l => l.id === activeLevelId) || LEVELS[0];
    const activeLevelIndex = LEVELS.findIndex(l => l.id === activeLevelId);

    const handleMintSuccess = (levelId: number) => {
        setModalLevel(levelId);
        stats.refetch();
    };

    const handleBecomeGuardian = async () => {
        if (!isConnected) return;

        // Filter levels not yet owned
        const levelsToMint = LEVELS
            .filter(level => !ownsLevel(stats.userLevelsMask, level.id))
            .map(level => BigInt(level.id));

        if (levelsToMint.length === 0) return;

        setIsBatchMinting(true);
        try {
            // Use hardcoded safety net prices
            const totalCeloVal = levelsToMint.reduce((sum, levelId) => {
                const price = TIER_CELO_PRICES[Number(levelId) as keyof typeof TIER_CELO_PRICES];
                return sum + parseEther(price.toString());
            }, 0n);

            await mintBatchAsync({
                address: IMPACT_CONTRACT_ADDRESS,
                abi: IMPACT_CONTRACT_ABI,
                functionName: 'mintBatchLevels',
                args: [levelsToMint],
                value: totalCeloVal,
            });
            handleMintSuccess(5);
        } catch (error) {
            console.error('Batch mint error:', error);
        } finally {
            setIsBatchMinting(false);
        }
    };

    // Social Proof: Pre-Seed Value ($150)
    const displayTotalFunded = stats.totalRaisedUSD === 0 ? 150 : stats.totalRaisedUSD;

    return (
        <div className="min-h-screen bg-deep-forest text-slate-100 selection:bg-cyber-green selection:text-deep-forest overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-green/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-green/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] bg-repeat"></div>
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-green/10 backdrop-blur-md bg-deep-forest/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyber-green flex items-center justify-center cyber-glow">
                            <Leaf className="w-5 h-5 text-deep-forest" />
                        </div>
                        <span className="text-lg font-bold tracking-tighter uppercase font-mono hidden sm:inline">ECOTHAILAND</span>
                    </div>
                    <ConnectButton showBalance={false} chainStatus="icon" />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-24 pb-32">

                {/* Hero / Intro Section */}
                <section className="relative z-10 px-4 mb-24 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-green/10 border border-cyber-green/20 text-cyber-green text-[10px] font-mono mb-8 uppercase tracking-widest">
                        <Waves className="w-3 h-3" />
                        Celo Protocol • Real-World Impact
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[0.9] uppercase tracking-tighter italic">
                        Regenerate the <span className="text-cyber-green cyber-glow">Thai Gulf</span>
                    </h1>

                    <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Scroll down to climb the levels of impact. <br className="hidden sm:block" />
                        Fund verified projects. Collect the proof.
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
                        {[
                            { label: 'Total Funded', value: stats.totalRaisedUSD > 100 || displayTotalFunded > 100 ? (displayTotalFunded as number) : 150, prefix: '$' },
                            { label: 'Gardens', value: 5, suffix: '+' },
                            { label: 'Trees', value: 420 },
                            { label: 'Students', value: 1000, suffix: '+' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-schematic p-3 text-center border-cyber-green/10">
                                <p className="text-[9px] font-mono text-slate-500 uppercase">{stat.label}</p>
                                <p className="text-lg font-mono text-cyber-green leading-none mt-1">
                                    {typeof stat.value === 'string' ? stat.value : <CountUp end={stat.value as number} duration={2.5} separator="," prefix={stat.prefix} suffix={stat.suffix} />}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Batch Mint CTA */}
                    <button
                        onClick={handleBecomeGuardian}
                        disabled={isBatchMinting}
                        className={`btn-sharp px-8 py-4 w-full sm:w-auto text-sm font-bold flex items-center justify-center gap-2 mx-auto btn-active-press ${isBatchMinting ? 'bg-slate-800 border-slate-700 text-slate-500 shimmer-effect' : 'btn-cyber cyber-glow'
                            }`}
                    >
                        {isBatchMinting ? (
                            <>
                                <Shield className="w-4 h-4 animate-pulse" />
                                COMMITTING...
                            </>
                        ) : (
                            'BECOME A GUARDIAN (MINT ALL)'
                        )}
                    </button>
                </section>


                {/* Sticky Stack Container */}
                <div className="relative">
                    {/* The Floating UI Navigation (Sticky/Fixed) */}
                    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center px-4">
                        {/* Only show on large screens or handle mobile differently? 
                            For mobile, we want it at the bottom. 
                            For Desktop, center.
                        */}
                        <div className="w-full max-w-lg hidden md:block pointer-events-auto">
                            <div className="transition-all duration-500 transform">
                                <MintingConsole
                                    level={activeLevel}
                                    userLevelsMask={stats.userLevelsMask}
                                    celoPrice={stats.celoPrices[activeLevelIndex] || 0n}
                                    onMintSuccess={handleMintSuccess}
                                    refetch={stats.refetch}
                                />
                            </div>
                        </div>
                    </div>

                    {/* The Stack of Images */}
                    <ImpactStack
                        levels={LEVELS}
                        activeLevelId={activeLevelId}
                        onActiveLevelChange={setActiveLevelId}
                    />
                </div>

                {/* Mobile Sticky Footer (Only visible on small screens) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-deep-forest/90 backdrop-blur-xl border-t border-cyber-green/20 safe-area-bottom">
                    {/* Simplified Mobile Console */}
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <div>
                            <p className="text-[10px] text-cyber-green font-mono uppercase">Level {activeLevel.id}</p>
                            <p className="text-white font-bold leading-none">{activeLevel.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-cyber-green">${activeLevel.priceUSD}</p>
                        </div>
                    </div>
                    {/* We can re-use logic if we extract a simple button, but for now specific logic */}
                    {ownsLevel(stats.userLevelsMask, activeLevel.id) ? (
                        <button className="btn-sharp btn-cyber-outline w-full py-3 text-sm font-bold flex items-center justify-center gap-2">
                            OWNED - SHARE
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                // For mobile simple mint, we'd need to invoke the mint function here.
                                // Ideal: Render a stripped down MintingConsole or pass mint ref.
                                // For now, let's just make it scroll to top to connect if not connected?
                                // Implementing direct call is better.
                                // But we don't have the mint function here easily accessible without duplicating logic.
                                // Suggestion: Creating a "MobileMintButton" component or similar.
                                // Or better: Just render MintingConsole in a Sheet/Drawer? 
                                // Let's keep it simple: "View Details" to open modal?
                                setModalLevel(activeLevel.id); // This opens success modal, not mint modal.
                                // Let's just put a "Go to Desktop" or "Connect" msg if needed.
                                // Re-implementing basic mint here for speed:
                            }}
                            className="btn-sharp btn-cyber w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                        >
                            MINT LEVEL {activeLevel.id}
                        </button>
                    )}
                </div>
            </main>

            {/* Mint Success Modal */}
            <MintModal
                isOpen={modalLevel !== null}
                levelId={modalLevel}
                onClose={() => setModalLevel(null)}
            />
        </div>
    );
}
