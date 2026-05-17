import { NextRequest, NextResponse } from 'next/server';
import { redis, getWithCompression, setWithCompression, compressValue, decompressValue } from '@/lib/redis';

export const runtime = 'edge';

const ADMIN_SECRET = process.env.ADMIN_SECRET!;

function fail(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  try {
    const secret = new URL(request.url).searchParams.get('secret');
    if (secret !== ADMIN_SECRET) {
      return fail({ error: 'Unauthorized' }, 401);
    }

    const { slug, lang, content: editedContent, title: editedTitle } = await request.json().catch(() => ({}));
    if (!slug || !lang) {
      return fail({ error: 'Missing slug or lang' }, 400);
    }

    // 1. Fetch draft article body via shared decompressValue
    const draftArticleKey = `insights:draft:article:${slug}`;
    const raw = await redis.get(draftArticleKey);
    if (!raw) return fail({ error: 'Draft not found' }, 404);

    // 2. Human-editable draft body — decompressed from whatever format the workflow wrote
    const article = decompressValue(String(raw)) as Record<string, unknown>;

    // 2. Apply human edits if provided
    const hasEdits = !!(editedContent || editedTitle);
    if (editedContent !== undefined) {
      (article as Record<string, unknown>).content = editedContent;
    }
    if (editedTitle !== undefined) {
      (article as Record<string, unknown>).title = editedTitle;
      const contentForDesc = (editedContent ?? (article as Record<string, unknown>).content ?? '') as string;
      const lines = contentForDesc.split('\n');
      const paragraph = lines.find((l: string) => !l.startsWith('#') && l.length > 80);
      (article as Record<string, unknown>).description = paragraph
        ? paragraph.replace(/[#*_]/g, '').trim().substring(0, 180) + '...'
        : (article as Record<string, unknown>).description;
    }

    // 3. Update status
    (article as Record<string, unknown>).status = 'published';
    if (hasEdits) {
      (article as Record<string, unknown>).humanEdited = true;
      (article as Record<string, unknown>).editedAt = new Date().toISOString();
    }

    // 4. Save to live article key with the same format the workflow/readers expect
    const liveCompressed = compressValue(article);
    await redis.set(`insights:article:${slug}`, liveCompressed, { ex: 31536000 } as Record<string, unknown>);

    // 5. Add to live list (content is already part of the article object; live list carries full metadata)
    const listKey = `insights:list:${lang}`;
    const currentLive = await getWithCompression<Record<string, string | number | boolean | string[]>[]>(listKey) ?? [];
    await setWithCompression(listKey, [article as Record<string, unknown>, ...currentLive].slice(0, 1000), { ex: 31536000 });

    // 6. Remove from draft list
    const draftListKey = `insights:drafts:${lang}`;
    const currentDrafts = await getWithCompression<Record<string, unknown>[]>(draftListKey) ?? [];
    const updatedDrafts = currentDrafts.filter((d: Record<string, unknown>) => d.slug !== slug);
    await setWithCompression(draftListKey, updatedDrafts, { ex: 31536000 });

    // 7. Delete draft article body
    await redis.del(draftArticleKey).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approval failed:', error);
    const statusNum = typeof (error as { status?: number }).status === 'number' ? (error as { status: number }).status : 500;
    return NextResponse.json({ error: 'Approval failed' }, { status: statusNum });
  }
}
