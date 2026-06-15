/**
 * @file app/sitemap.ts
 * @description Arabia Khaleej — XML Sitemap Generator
 *
 * Dynamically generates the full XML sitemap at request time using Next.js's
 * `MetadataRoute.Sitemap` type. Runs on the Edge runtime for low-latency delivery.
 *
 * ## Route Groups
 *
 * | Group           | Count     | Source                       | Priority |
 * |-----------------|-----------|------------------------------|----------|
 * | Static routes   | ~10 URLs  | Hardcoded                    | 0.3–1.0  |
 * | Prayer pages    | 6 URLs    | `countries` array            | 0.8      |
 * | Country guides  | 6 URLs    | `fullCountrySlugs`           | 0.8      |
 * | Insight articles| ≤2000 URLs| Redis via `getAllInsightSlugs()` | 0.6 |
 *
 * ## Priority Logic
 * - Homepage and `/insights` dynamically inherit `lastModified` from the most
 *   recently published article, keeping Google's freshness signal up to date.
 * - All other static routes use `new Date()` (current request time) as `lastModified`.
 *
 * ## Deduplication & Cap
 * Insight slugs are deduplicated (English variant preferred) and capped at 2000
 * entries to remain within Google's recommended sitemap size limit.
 *
 * ## hreflang Alternates
 * All insight, prayer, and country routes include `alternates.languages` entries
 * for the full set of relevant regional locales to support GCC-targeted SEO.
 *
 * @requires lib/insights.getAllInsightSlugs — fetches slug list from Upstash Redis
 * @requires lib/seo.SITE_URL              — canonical base URL for all entries
 */
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/seo';
import { getAllInsightSlugs } from '@/lib/database/insights';

