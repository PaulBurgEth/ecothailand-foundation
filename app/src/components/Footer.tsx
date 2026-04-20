'use client';

import { Leaf, Facebook } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-jungle-green border-t border-thai-gold/10 pt-24 pb-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern-organic opacity-5 pointer-events-none"></div>

            {/* Organic Decor Lines */}
            <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-thai-gold/50 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-thai-gold/50 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-thai-gold/30 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">

                {/* Main Content: Big EcoThailand Branding & Socials */}
                <div className="flex flex-col items-center justify-center text-center gap-8 mb-16">

                    {/* Brand Name & Tagline */}
                    <div className="flex flex-col items-center gap-3">
                        <a href="https://ecothailand.org" target="_blank" rel="noopener noreferrer" className="group">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2 group-hover:text-thai-gold transition-colors">
                                Eco<span className="text-thai-gold">Thailand</span>
                            </h2>
                        </a>
                        <p className="font-mono text-sm text-thai-gold uppercase tracking-[0.3em] opacity-80">
                            Regeneration Hub
                        </p>
                        <div className="flex items-center gap-2 mt-4 opacity-70 hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Powered by</span>
                            <a href="https://ecosynthesisx.com" target="_blank" className="flex items-center gap-1.5">
                                <img src="/images/ecosynthesisx-logo.svg" alt="X" className="w-5 h-5 rounded-full border border-thai-gold/30 grayscale hover:grayscale-0 transition-all" />
                                <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase hover:text-white">ECOSYNTHESISX</span>
                            </a>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-6 mt-6">
                        <a href="https://www.facebook.com/EcoThailandFoundation" target="_blank" className="w-12 h-12 flex items-center justify-center rounded-full bg-deep-forest/50 border border-white/5 hover:border-thai-gold hover:bg-thai-gold hover:text-deep-forest transition-all duration-300 group">
                            <Facebook className="w-5 h-5 text-slate-400 group-hover:text-deep-forest transition-colors" />
                        </a>
                        <a href="https://ecothailand.org" target="_blank" className="w-12 h-12 flex items-center justify-center rounded-full bg-deep-forest/50 border border-white/5 hover:border-cyber-green hover:bg-cyber-green hover:text-deep-forest transition-all duration-300 group">
                            <Leaf className="w-5 h-5 text-slate-400 group-hover:text-deep-forest transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Bottom Bar: Copyright & Tagline */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-6 text-center md:text-left border-t border-white/5">
                    <div className="flex flex-col">
                        <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} EcoThailand Foundation
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <p className="font-mono text-[10px] text-thai-gold/80 uppercase tracking-[0.2em] font-bold mb-2">
                            Designed for the Living Earth
                        </p>
                        {/* Status Indicator */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-deep-forest/50 border border-thai-gold/20">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-thai-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-thai-gold"></span>
                            </div>
                            <span className="font-mono text-[9px] text-slate-400 uppercase leading-none">Ecosystem Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
