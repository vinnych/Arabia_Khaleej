import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = ['qatar', 'uae', 'saudi-arabia', 'kuwait', 'oman', 'bahrain'];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${SITE_URL}/prayer`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/currency-exchange`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/market-insight`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/transparency`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const countryRoutes: MetadataRoute.Sitemap = countries.map(country => ({
    url: `${SITE_URL}/prayer/${country}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8
  }));

  // Dynamic News Routes — Fetch latest 100 from each language to ensure indexing
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const [enRes, arRes] = await Promise.all([
      fetch(`${baseUrl}/api/news?lang=en`).then(r => r.json()).catch(() => ({ news: [] })),
      fetch(`${baseUrl}/api/news?lang=ar`).then(r => r.json()).catch(() => ({ news: [] }))
    ]);

    const enNews = (enRes.news || []).map((item: any) => ({
      url: `${SITE_URL}/news/${item.slug}`,
      lastModified: new Date(item.pubDate),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }));

    const arNews = (arRes.news || []).map((item: any) => ({
      url: `${SITE_URL}/news/${item.slug}?lang=ar`,
      lastModified: new Date(item.pubDate),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }));

    newsRoutes = [...enNews, ...arNews];
  } catch (e) {
    console.error('Sitemap news fetch error:', e);
  }

  return [...staticRoutes, ...countryRoutes, ...newsRoutes];
}
