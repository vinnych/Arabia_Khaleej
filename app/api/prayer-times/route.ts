import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const method = searchParams.get('method') || '4';

  if (!lat || !lng) {
    return NextResponse.json({ status: 'error', message: 'Missing coordinates' }, { status: 400 });
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
