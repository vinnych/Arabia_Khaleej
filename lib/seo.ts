import type { Metadata } from "next";

export const SITE_URL = "https://arabiakhaleej.com";

interface PageMetaOptions {
  /** Full page title (e.g. "Qatar Metro Guide — Lines & Fares | Arabia Khaleej") */
  title: string;
  /** Meta description, max ~160 chars */
  description: string;
  /** URL path, e.g. "/qatar-metro" */
  path: string;
  keywords?: string[];
  /** OG/Twitter title — defaults to title */
  ogTitle?: string;
  /** OG/Twitter description — defaults to description */
  ogDescription?: string;
  /** Page type — defaults to "website" */
  type?: "website" | "article";
  /** Custom OG image URL — defaults to /opengraph-image */
  image?: string;
}

/**
 * Generate complete page metadata with automatic:
 * - canonical URL
 * - Open Graph tags + image
 * - Twitter card
 * - Doha geo tags (region, placename, coordinates)
 *
 * Usage:
 *   export const metadata = pageMeta({
 *     title: "My Page | Arabia Khaleej",
 *     description: "...",
 *     path: "/my-page",
 *     keywords: ["keyword1", "keyword2"],
 *   });
 */
export function pageMeta({
  title,
  description,
  path,
  keywords,
  ogTitle,
  ogDescription,
  type = "website",
  image,
}: PageMetaOptions): Metadata {
  const og = ogTitle ?? title;
  const ogDesc = ogDescription ?? description;
  const img = image ?? `${SITE_URL}/opengraph-image`;
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    alternates: {
      canonical,
      languages: {
        "en": canonical,
        "ar": canonical,
        "x-default": canonical,
      },
    },
    other: {
      "geo.region": "QA-DA",
      "geo.placename": "Doha, Qatar",
      "geo.position": "25.2854;51.5310",
      "ICBM": "25.2854, 51.5310",
    },
    openGraph: {
      title: og,
      description: ogDesc,
      url: canonical,
      siteName: "Arabia Khaleej",
      locale: "en_US",
      type,
      images: [{ url: img, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: og,
      description: ogDesc,
    },
  };
}
