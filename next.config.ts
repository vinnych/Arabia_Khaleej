import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'qna.org.qa' },
      { protocol: 'https', hostname: 'www.wam.ae' },
      { protocol: 'https', hostname: 'www.spa.gov.sa' },
      { protocol: 'https', hostname: 'www.bna.bh' },
      { protocol: 'https', hostname: 'omannews.gov.om' },
      { protocol: 'https', hostname: 'www.app.com.pk' },
      { protocol: 'https', hostname: 'www.pna.gov.ph' },
      // Fallback for other HTTPS sources with warning
      { protocol: 'https', hostname: 'www.qna.org.qa' },
      { protocol: 'https', hostname: 'www.spa.gov.sa' },
      { protocol: 'https', hostname: 'www.bna.bh' },
      { protocol: 'https', hostname: 'www.omannews.gov.om' },
    ],
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
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https://images.unsplash.com https://images.pexels.com https://*.noon.com https://*.gov.sa https://*.gov.qa https://*.gov.bh https://*.gov.om https://*.ae https://www.google-analytics.com https://pagead2.googlesyndication.com;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://api.groq.com https://api.aladhan.com https://open.er-api.com https://*.upstash.io https://*.google-analytics.com https://*.googlesyndication.com https://*.workers.dev https://va.vercel-scripts.com;
      frame-src 'self' https://googleads.g.doubleclick.net https://*.googlesyndication.com;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(self), microphone=(), camera=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
