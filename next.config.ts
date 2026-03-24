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
              "script-src 'self' 'unsafe-inline' pagead2.googlesyndication.com partner.googleadservices.com www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src fonts.gstatic.com",
              "img-src 'self' https: data: pagead2.googlesyndication.com tpc.googlesyndication.com www.google-analytics.com",
              "frame-src googleads.g.doubleclick.net",
              "connect-src 'self' api.aladhan.com www.aljazeera.com thepeninsulaqatar.com www.gulf-times.com www.qna.org.qa www.bayt.com www.gulftalent.com www.google-analytics.com region1.google-analytics.com api.groq.com api.pexels.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
