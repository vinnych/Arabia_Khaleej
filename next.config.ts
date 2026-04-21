import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow any HTTPS image source — news feeds come from unpredictable domains
      { protocol: 'https', hostname: '**' },
    ],
    // Disable optimization for external news images (they're already CDN-optimized)
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.arabiakhaleej.com" }],
        destination: "https://arabiakhaleej.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(self), microphone=(), camera=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' https: data: *",
              "connect-src 'self' https://va.vercel-scripts.com https://arabiakhaleej-contact.asishchilakapati.workers.dev https://freeipapi.com https://api.aladhan.com https://open.er-api.com https://www.google-analytics.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
