import { NextRequest, NextResponse } from 'next/server';
import { redis, getWithCompression, setWithCompression } from '@/lib/redis';

export const runtime = 'edge';

const ADMIN_SECRET = process.env.ADMIN_SECRET!;

function fail(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== ADMIN_SECRET) {
    return fail({ error: 'Unauthorized' }, 401);
  }

  const slug = searchParams.get('slug');
  const lang = searchParams.get('lang');

  if (!slug) return fail({ error: 'Missing slug' }, 400);

  // 1. Delete draft article body
  const draftArticleKey = `insights:draft:article:${slug}`;
  await redis.del(draftArticleKey).catch(() => {});

  // 2. Remove from draft list, re-compress in the same format the workflow uses
  const langToRemove = lang || 'en';
  const draftListKey = `insights:drafts:${langToRemove}`;
  const rawList = await getWithCompression<unknown>(draftListKey);
  const currentDrafts: Record<string, unknown>[] = Array.isArray(rawList) ? rawList as Record<string, unknown>[] : [];

const keep = currentDrafts.filter((d: Record<string, unknown>) => d.slug !== slug);
  if (keep.length !== currentDrafts.length) {
    await setWithCompression(draftListKey, keep, { ex: 31536000 }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
