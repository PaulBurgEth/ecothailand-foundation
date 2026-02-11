'use client';

import { Zap, ShieldCheck, Coins, Leaf } from 'lucide-react';

export function ReFiBenefits() {
    return (
        <section id="refi" className="py-24 relative overflow-hidden bg-jungle-green/10">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                        Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-ocean-blue">ReFi & Celo?</span>
                    </h2>
                    <p className="text-warm-sand/60 max-w-2xl mx-auto font-mono text-sm uppercase tracking-widest">
                        The intersection of climate action and blockchain technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-cyber-green/10 rounded-full flex items-center justify-center text-cyber-green mb-6 border border-cyber-green/20">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-unbounded">Carbon Negative</h3>
                        <p className="text-sm text-warm-sand/60 leading-relaxed">
                            Celo is one of the first carbon-negative blockchains, offsetting its footprint through forestry projects.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-thai-gold/10 rounded-full flex items-center justify-center text-thai-gold mb-6 border border-thai-gold/20">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-unbounded">Low Fees</h3>
                        <p className="text-sm text-warm-sand/60 leading-relaxed">
                            Transactions cost fractions of a cent, ensuring that 90%+ of your contribution goes directly to the ground.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-ocean-blue/10 rounded-full flex items-center justify-center text-ocean-blue mb-6 border border-ocean-blue/20">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-unbounded">Verified Data</h3>
                        <p className="text-sm text-warm-sand/60 leading-relaxed">
                            Impact is verified IRL and recorded on-chain, creating an unmutable audit trail for climate action.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                            <Coins className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-unbounded">Regen Bazaar</h3>
                        <p className="text-sm text-warm-sand/60 leading-relaxed">
                            Integrated with the Regen Bazaar ecosystem, allowing impact products to be part of a global ReFi movement.
                        </p>
                    </div>
                </div>

                <div className="mt-20 p-8 glass-organic border-white/5 bg-white/[0.01] text-center max-w-4xl mx-auto">
                    <p className="text-warm-sand/80 italic leading-relaxed">
                        "Regenerative Finance (ReFi) shifts the focus from extractive economies to systems that restore and preserve our natural world. By tokenizing impact, we create a new asset class based on the health of our planet."
                    </p>
                </div>
            </div>
        </section>
    );
}
