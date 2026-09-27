import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description:
        'Terms for using EcoThailand Impact. tRWI (Tokenized Real-World Impact) tokens represent real-world environmental action and are not investments or financial instruments.',
    alternates: { canonical: '/terms' },
};

const UPDATED = 'September 27, 2026';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-deep-forest text-warm-sand/90">
            <header className="border-b border-cyber-green/10 backdrop-blur-md bg-deep-forest/80">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="font-mono text-xs uppercase tracking-widest text-cyber-green hover:text-thai-gold transition-colors">
                        ← EcoThailand Impact
                    </Link>
                    <Link href="/privacy" className="font-mono text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        Privacy
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">Terms of Service</h1>
                <p className="font-mono text-xs uppercase tracking-widest text-thai-gold/80 mb-12">Last updated: {UPDATED}</p>

                <div className="space-y-8 leading-relaxed text-warm-sand/80">
                    <section className="glass-organic p-6 border border-thai-gold/20">
                        <h2 className="text-xl font-bold text-thai-gold mb-3">Important: tRWI tokens are not investments</h2>
                        <p>
                            tRWI (Tokenized Real-World Impact) tokens represent real-world environmental action and
                            charitable support. They are <strong>not</strong> investments, securities, shares, or
                            financial instruments, and they carry <strong>no expectation of profit, yield, or return</strong>.
                            Nothing on this site is financial, legal, or tax advice. Purchase only what you are comfortable
                            contributing to environmental restoration.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Acceptance</h2>
                        <p>
                            By using EcoThailand Impact (the &ldquo;Site&rdquo;) and funding tRWI tokens, you agree to
                            these Terms. If you do not agree, please do not use the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. What a tRWI is</h2>
                        <p>
                            Each tRWI is an on-chain token on the Celo blockchain that corresponds to verified
                            regeneration efforts in the Thai Gulf. Of the funds from each mint, 80% supports
                            EcoThailand&rsquo;s on-the-ground projects, 10% supports EcoSynthesisX technology, and 10%
                            supports the ReFi Phangan node and GreenPill Phangan chapter.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Blockchain risks</h2>
                        <p>
                            Blockchain transactions are <strong>irreversible</strong>. You are solely responsible for your
                            wallet, private keys, and the accuracy of any transaction you sign. Transactions require CELO
                            for gas and may fail if the network is congested or your balance is insufficient. We do not
                            custody your assets and cannot reverse, refund, or recover completed or mistaken transactions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. No refunds</h2>
                        <p>
                            Because mints are recorded permanently on a public blockchain, all contributions are final and
                            non-refundable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Third-party services</h2>
                        <p>
                            The Site relies on third-party services including the Celo network and wallet providers
                            (e.g. WalletConnect / RainbowKit). We are not responsible for their availability, security, or
                            conduct, and your use of them is subject to their own terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Intellectual property</h2>
                        <p>
                            Site content, branding, and imagery are owned by the EcoThailand Foundation or used with
                            permission, and may not be reproduced without consent, except as needed to display Impact
                            Products you hold.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Disclaimer &amp; limitation of liability</h2>
                        <p>
                            The Site and tRWI tokens are provided &ldquo;as is&rdquo; without warranties of any kind. To
                            the maximum extent permitted by law, the EcoThailand Foundation and its partners are not liable
                            for any losses arising from use of the Site, blockchain transactions, or third-party services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
                        <p>
                            Questions about these Terms? Reach the EcoThailand Foundation via{' '}
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
