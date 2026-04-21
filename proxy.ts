import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get('lang');
  const cookieLang = request.cookies.get('NEXT_LOCALE')?.value;

  // 1. If lang param is present, ensure cookie matches
  if (langParam && (langParam === 'en' || langParam === 'ar')) {
    if (cookieLang !== langParam) {
      const response = NextResponse.next();
      response.cookies.set('NEXT_LOCALE', langParam, { path: '/', maxAge: 31536000 });
      return response;
    }
    return NextResponse.next();
  }

  // 2. If no lang param but cookie exists, redirect to include param (Optional, but good for SEO consistency)
  // For now, we'll just let the client handle the sync but ensure the server knows the language.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
