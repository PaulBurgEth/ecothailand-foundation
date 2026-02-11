'use client';

import { useRef, useState } from 'react';
import { LevelData } from '@/lib/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MintingConsole } from './MintingConsole';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface ImpactScrollerProps {
    levels: LevelData[];
    userLevelsMask: number;
    celoPrices: bigint[];
    onMintSuccess: (levelId: number) => void;
    refetch: () => void;
}

export function ImpactScroller({
    levels,
    userLevelsMask,
    celoPrices,
    onMintSuccess,
    refetch,
}: ImpactScrollerProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeLevelIndex, setActiveLevelIndex] = useState(0);

    const activeLevel = levels[activeLevelIndex];
    const activePrice = celoPrices[activeLevelIndex] || 0n;

    useGSAP(() => {
        if (!trackRef.current) return;

        // Create a timeline that pins the track
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: trackRef.current,
                start: 'top top',
                end: '+=400%', // 5 levels = 4 transitions.
                pin: true,
                scrub: 1, // Smooth scrubbing
            }
        });

        // ANIMATION: Floating Card Stack
        // We act on the WRAPPER (#level-card-wrapper-X) to avoid conflict with the CSS floating animation on the inner element
        levels.slice(1).forEach((level, i) => {
            const selector = `#level-card-wrapper-${level.id}`;
            const targetIndex = i + 1; // 1, 2, 3...

            // Initial state: 
            gsap.set(selector, {
                yPercent: 150,
                scale: 0.8,
                rotationX: 30,
                opacity: 0,
                zIndex: targetIndex + 2
            });

            // Animate IN
            tl.to(selector, {
                yPercent: 0,
                scale: 1,
                rotationX: 0,
                opacity: 1,
                ease: 'power3.out',
                duration: 1,
            });
        });

        // Global Timeline Update for Sync
        tl.eventCallback("onUpdate", () => {
            // Total duration is (levels.length - 1) because we have that many transitions
            // But actually, we just need to map progress (0-1) to the number of transitions.

            // However, tl.duration() might be different depending on defaults.
            // We added (levels.length - 1) tweens of duration 1.
            // So total time is levels.length - 1.

            const time = tl.time();
            // When time is 0 -> Index 0
            // When time is > 0.8 -> Index 1
            // When time is > 1.8 -> Index 2

            // Formula: Math.floor(time + 0.2)
            const nextIndex = Math.floor(time + 0.2);

            // Clamp to valid range
            const clampedIndex = Math.max(0, Math.min(nextIndex, levels.length - 1));

            setActiveLevelIndex(prev => prev !== clampedIndex ? clampedIndex : prev);
        });

    }, { scope: trackRef, dependencies: [levels.length] });

    return (
        // The Track: Height is determined by ScrollTrigger 'end' (via pinSpacer), 
        // so we just need a viewport-sized container here that GETS pinned.
        <div ref={trackRef} className="relative w-full h-screen overflow-hidden flex flex-col md:flex-row bg-deep-forest">

            {/* LEFT PANEL: Info & Minting Console */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-6 relative z-50 bg-jungle-green/90 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 shadow-2xl">
                {/* Organic Pattern Background */}
                <div className="absolute inset-0 bg-pattern-organic opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-2xl transition-all duration-300 relative z-10">
                    <div key={activeLevel.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <MintingConsole
                            level={activeLevel}
                            userLevelsMask={userLevelsMask}
                            celoPrice={activePrice}
                            onMintSuccess={onMintSuccess}
                            refetch={refetch}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Floating Cards Zone */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-deep-forest flex items-center justify-center perspective-[1000px]">

                {/* Custom Glow Orb behind specific level */}
                <div
                    className="absolute w-[80%] h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-30 transition-colors duration-1000 ease-in-out pointer-events-none z-0 mix-blend-screen"
                    style={{ backgroundColor: activeLevel.glowColor }}
                ></div>

                {levels.map((level, index) => (
                    // WRAPPER: Controlled by GSAP for Scrollytelling Transitions
                    <div
                        key={level.id}
                        id={`level-card-wrapper-${level.id}`}
                        className="absolute w-[85%] md:w-[70%] aspect-square z-10 will-change-transform"
                        style={{
                            // Level 1 (Index 0) is base
                            zIndex: index === 0 ? 1 : undefined,
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* INNER: Controlled by CSS for Continuous Floating */}
                        <div
                            className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-500 bg-deep-forest/40 animate-float relative group"
                            style={{
                                animationDelay: `${index * 0.5}s` // Stagger animations slightly
                            }}
                        >
                            <Image
                                src={level.image}
                                alt={level.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={index === 0}
                                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-110"
                            />

                            {/* Card Gloss/Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none mix-blend-overlay"></div>

                            {/* Inner Shadow Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>

                            {/* Level Badge on Card */}
                            <div className="absolute bottom-8 left-8 z-20">
                                <span className="font-mono text-4xl font-black text-white drop-shadow-2xl flex items-center gap-3">
                                    <span className="text-white text-xs tracking-widest uppercase border border-white/20 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md">Level</span>
                                    {level.id.toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
