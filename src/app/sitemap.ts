import { MetadataRoute } from 'next';
import { PRODUCTION_URL, LEVELS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = ['', '/share/1', '/share/2', '/share/3', '/share/4', '/share/5'].map(
        (route) => ({
            url: `${PRODUCTION_URL}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        })
    );

    return routes;
}
