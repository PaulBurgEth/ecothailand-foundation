import { LEVELS } from '@/lib/constants';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const levelId = parseInt(params.id);
    const level = LEVELS.find((l) => l.id === levelId);

    if (!level) {
        return {
            title: 'EcoThailand Impact Product',
            description: 'Regenerate the Thai Gulf, One Block at a Time.',
        };
    }

    return {
        title: `I am an EcoThailand ${level.name}!`,
        description: level.description,
        openGraph: {
            title: `I am an EcoThailand ${level.name}!`,
            description: level.description,
            images: [
                {
                    url: `https://app-lac-phi-20.vercel.app${level.image}`,
                    width: 800,
                    height: 800,
                    alt: level.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `I am an EcoThailand ${level.name}!`,
            description: level.description,
            images: [`https://app-lac-phi-20.vercel.app${level.image}`],
        },
    };
}

export default function SharePage({ params }: Props) {
    // Redirect back to home after the metadata is served to the crawler
    redirect('/home');
}
