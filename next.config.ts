import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'qna.org.qa' },
      { protocol: 'https', hostname: 'www.qna.org.qa' },
      { protocol: 'https', hostname: 'www.wam.ae' },
      { protocol: 'https', hostname: 'www.spa.gov.sa' },
      { protocol: 'https', hostname: 'www.bna.bh' },
      { protocol: 'https', hostname: 'omannews.gov.om' },
      { protocol: 'https', hostname: 'www.omannews.gov.om' },
      { protocol: 'https', hostname: 'www.app.com.pk' },
      { protocol: 'https', hostname: 'www.pna.gov.ph' },
    ],
    unoptimized: false,
  },

  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.arabiakhaleej.com" }],
        destination: "https://arabiakhaleej.com/:path*",
        permanent: true,
      },
      {
        source: "/market-insight/((?!details).*)",
        destination: "/market-insight",
        permanent: true,
      },
      {
        source: "/market-insight/stocks",
        destination: "/market-insight",
        permanent: true,
      },
      {
        source: "/market-insight/gold",
        destination: "/market-insight",
        permanent: true,
      },
      {
        source: "/market-insight/crypto",
        destination: "/market-insight",
        permanent: true,
      },
      {
        source: "/market-insight/forex",
        destination: "/market-insight",
        permanent: true,
      },
      {
        source: "/market-insight/details/:path*",
        destination: "/market-insight",
        permanent: false,
      },
      {
        source: "/countries/uae",
        destination: "/countries/united-arab-emirates",
        permanent: true,
      },
      {
        source: "/prayer/united-arab-emirates",
        destination: "/prayer/uae",
        permanent: true,
      },
      {
        source: "/finance/:path*",
        destination: "/market-insight",
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
        ],
      },
    ];
  },
};

export default nextConfig;
