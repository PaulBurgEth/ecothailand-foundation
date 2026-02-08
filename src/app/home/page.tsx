'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import { Waves, Leaf, TreeDeciduous, Shield } from 'lucide-react';
import { LEVELS, IMPACT_CONTRACT_ADDRESS, TIER_CELO_PRICES } from '@/lib/constants';
import { IMPACT_CONTRACT_ABI } from '@/lib/abi';
import { useImpactStats, ownsLevel, isLevelUnlocked } from '@/hooks/useImpactStats';
import { parseEther } from 'viem';
import { ImpactCard } from '@/components/ImpactCard';
import { ProgressBar } from '@/components/ProgressBar';
import { MintModal } from '@/components/MintModal';
import CountUp from 'react-countup';

export default function HomePage() {
    const stats = useImpactStats();
    const [modalLevel, setModalLevel] = useState<number | null>(null);
    const { isConnected } = useAccount();
    const { writeContractAsync: mintBatchAsync } = useWriteContract();
    const [isBatchMinting, setIsBatchMinting] = useState(false);

    const handleMintSuccess = (levelId: number) => {
        setModalLevel(levelId);
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
            // Calculate total USD price for the missing levels
            const missingLevels = LEVELS.filter(level => !ownsLevel(stats.userLevelsMask, level.id));
            const totalUsdPrice = missingLevels.reduce((sum, level) => sum + level.priceUSD, 0);

            // Use hardcoded safety net prices
            const totalCeloVal = missingLevels.reduce((sum, level) => {
                const price = TIER_CELO_PRICES[level.id as keyof typeof TIER_CELO_PRICES];
                return sum + parseEther(price.toString());
            }, 0n);

            await mintBatchAsync({
                address: IMPACT_CONTRACT_ADDRESS,
                abi: IMPACT_CONTRACT_ABI,
                functionName: 'mintBatchLevels',
                args: [levelsToMint],
                value: totalCeloVal,
            });
            handleMintSuccess(5); // Show success for the highest level
        } catch (error) {
            console.error('Batch mint error:', error);
        } finally {
            setIsBatchMinting(false);
        }
    };

    // Social Proof: Pre-Seed Value ($150)
    const displayTotalFunded = stats.totalRaisedUSD === 0 ? 150 : stats.totalRaisedUSD;
    const isZeroState = stats.totalRaisedUSD === 0 && displayTotalFunded === 0; // Not really possible with our logic

    return (
        <div className="min-h-screen bg-deep-forest text-slate-100 selection:bg-cyber-green selection:text-deep-forest">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-green/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyber-green/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-cyber-green/10 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyber-green flex items-center justify-center cyber-glow">
                            <Leaf className="w-6 h-6 text-deep-forest" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase font-mono">ECOTHAILAND</span>
                    </div>
                    <ConnectButton />
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-24 pb-16 px-4 text-center border-b border-cyber-green/5">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-green/10 border border-cyber-green/20 text-cyber-green text-[10px] font-mono mb-8 uppercase tracking-widest">
                        <Waves className="w-3 h-3" />
                        Celo Protocol • Real-World Impact
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[0.9] uppercase tracking-tighter italic">
                        Regenerate the <br className="hidden sm:block" />
                        <span className="text-cyber-green cyber-glow">Thai Gulf</span>, <br className="hidden sm:block" />
                        One Block at a Time
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Directly fund verified ecological projects on Koh Phangan. <br className="hidden sm:block" />
                        Track your impact on-chain. <span className="text-white">Collect the proof.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <button
                            onClick={handleBecomeGuardian}
                            disabled={isBatchMinting}
                            className={`btn-sharp px-10 py-5 w-full sm:w-auto text-lg flex items-center justify-center gap-2 btn-active-press ${isBatchMinting ? 'bg-slate-800 border-slate-700 text-slate-500 shimmer-effect' : 'btn-cyber cyber-glow'
                                }`}
                        >
                            {isBatchMinting ? (
                                <>
                                    <Shield className="w-5 h-5 animate-pulse text-cyber-green" />
                                    COMMITTING...
                                </>
                            ) : (
                                'Become a Guardian'
                            )}
                        </button>
                        <button className="btn-sharp btn-cyber-outline px-10 py-5 w-full sm:w-auto text-lg">
                            Whitepaper
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-5xl mx-auto">
                        {[
                            { label: 'Total Funded', value: stats.totalRaisedUSD > 100 || displayTotalFunded > 100 ? (displayTotalFunded as number) : 150, prefix: '$' },
                            { label: 'Gardens', value: 5, suffix: '+' },
                            { label: 'CO2 Offset', value: 45.2, suffix: ' Tons', decimals: 1 },
                            { label: 'Plastic Removed', value: 1280, suffix: ' Kg' },
                            { label: 'Trees Planted', value: 420 },
                            { label: 'Students', value: 1000, suffix: '+' }
                        ].filter(s => s.value !== null).map((stat, i) => (
                            <div key={i} className="glass-schematic p-4 text-left border-cyber-green/10 card-hover-effect">
                                <p className="text-[9px] font-mono text-slate-500 uppercase">{stat.label}</p>
                                <p className="text-xl font-mono text-cyber-green leading-none mt-1">
                                    {typeof stat.value === 'string' ? stat.value : <CountUp end={stat.value as number} duration={2.5} separator="," prefix={stat.prefix} suffix={stat.suffix} />}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 py-24 px-4 border-b border-cyber-green/5">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-16 uppercase tracking-tighter text-center italic">Protocol Logic</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        {[
                            { step: '01', title: 'CONNECT WALLET', desc: 'Secure connection via Celo Network. Built on Carbon-Negative Infrastructure for Real-World Impact.' },
                            { step: '02', title: 'SELECT IMPACT TIER', desc: 'Choose between Seed Sower, Sapling Protector, or Ecosystem Architect tiers.' },
                            { step: '03', title: 'MINT PROOF', desc: 'Receive on-chain NFT proof. EcoThailand\'s Impact Product: Tokenized Real-World Impact (RWI).' }
                        ].map((step, i) => (
                            <div key={i} className="relative">
                                <span className="text-6xl font-black text-cyber-green/5 absolute -top-8 -left-4 font-mono leading-none">{step.step}</span>
                                <h3 className="text-lg font-bold mb-3 font-mono text-cyber-green">{step.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Progress Bar Area */}
            <section className="relative z-10 px-4 py-12 bg-black/10">
                <div className="max-w-5xl mx-auto">
                    {(stats.totalRaisedUSD > 100 || displayTotalFunded > 100) && (
                        <ProgressBar totalRaisedUSD={displayTotalFunded} isLoading={stats.isLoading} />
                    )}
                </div>
            </section>

            {/* Impact Grid */}
            <section className="relative z-10 px-4 py-24 bg-gradient-to-b from-transparent to-deep-forest/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center mb-16">
                        <div className="w-12 h-1 px-4 bg-cyber-green/20 mb-6" />
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Impact Marketplace</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {LEVELS.map((level, index) => (
                            <div key={level.id} id={`level-${level.id}`} className="h-full">
                                <ImpactCard
                                    level={level}
                                    userLevelsMask={stats.userLevelsMask}
                                    celoPrice={stats.celoPrices[index] || 0n}
                                    onMintSuccess={handleMintSuccess}
                                    refetch={stats.refetch}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* FAQ Section */}
            <section className="relative z-10 py-24 px-4 border-t border-cyber-green/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 uppercase tracking-tighter italic text-center text-cyber-green">Verification & Logic</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {[
                            {
                                q: "How does the verification work?",
                                a: "Every Impact Product is linked to a specific, verified action. Our guardians provide 'Proof of Work' in the form of timestamped photos, GPS coords, and laboratory results (e.g., plastic contaminant analysis)."
                            },
                            {
                                q: "Where does the money go?",
                                a: "80% goes directly to EcoThailand core regeneration projects, 10% to EcoSynthesisX (platform & outreach), and 10% to ReFi Phangan for local ecosystem support."
                            },
                            {
                                q: "Can I sell my Impact Product?",
                                a: "Yes. They are standard ERC-1155 tokens on Celo. However, their primary value is as a verifiable receipt of the positive impact you've funded."
                            },
                            {
                                q: "What is Tokenized RWI?",
                                a: "Real-World Impact (RWI) turning ecological debt into positive assets. We use blockchain to make environmental funding transparent and trackable."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass-schematic p-6 border-cyber-green/5">
                                <h4 className="text-white font-bold mb-2 font-mono uppercase tracking-tight">{item.q}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-cyber-green/10 py-16 px-4 bg-black/20">
                <div className="max-w-7xl mx-auto font-mono text-[10px] tracking-widest text-slate-500 flex flex-col md:flex-row justify-between items-center gap-8 uppercase text-center md:text-left">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <Leaf className="w-4 h-4 text-cyber-green" />
                            <a href="https://ecosynthesisx.com" target="_blank" className="hover:text-cyber-green transition-colors">POWERED BY ECOSYNTHESISX</a>
                        </div>
                        <p className="text-[8px] opacity-40">EcoThailand's Impact Product: Tokenized Real-World Impact (RWI)</p>
                    </div>
                    <div className="flex gap-8">
                        <span>80% CORE FUNDS</span>
                        <span>10% ECO-SYNTHESIS</span>
                        <span>10% REFI PHANGAN</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="https://ecothailand.org" target="_blank" className="hover:text-cyber-green transition-colors">WEBSITE</a>
                        <a href="https://www.facebook.com/ecothailand.org.th" target="_blank" className="hover:text-cyber-green transition-colors">FACEBOOK</a>
                        <a href="#" className="hover:text-cyber-green transition-colors">TERMINAL</a>
                    </div>
                </div>
            </footer>

            {/* Mint Success Modal */}
            <MintModal
                isOpen={modalLevel !== null}
                levelId={modalLevel}
                onClose={() => setModalLevel(null)}
            />
        </div>
    );
}
