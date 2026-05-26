import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const adminSecret = process.env.ADMIN_SECRET;

    // Why fail-closed: Silent fallback to default credentials like 'sherly' creates standard vectors
    // for unauthorized operations. By requiring process.env.ADMIN_SECRET and returning a 500 error if missing,
    // we enforce that the admin dashboard must be properly configured before it can be used.
    if (!adminSecret) {
      console.error('[security] Server Configuration Error: ADMIN_SECRET environment variable is missing.');
      return new NextResponse('Configuration Error: Admin secret not configured on the server.', { status: 500 });
    }

    if (secret !== adminSecret) {
      console.warn('[security] Unauthorized attempt to clear Next.js system cache.');
      return new NextResponse('Unauthorized: Invalid secret credential.', { status: 403 });
    }

    // Purge the cache across the entire site
    revalidatePath('/', 'layout');
    console.log('[admin] Next.js site-wide cache cleared successfully via Admin API.');

    return NextResponse.json({ 
      success: true, 
      message: 'Next.js data cache successfully cleared.' 
    });
  } catch (err: any) {
    console.error('[admin] Failed to clear system cache:', err.message || err);
    return new NextResponse('Internal Error: ' + (err.message || 'Unknown Error'), { status: 500 });
  }
}
