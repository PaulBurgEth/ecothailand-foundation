'use client';

import { useEffect, useRef } from 'react';
import { LevelData } from '@/lib/constants';

interface ArtTrackProps {
    levels: LevelData[];
    onActiveLevelChange: (levelId: number) => void;
}

export function ArtTrack({ levels, onActiveLevelChange }: ArtTrackProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const options = {
            root: null, // viewport
            rootMargin: '-50% 0px -50% 0px', // Trigger when element is in the middle 50% of viewport
            threshold: 0
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const levelId = Number(entry.target.getAttribute('data-level-id'));
                    if (levelId) {
                        onActiveLevelChange(levelId);
                        // Add active class for animation
                        entry.target.classList.add('active');
                    }
                } else {
                    // Optionally remove active class to re-trigger animation on scroll up?
                    // entry.target.classList.remove('active'); 
                }
            });
        }, options);

        // Observe all level images
        const elements = containerRef.current?.querySelectorAll('.level-image-container');
        elements?.forEach((el) => observerRef.current?.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [onActiveLevelChange]);

    return (
        <div ref={containerRef} className="relative w-full pb-24">
            {/* The Central Connector Line */}
            <div className="connector-line"></div>

            <div className="flex flex-col w-full">
                {levels.map((level) => (
                    <div
                        key={level.id}
                        data-level-id={level.id}
                        className="level-image-container stair-step relative w-full h-[80vh] flex items-center justify-center p-8 snap-center"
                    >
                        {/* Image Wrapper with Mask */}
                        <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-square overflow-hidden rounded-sm border border-cyber-green/10 bg-black/50 glow-hover group transition-all duration-700">

                            {/* Number Watermark */}
                            <div className="absolute -left-4 top-10 text-[120px] font-black text-white/5 font-mono leading-none select-none z-0">
                                {level.id.toString().padStart(2, '0')}
                            </div>

                            {/* The NFT Image */}
                            <img
                                src={level.image}
                                alt={level.name}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 image-mask-vertical"
                            />

                            {/* Mobile Overlay (Only visible on small screens to give context) */}
                            <div className="absolute bottom-4 left-4 right-4 md:hidden">
                                <span className="bg-black/80 text-cyber-green text-xs font-mono px-2 py-1 border border-cyber-green/30">
                                    {level.name}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
