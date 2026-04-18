import type { Metadata } from "next";

export const SITE_URL = "https://arabiakhaleej.com";
export const SITE_NAME = "Arabia Khaleej";
export const SITE_DESCRIPTION = "The definitive reference for a refined GCC experience.";

interface PageMetaOptions {
  /** Full page title */
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
  /** Content publication date */
  datePublished?: string;
  /** Content last modification date */
  dateModified?: string;
  /** Geographic coordinates for local SEO */
  geo?: {
    latitude: number;
    longitude: number;
    region?: string;
    placename?: string;
  };
}

/**
 * Generate complete page metadata with automatic:
 * - canonical URL
 * - Open Graph tags + image
 * - Twitter card
 * - Regional Geo tags
 * - AI Crawler instructions
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
  datePublished,
  dateModified,
  geo = {
    latitude: 25.2854,
    longitude: 51.5310,
    region: "QA-DA",
    placename: "Doha, Qatar",
  },
}: PageMetaOptions): Metadata {
  const og = ogTitle ?? title;
  const ogDesc = ogDescription ?? description;
  const img = image ?? `${SITE_URL}/opengraph-image`;
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const now = new Date().toISOString();
  const published = datePublished ?? "2024-01-01T00:00:00Z";
  const modified = dateModified ?? now;

  return {
    title,
    description,
    keywords: keywords || [
      "GCC guide",
      "Arabia Khaleej",
      "Gulf community",
      "Doha guide",
      "Dubai guide",
      "Riyadh guide",
      "GCC prayer times",
      "GCC gold rates",
    ],
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: "/favicon-emblem.png",
      apple: "/favicon-emblem.png",
    },
    alternates: {
      canonical,
      languages: {
        "en": canonical,
        "ar": canonical,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      "geo.region": geo.region || "QA-DA",
      "geo.placename": geo.placename || "Doha, Qatar",
      "geo.position": `${geo.latitude};${geo.longitude}`,
      "ICBM": `${geo.latitude}, ${geo.longitude}`,
      "DC.title": title,
      "DC.description": description,
      "DC.date.issued": published,
      "DC.date.modified": modified,
      "apple-mobile-web-app-title": SITE_NAME,
    },
    openGraph: {
      title: og,
      description: ogDesc,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      publishedTime: published,
      modifiedTime: modified,
      images: [
        {
          url: img,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: og,
      description: ogDesc,
      images: [img],
      creator: "@arabiakhaleej",
    },
  };
}


