import { MetadataRoute } from 'next';
import { PRODUCTION_URL, LEVELS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ['', '/share/1', '/share/2', '/share/3', '/share/4', '/share/5', '/privacy', '/terms'].map(
        (route) => ({
            url: `${PRODUCTION_URL}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : route.startsWith('/share') ? 0.8 : 0.3,
        })
    );

    return routes;
}
