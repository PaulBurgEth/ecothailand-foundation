import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation'; // Correct import for Next.js 15/App Router
import { LEVELS, PRODUCTION_URL } from '@/lib/constants';
import { MintingConsole } from '@/components/MintingConsole'; // We might reuse this or redirect
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const levelId = parseInt(id, 10);

    if (isNaN(levelId) || levelId < 1 || levelId > 5) {
        return {
            title: 'EcoThailand tRWI (Tokenized Real-World Impact)'
        };
    }

    const level = LEVELS[levelId - 1];

    // Open Graph / Twitter images intentionally omitted here so Next.js uses the
    // branded card from share/[id]/opengraph-image.tsx (1200x630) as the preview.
    return {
        title: `Level ${level.id}: ${level.name} | EcoThailand`,
        description: `I just funded a Level ${level.id} tRWI (Tokenized Real-World Impact)! Join me in regenerating the Thai Gulf.`,
        openGraph: {
            title: `Level ${level.id}: ${level.name}`,
            description: level.description,
            url: `${PRODUCTION_URL}/share/${id}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `Level ${level.id}: ${level.name}`,
            description: level.description,
        },
    };
}

export default async function Page({ params }: Props) {
    // This page can just be a redirect to home with the level selected, 
    // OR a standalone preview card that links to home.
    // For "link leading mint page", a redirect is best OR a specific landing view.
    // Let's make it a landing view that encourages minting same level.

    const { id } = await params;
    const levelId = parseInt(id, 10);

    if (isNaN(levelId) || levelId < 1 || levelId > 5) {
        notFound();
    }

    const level = LEVELS[levelId - 1];

    return (
        <div className="min-h-screen bg-deep-forest text-warm-sand/90 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-pattern-organic opacity-30 z-0"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-thai-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-green/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-md w-full glass-organic p-8 flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold font-unbounded mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-thai-gold">
                    EcoThailand Impact
                </h1>
                <p className="text-warm-sand/60 mb-8 font-light">Regenerating the Thai Gulf, one block at a time.</p>

                <div className="relative w-full aspect-square mb-8 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                    <Image
                        src={level.image}
                        alt={level.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-4 bg-deep-forest/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                        <span className="text-thai-gold font-bold text-xs tracking-widest">LVL {level.id}</span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">{level.name}</h2>
                <p className="text-sm text-warm-sand/80 mb-8 line-clamp-3 leading-relaxed">
                    {level.description}
                </p>

                <Link
                    href="/"
                    className="w-full btn-organic flex items-center justify-center gap-2 group/btn"
                >
                    Mint Your Own
                </Link>
            </div>
        </div>
    );
}
