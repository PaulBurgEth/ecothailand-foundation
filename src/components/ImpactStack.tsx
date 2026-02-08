'use client';

import { useEffect, useRef } from 'react';
import { LevelData } from '@/lib/constants';
import { LevelSection } from './LevelSection';

interface ImpactStackProps {
    levels: LevelData[];
    activeLevelId: number;
    onActiveLevelChange: (levelId: number) => void;
}

export function ImpactStack({ levels, activeLevelId, onActiveLevelChange }: ImpactStackProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '-45% 0px -45% 0px', // Trigger when element is mostly centered
            threshold: 0
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const levelId = Number(entry.target.getAttribute('data-level-id'));
                    if (levelId) {
                        onActiveLevelChange(levelId);
                    }
                }
            });
        }, options);

        // Observe all level sections
        const elements = containerRef.current?.querySelectorAll('.sticky-level');
        elements?.forEach((el) => observerRef.current?.observe(el));

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [onActiveLevelChange]);

    return (
        <div ref={containerRef} className="sticky-stack-container relative">
            {levels.map((level, index) => (
                <LevelSection
                    key={level.id}
                    level={level}
                    zIndex={index + 1}
                    isActive={activeLevelId === level.id}
                />
            ))}

            {/* Spacer to allow the last item to scroll fully if needed, 
                though in a sticky stack, usually the last item just sticks 
                until the container scrolls out. 
                With 5 items at 100vh each, the container should behave.
            */}
        </div>
    );
}
