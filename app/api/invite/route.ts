import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Server-side validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ status: 'error', message: 'Invalid email' }, { status: 400 });
    }

    if (name && (typeof name !== 'string' || name.length > 100)) {
      return NextResponse.json({ status: 'error', message: 'Invalid name' }, { status: 400 });
    }

    const res = await fetch("https://arabiakhaleej-contact.asishchilakapati.workers.dev", {
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
