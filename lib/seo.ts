/**
 * Arabia Khaleej — SEO & Metadata Engine
 * Centralized utility for generating meta tags and search engine optimization.
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
  
  // CRITICAL CLOUDFLARE BUILD FIX: We reference the static "/opengraph-image.png" asset from the "public/" folder.
  // We explicitly use a static public asset instead of Next.js's file-based "app/opengraph-image.png" convention because
  // Next.js compiles the "app/" file-based convention into an internal dynamic Route Handler. In Cloudflare Pages,
  // this dynamic Route Handler triggers build errors unless configured with Edge runtime exports, which cannot be injected
  // into Next.js's automatic internal handler. Moving the image to "public/opengraph-image.png" and linking it here 
  // avoids the route compiler altogether, runs completely statically at maximum speed, and achieves 100% SEO alignment.
  const img = image ?? `${SITE_URL}/opengraph-image.png`;

  let baseRoute = path.split('?')[0];
  if (baseRoute.startsWith('/en/') || baseRoute === '/en') baseRoute = baseRoute.replace(/^\/en/, '') || '/';
  if (baseRoute.startsWith('/ar/') || baseRoute === '/ar') baseRoute = baseRoute.replace(/^\/ar/, '') || '/';
  
  const formattedBase = baseRoute === '/' ? '' : baseRoute.startsWith('/') ? baseRoute : `/${baseRoute}`;
  const canonicalEn = `${SITE_URL}/en${formattedBase}`;
  const canonicalAr = `${SITE_URL}/ar${formattedBase}`;
  const canonical = lang === "ar" ? canonicalAr : canonicalEn;

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
        "en": canonicalEn,
        "ar": canonicalAr,
        "x-default": canonicalEn,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      ...(process.env.NEXT_PUBLIC_ADSENSE_ID ? { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_ID } : {}),
      ...(process.env.NEXT_PUBLIC_SITE_VERIFICATION ? { "google-site-verification": process.env.NEXT_PUBLIC_SITE_VERIFICATION } : {}),
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
