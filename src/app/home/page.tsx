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
import { CinematicStaircase } from '@/components/CinematicStaircase';
import { ProtocolPipeline } from '@/components/ProtocolPipeline';
import { Footer } from '@/components/Footer';
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
        } catch (error: any) {
            console.error('Batch mint error:', error);
            alert(`Mint Failed: ${error.message || JSON.stringify(error)}`);
        } finally {
            setIsBatchMinting(false);
        }
    };

    // VISUAL POLISH: Data Logic (N/A Rule)
    // IF totalRaised > 50: Show '$X'
    // IF totalRaised <= 50: Show 'N/A' or 'EARLY'
    const displayFunded = stats.totalRaisedUSD > 50
        ? <><span className="text-xl">$</span><CountUp end={stats.totalRaisedUSD} duration={3} /></>
        : <span className="text-2xl">EARLY</span>;

    return (
        <div className="min-h-screen bg-deep-forest text-slate-100 selection:bg-cyber-green selection:text-deep-forest overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-green/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-green/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] bg-repeat"></div>
            </div>

            {/* Header with EcoSynthesisX Branding */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-green/10 backdrop-blur-md bg-deep-forest/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href="https://ecosynthesisx.com" target="_blank" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            {/* EcoSynthesisX Logo */}
                            <img src="/images/ecosynthesisx-logo.jpg" alt="EcoSynthesisX" className="w-10 h-10 rounded-full border border-cyber-green/50 shadow-[0_0_10px_#00FFA3]" />
                            <span className="text-sm font-bold tracking-widest uppercase font-mono text-cyber-green">ECOSYNTHESISX</span>
                        </a>
                    </div>
                    <ConnectButton showBalance={false} chainStatus="icon" />
                </div>
            </header>

            {/* Main Content Area */}
            <main>

                {/* SECTION 1: HERO (Asymmetric Data Terminal) */}
                <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full z-10">
                        {/* VISUAL POLISH: Added gap-20 to prevent collision */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                            {/* Left Col: Kinetic Typography */}
                            <div className="lg:col-span-7 flex flex-col justify-center animate-fade-in-up">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse shadow-[0_0_10px_#00FFA3]"></div>
                                    <span className="font-mono text-xs text-cyber-green/80 tracking-widest uppercase">System Online v2.1</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white mb-8 group cursor-default">
                                    <span className="block hover:text-cyber-green transition-colors duration-300">REGENERATE</span>
                                    <span className="block text-slate-500 hover:text-white transition-colors duration-300">THE THAI</span>
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-emerald-600 hover:brightness-125 transition-all duration-300">GULF.</span>
                                </h1>
                                <p className="text-xl md:text-2xl font-mono text-slate-400 max-w-xl leading-relaxed border-l-2 border-cyber-green/30 pl-6 mb-10">
                                    Collect tokenized Real-World Impact on Celo.
                                    <span className="block text-sm mt-2 text-slate-500">ONE BLOCK AT A TIME.</span>
                                </p>
                                <div className="flex gap-4">
                                    <div
                                        onClick={() => document.getElementById('staircase')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="btn-sharp btn-cyber px-8 py-4 text-base font-bold flex items-center gap-3 group cursor-pointer"
                                    >
                                        INITIATE <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                    <div
                                        onClick={() => document.getElementById('protocol')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="btn-sharp btn-cyber-outline px-8 py-4 text-base font-bold cursor-pointer hover:bg-cyber-green/10"
                                    >
                                        PROTOCOL
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: The Terminal (Glassmorphism Monitor) */}
                            <div className="lg:col-span-5 relative animate-fade-in-up delay-200">
                                {/* VISUAL POLISH: Added border and shadow */}
                                <div className="glass-schematic p-8 relative min-h-[400px] flex flex-col justify-between group transition-colors duration-500 border border-cyber-green/30 shadow-[0_0_30px_-10px_rgba(0,255,163,0.1)]">
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm opacity-20">
                                        <div className="w-full h-[2px] bg-cyber-green/50 shadow-[0_0_10px_#00FFA3] animate-[scanline_3s_linear_infinite]"></div>
                                    </div>

                                    {/* Header */}
                                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                        </div>
                                        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Live Feed // Net-24</span>
                                    </div>

                                    {/* Stats with "Terminal" feel */}
                                    <div className="space-y-8">
                                        <div>
                                            <p className="font-mono text-xs text-slate-500 mb-2 uppercase flex items-center gap-2">
                                                <Leaf className="w-3 h-3" /> Total Carbon Offset
                                            </p>
                                            <div className="text-5xl font-bold font-mono text-white tracking-tighter flex items-baseline gap-2">
                                                <span><CountUp end={420} duration={3} /></span>
                                                <span className="text-sm text-cyber-green">TREES</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-mono text-xs text-slate-500 mb-2 uppercase flex items-center gap-2">
                                                <Shield className="w-3 h-3" /> Area Protected
                                            </p>
                                            <div className="text-5xl font-bold font-mono text-white tracking-tighter flex items-baseline gap-2">
                                                <span><CountUp end={12.5} decimals={1} duration={3} /></span>
                                                <span className="text-sm text-cyber-green">HECTARES</span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-mono text-xs text-slate-500 mb-2 uppercase flex items-center gap-2">
                                                <Waves className="w-3 h-3" /> Community Support
                                            </p>
                                            <div className="text-5xl font-bold font-mono text-white tracking-tighter flex items-baseline gap-2">
                                                {displayFunded}
                                                <span className="text-sm text-cyber-green">RAISED</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Decor */}
                                    <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-end">
                                        <div className="font-mono text-[10px] text-slate-600">
                                            LAT: 9.55° N <br />
                                            LON: 100.04° E
                                        </div>
                                        <div className="animate-pulse">
                                            <div className="w-16 h-8 border border-cyber-green/30 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-cyber-green/10"></div>
                                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-green"></div>
                                                <div className="absolute bottom-1 left-1 w-1 h-3 bg-cyber-green"></div>
                                                <div className="absolute bottom-1 left-3 w-1 h-5 bg-cyber-green"></div>
                                                <div className="absolute bottom-1 left-5 w-1 h-2 bg-cyber-green"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Gradient Mesh */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-green/5 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none -ml-20 -mb-20"></div>
                </section>

                {/* SECTION 2: THE PIPELINE */}
                <ProtocolPipeline />

                {/* Cinematic Pinned Staircase Container */}
                <div id="staircase">
                    <CinematicStaircase
                        levels={LEVELS}
                        userLevelsMask={stats.userLevelsMask}
                        celoPrices={stats.celoPrices}
                        onMintSuccess={handleMintSuccess}
                        refetch={stats.refetch}
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

                    {ownsLevel(stats.userLevelsMask, activeLevel.id) ? (
                        <button className="btn-sharp btn-cyber-outline w-full py-3 text-sm font-bold flex items-center justify-center gap-2">
                            OWNED - SHARE
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setModalLevel(activeLevel.id); // Placeholder
                            }}
                            className="btn-sharp btn-cyber w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                        >
                            MINT LEVEL {activeLevel.id}
                        </button>
                    )}
                </div>
            </main>

            {/* Footer */}
            <Footer />

            {/* Mint Success Modal */}
            <MintModal
                isOpen={modalLevel !== null}
                levelId={modalLevel}
                onClose={() => setModalLevel(null)}
            />
        </div>
    );
}
