/**
 * Arabia Khaleej — Content Security Policy Configuration
 * Centralized source of truth for security headers.
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
      "https://va.vercel-scripts.com",
      "https://arabiakhaleej-contact.asishchilakapati.workers.dev",
      "https://freeipapi.com",
      "https://api.aladhan.com",
      "https://open.er-api.com",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.googletagmanager.com",
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
