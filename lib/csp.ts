/**
 * Arabia Khaleej — Content Security Policy Configuration
 * Centralized source of truth for security headers.
 *
 * 'unsafe-inline' for styles is required due to CSS-in-JS patterns in the component library.
 * nonce-based script execution with 'strict-dynamic' provides modern XSS protection while
 * allowing legitimate inline handlers from UI frameworks.
 */
export function getCSPHeader(nonce: string, isDev: boolean): string {
  const directives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      "https:",
      "'unsafe-inline'",
      // 'unsafe-eval' disabled in prod to prevent code injection attacks
      isDev ? "'unsafe-eval'" : '',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com",
      "data:",
    ],
    'img-src': [
      "'self'",
      "https:",
      "data:",
      "blob:",
    ],
    'connect-src': [
      "'self'",
      // Vercel analytics for performance monitoring
      "https://va.vercel-scripts.com",
      // Contact form worker endpoint
      "https://arabiakhaleej-contact.asishchilakapati.workers.dev",
      // IP geolocation for prayer times detection
      "https://freeipapi.com",
      "https://api.aladhan.com",
      // Exchange rates API for currency conversion
      "https://open.er-api.com",
      // Google Analytics for insights tracking (requires .google-analytics.com domains)
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.googletagmanager.com",
      // AdSense domains for monetization
      "https://*.googlesyndication.com",
      "https://*.doubleclick.net",
      "https://*.adtrafficquality.google",
    ],
    'frame-src': [
      "'self'",
      "https://googleads.g.doubleclick.net",
      "https://*.googlesyndication.com",
      "https://*.google.com",
      "https://*.adtrafficquality.google",
    ],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.filter(Boolean).join(' ')}`;
    })
    .join('; ');
}
