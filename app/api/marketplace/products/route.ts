import { NextResponse } from 'next/server';
import { AmazonProvider } from '@/lib/marketplace/providers/amazon';
import { NoonProvider } from '@/lib/marketplace/providers/noon';
import { redis } from '@/lib/redis';

export async function GET() {
  const CACHE_KEY = 'marketplace_products_aggregated';
  const CACHE_TTL = 3600; // 1 hour

  try {
    // 1. Try to get from cache
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      try {
        const data = typeof cached === 'string' ? JSON.parse(cached) : cached;
        return NextResponse.json(data);
      } catch (e) {
        console.error("Redis cache parse failed", e);
      }
    }

    // 2. Fetch from providers
    const providers = [
      new AmazonProvider(),
      new NoonProvider()
    ];

    console.log("Fetching trending products from providers...");
    const results = await Promise.allSettled(
      providers.map(p => p.getTrendingProducts())
    );

    const products = results.flatMap((res, i) => {
      if (res.status === 'fulfilled') return res.value;
      console.error(`Provider ${providers[i].name} failed:`, res.reason);
      return [];
    });

    const response = {
      status: 'success',
      timestamp: new Date().toISOString(),
      count: products.length,
      data: products
    };

    // 3. Cache the result
    try {
      await redis.set(CACHE_KEY, JSON.stringify(response), { ex: CACHE_TTL });
    } catch (e) {
      console.error("Redis cache set failed", e);
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Marketplace API aggregation failed:", error.message);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message || 'Failed to aggregate products' 
    }, { status: 500 });
  }
}
