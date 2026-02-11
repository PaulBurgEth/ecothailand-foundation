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
                scrub: 1.2, // Smoother momentum
            }
        });

        // ANIMATION: Floating Card Stack
        // We act on the WRAPPER (#level-card-wrapper-X) to avoid conflict with the CSS floating animation on the inner element
        levels.slice(1).forEach((level, i) => {
            const selector = `#level-card-wrapper-${level.id}`;
            const targetIndex = i + 1; // 1, 2, 3...

            // Initial state: 
            gsap.set(selector, {
                yPercent: 200,
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
                ease: 'power4.out',
                duration: 1,
            });
        });

        // Global Timeline Update for Sync
        tl.eventCallback("onUpdate", () => {
            // Formula: Math.floor(time + 0.5) ensures we switch index at the halfway point of the transition
            const time = tl.time();
            const nextIndex = Math.floor(time + 0.5);

            // Clamp to valid range
            const clampedIndex = Math.max(0, Math.min(nextIndex, levels.length - 1));

            setActiveLevelIndex(prev => prev !== clampedIndex ? clampedIndex : prev);
        });

    }, { scope: trackRef, dependencies: [levels.length] });

    return (
        // The Track: Height is determined by ScrollTrigger 'end' (via pinSpacer), 
        // so we just need a viewport-sized container here that GETS pinned.
        <div ref={trackRef} className="relative w-full h-screen overflow-hidden md:flex md:flex-row bg-deep-forest">
            {/* RIGHT PANEL (Background Cards on Mobile, Right Panel on Desktop) */}
            <div className="absolute inset-0 md:relative md:w-1/2 h-full overflow-hidden bg-deep-forest flex items-center justify-center perspective-[1000px] z-0 md:order-2">
                {/* Custom Glow Orb */}
                <div
                    className="absolute w-[80%] h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-30 transition-colors duration-1000 ease-in-out pointer-events-none z-0 mix-blend-screen"
                    style={{ backgroundColor: activeLevel.glowColor }}
                ></div>

                {levels.map((level, index) => (
                    <div
                        key={level.id}
                        id={`level-card-wrapper-${level.id}`}
                        className="absolute w-[85%] md:w-[70%] aspect-square z-10 will-change-transform"
                        style={{
                            zIndex: index === 0 ? 1 : undefined,
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <div
                            className="w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-500 bg-deep-forest/40 animate-float relative group"
                            style={{ animationDelay: `${index * 0.5}s` }}
                        >
                            <Image
                                src={level.image}
                                alt={level.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={index === 0}
                                className="object-cover opacity-90 transition-opacity duration-500 scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>
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

            {/* LEFT PANEL (Overlay on Mobile, Left Panel on Desktop) */}
            <div className="absolute bottom-0 left-0 right-0 md:relative md:w-1/2 h-auto md:h-full flex items-center justify-center p-4 md:p-6 z-50 bg-gradient-to-t from-deep-forest via-deep-forest/80 to-transparent md:bg-jungle-green/90 md:backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/5 shadow-2xl md:order-1">
                <div className="absolute inset-0 bg-pattern-organic opacity-10 pointer-events-none md:sticky md:top-0"></div>

                <div className="w-full max-w-2xl transition-all duration-300 relative z-10 py-4 md:py-0">
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
        </div>
    );
}
