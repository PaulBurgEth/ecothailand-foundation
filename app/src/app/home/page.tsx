'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { LEVELS, IMPACT_CONTRACT_ADDRESS, TIER_CELO_PRICES } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI } from '@/lib/abi';
import { useImpactStats, ownsLevel } from '@/hooks/useImpactStats';
import { parseEther } from 'viem';
import { MintModal } from '@/components/MintModal';
import { ImpactScroller } from '@/components/ImpactScroller';
import { ProtocolPipeline } from '@/components/ProtocolPipeline';
import { Footer } from '@/components/Footer';
import { FAQ } from '@/components/FAQ';
import { RegenerationBundle } from '@/components/RegenerationBundle';
import { Menu, X as CloseIcon } from 'lucide-react';
import { MissionControlHero } from '@/components/MissionControlHero';
import { AboutMission } from '@/components/AboutMission';
import { ReFiBenefits } from '@/components/ReFiBenefits';
import { MobileMenu } from '@/components/MobileMenu';

export default function HomePage() {
    const stats = useImpactStats();
    const [modalLevel, setModalLevel] = useState<number | null>(null);
    const { isConnected } = useAccount();
    const { writeContractAsync: mintBatchAsync } = useWriteContract();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBatchMinting, setIsBatchMinting] = useState(false);

    // Scrollytelling State
    const [activeLevelId, setActiveLevelId] = useState<number>(1);

    // Find active level data
    const activeLevel = LEVELS.find(l => l.id === activeLevelId) || LEVELS[0];

    const handleMintSuccess = (levelId: number) => {
        setModalLevel(levelId);
        stats.refetch();
    };

    return (
        <div className="min-h-screen bg-deep-forest text-slate-100 selection:bg-cyber-green selection:text-deep-forest overflow-x-hidden">
            {/* Background Effects */}
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-deep-forest/90 bg-pattern-organic opacity-10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-thai-gold/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-green/5 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            {/* Header with EcoSynthesisX Branding */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-green/10 backdrop-blur-md bg-deep-forest/80">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href="https://ecosynthesisx.com" target="_blank" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            {/* EcoSynthesisX Logo */}
                            <img src="/images/ecosynthesisx-logo.svg" alt="EcoSynthesisX" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-cyber-green/50 shadow-[0_0_10px_#00FFA3]" />
                            <span className="text-xs md:text-sm font-bold tracking-widest uppercase font-mono text-white">
                                ECO<span className="text-thai-gold">SYNTHESIS</span>X
                            </span>
                        </a>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            Mission
                        </button>
                        <button onClick={() => document.getElementById('protocol')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            Pipeline
                        </button>
                        <button onClick={() => document.getElementById('refi')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            Ecosystem
                        </button>
                        <button onClick={() => document.getElementById('staircase')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            Impact
                        </button>
                        <button onClick={() => document.getElementById('bundle')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            Bundle
                        </button>
                        <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            FAQ
                        </button>
                    </nav>

                    <div className="flex items-center gap-4">
                        <ConnectButton showBalance={false} chainStatus="icon" />

                        {/* Burger Menu Button */}
                        <button
                            className="md:hidden p-2 text-white hover:text-cyber-green transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open navigation menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main>
                <MissionControlHero />


                <div className="relative z-10">
                    <AboutMission />
                </div>

                {/* SECTION 2: THE PIPELINE */}
                <div className="relative z-10">
                    <ProtocolPipeline />
                </div>

                {/* Technical & Ecosystem Benefits */}
                <div className="relative z-10">
                    <ReFiBenefits />
                </div>

                {/* Cinematic Pinned Staircase Container */}
                <div id="staircase" className="relative z-20 bg-deep-forest">
                    <ImpactScroller
                        levels={LEVELS}
                        userLevelsMask={stats.userLevelsMask}
                        celoPrices={stats.celoPrices}
                        onMintSuccess={handleMintSuccess}
                        refetch={stats.refetch}
                    />
                </div>

                {/* SECTION 4: THE REGENERATION BUNDLE (Standalone) */}
                <div id="bundle" className="relative z-10">
                    <RegenerationBundle
                        userLevelsMask={stats.userLevelsMask}
                        onMintSuccess={handleMintSuccess}
                        refetch={stats.refetch}
                    />
                </div>

                {/* FAQ SECTION */}
                <FAQ />
            </main>

            <Footer />

            <MintModal
                isOpen={modalLevel !== null}
                levelId={modalLevel || 1}
                onClose={() => setModalLevel(null)}
            />

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
    );
}
