import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'How EcoThailand Foundation handles data on the EcoThailand Impact platform. We run no advertising trackers; wallet and on-chain data is public by nature.',
    alternates: { canonical: '/privacy' },
};

const UPDATED = 'May 31, 2026';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-deep-forest text-warm-sand/90">
            <header className="border-b border-cyber-green/10 backdrop-blur-md bg-deep-forest/80">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="font-mono text-xs uppercase tracking-widest text-cyber-green hover:text-thai-gold transition-colors">
                        ← EcoThailand Impact
                    </Link>
                    <Link href="/terms" className="font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        Terms
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">Privacy Policy</h1>
                <p className="font-mono text-xs uppercase tracking-widest text-thai-gold/80 mb-12">Last updated: {UPDATED}</p>

                <div className="space-y-8 leading-relaxed text-warm-sand/80">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Who we are</h2>
                        <p>
                            EcoThailand Impact is operated by the EcoThailand Foundation (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
                            This policy explains what data is involved when you use this website and connect a wallet to
                            fund tRWI (Tokenized Real-World Impact) tokens on the Celo blockchain.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. We do not track you for advertising</h2>
                        <p>
                            This site does not use advertising cookies, analytics pixels, or third-party behavioural
                            tracking. We do not build marketing profiles and we do not sell personal data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Wallet and blockchain data</h2>
                        <p>
                            When you connect a wallet, your public wallet address and the transactions you sign are
                            processed to display your holdings and complete mints. Transactions on the Celo blockchain are
                            <strong> public, permanent, and outside our control</strong>; they cannot be edited or deleted
                            by us or by you. Wallet connection is handled by third-party providers (e.g. WalletConnect /
                            RainbowKit), which operate under their own privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Technical logs</h2>
                        <p>
                            Our hosting and network providers (Vercel and Cloudflare) may automatically process technical
                            information such as IP address, browser type, and request timestamps to deliver the site
                            securely and prevent abuse. This is standard server logging and is not used to identify you
                            personally.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Contacting us</h2>
                        <p>
                            If you email us or reach out through our social channels, we will process the information you
                            choose to share in order to respond. We keep it only as long as needed for that purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Children</h2>
                        <p>This site is not directed at children under 13, and we do not knowingly collect their data.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Changes</h2>
                        <p>
                            We may update this policy as the platform evolves. Material changes will be reflected by the
                            &ldquo;last updated&rdquo; date above.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
                        <p>
                            Questions about this policy? Reach the EcoThailand Foundation via{' '}
                            <a href="https://ecothailand.org" target="_blank" rel="noopener noreferrer" className="text-cyber-green hover:text-thai-gold underline">
                                ecothailand.org
                            </a>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
