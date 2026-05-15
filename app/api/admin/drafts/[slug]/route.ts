import { NextResponse } from 'next/server';

export const runtime = 'edge';

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

async function decompress(compressedStr: string) {
  if (typeof compressedStr !== 'string' || !compressedStr.startsWith('compressed:')) {
    return typeof compressedStr === 'string' ? JSON.parse(compressedStr) : compressedStr;
  }
  const base64 = compressedStr.replace('compressed:', '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.byteLength; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  }).pipeThrough(new DecompressionStream('gzip'));
  const text = await new Response(stream).text();
  return JSON.parse(text);
}

async function compress(data: any) {
  const encoder = new TextEncoder();
  const uint8 = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8);
      controller.close();
    },
  }).pipeThrough(new CompressionStream('gzip'));
  const buffer = await new Response(stream).arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'compressed:' + btoa(binary);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = searchParams.get('slug');
  const lang = searchParams.get('lang');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    // 1. Delete draft article key (same format as generate/0/route.ts write path)
    const draftArticleKey = 'insights:draft:article:' + slug;
    await fetch(`${UPSTASH_REDIS_REST_URL}/del/${draftArticleKey}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    }).catch(() => {});

    // 2. Remove from draft list
    const langToRemove = lang || 'en';
    const draftListKey = `insights:drafts:${langToRemove}`;
    const listRes = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(draftListKey)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });
    const listData = await listRes.json();
    let currentDrafts: any[] = [];
    if (listData.result) {
      currentDrafts = await decompress(listData.result);
    }
    const updatedDrafts = currentDrafts.filter((d: any) => d.slug !== slug);
    if (updatedDrafts.length !== currentDrafts.length) {
      const compressedDrafts = await compress(updatedDrafts);
      await fetch(`${UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(draftListKey)}?ex=31536000`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
        body: compressedDrafts
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
