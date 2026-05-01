import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/redis';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const { success } = await rateLimit(ip, 5, 3600, 'invite');

  if (!success) {
    return NextResponse.json({ status: 'error', message: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, name } = body;

    // Server-side validation
    if (!email || typeof email !== 'string' || !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ status: 'error', message: 'Invalid email' }, { status: 400 });
    }

    if (name && (typeof name !== 'string' || name.length > 100)) {
      return NextResponse.json({ status: 'error', message: 'Invalid name' }, { status: 400 });
    }

    const workerUrl = process.env.CONTACT_WORKER_URL || "https://arabiakhaleej-contact.asishchilakapati.workers.dev";
    
    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    if (!res.ok) {
      return NextResponse.json({ status: 'error' }, { status: res.status });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
