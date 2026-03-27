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
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${PRODUCTION_URL}/#website`,
      'url': PRODUCTION_URL,
      'name': 'EcoThailand Impact',
      'description': 'Regenerative Environmental Action on Celo blockchain',
    },
    {
      '@type': 'Organization',
      '@id': `${PRODUCTION_URL}/#organization`,
      'name': 'EcoThailand',
      'url': PRODUCTION_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${PRODUCTION_URL}/favicon.png`,
      },
      'sameAs': ['https://ecothailand.org'],
    },
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is an Impact Product?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'An Impact Product is a onchain tokenized real-world impact on the Celo blockchain that represents real-world environmental action. Each level corresponds to verified regeneration efforts in the Thai Gulf, from planting trees to removing ocean plastic.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How does the purchase help?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': '80% of funds go directly to EcoThailand for on-the-ground projects. 10% supports EcoSynthesisX for technology development, and 10% goes to the ReFi Phangan node and GreenPill Phangan chapter to support local regenerative finance initiatives.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Why Celo?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Celo is a carbon-negative blockchain designed for mobile-first financial inclusion. Its low fees and commitment to regenerative finance (ReFi) make it the perfect home for our Impact Products.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I sell my Impact Product?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, you can trade your Impact Products on secondary marketplaces. In the future, we plan to support selling and staking on the Regen Bazaar, enhancing the liquidity and utility of your contributions.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How is the impact verified?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'EcoThailand works with local partners to verify all activities. Current verification is done by ReFi Phangan via IRL verification and public social media evidence, ensuring every dollar contributes to tangible environmental restoration.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Why might my minting transaction fail?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Transactions may fail if you don\'t have enough CELO for gas fees or if the network is busy. Ensure you have a small amount of CELO in your wallet.',
          },
        },
      ],
    },
  ],
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
