
import { ImageResponse } from 'next/og';
import { PRODUCTION_URL } from '@/lib/constants';

export const runtime = 'edge';

export const alt = 'EcoThailand tRWI Pilot Collection | Regenerate the Thai Gulf';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
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
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative elements */}
                <div style={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    background: 'rgba(212, 175, 55, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(100px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -100,
                    left: -100,
                    width: 400,
                    height: 400,
                    background: 'rgba(0, 255, 163, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(100px)'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 80, width: '60%', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
                        <img
                            src={`${PRODUCTION_URL}/images/ecosynthesisx-logo.svg`}
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                        />
                        <div style={{ fontSize: 24, letterSpacing: '0.2em', color: '#00FFA3', fontWeight: 'bold' }}>ECOTHAILAND IP</div>
                    </div>
                    <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>Regenerate the Thai Gulf</div>
                    <div style={{ fontSize: 32, opacity: 0.8, marginBottom: 48, lineHeight: 1.4 }}>
                        Fund Tokenized Real-World Impact (tRWI) to support environmental missions on Celo.
                    </div>
                    <div style={{
                        background: 'linear-gradient(90deg, #00FFA3, #D4AF37)',
                        borderRadius: 12,
                        padding: '16px 32px',
                        color: '#0F2027',
                        fontSize: 28,
                        fontWeight: 'bold'
                    }}>
                        JOIN THE MOVEMENT
                    </div>
                </div>

                <div style={{ width: '40%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 80, zIndex: 10 }}>
                    <div style={{
                        position: 'relative',
                        width: 400,
                        height: 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={`${PRODUCTION_URL}/images/level-1.jpg`}
                            style={{
                                width: 380,
                                height: 380,
                                borderRadius: 48,
                                objectFit: 'cover',
                                transform: 'rotate(-5deg)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                border: '4px solid rgba(255,255,255,0.1)',
                                position: 'absolute',
                                left: 0
                            }}
                        />
                        <img
                            src={`${PRODUCTION_URL}/images/level-2.jpg`}
                            style={{
                                width: 380,
                                height: 380,
                                borderRadius: 48,
                                objectFit: 'cover',
                                transform: 'rotate(5deg)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                border: '4px solid rgba(255,255,255,0.1)',
                                position: 'absolute',
                                right: 0
                            }}
                        />
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
