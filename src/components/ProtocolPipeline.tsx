'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sprout, Droplets, TreeDeciduous } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        id: 1,
        title: "SOURCE",
        subtitle: "CONNECT WALLET",
        description: "Link your wallet to the Celo Network. Navigate the river of regenerative finance.",
        icon: Sprout,
    },
    {
        id: 2,
        title: "NOURISH",
        subtitle: "CHOOSE IMPACT",
        description: "Select your restoration zone. From mangrove roots to biochar soil enrichment.",
        icon: Droplets,
    },
    {
        id: 3,
        title: "BLOOM",
        subtitle: "RECEIVE ASSET",
        description: "Your impact is verified and tokenized. A permanent record of your guardianship.",
        icon: TreeDeciduous,
    }
];

export function ProtocolPipeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
        const path = pathRef.current;
        if (!path) return;

        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });

        gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                end: "bottom 70%",
                scrub: 1,
            }
        });

        STEPS.forEach((step, index) => {
            gsap.fromTo(`#step-card-${step.id}`,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: `#step-card-${step.id}`,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <section id="protocol" className="relative py-32 overflow-hidden w-full max-w-7xl mx-auto px-4" ref={containerRef}>

            <div className="text-center mb-24 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fade-in-up tracking-tighter">
                    Stream of <span className="text-transparent bg-clip-text bg-gradient-to-r from-thai-gold to-orange-400">Regeneration</span>
                </h2>
                <div className="flex justify-center gap-2 items-center opacity-70">
                    <div className="w-1.5 h-1.5 rounded-full bg-thai-gold"></div>
                    <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-thai-gold to-transparent"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-thai-gold"></div>
                </div>
            </div>

            <div className="relative">
                {/* Background SVG River (Desktop) */}
                <svg className="absolute top-0 left-0 w-full h-full z-0 hidden md:block overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="river-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#E09F3E" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#00FFA3" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#00D1FF" stopOpacity="0.3" />
                        </linearGradient>
                        <filter id="soft-glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* The River Path (Smooth Curve) */}
                    <path
                        ref={pathRef}
                        d="M 250 100 C 250 300, 600 300, 600 500 C 600 700, 250 700, 250 900"
                        fill="none"
                        stroke="url(#river-gradient)"
                        strokeWidth="4"
                        filter="url(#soft-glow)"
                        className="opacity-60"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                    />

                    {/* Floating Spores on Path */}
                    <circle cx="250" cy="100" r="6" fill="#E09F3E" className="animate-pulse shadow-[0_0_10px_#E09F3E]" />
                    <circle cx="250" cy="900" r="6" fill="#00D1FF" className="animate-pulse delay-700 shadow-[0_0_10px_#00D1FF]" />
                </svg>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 relative z-10">

                    {/* Step 1: Left */}
                    <div id="step-card-1" className="md:col-start-1 md:text-right flex flex-col items-center md:items-end">
                        <div className="glass-organic p-8 hover:border-thai-gold/30 transition-all duration-500 group max-w-md w-full relative">
                            <div className="absolute -right-4 top-1/2 w-8 h-8 bg-deep-forest rounded-full border border-thai-gold/50 z-20 hidden md:flex items-center justify-center shadow-lg">
                                <div className="w-2.5 h-2.5 bg-thai-gold rounded-full"></div>
                            </div>
                            <Sprout className="w-12 h-12 text-thai-gold mb-4 stroke-[1.5] group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-2xl font-bold font-mono text-white mb-1">01. {STEPS[0].title}</h3>
                            <div className="text-xs font-mono text-thai-gold uppercase tracking-wider mb-3">{STEPS[0].subtitle}</div>
                            <p className="text-warm-sand/80 text-sm leading-relaxed font-sans">{STEPS[0].description}</p>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block"></div>

                    {/* Spacer */}
                    <div className="hidden md:block"></div>

                    {/* Step 2: Right */}
                    <div id="step-card-2" className="md:col-start-2 md:text-left flex flex-col items-center md:items-start">
                        <div className="glass-organic p-8 hover:border-cyber-green/30 transition-all duration-500 group max-w-md w-full relative">
                            <div className="absolute -left-4 top-1/2 w-8 h-8 bg-deep-forest rounded-full border border-cyber-green/50 z-20 hidden md:flex items-center justify-center shadow-lg">
                                <div className="w-2.5 h-2.5 bg-cyber-green rounded-full"></div>
                            </div>
                            <Droplets className="w-12 h-12 text-cyber-green mb-4 stroke-[1.5] group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-2xl font-bold font-mono text-white mb-1">02. {STEPS[1].title}</h3>
                            <div className="text-xs font-mono text-cyber-green uppercase tracking-wider mb-3">{STEPS[1].subtitle}</div>
                            <p className="text-warm-sand/80 text-sm leading-relaxed font-sans">{STEPS[1].description}</p>
                        </div>
                    </div>

                    {/* Step 3: Left */}
                    <div id="step-card-3" className="md:col-start-1 md:text-right flex flex-col items-center md:items-end">
                        <div className="glass-organic p-8 hover:border-ocean-blue/30 transition-all duration-500 group max-w-md w-full relative">
                            <div className="absolute -right-4 top-1/2 w-8 h-8 bg-deep-forest rounded-full border border-ocean-blue/50 z-20 hidden md:flex items-center justify-center shadow-lg">
                                <div className="w-2.5 h-2.5 bg-ocean-blue rounded-full"></div>
                            </div>
                            <TreeDeciduous className="w-12 h-12 text-ocean-blue mb-4 stroke-[1.5] group-hover:scale-110 transition-transform duration-500" />
                            <h3 className="text-2xl font-bold font-mono text-white mb-1">03. {STEPS[2].title}</h3>
                            <div className="text-xs font-mono text-ocean-blue uppercase tracking-wider mb-3">{STEPS[2].subtitle}</div>
                            <p className="text-warm-sand/80 text-sm leading-relaxed font-sans">{STEPS[2].description}</p>
                        </div>
                    </div>

                </div>

                {/* Vertical Line for Mobile - Organic Gradient */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-thai-gold via-cyber-green to-ocean-blue -translate-x-1/2 md:hidden rounded-full opacity-30"></div>
            </div>

        </section>
    );
}
