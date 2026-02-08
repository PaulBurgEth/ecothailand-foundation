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
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: trackRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                pin: containerRef.current,
                onUpdate: (self) => {
                    // Update active index based on progress
                    const p = self.progress;
                    // 4 transitions for 5 levels (1->2, 2->3, 3->4, 4->5)
                    // Range per level = 1 / 4 = 0.25
                    let newIndex = Math.floor(p / 0.25);
                    if (newIndex >= levels.length) newIndex = levels.length - 1;
                    setActiveLevelIndex(newIndex);
                }
            }
        });

        // Animate Levels 2-5
        levels.slice(1).forEach((level, i) => {
            // i=0 is Level 2
            const selector = `#level-layer-${level.id}`;

            // Ensure GSAP knows we start at 100% (matches CSS)
            gsap.set(selector, { yPercent: 100 });

            // Timeline Animation: Ascension
            // Animate TO yPercent: 0 (Slide UP from bottom)
            tl.to(
                selector,
                {
                    yPercent: 0,
                    ease: 'none',
                    duration: 1
                },
                i // Insert at absolute time (0, 1, 2, 3)
            );
        });

    }, { scope: containerRef, dependencies: [levels] });

    return (
        <div ref={trackRef} className="relative w-full" style={{ height: `${levels.length * 100}vh` }}>
            {/* The Pinned Viewport */}
            <div
                ref={containerRef}
                className="h-screen w-full overflow-hidden relative"
            >
                {/* Images Stack */}
                {levels.map((level, index) => (
                    <div
                        key={level.id}
                        id={`level-layer-${level.id}`}
                        className="absolute inset-0 w-full h-full flex items-center justify-center"
                        style={{
                            zIndex: index + 1,
                            // Level 1 is static (visible), others start below via CSS to prevent flash
                            transform: index === 0 ? 'none' : 'translateY(100%)'
                        }}
                    >
                        <div className="relative w-full h-full mask-stack-blend">
                            <img
                                src={level.image}
                                alt={level.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Scrim for Text Readability: VISUAL POLISH */}
                            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-deep-forest via-deep-forest/80 to-transparent pointer-events-none" />
                        </div>

                        {/* Center Neon Connector */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-cyber-green shadow-[0_0_15px_#00FFA3] z-20 hidden md:block origin-top neon-spine"></div>
                    </div>
                ))}

                {/* Floating UI Layer (Z-Index 50) */}
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <div className="w-full max-w-lg pointer-events-auto transition-opacity duration-500 px-4 md:px-0 transform scale-90 md:scale-100 origin-bottom md:origin-center">
                        {/* Console updates based on state */}
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
