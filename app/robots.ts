import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// NOTE: runtime='edge' removed for OpenNext/Cloudflare Workers compatibility.
// All routes run in nodejs_compat Workers runtime - edge declaration not needed.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/', // Block admin panel - protected, non-public content
        ],
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

