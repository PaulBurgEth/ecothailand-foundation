'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LiveTerminalLog } from './LiveTerminalLog';

export function RegenerationHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Organic Float Animation for "Spores/Seeds"
        gsap.to(".floating-seed", {
            y: "-=20",
            x: "+=10",
            rotation: 10,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.5
        });

        // Soft Pulse for the "Living Node"
        gsap.to(".living-node", {
            scale: 1.1,
            opacity: 0.8,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-[100dvh] flex items-center pt-[calc(env(safe-area-inset-top)+6rem)] pb-[calc(env(safe-area-inset-bottom)+3rem)] overflow-hidden bg-deep-forest">

            {/* BACKGROUND: Organic Texture & Gradient */}
            <div className="absolute inset-0 bg-pattern-organic opacity-40 z-0"></div>
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-b from-ocean-blue/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-t from-thai-gold/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

            {/* CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* LEFT: Typography & Story */}
                    <div className="lg:col-span-7 flex flex-col justify-center animate-in fade-in slide-in-from-left duration-1000">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-green"></span>
                            </span>
                            <span className="font-medium text-sm text-cyber-green tracking-wide uppercase">Regeneration // Live</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-8">
                            Restoring the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-thai-gold via-orange-300 to-warm-sand">Heart of the Gulf</span>
                        </h1>

                        <p className="text-lg md:text-xl text-warm-sand/80 max-w-lg leading-relaxed mb-10 border-l-2 border-thai-gold/30 pl-6">
                            Join the movement to regenerate Thailand's vital coastal ecosystems.
                            <span className="block mt-2 text-white font-medium">Verified RWI · Mangroves · Coral · Communities</span>
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => document.getElementById('staircase')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-organic group flex items-center gap-2"
                            >
                                Start Regenerating
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                            <a
                                href="https://ecothailand.org"
                                target="_blank"
                                className="px-6 py-3 rounded-full border border-white/20 text-warm-sand hover:bg-white/5 transition-colors font-medium text-sm flex items-center gap-2"
                            >
                                View Mission
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: Eco-Pulse Dashboard (Organic Glass) */}
                    <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
                        {/* Decorative Organic Shapes (Seeds/Spores) */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-thai-gold/20 rounded-full blur-xl floating-seed"></div>
                        <div className="absolute top-1/2 -left-12 w-16 h-16 bg-cyber-green/20 rounded-full blur-lg floating-seed" style={{ animationDelay: '1s' }}></div>

                        {/* Glassmorphic Container */}
                        <div className="glass-organic p-8 relative overflow-hidden">
                            {/* Inner Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-thai-gold/50 to-transparent opacity-50"></div>

                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h3 className="text-warm-sand font-medium text-sm uppercase tracking-wider mb-1">Eco-Pulse</h3>
                                    <p className="text-2xl font-bold text-white">Gulf Vital Signs</p>
                                </div>
                                <div className="living-node w-3 h-3 rounded-full bg-cyber-green shadow-[0_0_10px_#00FFA3]"></div>
                            </div>

                            <LiveTerminalLog />

                            {/* Organic Bottom Curve */}
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-forest/50 to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
