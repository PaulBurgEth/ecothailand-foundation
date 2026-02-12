'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X as CloseIcon } from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MENU_ITEMS = [
    { name: 'Mission', id: 'about', number: '01' },
    { name: 'Pipeline', id: 'protocol', number: '02' },
    { name: 'Ecosystem', id: 'refi', number: '03' },
    { name: 'Impact', id: 'staircase', number: '04' },
    { name: 'Bundle', id: 'bundle', number: '05' },
    { name: 'FAQ', id: 'faq', number: '06' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLButtonElement | null)[]>([]);

    useGSAP(() => {
        if (isOpen) {
            // Animate Menu Entrance
            gsap.fromTo(containerRef.current,
                { opacity: 0, scale: 1.1 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power4.out" }
            );

            // Staggered Link Animation
            gsap.fromTo(linksRef.current,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: 0.2
                }
            );

            // Background Decorative Elements Animation
            gsap.fromTo(".menu-bg-circle",
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 0.1, duration: 1, stagger: 0.2, ease: "elastic.out(1, 0.5)" }
            );
        }
    }, { scope: containerRef, dependencies: [isOpen] });

    if (!isOpen) return null;

    const handleItemClick = (id: string) => {
        onClose();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col bg-deep-forest/98 backdrop-blur-3xl md:hidden overflow-hidden"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="menu-bg-circle absolute -top-20 -right-20 w-80 h-80 bg-thai-gold/20 rounded-full blur-[100px]" />
                <div className="menu-bg-circle absolute top-1/2 -left-40 w-[600px] h-[600px] bg-cyber-green/10 rounded-full blur-[150px]" />
                <div className="menu-bg-circle absolute -bottom-20 right-0 w-64 h-64 bg-ocean-blue/20 rounded-full blur-[80px]" />
            </div>

            {/* Header in Menu */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 relative z-10 w-full shrink-0">
                <div className="flex items-center gap-2">
                    <img src="/images/ecosynthesisx-logo.svg" alt="EcoSynthesisX" className="w-8 h-8 rounded-full border border-cyber-green/30" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono text-white/50">
                        Contents
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-white hover:text-cyber-green transition-colors bg-white/5 rounded-full"
                >
                    <CloseIcon size={24} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col flex-1 justify-center px-8 relative z-10 overflow-y-auto pt-8 pb-12">
                <div className="flex flex-col gap-6 max-w-xs mx-auto w-full">
                    {MENU_ITEMS.map((item, index) => (
                        <button
                            key={item.id}
                            ref={el => { linksRef.current[index] = el; }}
                            onClick={() => handleItemClick(item.id)}
                            className="group flex items-baseline gap-6 text-left py-2 border-b border-white/5 hover:border-cyber-green/30 transition-all"
                        >
                            <span className="font-mono text-xs text-thai-gold font-bold tracking-tighter opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                {item.number}
                            </span>
                            <span className="text-3xl font-black uppercase tracking-tighter text-white group-hover:text-cyber-green transition-colors">
                                {item.name}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Footer Brand in Menu */}
                <div className="mt-16 text-center opacity-40">
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-warm-sand">
                        Thai Gulf Regeneration // 2026
                    </p>
                </div>
            </nav>

            {/* Bottom Notch Spacing */}
            <div className="h-[env(safe-area-inset-bottom)] shrink-0" />
        </div>
    );
}
