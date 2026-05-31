import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCSPHeader } from './lib/csp';

export default function middleware(request: NextRequest) {
  // Generate a cryptographically secure nonce for CSP script-src
  // Using crypto.randomUUID() ensures unique nonces per request, preventing XSS
  const nonce = btoa(crypto.randomUUID());
  
  const { searchParams, hostname, pathname } = new URL(request.url);

  // Redirect from .pages.dev to the main domain for SEO consistency
  // This ensures only the canonical domain appears in search results
  if (hostname.endsWith('.pages.dev')) {
    const destination = new URL(`https://arabiakhaleej.com${pathname}`);
    destination.search = searchParams.toString();
    return NextResponse.redirect(destination.toString(), 301);
  }

  const isAdminPage = pathname.startsWith('/admin');

  // If there's a legacy lang query param, redirect to the new subpath structure
  if (searchParams.has('lang') && !isAdminPage) {
    const lang = searchParams.get('lang') === 'ar' ? 'ar' : 'en';
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete('lang');
    
    // strip existing locale if any
    let cleanPath = pathname;
    if (cleanPath.startsWith('/en/') || cleanPath === '/en') cleanPath = cleanPath.replace(/^\/en/, '') || '/';
    if (cleanPath.startsWith('/ar/') || cleanPath === '/ar') cleanPath = cleanPath.replace(/^\/ar/, '') || '/';
    
    redirectUrl.pathname = `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Handle i18n routing for public pages
  if (!isAdminPage) {
    const locales = ['en', 'ar'];
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      // Get preferred language from cookie or default to en
      const cookieLang = request.cookies.get('NEXT_LOCALE')?.value;
      const locale = cookieLang === 'ar' ? 'ar' : 'en';
      
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Extract current language from URL for cookie syncing if it changed
  let langToSet = null;
  if (!isAdminPage) {
    const match = pathname.match(/^\/(en|ar)(\/|$)/);
    if (match) {
      const currentLang = match[1];
      const cookieLang = request.cookies.get('NEXT_LOCALE')?.value;
      if (cookieLang !== currentLang) {
        langToSet = currentLang;
      }
    }
  }

  const isDev = process.env.NODE_ENV === 'development';
  
  // WHY: Next.js pre-compiles and optimizes static pages (like the admin review console) at build-time.
  // Static pages carry pre-rendered Next.js inline scripts that do not have access to our dynamic request-time nonce.
  // Under the CSP spec, if a nonce is present, browsers ignore 'unsafe-inline'.
  // By passing an empty string for the nonce on admin pages, we cleanly omit the nonce from the CSP header,
  // allowing the browser to respect 'unsafe-inline' and execute Next.js's hydration scripts successfully.
  const activeNonce = isAdminPage ? '' : nonce;
  const cspHeader = getCSPHeader(activeNonce, isDev);

  // Set the nonce in request headers so Server Components can inline scripts securely
  // The nonce must match in both the CSP header and script tags
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Create the response with modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set the CSP header on the response to enable strict Content Security Policy
  // This prevents XSS attacks by restricting script sources to nonce-authorized scripts
  response.headers.set('Content-Security-Policy', cspHeader);

  // Add noindex for admin pages to prevent search engines from indexing admin UI.
  // Also set Cache-Control: no-store, private to prevent Cloudflare CDN from caching
  // the admin page and serving a cached version to other users.
  if (isAdminPage) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store, private');
  }

  // Set language cookie if language preference changed
  // 1 year maxAge (31536000 seconds) - user preference should persist long-term
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
