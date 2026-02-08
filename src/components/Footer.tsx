'use client';

import { Leaf, Activity, ExternalLink, Github, Twitter, Disc, Facebook } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-deep-forest border-t border-cyber-green/10 pt-20 pb-8 relative overflow-hidden">
            {/* HUD Decor Lines */}
            <div className="absolute top-0 left-0 w-32 h-[1px] bg-cyber-green/50"></div>
            <div className="absolute top-0 right-0 w-32 h-[1px] bg-cyber-green/50"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-cyber-green/20"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">

                {/* Main Content: Big EcoThailand Branding & Socials */}
                <div className="flex flex-col items-center justify-center text-center gap-6 mb-12">

                    {/* Brand Name & Tagline */}
                    <div className="flex flex-col items-center gap-2">
                        <a href="https://ecothailand.org" target="_blank" rel="noopener noreferrer" className="group">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2 group-hover:text-cyber-green transition-colors">
                                EcoThailand
                            </h2>
                        </a>
                        <p className="font-mono text-sm text-cyber-green uppercase tracking-widest">
                            Impact Product
                        </p>
                        <div className="flex items-center gap-2 mt-2 opacity-80">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Powered by</span>
                            <a href="https://ecosynthesisx.com" target="_blank" className="flex items-center gap-1.5 hover:opacity-100 transition-opacity">
                                <img src="/images/ecosynthesisx-logo.jpg" alt="X" className="w-4 h-4 rounded-full border border-cyber-green/30" />
                                <span className="text-[10px] font-bold text-cyber-green tracking-wider uppercase">ECOSYNTHESISX</span>
                            </a>
                        </div>
                    </div>

                    {/* Social Links (Removed X/Twitter as requested) */}
                    <div className="flex items-center gap-8 mt-4">
                        <a href="https://www.facebook.com/EcoThailandFoundation" target="_blank" className="text-slate-400 hover:text-blue-500 transition-colors transform hover:scale-110">
                            <Facebook className="w-8 h-8" />
                        </a>
                        <a href="https://ecothailand.org" target="_blank" className="text-slate-400 hover:text-cyber-green transition-colors transform hover:scale-110">
                            <Leaf className="w-8 h-8" />
                        </a>
                    </div>

                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyber-green/50 to-transparent mt-8"></div>
                </div>

                {/* Bottom Bar: Copyright & Tagline */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-center md:text-left">
                    <div className="flex flex-col">
                        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1">
                            © 2025 <span className="text-slate-300">EcoThailand Impact Product</span>. All rights reserved.
                        </p>
                        <p className="font-mono text-[10px] text-cyber-green/60 uppercase">
                            Designed for the Solar Future. Verifying Impact on Celo.
                        </p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-3 bg-black/30 border border-cyber-green/20 px-3 py-1.5 rounded-sm backdrop-blur-sm">
                        <div className="relative">
                            <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 bg-cyber-green rounded-full animate-ping opacity-50"></div>
                        </div>
                        <span className="font-mono text-[9px] text-slate-500 uppercase leading-none">Systems Online</span>
                    </div>
                </div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] bg-repeat pointer-events-none"></div>
        </footer>
    );
}
