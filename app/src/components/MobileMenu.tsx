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
                { opacity: 0, scale: 1.05 },
                { opacity: 1, scale: 1, duration: 0.4, ease: "power4.out" }
            );

            // Staggered Link Animation
            gsap.fromTo(linksRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                    delay: 0.1
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
            className="fixed inset-0 z-[1000] flex flex-col bg-deep-forest md:hidden overflow-hidden"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="menu-bg-circle absolute -top-20 -right-20 w-80 h-80 bg-thai-gold/20 rounded-full blur-[100px]" />
                <div className="menu-bg-circle absolute top-1/2 -left-40 w-[600px] h-[600px] bg-cyber-green/10 rounded-full blur-[150px]" />
                <div className="menu-bg-circle absolute -bottom-20 right-0 w-64 h-64 bg-ocean-blue/20 rounded-full blur-[80px]" />
            </div>

            {/* Header in Menu with Safe Area Support */}
            <div className="flex items-center justify-between px-6 pb-6 border-b border-white/5 relative z-10 w-full shrink-0 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
                <div className="flex items-center gap-3">
                    <img src="/images/ecosynthesisx-logo.svg" alt="EcoSynthesisX" className="w-8 h-8 rounded-full border border-cyber-green/30" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase font-mono text-white">
                        Contents
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 text-white hover:text-cyber-green transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
                >
                    <CloseIcon size={24} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col flex-1 justify-center px-8 relative z-10 overflow-y-auto py-12 scrollbar-hide">
                <div className="flex flex-col gap-8 max-w-xs mx-auto w-full">
                    {MENU_ITEMS.map((item, index) => (
                        <button
                            key={item.id}
                            ref={el => { linksRef.current[index] = el; }}
                            onClick={() => handleItemClick(item.id)}
                            className="group flex items-baseline gap-8 text-left py-1"
                        >
                            <span className="font-mono text-sm text-thai-gold font-bold tracking-tighter opacity-100 group-hover:translate-x-1 transition-transform">
                                {item.number}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-4xl font-black uppercase tracking-tighter text-white group-hover:text-cyber-green transition-colors">
                                    {item.name}
                                </span>
                                <div className="h-0.5 w-0 group-hover:w-full bg-cyber-green/50 transition-all duration-300 rounded-full mt-1" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Brand in Menu */}
                <div className="mt-20 text-center opacity-30">
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-warm-sand">
                        Regen Bazaar // Thai Gulf // 2026
                    </p>
                </div>
            </nav>

            {/* Bottom Safe Area Padding */}
            <div className="h-[env(safe-area-inset-bottom)] shrink-0" />
        </div>
    );
}

