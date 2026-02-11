import type { Metadata } from 'next';
import { Inter, Unbounded, Space_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'EcoThailand Impact Product | Regenerate the Thai Gulf',
  description:
    'Collect tokenized Real-World Impact (RWI) on Celo Blockchain to support EcoThailand\'s mission to preserve the environment, lead educational programs, and initiate social projects.',
  keywords: [
    'EcoThailand',
    'Impact Product',
    'Celo',
    'ReFi',
    'Regenerative Finance',
    'Thai Gulf',
    'Environmental',
    'Web3',
  ],
  openGraph: {
    title: 'EcoThailand Impact Product',
    description: 'Collect tokenized Real-World Impact (RWI) to regenerate the Thai Gulf.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EcoThailand',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoThailand Impact Product',
    description: 'Collect tokenized Real-World Impact (RWI) to regenerate the Thai Gulf.',
    creator: '@EcoThailand',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${unbounded.variable} ${spaceMono.variable} font-sans antialiased bg-deep-forest text-warm-sand/90 overflow-x-hidden selection:bg-cyber-green selection:text-deep-forest`}>
        <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid-pattern.svg')] opacity-[0.03] bg-repeat"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
