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

type MarketData = {
  stocks: any[];
  commodities: any[];
  currencies: any[];
  timestamp: string;
  marketStatus: 'open' | 'closed';
  status: string;
};

// Singleton promises to prevent redundant simultaneous requests
let geoPromise: Promise<GeoData> | null = null;
let marketPromise: Promise<MarketData> | null = null;

// Simple cache for market data (TTL in ms)
let cachedMarketData: MarketData | null = null;
let lastMarketFetch = 0;
const MARKET_CACHE_TTL = 5000; // 5 seconds cache to handle rapid component mounts

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

/**
 * Fetches GCC market data
 * Implements de-duplication and short-term caching
 */
export async function getMarketData(): Promise<MarketData> {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (cachedMarketData && (now - lastMarketFetch < MARKET_CACHE_TTL)) {
    return cachedMarketData;
  }

  // Return existing promise if fetch is already in progress
  if (marketPromise) return marketPromise;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  marketPromise = fetch('/api/market-data', { 
    signal: controller.signal,
    cache: 'no-store'
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Market API error: ${res.status}`);
      const data = await res.json();
      
      cachedMarketData = data;
      lastMarketFetch = Date.now();
      return data;
    })
    .catch((err) => {
      marketPromise = null;
      throw err;
    })
    .finally(() => {
      clearTimeout(timeoutId);
      marketPromise = null; // Reset promise so next call after TTL can fetch fresh
    });

  return marketPromise;
}
