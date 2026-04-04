import { isValidHttpUrl, toSlug } from "./utils";

const SSRF_DENYLIST = /^(localhost|127\.|0\.0\.0\.0|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1$|fe80:|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

function isSafeExternalUrl(str: string): boolean {
  if (!isValidHttpUrl(str)) return false;
  try {
    const { hostname, protocol } = new URL(str);
    if (protocol !== "http:" && protocol !== "https:") return false;
    if (SSRF_DENYLIST.test(hostname)) return false;
    return true;
  } catch { return false; }
}

const HARD_LIMIT = 48;
import { redis, KV_TTL, isMaintenance } from "./redis";

export interface Job {
  title: string;
  company: string;
  location: string;
  link: string;
  slug: string;
  pubDate: string;
  source: string;
  description?: string;
}

const JOB_FEEDS = [
  {
    url: "https://news.google.com/rss/search?q=qatar+jobs+hiring&hl=en-US&gl=US&ceid=US:en",
    source: "Google Jobs",
  },
  {
    url: "https://news.google.com/rss/search?q=qatar+careers+vacancy&hl=en-US&gl=US&ceid=US:en",
    source: "Qatar Careers",
  },
];

export async function getJobs(limit = 12): Promise<Job[]> {
  if (isMaintenance()) return [];
  const jobs: Job[] = [];

  await Promise.allSettled(
    JOB_FEEDS.map(async ({ url, source }) => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(url, { signal: controller.signal, next: { revalidate: 1800 } });
        clearTimeout(timer);
        if (!res.ok) return;
        const raw = await res.text();
        const text = raw.length > 5 * 1024 * 1024 ? raw.slice(0, 5 * 1024 * 1024) : raw;
        const matches = [...text.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)];
        for (const m of matches.slice(0, 8)) {
          const block = m[1];
          const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
            block.match(/<title>(.*?)<\/title>/)?.[1] || "";
          const link = block.match(/<link>(.*?)<\/link>/)?.[1] ||
            block.match(/<guid>(.*?)<\/guid>/)?.[1] || "";
          const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
          const desc = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
            block.match(/<description>(.*?)<\/description>/)?.[1] || "";

          // Try to extract company from title (common pattern: "Job Title at Company")
          const companyMatch = title.match(/ at (.+)$/i);
          const company = companyMatch ? companyMatch[1] : source;
          const cleanTitle = companyMatch ? title.replace(/ at .+$/i, "") : title;

          // Try to extract city from description (e.g. "Location: Doha" or "Doha, Qatar")
          const plainDesc = desc.replace(/<[^>]+>/g, "");
          const locationMatch = plainDesc.slice(0, 500).match(/location[:\s]+([A-Za-z\s,]{1,80})(?:\n|<|$)/i) ||
            plainDesc.match(/([A-Za-z\s]+),\s*Qatar/i);
          const location = locationMatch ? locationMatch[1].trim().replace(/[^a-zA-Z\s,]/g, "").slice(0, 60) : "Qatar";

          const description = plainDesc.slice(0, 500).trim() || undefined;
          const cleanLink = link.trim();
          if (cleanTitle && cleanLink && isSafeExternalUrl(cleanLink)) {
            jobs.push({
              title: cleanTitle.trim(),
              company: company.trim(),
              location,
              link: cleanLink,
              slug: toSlug(cleanTitle.trim(), cleanLink),
              pubDate: pubDate.trim(),
              source,
              description,
            });
          }
        }
      } catch (err) {
        console.error(`[jobs] feed "${source}" failed:`, err instanceof Error ? err.message : err);
      }
    })
  );

  // Persist to Redis (fire-and-forget, 7-day TTL)
  if (redis && jobs.length > 0) {
    Promise.allSettled(
      jobs.map((job) => redis!.set(`job:${job.slug}`, job, { ex: KV_TTL, nx: true }))
    ).catch((err) => console.error("[jobs] Redis persist error:", err instanceof Error ? err.message : err));
  }

  return jobs.slice(0, Math.min(limit, HARD_LIMIT));
}
