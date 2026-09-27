import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'EcoThailand Impact',
        short_name: 'EcoThailand',
        description:
            'Support environmental restoration in the Thai Gulf with tokenized impact products on Celo.',
        start_url: '/',
        display: 'standalone',
        background_color: '#022c22',
        theme_color: '#022c22',
        icons: [
            { src: '/icon', sizes: '64x64', type: 'image/png' },
            { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
        ],
    };
}
