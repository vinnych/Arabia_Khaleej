import { NextResponse } from 'next/server';

export const runtime = 'edge';

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

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

async function decompress(compressedStr: string) {
  if (typeof compressedStr !== 'string' || !compressedStr.startsWith('compressed:')) {
    return typeof compressedStr === 'string' ? JSON.parse(compressedStr) : compressedStr;
  }
  const base64 = compressedStr.replace('compressed:', '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
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

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug, lang } = await request.json();
    if (!slug || !lang) {
      return NextResponse.json({ error: 'Missing slug or lang' }, { status: 400 });
    }

    // 1. Fetch draft article
    const draftArticleKey = `insights:draft:article:${slug}`;
    const draftRes = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(draftArticleKey)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });
    const draftData = await draftRes.json();
    if (!draftData.result) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }
    const article = await decompress(draftData.result);

    // 2. Update article status to published
    article.status = 'published';

    // 3. Save to live article key
    const liveArticleKey = `insights:article:${slug}`;
    const compressedArticle = await compress(article);
    await fetch(`${UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(liveArticleKey)}?ex=31536000`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
      body: compressedArticle
    });

    // 4. Add to live list
    const listKey = `insights:list:${lang}`;
    const listRes = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(listKey)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });
    const listData = await listRes.json();
    let currentList = [];
    if (listData.result) {
      currentList = await decompress(listData.result);
    }

    const { content, ...metadata } = article;
    const updatedList = [metadata, ...currentList].slice(0, 1000);
    const compressedList = await compress(updatedList);
    await fetch(`${UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(listKey)}?ex=31536000`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
      body: compressedList
    });

    // 5. Remove from draft list
    const draftListKey = `insights:drafts:${lang}`;
    const draftListRes = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(draftListKey)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });
    const draftListData = await draftListRes.json();
    let currentDrafts = [];
    if (draftListData.result) {
      currentDrafts = await decompress(draftListData.result);
    }
    const updatedDrafts = currentDrafts.filter((d: any) => d.slug !== slug);
    const compressedDrafts = await compress(updatedDrafts);
    await fetch(`${UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(draftListKey)}?ex=31536000`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
      body: compressedDrafts
    });

    // 6. Delete draft article key
    await fetch(`${UPSTASH_REDIS_REST_URL}/del/${encodeURIComponent(draftArticleKey)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Approval failed' }, { status: 500 });
  }
}
