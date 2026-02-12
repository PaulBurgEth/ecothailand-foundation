'use client';

import { Sprout, ShieldCheck, Globe } from 'lucide-react';

export function AboutMission() {
    return (
        <section id="about" className="py-24 relative overflow-hidden bg-deep-forest">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Mission Text */}
                    <div className="animate-in fade-in slide-in-from-left duration-1000">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                            The Mission: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-thai-gold">Regeneration</span>
                        </h2>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-warm-sand/80 leading-relaxed mb-6">
                                EcoThailand is a community-led foundation dedicated to the environmental guardianship of the Thai Gulf. We bridge the gap between digital innovation and real-world impact through <strong>tokenized environmental regeneration</strong>.
                            </p>

                            <p className="text-lg text-warm-sand/80 leading-relaxed mb-6">
                                Our platform leverages <strong>Regenerative Finance (ReFi)</strong> on the Celo blockchain to fund critical restoration projects. By collecting an Impact Product, you are directly supporting the restoration of mangroves, preservation of sea grass, and deployment of coral nursery frames.
                            </p>

                            <p className="text-lg text-warm-sand/80 leading-relaxed">
                                Every transaction is verified on-chain, creating a transparent, permanent record of your contribution to the Thai Gulf ecosystem. This is more than a digital collectible; it's a <strong>verified impact product</strong> that funds tangible environmental change.
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right duration-1000 delay-200">
                        <div className="glass-organic p-8 border-white/5 bg-white/[0.02]">
                            <Sprout className="w-10 h-10 text-cyber-green mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase font-mono">Verified RWI</h3>
                            <p className="text-sm text-warm-sand/60 leading-relaxed">
                                Real-World Impact (RWI) is geo-located and documented by local arborist and marine biologists.
                            </p>
                        </div>

                        <div className="glass-organic p-8 border-white/5 bg-white/[0.02]">
                            <Globe className="w-10 h-10 text-thai-gold mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase font-mono">ReFi Marketplace</h3>
                            <p className="text-sm text-warm-sand/60 leading-relaxed">
                                Part of the Regen Bazaar network, fostering a global ecosystem of regenerative projects.
                            </p>
                        </div>

                        <div className="glass-organic p-8 border-white/5 bg-white/[0.02]">
                            <ShieldCheck className="w-10 h-10 text-thai-gold mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase font-mono">Transparency</h3>
                            <p className="text-sm text-warm-sand/60 leading-relaxed">
                                80% of all funds flow directly to EcoThailand Foundation's local field operations.
                            </p>
                        </div>

                        <div className="glass-organic p-8 border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/images/ecosynthesisx-logo.svg" alt="Celo" className="w-8 h-8 rounded-full" />
                                <span className="text-xs font-bold text-cyber-green font-mono uppercase">Powered by Celo</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase font-mono">Carbon Neutral</h3>
                            <p className="text-sm text-warm-sand/60 leading-relaxed">
                                Built on Celo, the carbon-negative blockchain designed for mobile-first financial inclusion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </section>
    );
}
