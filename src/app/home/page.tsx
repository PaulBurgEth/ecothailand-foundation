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
import { MissionControlHero } from '@/components/MissionControlHero';

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href="https://ecosynthesisx.com" target="_blank" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            {/* EcoSynthesisX Logo */}
                            <img src="/images/ecosynthesisx-logo.svg" alt="EcoSynthesisX" className="w-10 h-10 rounded-full border border-cyber-green/50 shadow-[0_0_10px_#00FFA3]" />
                            <span className="text-sm font-bold tracking-widest uppercase font-mono text-white hidden md:block">
                                ECO<span className="text-thai-gold">SYNTHESIS</span>X
                            </span>
                        </a>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button onClick={() => document.getElementById('protocol')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            Pipeline
                        </button>
                        <button onClick={() => document.getElementById('staircase')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            Impact
                        </button>
                        <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-mono font-bold text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-wider">
                            FAQ
                        </button>
                    </nav>

                    <ConnectButton showBalance={false} chainStatus="icon" />
                </div>
            </header>

            {/* Main Content Area */}
            <main>
                <MissionControlHero />

                {/* SECTION 2: THE PIPELINE */}
                <ProtocolPipeline />

                {/* Cinematic Pinned Staircase Container */}
                <div id="staircase">
                    <ImpactScroller
                        levels={LEVELS}
                        userLevelsMask={stats.userLevelsMask}
                        celoPrices={stats.celoPrices}
                        onMintSuccess={handleMintSuccess}
                        refetch={stats.refetch}
                    />
                </div>

                {/* FAQ SECTION */}
                <FAQ />
            </main>

            <Footer />

            {/* Mobile Sticky Footer */}
            <div className="md:hidden fixed bottom-16 left-0 right-0 z-50 p-4 bg-deep-forest/90 backdrop-blur-xl border-t border-cyber-green/20 safe-area-bottom">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                        <p className="text-[10px] text-cyber-green font-mono uppercase">Status: Terminal Active</p>
                        <p className="text-white font-bold leading-none">Engineering Future</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-cyber-green">PROTOCOL</p>
                    </div>
                </div>
                <button
                    onClick={() => document.getElementById('staircase')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-sharp btn-cyber w-full py-3 text-sm font-bold"
                >
                    INITIALIZE IMPACT
                </button>
            </div>

            <MintModal
                isOpen={modalLevel !== null}
                levelId={modalLevel || 1}
                onClose={() => setModalLevel(null)}
            />
        </div>
    );
}
