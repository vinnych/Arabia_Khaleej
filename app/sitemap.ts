import type { MetadataRoute } from "next";
import { getNews } from "@/lib/rss";
import { getJobs } from "@/lib/jobs";

const SITE_URL = "https://qatar-portal.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/weather`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/currency`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const [news, jobs] = await Promise.all([getNews(48), getJobs(48)]);

    const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
      url: `${SITE_URL}/news/${item.slug}`,
      lastModified: item.pubDate ? new Date(item.pubDate) : new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${SITE_URL}/jobs/${job.slug}`,
      lastModified: job.pubDate ? new Date(job.pubDate) : new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [...base, ...newsPages, ...jobPages];
  } catch {
    return base;
  }
}
