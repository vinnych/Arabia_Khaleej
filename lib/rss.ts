import { isValidHttpUrl, toSlug } from "./utils";

const SSRF_DENYLIST = /^(localhost|127\.|0\.0\.0\.0|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1$|\[::1\]|fe80:|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;

/** Like isValidHttpUrl but also blocks private/loopback IPs to prevent SSRF */
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

export interface NewsItem {
  title: string;
  link: string;
  slug: string;
  pubDate: string;
  contentSnippet?: string;
  source: string;
  imageUrl?: string;
}

const FEEDS = [
  { url: "https://www.aljazeera.com/xml/rss/all.xml", source: "Al Jazeera" },
  { url: "https://news.google.com/rss/search?q=qatar&hl=en-US&gl=US&ceid=US:en", source: "Google News" },
  { url: "https://feeds.bbci.co.uk/news/world/middle_east/rss.xml", source: "BBC Middle East" },
];

/** Fetch a relevant image from Pexels based on article title keywords. Cached in Redis. */
export async function fetchPexelsImage(slug: string, title: string, articleUrl?: string): Promise<string | undefined> {
  if (redis) {
    try {
      const cached = await redis.get<string>(`news:ogimage:${slug}`);
      if (cached !== null) return cached || undefined;
    } catch { /* fall through */ }
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return undefined;

  // Extract 2-3 keywords from title (strip common stop words)
  const stopWords = new Set(["the","a","an","in","on","at","to","for","of","and","or","is","are","was","were","has","have","that","this","with","by","from","as","its","it","be","been","will","but","not","who","what","how","when","where","why"]);
  const keywords = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w))
    .slice(0, 3)
    .join(" ");

  if (!keywords) return undefined;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keywords)}&per_page=1&orientation=landscape`,
      { signal: controller.signal, headers: { Authorization: apiKey } }
    );
    clearTimeout(timer);
    if (!res.ok) return undefined;

    const data = await res.json();
    const imageUrl: string | undefined = data?.photos?.[0]?.src?.large;

    if (redis) {
      try {
        await redis.set(`news:ogimage:${slug}`, imageUrl ?? "", { ex: KV_TTL });
      } catch { /* ignore */ }
    }

    return imageUrl && isSafeExternalUrl(imageUrl) ? imageUrl : undefined;
  } catch {
    return undefined;
  }
}

export async function getNews(limit = 12): Promise<NewsItem[]> {
  if (isMaintenance()) return [];
  const results = await Promise.allSettled(
    FEEDS.map(async ({ url, source }): Promise<NewsItem[]> => {
      const feedItems: NewsItem[] = [];
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(url, { signal: controller.signal, next: { revalidate: 900 } });
        clearTimeout(timer);
        if (!res.ok) return feedItems;
        const raw = await res.text();
        const text = raw.length > 5 * 1024 * 1024 ? raw.slice(0, 5 * 1024 * 1024) : raw;
        const matches = [...text.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)];
        for (const m of matches.slice(0, 10)) {
          const block = m[1];
          const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
            block.match(/<title>(.*?)<\/title>/)?.[1] || "";
          const link = block.match(/<link>(.*?)<\/link>/)?.[1] ||
            block.match(/<link[^>]+href="([^"]+)"/)?.[1] ||
            block.match(/<guid>(.*?)<\/guid>/)?.[1] || "";
          const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
          const snippet = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
            block.match(/<description>(.*?)<\/description>/)?.[1] || "";
          const rawImage =
            block.match(/<media:content[^>]+url="([^"]+)"/)?.[1] ||
            block.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ||
            block.match(/<enclosure[^>]+url="([^"]+)"[^>]+type="image\//)?.[1] ||
            block.match(/<enclosure[^>]+type="image\/[^"]*"[^>]+url="([^"]+)"/)?.[1] ||
            snippet.match(/<img[^>]+src="([^"]+)"/)?.[1] || "";
          const imageUrl = rawImage && isSafeExternalUrl(rawImage) ? rawImage : undefined;
          const cleanLink = link.trim();
          if (title && cleanLink && isSafeExternalUrl(cleanLink)) {
            feedItems.push({
              title: title.trim(),
              link: cleanLink,
              slug: toSlug(title.trim(), cleanLink),
              pubDate: pubDate.trim(),
              contentSnippet: snippet.replace(/<[^>]+>/g, "").slice(0, 150),
              source,
              imageUrl,
            });
          }
        }
      } catch (err) {
        console.error(`[rss] feed "${source}" failed:`, err instanceof Error ? err.message : err);
      }
      return feedItems;
    })
  );

  const items: NewsItem[] = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  // For items without images, fetch from Pexels in the background and cache in Redis.
  // Images will appear on the next request once cached — avoids blocking page render.
  const itemsWithoutImage = items.filter((item) => !item.imageUrl);
  if (itemsWithoutImage.length > 0) {
    Promise.allSettled(
      itemsWithoutImage.map(async (item) => {
        await fetchPexelsImage(item.slug, item.title, item.link);
      })
    );
  }

  // Persist to Redis (fire-and-forget)
  // Full item: 7-day TTL (nx:true — don't overwrite fresher cached versions)
  // Tombstone: 1-year TTL (nx:true — written once, survives item expiry so expired
  //   URLs never return 404 — they show a "this article has expired" page instead)
  const TOMB_TTL = 60 * 60 * 24 * 365;
  if (redis && items.length > 0) {
    Promise.allSettled(
      items.flatMap((item) => [
        redis!.set(`news:${item.slug}`, item, { ex: KV_TTL, nx: true }),
        redis!.set(`news:${item.slug}:tomb`, { title: item.title, source: item.source }, { ex: TOMB_TTL, nx: true }),
      ])
    ).catch((err) => console.error("[rss] Redis persist error:", err instanceof Error ? err.message : err));
  }

  return items.slice(0, Math.min(limit, HARD_LIMIT));
}
