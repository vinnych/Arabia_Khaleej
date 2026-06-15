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
