import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getAllNewsSlugs } from '@/lib/news';

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
  const marketCategories = ['stocks', 'gold', 'currencies', 'oil'];
  
  // 1. Static Base Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${SITE_URL}/prayer`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/currency-exchange`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/market-insight`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/market-insight/details`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/transparency`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // 2. Prayer Times (Country-level)
  const prayerRoutes: MetadataRoute.Sitemap = countries.map(country => ({
    url: `${SITE_URL}/prayer/${country}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: {
      languages: {
        'ar': `${SITE_URL}/prayer/${country}?lang=ar`
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
        'ar': `${SITE_URL}/countries/${slug}?lang=ar`
      }
    }
  }));

  // 4. Market Insights (Categories)
  const marketRoutes: MetadataRoute.Sitemap = marketCategories.map(cat => ({
    url: `${SITE_URL}/market-insight/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
    alternates: {
      languages: {
        'ar': `${SITE_URL}/market-insight/${cat}?lang=ar`
      }
    }
  }));

  // 5. Dynamic News Routes (All Archived News)
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const allNews = await getAllNewsSlugs();
    newsRoutes = allNews.map(item => ({
      url: `${SITE_URL}/news/${item.slug}${item.lang === 'ar' ? '?lang=ar' : ''}`,
      lastModified: new Date(item.pubDate),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          // If it's English, point to Arabic version as alternate, and vice versa
          [item.lang === 'en' ? 'ar' : 'en']: `${SITE_URL}/news/${item.slug}${item.lang === 'en' ? '?lang=ar' : ''}`
        }
      }
    }));
  } catch (e) {
    console.error('Sitemap news generation error:', e);
  }

  // Combine everything
  // We use a Set to avoid duplicate URLs if they occur
  const allRoutes = [
    ...staticRoutes, 
    ...prayerRoutes, 
    ...countryRoutes, 
    ...marketRoutes, 
    ...newsRoutes
  ];

  return allRoutes;
}
