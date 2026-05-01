import { NextResponse } from 'next/server';
import { getUnifiedInsights, getArticleBySlug } from '@/lib/insights';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    // If slug is provided, return that article directly
    if (slug) {
      const article = await getArticleBySlug(slug, lang);
      return article 
        ? NextResponse.json({ status: 'success', insights: [article] }) 
        : NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 });
    }

    const finalInsights = await getUnifiedInsights({ lang, category, limit });
    return NextResponse.json({ status: 'success', count: finalInsights.length, insights: finalInsights });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ status: 'error', insights: [] }, { status: 500 });
  }
}
