import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const runtime = 'edge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    const adminSecret = process.env.ADMIN_SECRET || 'sherly';

    if (secret !== adminSecret) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Purge the cache across the entire site
    revalidatePath('/', 'layout');

    return NextResponse.json({ 
      success: true, 
      message: 'Next.js data cache successfully cleared.' 
    });
  } catch (err) {
    console.error('Failed to clear cache', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
