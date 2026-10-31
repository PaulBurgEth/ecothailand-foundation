import { MetadataRoute } from 'next';
import { PRODUCTION_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/',
        },
        sitemap: `${PRODUCTION_URL}/sitemap.xml`,
    };
}
