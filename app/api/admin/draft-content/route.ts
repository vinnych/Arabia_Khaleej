import { NextRequest, NextResponse } from 'next/server';
import { getWithCompression } from '@/lib/redis';

export const runtime = 'edge';

const ADMIN_SECRET = process.env.ADMIN_SECRET!;

function fail(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== ADMIN_SECRET) {
    return fail({ error: 'Unauthorized' }, 401);
  }

  if (!slug) return fail({ error: 'Missing slug' }, 400);

  try {
    const article = await getWithCompression<Record<string, unknown>>(
      `insights:draft:article:${slug}`
    );
    if (!article) return fail({ error: 'Article not found' }, 404);
    return NextResponse.json({
      content: article.content,
      title: article.title,
    });
  } catch (error) {
    return fail({ error: 'Failed to fetch article' }, 500);
  }
}
