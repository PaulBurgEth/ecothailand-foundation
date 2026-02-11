'use client';

import { useEffect } from 'react';
import { X, ExternalLink, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEVELS, TWITTER_INTENT_URL } from '@/lib/constants';

interface MintModalProps {
    isOpen: boolean;
    levelId: number | null;
    onClose: () => void;
}

export function MintModal({ isOpen, levelId, onClose }: MintModalProps) {
    const level = levelId ? LEVELS.find((l) => l.id === levelId) : null;

    useEffect(() => {
        if (isOpen) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen || !level) return null;

    // Construct dynamic share URL pointing to our new metadata page
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app-lac-phi-20.vercel.app';
    const dynamicShareUrl = `${appUrl}/share/${level.id}`;

    const shareText = encodeURIComponent(
        `I just supported @EcoThailand's mission to regenerate the Thai Gulf! 🌊🌱\n\nCollect your own Impact Product and join the movement:\n\n#ReFi #ImpactProduct #Celo #EcoThailand\n${dynamicShareUrl}`
    );

    // Override the global intent with our specific text containing the link
    const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />


            {/* Modal */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="pt-12 pb-6 px-8 text-center bg-deep-forest/50">
                    <div className="relative w-full aspect-square max-w-[280px] mx-auto mb-8 group">
                        {/* Glow Effect */}
                        <div
                            className="absolute inset-0 rounded-3xl blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                            style={{ backgroundColor: level.glowColor }}
                        />

                        {/* NFT Image */}
                        <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl z-10">
                            <img
                                src={level.image}
                                alt={level.name}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay details */}
                            <div className="absolute top-4 right-4 bg-deep-forest/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                <span className="text-thai-gold font-bold text-[10px] tracking-widest uppercase">LVL {level.id}</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tighter animate-in fade-in slide-in-from-bottom duration-700">
                        {level.name} Acquired! 🎉
                    </h2>

                    <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-[300px] mx-auto">
                        Thank you for purchasing an <span className="text-emerald-400 font-semibold">EcoThailand Impact Product</span> and helping regenerate the Thai Gulf.
                    </p>
                </div>

                {/* Actions */}
                <div className="px-8 pb-8">
                    <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold
              bg-gradient-to-r from-emerald-500 to-teal-500 text-white 
              hover:from-emerald-400 hover:to-teal-400 
              shadow-lg shadow-emerald-500/25 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Share on X
                    </a>

                    <button
                        onClick={onClose}
                        className="w-full mt-3 py-3 px-6 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        Continue Collecting
                    </button>
                </div>
            </div>
        </div>
    );
}
