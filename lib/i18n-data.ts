import { common } from "./i18n/common";
import { finance } from "./i18n/finance";
import { prayer } from "./i18n/prayer";
import { editorial } from "./i18n/editorial";
import { guides } from "./i18n/guides";
import { legal } from "./i18n/legal";
import { boutique } from "./i18n/boutique";

export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

/**
 * Arabia Khaleej Unified Translation Dictionary
 * Refactored into modular domains for high-fidelity maintainability.
 */
export const translations: Translations = {
  ...common,
  ...finance,
  ...prayer,
  ...editorial,
  ...guides,
  ...legal,
  ...boutique,
  
  // High-Fidelity SEO & Metadata (Kept here for central oversight)
  homeSchemaName: { en: "Arabia Khaleej — The GCC Standard", ar: "عربية خليج — المعيار الخليجي" },
  homeSchemaDesc: { en: "The definitive independent reference for the Gulf Cooperation Council.", ar: "المرجع المستقل النهائي لدول مجلس التعاون الخليجي." },
  homeDatasetName: { en: "Arabia Khaleej GCC Regional Intelligence", ar: "عربية خليج الاستخبارات الإقليمية الخليجية" },
};
