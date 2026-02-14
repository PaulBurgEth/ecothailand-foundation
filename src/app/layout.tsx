import type { Metadata } from 'next';
import { Inter, Unbounded, Space_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' });

import { PRODUCTION_URL } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_URL),
  title: {
    default: 'EcoThailand Impact | Restore Mangroves & Coral | ReFi Marketplace',
    template: '%s | EcoThailand Impact'
  },
  description:
    'Support environmental restoration in the Thai Gulf with tokenized impact products on Celo. Join EcoThailand in planting mangroves and coral.',
  keywords: [
    'environmental impact tokens Thailand',
    'ReFi impact marketplace',
    'mangrove restoration token',
    'Celo blockchain eco tokens',
    'Regeneration hub Thai Gulf',
    'EcoThailand',
    'Impact Product',
    'Regen Bazaar'
  ],
  openGraph: {
    title: 'EcoThailand Impact | Regenerative Environmental Action',
    description: 'Collect tokenized Real-World Impact (RWI) to regenerate the Thai Gulf. Verified mangrove and coral restoration on Celo.',
    url: '/',
    siteName: 'EcoThailand Impact',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'EcoThailand Impact Product | Regenerate the Thai Gulf',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoThailand Impact | Restore Mangroves & Coral',
    description: 'Support environmental restoration in the Thai Gulf with tokenized impact products on Celo.',
    creator: '@EcoThailand',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'EcoThailand Impact – Regenerative Environmental Action',
  'description': 'Support environmental restoration in the Thai Gulf with tokenized impact products on the Celo blockchain.',
  'url': PRODUCTION_URL,
  'publisher': {
    '@type': 'Organization',
    'name': 'EcoThailand',
    'url': 'https://ecothailand.org'
  }
};

import { SmoothScroll } from '@/components/SmoothScroll';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${unbounded.variable} ${spaceMono.variable} font-sans antialiased bg-deep-forest text-warm-sand/90 overflow-x-hidden selection:bg-cyber-green selection:text-deep-forest`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid-pattern.svg')] opacity-[0.03] bg-repeat"></div>
        <Providers>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
