import { NextResponse } from 'next/server';
import { redis, getWithCompression, setWithCompression } from '@/lib/redis';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const ADMIN_SECRET = process.env.ADMIN_SECRET!;

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

const lang = searchParams.get('lang') || 'en';
  const draftKey = `insights:drafts:${lang}`;

  console.log(`[Admin Drafts] Fetching key=${draftKey}`);
  const raw = await getWithCompression<unknown>(draftKey);
  console.log(`[Admin Drafts] rawType=${typeof raw} isArray=${Array.isArray(raw)} len=${Array.isArray(raw) ? raw.length : 'n/a'}`);

  if (raw && !Array.isArray(raw)) {
    console.warn(`[Admin Drafts] Expected array, got:`, typeof raw, Object.keys(raw || {}));
  }

  const drafts: unknown[] = Array.isArray(raw) ? raw as unknown[] : [];

  return NextResponse.json({ drafts });
}
