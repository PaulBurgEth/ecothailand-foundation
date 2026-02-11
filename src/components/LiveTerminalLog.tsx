'use client';

import { useState, useEffect, useRef } from 'react';

const LOG_LINES = [
    "Monitoring Gulf Health",
    "Soil Sensor [M2]: Moisture +42%, pH Neutral",
    "Mangrove Zone A: Root Density Increasing",
    "Biochar Kiln #4: 450kg Carbon Sequestered",
    "Regen Bazaar: New Community Offerings",
    "Water Quality (Ao Thai): Nitrates Low",
    "Community: 12 New Gardeners Onboarded",
    "Bio-Waste Diverter: 5 Tons Saved from Landfill",
    "Thai Gulf: Species Count +3 (Seahorse Sighting)",
    "Network: ReFi Phangan Node Syncing",
    "Impact Verified: 0x82f...91a (On-Chain)",
    "Air Quality: Good (PM2.5 Low)",
    "Minting Engine: Ready for New Growth",
];

export function LiveTerminalLog() {
    const [lines, setLines] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setLines(prev => {
                const newLines = [...prev, LOG_LINES[index]];
                if (newLines.length > 20) newLines.shift();
                return newLines;
            });
            setIndex((prev) => (prev + 1) % LOG_LINES.length);
        }, 2000); // Slower, calmer pace

        return () => clearInterval(interval);
    }, [index]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="w-full h-full font-mono text-[11px] md:text-sm text-slate-300 overflow-hidden relative flex flex-col">
            {/* Eco Pulse Header (Hidden/Integrated in Parent) */}
            <div className="hidden flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <div className="flex gap-2 items-center">
                    <span className="w-2 h-2 rounded-full bg-thai-gold animate-pulse"></span>
                    <span className="text-thai-gold tracking-widest uppercase font-bold text-xs">Eco-Pulse // Live</span>
                </div>
                <div className="text-[9px] uppercase tracking-widest opacity-50 text-slate-400">Station: Phangan.01</div>
            </div>

            {/* Scrolling Feed */}
            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto scrollbar-hide space-y-3 pr-2"
            >
                {lines.map((line, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-700 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                        <span className="text-warm-sand/80 font-mono text-xs tracking-wide">
                            {line.replace(/^>\s*/, "").replace(/^ECO-PULSE:\s*/, "")}
                        </span>
                    </div>
                ))}
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-deep-forest/20 to-transparent pointer-events-none"></div>
        </div>
    );
}
