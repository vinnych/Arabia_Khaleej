import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://qatar-portal.vercel.app/sitemap.xml",
    host: "https://qatar-portal.vercel.app",
  };
}
