import { NextRequest, NextResponse } from 'next/server';
import { LEVELS } from '@/lib/constants';

// Metadata API for ERC-1155 token URIs
// Endpoint: /api/metadata/[id]

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const levelId = parseInt(id, 10);

    // Validate level ID
    if (isNaN(levelId) || levelId < 1 || levelId > 5) {
        return NextResponse.json(
            { error: 'Invalid token ID. Must be 1-5.' },
            { status: 400 }
        );
    }

    const level = LEVELS[levelId - 1];

    // ERC-1155 Metadata Standard
    const metadata = {
        name: `EcoThailand Impact Level ${levelId}: ${level.name}`,
        description: level.description,
        image: `https://app-lac-phi-20.vercel.app${level.image}`,
        external_url: 'https://ecothailand.org',
        attributes: [
            {
                trait_type: 'Level',
                value: levelId,
            },
            {
                trait_type: 'Category',
                value: level.name,
            },
            {
                trait_type: 'Price (USD)',
                value: level.priceUSD,
            },
            {
                trait_type: 'Impact',
                value: level.impact,
            },
        ],
        properties: {
            impact_metrics: level.impact,
            price_usd: level.priceUSD,
            category: level.name,
        },
    };

    return NextResponse.json(metadata, {
        headers: {
            'Cache-Control': 'public, max-age=3600',
            'Content-Type': 'application/json',
        },
    });
}
