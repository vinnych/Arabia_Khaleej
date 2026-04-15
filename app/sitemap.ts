import type { MetadataRoute } from "next";
import { getJobs } from "@/lib/jobs";

const SITE_URL = "https://qatar-portal.vercel.app";

// Fixed date for static/evergreen pages — update this when content actually changes
const STATIC_LAST_MODIFIED = new Date("2026-04-13");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/weather`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/currency`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.3 },
    // Content pages
    { url: `${SITE_URL}/prayer`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/qatar-metro`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/qatar-labour-law`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/qatar-salary-guide`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/qatar-visa-requirements`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/cost-of-living-doha`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/qatar-public-holidays`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/emergency-numbers-qatar`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/work-in-qatar`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.8 },
    // City prayer pages
    ...["dubai", "abu-dhabi", "riyadh", "jeddah", "kuwait-city", "muscat", "manama", "cairo", "islamabad", "manila", "dhaka"].map((city) => ({
      url: `${SITE_URL}/prayer/${city}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    // Job category pages
    ...["engineering", "it", "healthcare", "finance", "construction"].map((cat) => ({
      url: `${SITE_URL}/jobs-category/${cat}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
    // Qatar services guide pages
    ...["qid", "work-visa", "family-visa", "business-registration", "driving-licence", "exit-permit", "document-attestation"].map((slug) => ({
      url: `${SITE_URL}/qatar-services/${slug}`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  try {
    const [jobs] = await Promise.all([getJobs(48)]);

    // Only include items within 7-day Redis TTL — older items may no longer resolve
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const jobPages: MetadataRoute.Sitemap = jobs
      .filter((job) => {
        if (!job.pubDate) return true;
        try { return new Date(job.pubDate).getTime() >= cutoff; } catch { return false; }
      })
      .map((job) => ({
        url: `${SITE_URL}/jobs/${job.slug}`,
        lastModified: job.pubDate ? new Date(job.pubDate) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.5,   // expires after 7 days — lower priority
      }));

    return [...base, ...jobPages];
  } catch {
    return base;
  }
}
