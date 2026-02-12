'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LiveTerminalLog } from './LiveTerminalLog';

export function MissionControlHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        // Holographic Globe Rotation
        gsap.to(globeRef.current, {
            rotateY: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
        });

        // Floating ambient movement
        gsap.to(".floating-node", {
            y: "-=10",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            stagger: 0.2
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-[100dvh] flex items-center pt-[calc(env(safe-area-inset-top)+8rem)] pb-[calc(env(safe-area-inset-bottom)+5rem)] overflow-hidden bg-jungle-green bg-pattern-organic">
            {/* BACKGROUND: The Living Ecosystem Centerpiece */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 opacity-60 perspective-[1000px]">
                <svg
                    ref={globeRef}
                    viewBox="0 0 800 800"
                    className="w-[800px] h-[800px] mx-auto overflow-visible"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <defs>
                        <filter id="organic-glow">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="thai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF9F1C" />
                            <stop offset="100%" stopColor="#00FFA3" />
                        </linearGradient>
                    </defs>

                    {/* Stylized Thai Gulf / Phangan Shape (Organic) */}
                    <path
                        d="M400,250 Q500,200 600,350 T550,600 Q450,700 350,650 T250,450 Q300,300 400,250 Z"
                        fill="none"
                        stroke="url(#thai-gradient)"
                        strokeWidth="1.5"
                        className="opacity-60"
                        filter="url(#organic-glow)"
                    />

                    {/* Ripple/Water Rings */}
                    {[...Array(6)].map((_, i) => (
                        <circle
                            key={i}
                            cx="400"
                            cy="450"
                            r={100 + i * 50}
                            fill="none"
                            stroke="#FF9F1C"
                            strokeWidth="0.5"
                            className="opacity-20 animate-pulse"
                            style={{ animationDelay: `${i * 0.5}s`, animationDuration: '4s' }}
                        />
                    ))}

                    {/* Mycelial Roots Network */}
                    <g className="roots">
                        <path d="M400,450 Q420,550 400,750" fill="none" stroke="#00FFA3" strokeWidth="1" className="opacity-40" />
                        <path d="M400,450 Q300,500 250,700" fill="none" stroke="#00FFA3" strokeWidth="1" className="opacity-40" />
                        <path d="M400,450 Q500,500 550,700" fill="none" stroke="#00FFA3" strokeWidth="1" className="opacity-40" />

                        {/* Flowering Nodes */}
                        <circle cx="400" cy="450" r="12" fill="#FF9F1C" className="floating-node shadow-lg" filter="url(#organic-glow)" />
                        <circle cx="420" cy="550" r="4" fill="#00FFA3" className="floating-node" />
                        <circle cx="300" cy="500" r="3" fill="#00FFA3" className="floating-node" />
                        <circle cx="500" cy="500" r="3" fill="#00FFA3" className="floating-node" />
                    </g>
                </svg>
            </div>

            {/* CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* LEFT: Typography & CTAs */}
                    <div className="lg:col-span-7 flex flex-col justify-center animate-in fade-in slide-in-from-left duration-1000">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-thai-gold rounded-full animate-pulse shadow-[0_0_15px_#FF9F1C]"></div>
                            <span className="font-mono text-xs text-thai-gold tracking-widest uppercase">Ecosystem // Live</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter text-white mb-8 group cursor-default">
                            <span className="block text-thai-gold">EcoThailand Impact</span>
                            <span className="block text-slate-400 hover:text-white transition-all duration-300">Regenerative Action</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-thai-gold via-orange-400 to-cyber-green">Hub</span>
                        </h1>

                        <p className="text-lg md:text-xl font-mono text-slate-300 max-w-lg leading-relaxed border-l-4 border-thai-gold/50 pl-6 mb-10 rounded-sm">
                            Guardianship of the Thai Gulf.
                            <br />
                            <span className="text-emerald-400">Restoring mangroves, soil, and communities.</span>
                            <span className="block text-[10px] mt-4 text-thai-gold/70 tracking-tighter uppercase font-mono">Verified RWI // Thai-Native Biochar</span>
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => document.getElementById('staircase')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-sharp bg-thai-gold text-deep-forest border-thai-gold hover:bg-transparent hover:text-thai-gold px-10 py-4 text-sm font-bold flex items-center gap-3 group rounded-tl-xl rounded-br-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,159,28,0.3)] hover:shadow-[0_0_30px_rgba(255,159,28,0.5)]"
                            >
                                PLANT IMPACT [MINT] <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Eco-Pulse Dashboard */}
                    <div className="lg:col-span-5 h-[400px] animate-in fade-in slide-in-from-right duration-1000 delay-300">
                        {/* Glassmorphic Container for Feed */}
                        <div className="bg-deep-forest/40 backdrop-blur-xl border border-thai-gold/20 rounded-2xl p-6 h-full shadow-2xl relative overflow-hidden group hover:border-thai-gold/40 transition-colors">
                            <LiveTerminalLog />

                            {/* Decorative Corner Accents */}
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-thai-gold/30 rounded-tr-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyber-green/30 rounded-bl-2xl"></div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Ambient Particles replaced scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-thai-gold/20 via-deep-forest/0 to-deep-forest/0"></div>
        </section>
    );
}
