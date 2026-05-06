export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/redis';

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const { success } = await rateLimit(ip, 60, 3600, 'prayer');

  if (!success) {
    return NextResponse.json({ status: 'error', message: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const method = searchParams.get('method') || '4';

  const lat = parseFloat(latStr || '');
  const lng = parseFloat(lngStr || '');

  if (!isFinite(lat) || !isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ status: 'error', message: 'Invalid coordinates' }, { status: 400 });
  }

  const methodNum = parseInt(method, 10);
  if (!isFinite(methodNum) || methodNum < 0 || methodNum > 20) {
    return NextResponse.json({ status: 'error', message: 'Invalid method' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${method}`, {
        next: { revalidate: 3600 },
        signal: controller.signal
      });
      const data = await res.json();
      return NextResponse.json(data);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}


