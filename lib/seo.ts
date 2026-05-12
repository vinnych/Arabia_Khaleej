/**
 * Arabia Khaleej — SEO & Metadata Engine
 * 
 * Centralized utility for generating meta tags, structured data,
 * and search engine optimization configurations.
 */

import type { Metadata } from "next";

export { default as Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const SITE_URL = "https://arabiakhaleej.com";
export const SITE_NAME_EN = "Arabia Khaleej";
export const SITE_NAME_AR = "عربية خليج";
export const SITE_NAME = SITE_NAME_EN;

export const SITE_DESCRIPTION_EN = "The definitive reference for a refined GCC experience.";
export const SITE_DESCRIPTION_AR = "المرجع النهائي لتجربة خليجية متميزة في دول مجلس التعاون.";
export const SITE_DESCRIPTION = SITE_DESCRIPTION_EN;

export const SITE_TAGLINE_EN = "The GCC Standard";
export const SITE_TAGLINE_AR = "المعيار الخليجي";

interface PageMetaOptions {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  path: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  type?: "website" | "article";
  image?: string;
  datePublished?: string;
  dateModified?: string;
  geo?: {
    latitude: number;
    longitude: number;
    region?: string;
    placename?: string;
  };
  lang?: "en" | "ar";
}

/**
 * Generate complete page metadata with automatic canonicals, OG tags, and regional alternates.
 */
export function pageMeta({
  title,
  titleAr,
  description,
  descriptionAr,
  path,
  keywords,
  ogTitle,
  ogDescription,
  type = "website",
  image,
  datePublished,
  dateModified,
  geo,
  lang = "en",
}: PageMetaOptions): Metadata {
  const og = ogTitle ?? (lang === "ar" && titleAr ? titleAr : title);
  const ogDesc = ogDescription ?? (lang === "ar" && descriptionAr ? descriptionAr : description);
  const img = image ?? `${SITE_URL}/opengraph-image`;
  
  // Sanitize path
  const cleanPath = path.split('?')[0];
  const canonical = cleanPath === "/" ? SITE_URL : `${SITE_URL}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  
  const now = new Date().toISOString();
  const published = datePublished ?? "2026-01-01T00:00:00Z";
  const modified = dateModified ?? now;

  const finalTitle = lang === "ar" && titleAr ? titleAr : title;
  const finalDescription = lang === "ar" && descriptionAr ? descriptionAr : description;

  const defaultKeywords = [
    "GCC insights", "Gulf news", "Middle East business",
    "دليل الخليج", "عربية خليج", "مواقيت الصلاة", "أسعار الذهب"
  ];

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: keywords ? [...keywords, ...defaultKeywords] : defaultKeywords,
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: "/favicon-emblem.png",
      apple: "/favicon-emblem.png",
    },
    alternates: {
      canonical,
      languages: {
        "en": canonical,
        "ar": `${canonical}?lang=ar`,
        "x-default": canonical,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_ID || "",
      "google-site-verification": process.env.NEXT_PUBLIC_SITE_VERIFICATION || "",
      ...(geo ? {
        "geo.region": geo.region,
        "geo.placename": geo.placename,
        "geo.position": `${geo.latitude};${geo.longitude}`,
      } : {}),
      "DC.title": finalTitle,
      "DC.description": finalDescription,
      "format-detection": "telephone=no",
      "google": "notranslate",
    },
    openGraph: {
      title: og,
      description: ogDesc,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === 'ar' ? "ar_QA" : "en_US",
      type,
      publishedTime: published,
      modifiedTime: modified,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
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
