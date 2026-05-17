import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { decompressValue } from '@/lib/redis';

export const runtime = 'edge';

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
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
    // Read article body via shared decompressValue
    const articleKey = `insights:draft:article:${slug}`;
    const raw = await redis.get(articleKey);
    if (!raw) return fail({ error: 'Article not found' }, 404);

    if (typeof raw !== 'string') {
      return NextResponse.json({
        content: (raw as Record<string, unknown>).content,
        title: (raw as Record<string, unknown>).title,
      });
    }

    const article = decompressValue(raw) as Record<string, unknown>;
    return NextResponse.json({
      content: article.content,
      title: article.title,
    });
  } catch (error) {
    return fail({ error: 'Failed to fetch article' }, 500);
  }
}
