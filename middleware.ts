import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCSPHeader } from './lib/csp';

export default function middleware(request: NextRequest) {
  // Generate a cryptographically secure nonce
  const nonce = btoa(crypto.randomUUID());
  
  const { searchParams, hostname, pathname } = new URL(request.url);

  // Redirect from .pages.dev to the main domain
  if (hostname.endsWith('.pages.dev')) {
    const destination = new URL(`https://arabiakhaleej.com${pathname}`);
    destination.search = searchParams.toString();
    return NextResponse.redirect(destination.toString(), 301);
  }

  // Add noindex header for admin pages (not public content)
  const isAdminPage = pathname.startsWith('/admin');

  const langParam = searchParams.get('lang');
  const cookieLang = request.cookies.get('NEXT_LOCALE')?.value;

  // Sync lang param with cookie
  let langToSet = null;
  if (langParam && (langParam === 'en' || langParam === 'ar')) {
    if (cookieLang !== langParam) {
      langToSet = langParam;
    }
  }

  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = getCSPHeader(nonce, isDev);

  // Set the nonce in the request headers so it can be read by Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set the CSP header on the response
  response.headers.set('Content-Security-Policy', cspHeader);

  // Add noindex for admin pages
  if (isAdminPage) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // Set language cookie if needed
  if (langToSet) {
    response.cookies.set('NEXT_LOCALE', langToSet, { 
      path: '/', 
      maxAge: 31536000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return response;
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
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
