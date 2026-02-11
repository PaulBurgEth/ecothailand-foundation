'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
    {
        question: "What is an Impact Product?",
        answer: "An Impact Product is a onchain tokenized real-world impact on the Celo blockchain that represents real-world environmental action. Each level corresponds to verified regeneration efforts in the Thai Gulf, from planting trees to removing ocean plastic."
    },
    {
        question: "How does the purchase help?",
        answer: "80% of funds go directly to EcoThailand for on-the-ground projects. 10% supports EcoSynthesisX for technology development, and 10% goes to the ReFi Phangan node and GreenPill Phangan chapter to support local regenerative finance initiatives."
    },
    {
        question: "Why Celo?",
        answer: "Celo is a carbon-negative blockchain designed for mobile-first financial inclusion. Its low fees and commitment to regenerative finance (ReFi) make it the perfect home for our Impact Products."
    },
    {
        question: "Can I sell my Impact Product?",
        answer: "Yes, you can trade your Impact Products on secondary marketplaces. In the future, we plan to support selling and staking on the Regen Bazaar, enhancing the liquidity and utility of your contributions."
    },
    {
        question: "How is the impact verified?",
        answer: "EcoThailand works with local partners to verify all activities. Current verification is done by ReFi Phangan via IRL verification and public social media evidence, ensuring every dollar contributes to tangible environmental restoration."
    },
    {
        question: "Why might my minting transaction fail?",
        answer: "Transactions may fail if you don't have enough CELO for gas fees or if the network is busy. Ensure you have a small amount of CELO in your wallet."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 relative overflow-hidden bg-jungle-green/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern-organic opacity-5 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-thai-gold/30 bg-thai-gold/5 backdrop-blur-sm mb-4">
                        <HelpCircle className="w-4 h-4 text-thai-gold" />
                        <span className="text-xs font-mono text-thai-gold uppercase tracking-widest">Knowledge Base</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                        Regeneration <span className="text-transparent bg-clip-text bg-gradient-to-r from-thai-gold to-orange-500">FAQ</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-thai-gold to-transparent mx-auto opacity-50"></div>
                </div>

                {/* FAQ Items - Horizontal Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`
                                group border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative
                                ${openIndex === index
                                    ? 'bg-deep-forest/80 border-thai-gold shadow-[0_0_30px_rgba(255,159,28,0.1)] z-10 scale-[1.02]'
                                    : 'bg-deep-forest/40 border-white/5 hover:border-thai-gold/30 hover:bg-deep-forest/60'
                                }
                            `}
                        >
                            {/* Active Indicator Line */}
                            {openIndex === index && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-thai-gold to-orange-500"></div>
                            )}

                            <button
                                onClick={() => toggle(index)}
                                className="w-full flex items-start justify-between p-6 text-left focus:outline-none h-full"
                            >
                                <span className={`font-bold text-base leading-snug transition-colors pr-4 ${openIndex === index ? 'text-thai-gold' : 'text-slate-200 group-hover:text-white'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-thai-gold flex-shrink-0 mt-0.5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-thai-gold transition-colors flex-shrink-0 mt-0.5" />
                                )}
                            </button>

                            <div
                                className={`
                                    overflow-hidden transition-all duration-500 ease-in-out
                                    ${openIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}
                                `}
                            >
                                <div className="p-6 pt-0 text-slate-300 text-sm leading-relaxed border-t border-white/5 font-sans">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Background Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-thai-gold/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
        </section>
    );
}
