'use client';

import { useRef, useState } from 'react';
import { LevelData } from '@/lib/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MintingConsole } from './MintingConsole';

gsap.registerPlugin(ScrollTrigger);

interface CinematicStaircaseProps {
    levels: LevelData[];
    userLevelsMask: number;
    celoPrices: bigint[];
    onMintSuccess: (levelId: number) => void;
    refetch: () => void;
}

export function CinematicStaircase({
    levels,
    userLevelsMask,
    celoPrices,
    onMintSuccess,
    refetch,
}: CinematicStaircaseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeLevelIndex, setActiveLevelIndex] = useState(0);

    const activeLevel = levels[activeLevelIndex];
    const activePrice = celoPrices[activeLevelIndex] || 0n;

    useGSAP(() => {
        if (!trackRef.current || !containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: trackRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: (self) => {
                    // Update active index based on progress
                    // 4 transitions (20% each step? No, 100% / 4 = 25%)
                    const p = self.progress;
                    let newIndex = Math.floor(p / 0.25);
                    if (newIndex >= levels.length) newIndex = levels.length - 1;
                    setActiveLevelIndex(newIndex);
                }
            }
        });

        // Loop through Levels 2-5 (Indices 1-4)
        // Level 1 (Index 0) is static base.
        levels.slice(1).forEach((level, i) => {
            const selector = `#level-layer-${level.id}`;

            // STRICT INITIALIZATION: Start below viewport
            gsap.set(selector, { yPercent: 100 });

            // Animate UP to 0% (Cover previous level)
            tl.to(selector, {
                yPercent: 0,
                ease: 'none',
                duration: 1
            }); // Sequential animation
        });

    }, { scope: trackRef, dependencies: [levels] });

    return (
        // 1. The Setup (The Track) - 500vh
        <div ref={trackRef} className="relative w-full h-[500vh] staircase-track">

            {/* The Viewport - Sticky 100vh */}
            <div ref={containerRef} className="sticky top-0 h-screen w-full overflow-hidden staircase-viewport">

                {/* 2. The Layers (5 Separate Images) */}
                {levels.map((level, index) => (
                    <div
                        key={level.id}
                        id={`level-layer-${level.id}`}
                        className="absolute inset-0 w-full h-full"
                        style={{
                            zIndex: index + 1, // Z-Index 1-5
                            // Level 1 is naturally visible. Levels 2-5 start translated via GSAP, 
                            // but we add CSS default here to prevent FOUC
                            transform: index === 0 ? 'none' : 'translateY(100%)'
                        }}
                    >
                        {/* Image Container */}
                        <div className="relative w-full h-full">
                            <img
                                src={level.image}
                                alt={level.name}
                                className="w-full h-full object-cover"
                            />
                            {/* 3. Readability Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 pointer-events-none" />
                        </div>
                    </div>
                ))}

                {/* VISUAL POLISH: Neon Spine (Z-Index 10) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#00FFA3] shadow-[0_0_15px_#00FFA3] z-10 hidden md:block -translate-x-1/2 pointer-events-none neon-spine"></div>

                {/* MINT CONSOLE (Z-Index 20) */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-end pb-12 md:pb-24 justify-center">
                    <div className="w-full max-w-lg pointer-events-auto px-4 md:px-0 transform scale-90 md:scale-100 origin-bottom transition-all duration-500">
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