export const revalidate = 3600; // Cache for 1 hour
// NOTE: runtime='edge' removed for OpenNext/Cloudflare Workers compatibility.
// All routes run in nodejs_compat Workers runtime - edge declaration not needed.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Country codes for prayer times routes - matches GCC countries
  const countries = ['qatar', 'uae', 'saudi-arabia', 'kuwait', 'oman', 'bahrain'];
  // Full country slug names for guide pages - must match route pathnames
  const fullCountrySlugs = [
    'saudi-arabia', 
    'united-arab-emirates', 
    'qatar', 
    'kuwait', 
    'oman', 
    'bahrain'
  ];
  
  // 1. Static Base Routes
  // Why: Adding alternates.languages to static routes ensures search engines discover and link
  // the translated pages (e.g. /en/... and /ar/...) correctly, matching our subpath routing scheme.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en`,
          'x-default': `${SITE_URL}/en`,
          'ar': `${SITE_URL}/ar`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/insights`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/insights`,
          'x-default': `${SITE_URL}/en/insights`,
          'ar': `${SITE_URL}/ar/insights`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/prayer`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/prayer`,
          'x-default': `${SITE_URL}/en/prayer`,
          'ar': `${SITE_URL}/ar/prayer`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/currency-exchange`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/currency-exchange`,
          'x-default': `${SITE_URL}/en/currency-exchange`,
          'ar': `${SITE_URL}/ar/currency-exchange`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/about`,
          'x-default': `${SITE_URL}/en/about`,
          'ar': `${SITE_URL}/ar/about`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/privacy`,
          'x-default': `${SITE_URL}/en/privacy`,
          'ar': `${SITE_URL}/ar/privacy`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/terms`,
          'x-default': `${SITE_URL}/en/terms`,
          'ar': `${SITE_URL}/ar/terms`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/disclaimer`,
          'x-default': `${SITE_URL}/en/disclaimer`,
          'ar': `${SITE_URL}/ar/disclaimer`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/transparency`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/transparency`,
          'x-default': `${SITE_URL}/en/transparency`,
          'ar': `${SITE_URL}/ar/transparency`,
        }
      }
    },
    {
      url: `${SITE_URL}/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/contact`,
          'x-default': `${SITE_URL}/en/contact`,
          'ar': `${SITE_URL}/ar/contact`,
        }
      }
    },
  ];

  // 2. Prayer Times (Country-level)
  const prayerRoutes: MetadataRoute.Sitemap = countries.map(country => ({
    url: `${SITE_URL}/en/prayer/${country}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: {
      languages: {
        'en': `${SITE_URL}/en/prayer/${country}`,
        'x-default': `${SITE_URL}/en/prayer/${country}`,
        'en-US': `${SITE_URL}/en/prayer/${country}`,
        'en-GB': `${SITE_URL}/en/prayer/${country}`,
        'ar': `${SITE_URL}/ar/prayer/${country}`,
        'ar-SA': `${SITE_URL}/ar/prayer/${country}`,
        'ar-AE': `${SITE_URL}/ar/prayer/${country}`,
        'ar-QA': `${SITE_URL}/ar/prayer/${country}`,
        'ar-KW': `${SITE_URL}/ar/prayer/${country}`,
        'ar-OM': `${SITE_URL}/ar/prayer/${country}`,
        'ar-BH': `${SITE_URL}/ar/prayer/${country}`,
      }
    }
  }));

  // 3. Country Guides
  const countryRoutes: MetadataRoute.Sitemap = fullCountrySlugs.map(slug => ({
    url: `${SITE_URL}/en/countries/${slug}`,
    lastModified: new Date('2026-01-01'),
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: {
      languages: {
        'en': `${SITE_URL}/en/countries/${slug}`,
        'x-default': `${SITE_URL}/en/countries/${slug}`,
        'en-US': `${SITE_URL}/en/countries/${slug}`,
        'ar': `${SITE_URL}/ar/countries/${slug}`,
        'ar-SA': `${SITE_URL}/ar/countries/${slug}`,
        'ar-AE': `${SITE_URL}/ar/countries/${slug}`,
        'ar-QA': `${SITE_URL}/ar/countries/${slug}`,
      }
    }
}));

  // 4. Dynamic Insights Routes (Deduplicated & Capped)
  let insightRoutes: MetadataRoute.Sitemap = [];
  let latestDate = new Date();
  
  try {
    const allInsightSlugs = await getAllInsightSlugs();
    
    // Deduplicate by slug
    const uniqueSlugs = new Map<string, typeof allInsightSlugs[0]>();
    allInsightSlugs.forEach(item => {
      if (!uniqueSlugs.has(item.slug) || item.lang === 'en') {
        uniqueSlugs.set(item.slug, item);
      }
    });

    // Capping for performance
    const sortedInsights = Array.from(uniqueSlugs.values())
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 2000);

    if (sortedInsights.length > 0) {
      latestDate = new Date(sortedInsights[0].pubDate);
    }

    insightRoutes = sortedInsights.map(item => ({
      url: `${SITE_URL}/${item.lang === 'ar' ? 'ar' : 'en'}/insights/${item.slug}`,
      lastModified: new Date(item.pubDate),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          'en': `${SITE_URL}/en/insights/${item.slug}`,
          'x-default': `${SITE_URL}/en/insights/${item.slug}`,
          'en-US': `${SITE_URL}/en/insights/${item.slug}`,
          'ar': `${SITE_URL}/ar/insights/${item.slug}`,
          'ar-SA': `${SITE_URL}/ar/insights/${item.slug}`,
          'ar-AE': `${SITE_URL}/ar/insights/${item.slug}`,
          'ar-QA': `${SITE_URL}/ar/insights/${item.slug}`,
          'ar-KW': `${SITE_URL}/ar/insights/${item.slug}`,
          'ar-OM': `${SITE_URL}/ar/insights/${item.slug}`,
          'ar-BH': `${SITE_URL}/ar/insights/${item.slug}`,
        }
      }
    }));
  } catch (e) {
    console.error('Sitemap insights generation error:', e);
  }

  // Combine everything
  const allRoutes = [
    { ...staticRoutes[0], lastModified: latestDate }, // Home
    { ...staticRoutes[1], lastModified: latestDate }, // Insights list
    ...staticRoutes.slice(2), 
    ...prayerRoutes, 
    ...countryRoutes, 
    ...insightRoutes
  ];

  return allRoutes;
}

