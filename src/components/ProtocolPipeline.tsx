'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Wallet, MousePointerClick, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
    {
        id: 1,
        title: "CONNECT",
        description: "Link your wallet to the Celo Network. We support Rainbow, MetaMask, and Valora.",
        icon: Wallet,
        align: "start"
    },
    {
        id: 2,
        title: "SELECT IMPACT",
        description: "Choose your tier. From planting a single tree to regenerating an entire hectare.",
        icon: MousePointerClick,
        align: "end"
    },
    {
        id: 3,
        title: "MINT & VERIFY",
        description: "Receive your Impact NFT. The proof is on-chain, visible forever.",
        icon: ShieldCheck,
        align: "start"
    }
];

export function ProtocolPipeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
        const path = pathRef.current;
        if (!path) return;

        // Calculate path length for drawing
        const length = path.getTotalLength();

        // Set initial state: hidden path
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });

        // Animate path drawing on scroll
        gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom 80%",
                scrub: 1,
            }
        });

        // Animate Steps Stagger
        STEPS.forEach((step, index) => {
            gsap.fromTo(`#step-card-${step.id}`,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: `#step-card-${step.id}`,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <section id="protocol" className="relative py-32 overflow-hidden w-full max-w-7xl mx-auto px-4" ref={containerRef}>

            <div className="text-center mb-24 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fade-in-up">
                    THE <span className="text-cyber-green">PIPELINE</span>
                </h2>
                <div className="w-24 h-1 bg-cyber-green mx-auto"></div>
            </div>

            <div className="relative">
                {/* Background SVG Cable (Desktop) */}
                <svg className="absolute top-0 left-0 w-full h-full z-0 hidden md:block" preserveAspectRatio="none">
                    {/* Define the path roughly connecting the zigzag points */}
                    {/* 
                        Step 1: Top Left (20% x, 0% y)
                        Step 2: Center Right (80% x, 50% y)
                        Step 3: Bottom Left (20% x, 100% y)
                    */}
                    <path
                        ref={pathRef}
                        d="M 250 100 C 600 100, 600 500, 900 500 C 600 500, 600 900, 250 900"
                        fill="none"
                        stroke="#00FFA3"
                        strokeWidth="4"
                        className="opacity-50 drop-shadow-[0_0_10px_rgba(0,255,163,0.5)]"
                        vectorEffect="non-scaling-stroke"
                    // Note: Precise coordinates depend on responsiveness. 
                    // Using specific viewBox or percent based might be tricky with pure SVG scaling.
                    // Let's use a simpler vertical line for now or just generic curve?
                    // Actually, let's use a straight line with corners for "Technical" look?
                    />
                    {/* Redrawing path to be simpler/responsive-ish:
                        M 20% 15% -> L 80% 50% -> L 20% 85% 
                        But SVG logic in absolute div needs `viewBox` matching content.
                        Hard to align perfectly without fixed height. 
                        Let's try a dashed line via CSS border implementation for simplicity on "nodes" if SVG fails?
                        No, let's try the SVG path. Assuming container is relative.
                    */}
                </svg>

                {/* 
                   Wait, getting SVG path to align with Grid items responsively is hard.
                   Better approach: 
                   Use a central line for mobile.
                   For desktop, maybe just absolute positioning or carefully placed Grid?
                   Let's use a Grid approach.
                */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 relative z-10">

                    {/* Step 1: Left */}
                    <div id="step-card-1" className="md:col-start-1 md:text-right flex flex-col items-center md:items-end">
                        <div className="glass-schematic p-8 hover:border-cyber-green transition-all duration-300 group max-w-md w-full relative">
                            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-cyber-green rounded-full border-4 border-deep-forest z-20 hidden md:block"></div>
                            <Wallet className="w-10 h-10 text-cyber-green mb-4" />
                            <h3 className="text-2xl font-bold font-mono mb-2">01. CONNECT</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{STEPS[0].description}</p>
                        </div>
                    </div>

                    {/* Step 2: Right */}
                    <div className="hidden md:block"></div> {/* Spacer */}
                    <div className="hidden md:block"></div> {/* Spacer */}

                    <div id="step-card-2" className="md:col-start-2 md:text-left flex flex-col items-center md:items-start">
                        <div className="glass-schematic p-8 hover:border-cyber-green transition-all duration-300 group max-w-md w-full relative">
                            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-cyber-green rounded-full border-4 border-deep-forest z-20 hidden md:block"></div>
                            <MousePointerClick className="w-10 h-10 text-cyber-green mb-4" />
                            <h3 className="text-2xl font-bold font-mono mb-2">02. VERIFY</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{STEPS[1].description}</p>
                        </div>
                    </div>

                    {/* Step 3: Left */}
                    <div id="step-card-3" className="md:col-start-1 md:text-right flex flex-col items-center md:items-end">
                        <div className="glass-schematic p-8 hover:border-cyber-green transition-all duration-300 group max-w-md w-full relative">
                            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-cyber-green rounded-full border-4 border-deep-forest z-20 hidden md:block"></div>
                            <ShieldCheck className="w-10 h-10 text-cyber-green mb-4" />
                            <h3 className="text-2xl font-bold font-mono mb-2">03. IMPACT</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{STEPS[2].description}</p>
                        </div>
                    </div>

                </div>

                {/* Simple Vertical Line for Mobile */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-cyber-green/20 -translate-x-1/2 md:hidden"></div>
            </div>

        </section>
    );
}
