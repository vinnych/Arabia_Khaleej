import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { getUnifiedNews, getArticleBySlug } from '@/lib/insights';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    // If slug is provided, return that article directly
    if (slug) {
      const article = await getArticleBySlug(slug, lang);
      return article 
        ? NextResponse.json({ status: 'success', news: [article] }) 
        : NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 });
    }

    const finalNews = await getUnifiedNews({ lang, category, limit });
    return NextResponse.json({ status: 'success', count: finalNews.length, news: finalNews });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ status: 'error', news: [] }, { status: 500 });
  }
}
