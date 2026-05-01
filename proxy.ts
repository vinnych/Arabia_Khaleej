import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // Generate a cryptographically secure nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const { searchParams } = new URL(request.url);
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

  // Define CSP directives
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' https: data: blob:;
    connect-src 'self' https://va.vercel-scripts.com https://arabiakhaleej-contact.asishchilakapati.workers.dev https://freeipapi.com https://api.aladhan.com https://open.er-api.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.doubleclick.net https://ep1.adtrafficquality.google;
    frame-src 'self' https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.google.com;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Set the nonce in the request headers so it can be read by Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  console.log('Middleware: Generated nonce:', nonce);

  // Create the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set the CSP header on the response
  response.headers.set('Content-Security-Policy', cspHeader);

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
