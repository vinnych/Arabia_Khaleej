import type { Metadata } from "next";

// Re-export the Breadcrumbs UI component from its .tsx home
export { default as Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const SITE_URL = "https://arabiakhaleej.com";
export const SITE_NAME_EN = "Arabia Khaleej";
export const SITE_NAME_AR = "عربية خليج";
export const SITE_NAME = SITE_NAME_EN;

export const SITE_DESCRIPTION_EN = "The definitive reference for a refined GCC experience.";
export const SITE_DESCRIPTION_AR = "المرجع النهائي لتجربة خليجية متميزة في دول مجلس التعاون.";
export const SITE_DESCRIPTION = SITE_DESCRIPTION_EN;

interface PageMetaOptions {
  /** Full page title */
  title: string;
  /** Arabic page title */
  titleAr?: string;
  /** Meta description, max ~160 chars */
  description: string;
  /** Arabic meta description */
  descriptionAr?: string;
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
 * - Arabic/English alternates
 * - AI Crawler instructions
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

  // Combine English and Arabic for maximum SEO reach on a single URL
  const combinedTitle = titleAr ? `${title} | ${titleAr}` : title;
  const combinedDescription = descriptionAr ? `${description} ${descriptionAr}` : description;

  const defaultKeywords = [
    "GCC news",
    "official updates",
    "QNA",
    "WAM",
    "SPA",
    "BNA",
    "ONA",
    "Premium GCC Insights",
    "Luxury Middle East",
    "Sovereign Wealth News",
    "Strategic Intelligence Gulf",
    "High-Fidelity Regional Analysis",
    "expat news GCC",
    "India news Qatar",
    "Pakistan news UAE",
    "Bangladesh news Saudi",
    "Philippines news GCC",
    "regional press terminal",
    "دليل الخليج",
    "عربية خليج",
    "أخبار الخليج",
    "وكالة الأنباء القطرية",
    "واس",
    "وام",
    "مواقيت الصلاة",
    "أسعار الذهب",
  ];

  return {
    title: combinedTitle,
    description: combinedDescription,
    keywords: keywords ? [...keywords, ...defaultKeywords] : defaultKeywords,
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: "/favicon-emblem.png",
      apple: "/favicon-emblem.png",
    },
    alternates: {
      canonical,
      languages: {
        "en-US": canonical.includes('?') 
          ? `${canonical.split('?')[0]}?lang=en` 
          : `${canonical}?lang=en`,
        "ar-SA": canonical.includes('?') 
          ? `${canonical.split('?')[0]}?lang=ar` 
          : `${canonical}?lang=ar`,
        "ar-AE": canonical.includes('?') 
          ? `${canonical.split('?')[0]}?lang=ar` 
          : `${canonical}?lang=ar`,
        "ar-QA": canonical.includes('?') 
          ? `${canonical.split('?')[0]}?lang=ar` 
          : `${canonical}?lang=ar`,
        "ar-KW": canonical.includes('?') 
          ? `${canonical.split('?')[0]}?lang=ar` 
          : `${canonical}?lang=ar`,
        "ar-OM": canonical.includes('?') 
          ? `${canonical.split('?')[0]}?lang=ar` 
          : `${canonical}?lang=ar`,
        "ar-BH": canonical.includes('?') 
          ? `${canonical.split('?')[0]}?lang=ar` 
          : `${canonical}?lang=ar`,
        "x-default": canonical.includes('?') ? canonical.split('?')[0] : canonical,
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
      "DC.title": combinedTitle,
      "DC.description": combinedDescription,
      "DC.date.issued": published,
      "DC.date.modified": modified,
      "apple-mobile-web-app-title": SITE_NAME,
      "format-detection": "telephone=no",
      "google": "notranslate", // We provide our own translations
    },
    openGraph: {
      title: og,
      description: ogDesc,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_US",
      alternateLocale: ["ar_QA", "ar_SA", "ar_AE", "ar_KW", "ar_OM", "ar_BH"],
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
    publisher: SITE_NAME,
    twitter: {
      card: "summary_large_image",
      title: og,
      description: ogDesc,
      images: [img],
      creator: "@arabiakhaleej",
    },
  };
}

