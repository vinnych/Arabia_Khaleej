import { getDeterministicFallback } from './fallbacks';

/**
 * Tiered image search optimized for Pexels:
 * 1. Pexels (Primary Source)
 * 2. Unsplash (Secondary Fallback)
 * 3. Deterministic Fallback (Final Safety Net)
 */
export async function getRelevantImage(query: string, slug: string): Promise<string> {
  // Clean and optimize query: remove punctuation and focus on nouns
  const cleanQuery = query
    .replace(/[#*!?,.]/g, '')
    .trim()
    .substring(0, 70);

  // 1. PEXELS (Primary - High Relevance for Lifestyle/Regional)
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (pexelsKey) {
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': pexelsKey
          },
          next: { revalidate: 86400 } // Cache for 24 hours
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          // Return the large2x version for premium feel
          return data.photos[0].src.large2x || data.photos[0].src.large;
        }
      }
    } catch (err) {
      console.error("Pexels search failed:", err);
    }
  }

  // 2. UNSPLASH (Secondary Fallback)
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
          return `${imageUrl}&q=80&w=1200&auto=format&fit=crop`;
        }
      }
    } catch (err) {
      console.error("Unsplash search failed:", err);
    }
  }

  // 3. FINAL FALLBACK (Geometric/Brand consistent placeholder)
  return getDeterministicFallback(slug);
}
