/**
 * Insights API - Returns editorial articles from Redis.
 * 
 * Cache control: Client can pass 'cache=force' to bypass cache for live updates.
 * The InsightsClient auto-refreshes every minute when autoRefresh is enabled.
 */
import { NextResponse } from 'next/server';
import { getUnifiedInsights, getArticleBySlug } from '@/lib/insights';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '100');
  const cacheParam = searchParams.get('cache');

  try {
    if (slug) {
      const article = await getArticleBySlug(slug, lang);
      if (!article) {
        return NextResponse.json({ status: 'error', message: 'Not found' }, { 
          status: 404,
          headers: { 'Cache-Control': 'no-store' }
        });
      }
      return NextResponse.json({ status: 'success', insights: [article] }, {
        headers: { 'Cache-Control': cacheParam === 'force' ? 'no-store' : 'public, max-age=300' }
      });
    }

    const finalInsights = await getUnifiedInsights({ lang, category, limit });
    return NextResponse.json({ status: 'success', count: finalInsights.length, insights: finalInsights }, {
      headers: { 'Cache-Control': cacheParam === 'force' ? 'no-store' : 'public, max-age=300' }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ status: 'error', insights: [] }, { 
      status: 500,
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}


