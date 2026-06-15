/**
 * Arabia Khaleej — Core API Client
 * 
 * Standardized data fetching layer for client-side interactions.
 * Handles request de-duplication, caching, and edge-native performance.
 */

type GeoData = {
  cityName: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
  source: string;
  status: string;
};

// Singleton promises to prevent redundant simultaneous requests
let geoPromise: Promise<GeoData> | null = null;

/**
 * Fetches user geolocation from the edge
 * De-duplicates multiple simultaneous calls
 */
export async function getGeolocation(): Promise<GeoData> {
  if (geoPromise) return geoPromise;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  geoPromise = fetch('/api/geolocation', { 
    signal: controller.signal,
    cache: 'no-store' 
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Geo API error: ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      geoPromise = null; // Allow retry on next call
      throw err;
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });

  return geoPromise;
}


