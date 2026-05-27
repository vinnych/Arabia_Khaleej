import type { NextConfig } from "next";
import path from "path";

// Why target-aware Webpack resolver alias is used instead of other alternatives:
// - Other alternatives like loader transformations or modifying ioredis usages directly can be complex, error-prone,
//   and risk breaking the Node.js daily automation workflow (which strictly requires standalone Redis via ioredis).
// - Setting 'ioredis', 'redis-parser', and the internal 'lib/redis-node.ts' to false for edge targets
//   forces Webpack to cleanly substitute them with empty modules, avoiding static bundle trace parsing of Node.js-only built-ins.
// - This surgically resolves compilation failures specifically for Edge runtime builds while leaving the Node.js build fully functional.
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

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

  // ioredis is a Node.js-only package (uses `net`, `tls` builtins).
  // Mark it external so our Redis provider abstraction can `require()` it
  // at runtime when REDIS_URL is set, without breaking the Node.js build.
  serverExternalPackages: ['ioredis'],

  // Why target-aware Webpack resolver alias is used instead of other alternatives:
  // We use Webpack configuration hooks in Next.js to intercept module resolution:
  // 1. Webpack statically parses dynamic imports like import('./redis-node') in lib/redis.ts.
  // 2. To prevent Webpack from resolving Node.js packages under the Cloudflare Edge runtime,
  //    we map 'ioredis', 'redis-parser', and './redis-node.ts' to false.
  // 3. This resolves dynamic imports to empty modules in the Edge target, bypassing compilation errors completely.
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'ioredis': false,
        'redis-parser': false,
        [path.resolve('lib/redis-node')]: false,
        [path.resolve('lib/redis-node.ts')]: false,
      };
    }
    return config;
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
        source: "/countries/uae",
        destination: "/countries/united-arab-emirates",
        permanent: true,
      },
      {
        source: "/prayer/united-arab-emirates",
        destination: "/prayer/uae",
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
