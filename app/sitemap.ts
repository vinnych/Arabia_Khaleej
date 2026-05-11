/**
 * @file app/sitemap.ts
 * @description Arabia Khaleej — XML Sitemap Generator
 *
 * Dynamically generates the full XML sitemap at request time using Next.js's
 * `MetadataRoute.Sitemap` type. Runs on the Edge runtime for low-latency delivery.
 *
 * ## Route Groups
 *
 * | Group           | Count     | Source               | Priority |
 * |-----------------|-----------|----------------------|----------|
 * | Static routes   | ~10 URLs  | Hardcoded            | 0.3–1.0  |
 * | Prayer pages    | 6 URLs    | `countries` array    | 0.8      |
 * | Country guides  | 6 URLs    | `fullCountrySlugs`   | 0.8      |
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
import { SITE_URL } from '@/lib/seo';
import { getAllInsightSlugs } from '@/lib/insights';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = ['qatar', 'uae', 'saudi-arabia', 'kuwait', 'oman', 'bahrain'];
  const fullCountrySlugs = [
    'saudi-arabia', 
    'united-arab-emirates', 
    'qatar', 
    'kuwait', 
    'oman', 
    'bahrain'
  ];
  
  // 1. Static Base Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/insights`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${SITE_URL}/prayer`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/currency-exchange`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/market-insight`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/transparency`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 2. Prayer Times (Country-level)
  const prayerRoutes: MetadataRoute.Sitemap = countries.map(country => ({
    url: `${SITE_URL}/prayer/${country}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: {
      languages: {
        'en': `${SITE_URL}/prayer/${country}`,
        'en-US': `${SITE_URL}/prayer/${country}`,
        'en-GB': `${SITE_URL}/prayer/${country}`,
        'ar': `${SITE_URL}/prayer/${country}?lang=ar`,
        'ar-SA': `${SITE_URL}/prayer/${country}?lang=ar`,
        'ar-AE': `${SITE_URL}/prayer/${country}?lang=ar`,
        'ar-QA': `${SITE_URL}/prayer/${country}?lang=ar`,
        'ar-KW': `${SITE_URL}/prayer/${country}?lang=ar`,
        'ar-OM': `${SITE_URL}/prayer/${country}?lang=ar`,
        'ar-BH': `${SITE_URL}/prayer/${country}?lang=ar`,
      }
    }
  }));

  // 3. Country Guides
  const countryRoutes: MetadataRoute.Sitemap = fullCountrySlugs.map(slug => ({
    url: `${SITE_URL}/countries/${slug}`,
    lastModified: new Date('2024-01-01'),
    changeFrequency: 'monthly',
    priority: 0.8,
    alternates: {
      languages: {
        'en': `${SITE_URL}/countries/${slug}`,
        'en-US': `${SITE_URL}/countries/${slug}`,
        'ar': `${SITE_URL}/countries/${slug}?lang=ar`,
        'ar-SA': `${SITE_URL}/countries/${slug}?lang=ar`,
        'ar-AE': `${SITE_URL}/countries/${slug}?lang=ar`,
        'ar-QA': `${SITE_URL}/countries/${slug}?lang=ar`,
      }
    }
  }));


  // 5. Dynamic Insights Routes (Deduplicated & Capped)
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
      url: `${SITE_URL}/insights/${item.slug}${item.lang === 'ar' ? '?lang=ar' : ''}`,
      lastModified: new Date(item.pubDate),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          'en': `${SITE_URL}/insights/${item.slug}`,
          'en-US': `${SITE_URL}/insights/${item.slug}`,
          'ar': `${SITE_URL}/insights/${item.slug}?lang=ar`,
          'ar-SA': `${SITE_URL}/insights/${item.slug}?lang=ar`,
          'ar-AE': `${SITE_URL}/insights/${item.slug}?lang=ar`,
          'ar-QA': `${SITE_URL}/insights/${item.slug}?lang=ar`,
          'ar-KW': `${SITE_URL}/insights/${item.slug}?lang=ar`,
          'ar-OM': `${SITE_URL}/insights/${item.slug}?lang=ar`,
          'ar-BH': `${SITE_URL}/insights/${item.slug}?lang=ar`,
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
