import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
      {
        // Explicitly allow AI crawlers for GCC Knowledge Graph indexing
        userAgent: ['GPTBot', 'Claude-Web', 'CCBot', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
