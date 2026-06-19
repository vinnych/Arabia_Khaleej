/**
 * Arabia Khaleej Unified Translation Dictionary
 * Refactored into modular domains for maintainability.
 */
import { common } from "./common";
import { finance } from "./finance";
import { prayer } from "./prayer";
import { editorial } from "./editorial";
import { guides } from "./guides";
import { legal } from "./legal";
import { boutique } from "./boutique";

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  ...common,
  ...finance,
  ...prayer,
  ...editorial,
  ...guides,
  ...legal,
  ...boutique,

  // SEO & Metadata
  homeSchemaName: { en: "Arabia Khaleej — The GCC Standard", ar: "عربية خليج — المعيار الخليجي" },
  homeSchemaDesc: { en: "The definitive independent reference for the Gulf Cooperation Council.", ar: "المرجع المستقل النهائي لدول مجلس التعاون الخليجي." },
  homeDatasetName: { en: "Arabia Khaleej GCC Regional Intelligence", ar: "عربية خليج الاستخبارات الإقليمية الخليجية" },
};

/**
 * Normalizes and prefixes an internal route path with the active language code.
 * Why: Ensures that client-side links point directly to the localized path,
 * avoiding redirect hops and ensuring Googlebot discovers canonical localized URLs.
 */
export function getLocalizedHref(path: string, lang: Language): string {
  // Why: Avoid prefixing external protocols (HTTP/HTTPS), mailto, or telephone links.
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  
  // Normalize leading slash to ensure we have a valid relative path.
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Why: Root path / points to /${lang} (e.g. /en or /ar).
  if (cleanPath === '/') {
    return `/${lang}`;
  }
  
  // Why: Prevent double-prefixing if the path already starts with /en/ or /ar/ or is exactly /en or /ar.
  if (cleanPath.startsWith('/en/') || cleanPath === '/en' || cleanPath.startsWith('/ar/') || cleanPath === '/ar') {
    return cleanPath;
  }
  
  return `/${lang}${cleanPath}`;
}

