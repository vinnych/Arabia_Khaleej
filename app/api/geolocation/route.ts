import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '';

    // If there's a valid client IP (and not local loopback), append it
    const url = ip && ip !== '127.0.0.1' && ip !== '::1'
      ? `https://freeipapi.com/api/json/${ip}`
      : "https://freeipapi.com/api/json";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(url, {
        cache: 'no-store', // CRITICAL: Do not cache IP responses
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
