import { NextResponse } from 'next/server';
import { ALADHAN_API_BASE } from '@/lib/constants/api';

// NOTE: runtime declaration removed - on Cloudflare Workers with nodejs_compat all routes
// run in the Node.js-compatible Workers runtime, making 'edge' declaration both unnecessary
// and incompatible with @opennextjs/cloudflare (which requires edge routes in separate functions).

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get('month') || '', 10);
  const year = parseInt(searchParams.get('year') || '', 10);

  if (!isFinite(month) || month < 1 || month > 12 || !isFinite(year) || year < 1400 || year > 2100) {
    return NextResponse.json({ status: 'error', message: 'Invalid month or year' }, { status: 400 });
  }

  try {
    const res = await fetch(`${ALADHAN_API_BASE}/gToHCalendar/${encodeURIComponent(month)}/${encodeURIComponent(year)}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Hijri API error:", error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch Hijri data' }, { status: 500 });
  }
}


