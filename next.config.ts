import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
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
              "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com data:",
              "img-src 'self' https: data: pagead2.googlesyndication.com tpc.googlesyndication.com www.google-analytics.com",
              "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://region1.google-analytics.com api.aladhan.com www.aljazeera.com thepeninsulaqatar.com www.gulf-times.com www.qna.org.qa www.bayt.com www.gulftalent.com api.groq.com api.pexels.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
