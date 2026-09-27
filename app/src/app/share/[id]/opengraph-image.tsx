
import { ImageResponse } from 'next/og';
import { LEVELS } from '@/lib/constants';

import { PRODUCTION_URL } from '@/lib/constants';

export const runtime = 'edge';

export const alt = 'EcoThailand Impact Product';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const levelId = parseInt(id, 10);
    // Default to level 1 for safety
    const level = LEVELS[levelId - 1] || LEVELS[0];

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0F2027, #203A43, #2C5364)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    color: 'white',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 60, width: '60%' }}>
                    <div style={{ fontSize: 24, letterSpacing: '0.2em', color: '#00FFA3', marginBottom: 20 }}>ECOTHAILAND IP</div>
                    <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>{level.name}</div>
                    <div style={{ fontSize: 32, opacity: 0.8, marginBottom: 40 }}>{`${level.description.slice(0, 100)}...`}</div>
                    <div style={{
                        background: 'rgba(255, 159, 28, 0.2)',
                        border: '1px solid #FF9F1C',
                        borderRadius: 12,
                        padding: '12px 24px',
                        color: '#FF9F1C',
                        fontSize: 24,
                        fontWeight: 'bold'
                    }}>
                        VERIFIED IMPACT
                    </div>
                </div>

                {/* Satori requires an absolute URL for the image. */}
                <div style={{ width: '40%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={`${PRODUCTION_URL}${level.image}`}
                        style={{
                            width: 350,
                            height: 350,
                            borderRadius: 32,
                            objectFit: 'cover',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            border: '2px solid rgba(255,255,255,0.1)'
                        }}
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
