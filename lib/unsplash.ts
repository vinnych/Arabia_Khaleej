import { getDeterministicFallback } from './fallbacks';

/**
 * Tiered image search:
 * 1. Pexels (Primary for now as Unsplash approval takes time)
 * 2. Unsplash (Secondary)
 * 3. Deterministic Fallback (Final Fallback)
 */
export async function getRelevantImage(query: string, slug: string): Promise<string> {
  const cleanQuery = query.replace(/[#*]/g, '').trim().substring(0, 50);

  // 1. Try Pexels (Primary for immediate results)
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (pexelsKey) {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=1`,
        {
          headers: {
            'Authorization': pexelsKey
          },
          next: { revalidate: 86400 }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          return data.photos[0].src.large2x || data.photos[0].src.large;
        }
      }
    } catch (err) {
      console.error("Pexels search failed:", err);
    }
  }

  // 2. Try Unsplash (Secondary fallback)
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (unsplashKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${unsplashKey}`,
            'Accept-Version': 'v1'
          },
          next: { revalidate: 86400 }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const imageUrl = data.results[0].urls.regular;
          return `${imageUrl}&q=80&w=800&auto=format&fit=crop`;
        }
      }
    } catch (err) {
      console.error("Unsplash search failed:", err);
    }
  }

  // 3. Final Fallback
  return getDeterministicFallback(slug);
}
