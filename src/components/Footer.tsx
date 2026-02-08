'use client';

import { Leaf, Activity, ExternalLink, Github, Twitter, Disc } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-deep-forest border-t border-cyber-green/10 pt-20 pb-8 relative overflow-hidden">
            {/* HUD Decor Lines */}
            <div className="absolute top-0 left-0 w-32 h-[1px] bg-cyber-green/50"></div>
            <div className="absolute top-0 right-0 w-32 h-[1px] bg-cyber-green/50"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-cyber-green/20"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mb-12">

                    {/* Left: Branding */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyber-green blur-md opacity-20 animate-pulse"></div>
                            <Leaf className="w-8 h-8 text-cyber-green relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest leading-none mb-1">Powered By</span>
                            <a href="https://ecosynthesisx.com" target="_blank" rel="noopener noreferrer" className="text-xl font-black text-white tracking-tighter leading-none hover:text-cyber-green transition-colors">ECOSYNTHESISX</a>
                        </div>
                    </div>

                    {/* Center: Terminal Links */}
                    <div className="flex items-center gap-8">
                        <a
                            href="#staircase"
                            className="font-mono text-xs text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-widest relative group"
                        >
                            TERMINAL
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-cyber-green transition-all group-hover:w-full"></span>
                        </a>
                        <a
                            href="#faq" // Currently no FAQ section exists, but user requested this anchors to it. Or maybe we should link to external?
                            // "Link FAQ to the FAQ Section anchor (#faq)."
                            className="font-mono text-xs text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-widest relative group"
                        >
                            FAQ
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-cyber-green transition-all group-hover:w-full"></span>
                        </a>
                        <button
                            onClick={() => alert("Verification Protocol Active. View on Celo Explorer.")} // Placeholder as "Modal" logic is in parent
                            className="font-mono text-xs text-slate-400 hover:text-cyber-green transition-colors uppercase tracking-widest relative group"
                        >
                            PROOF
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-cyber-green transition-all group-hover:w-full"></span>
                        </button>
                    </div>

                    {/* Right: Status Indicator */}
                    <div className="flex items-center gap-3 bg-black/30 border border-cyber-green/20 px-4 py-2 rounded-sm backdrop-blur-sm">
                        <div className="relative">
                            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 bg-cyber-green rounded-full animate-ping opacity-50"></div>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="font-mono text-[10px] text-cyber-green uppercase tracking-widest leading-none mb-0.5">Systems Online</span>
                            <span className="font-mono text-[9px] text-slate-500 uppercase leading-none">Block: 24,592,104</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Socials */}
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 gap-6">
                    <p className="font-mono text-[10px] text-slate-600 uppercase">
                        © 2025 <a href="https://ecothailand.org" target="_blank" className="hover:text-cyber-green">EcoThailand Impact Product</a>. All rights reserved. <br className="md:hidden" /> Designed for the Solar Future. Verifying Impact on Celo.
                    </p>

                    <div className="flex items-center gap-6">
                        <a href="https://github.com/EcoThailand" target="_blank" className="text-slate-500 hover:text-cyber-green transition-colors"><Github className="w-4 h-4" /></a>
                        <a href="https://twitter.com/EcoThailand" target="_blank" className="text-slate-500 hover:text-cyber-green transition-colors"><Twitter className="w-4 h-4" /></a>
                        <a href="https://ecothailand.org" target="_blank" className="text-slate-500 hover:text-cyber-green transition-colors"><Disc className="w-4 h-4" /></a>
                    </div>
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] bg-repeat pointer-events-none"></div>
        </footer>
    );
}
