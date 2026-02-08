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
        const totalLevels = levels.length;
        // We want to pin for a duration relative to number of levels
        // e.g. 100vh * (levels - 1) scroll distance

        // Logic:
        // Level 1: Static (z-index 1)
        // Level 2: Slides up over L1 (z-index 2)
        // Level 3: Slides up over L2 (z-index 3)
        // ...

        // We animate Levels 2 through 5.
        // The "timeline" should scrub 0 to 1 over the scroll distance.
        // We can distribute the arrival of each level evenly.

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: trackRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                // pin: containerRef.current, // Pin the viewport container? No, pin the track?
                // Actually, we want the container to be 100vh and PINNED while we scroll the track distance.
                // Wait, typical pattern:
                // Track has height 500vh.
                // Inner container is 100vh sticky? Or Use ScrollTrigger pin.
                pin: containerRef.current,
                onUpdate: (self) => {
                    // Update active index based on progress
                    // 5 levels. 
                    // 0-0.2: Level 1
                    // 0.2-0.4: Level 2
                    // ...
                    // Wait, we want the index to switch AS the new level arrives.
                    // Let's stick to visual logic:
                    // L2 arrives at 25% progress. 
                    // So if progress > 0.1, maybe start showing L2 text?

                    // Simple mapping: 
                    // Level 1 is base.
                    // Level 2 moves up.
                    // Progress 0 -> 0.25 (Level 2 covers moves from 100%y to 0%y)
                    // Progress 0.25 -> 0.5 (Level 3 covers)

                    const p = self.progress;
                    // 4 transitions for 5 levels (1->2, 2->3, 3->4, 4->5)
                    // Range per level = 1 / 4 = 0.25

                    let newIndex = Math.floor(p / 0.25);
                    if (newIndex >= levels.length) newIndex = levels.length - 1;

                    // Optional: Delay the text switch until the image is halfway up?
                    // For now, snap to the rising level.
                    setActiveLevelIndex(newIndex);
                }
            }
        });

        // Animate Levels 2-5
        levels.slice(1).forEach((level, i) => {
            // i=0 is Level 2
            // Target selector
            const selector = `#level-layer-${level.id}`;

            // Start time: i * 0.25
            // Duration: 0.25

            tl.fromTo(
                selector,
                { yPercent: 100 },
                { yPercent: 0, ease: 'none', duration: 1 }, // Duration is relative in timeline
                i // Position in timeline (0, 1, 2, 3)
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
                            // Level 1 is static, others start hidden (handled by GSAP formTo, but good to set initial via CSS/style avoids flash)
                            transform: index === 0 ? 'none' : 'translateY(100%)'
                        }}
                    >
                        <div className="relative w-full h-full mask-stack-blend">
                            <img
                                src={level.image}
                                alt={level.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                        </div>

                        {/* Center Neon Connector */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-cyber-green/50 shadow-[0_0_15px_#00FFA3] z-20 hidden md:block origin-top"></div>
                    </div>
                ))}

                {/* Floating UI Layer (Z-Index 50) */}
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <div className="w-full max-w-lg pointer-events-auto transition-opacity duration-500 px-4 md:px-0">
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

                {/* Mobile Bottom Bar (If MintingConsole is too big, but MintingConsole is pretty compact now. 
               Let's keep MintingConsole for both but maybe style it simpler on mobile? 
               The current MintingConsole has a responsive card look. 
               For "Cinematic", maybe we want it at bottom on mobile?
            */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
                    {/* We can render a different mobile layout here if needed, 
                    but MintingConsole is passed above.
                    If MintingConsole is centered, it might cover the image on mobile.
                    Let's rely on the centered one for now, or move it to bottom on mobile via CSS in MintingConsole?
                    Current MintingConsole has `mx-auto` and `w-full`. 
                    Let's adjust MintingConsole's container above to be `items-end pb-4` on mobile?
                */}
                </div>
            </div>
        </div>
    );
}
