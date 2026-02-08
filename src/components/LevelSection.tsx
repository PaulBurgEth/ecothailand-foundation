'use client';

import { LevelData } from '@/lib/constants';

interface LevelSectionProps {
    level: LevelData;
    zIndex: number;
    isActive: boolean;
}

export function LevelSection({ level, zIndex, isActive }: LevelSectionProps) {
    return (
        <div
            id={`level-${level.id}`}
            className="sticky-level"
            style={{ zIndex }}
            data-level-id={level.id}
        >
            <div className={`relative w-full h-full flex items-center justify-center transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40'}`}>

                {/* Background Image with Mask */}
                <div className="absolute inset-x-0 top-0 bottom-0 max-w-5xl mx-auto mask-stack-blend">
                    <img
                        src={level.image}
                        alt={level.name}
                        className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${isActive ? 'scale-105' : 'scale-100'}`}
                    />
                </div>

                {/* Giant Number Watermark (Behind everything) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vh] font-black text-white/5 font-mono select-none pointer-events-none z-0">
                    {level.id.toString().padStart(2, '0')}
                </div>

                {/* Center Connector Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyber-green/40 shadow-[0_0_10px_#00FFA3] z-10 hidden md:block"></div>

            </div>
        </div>
    );
}
