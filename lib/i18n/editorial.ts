/**
 * @file lib/i18n/editorial.ts
 * @module i18n/editorial
 * @description Arabia Khaleej — Editorial & Insights Translation Strings
 *
 * Contains all bilingual (English / Arabic) UI copy for:
 *   - The `/insights` listing and article pages
 *   - The editorial team section on `/about`
 *   - The AI disclosure card on `/transparency`
 */

import { Translations } from "../i18n-data";

export const editorial: Translations = {

  // ---------------------------------------------------------------------------
  // Insights UI Labels
  // ---------------------------------------------------------------------------

  /** Section label for the main insights hub */
  intelligenceTerminal: { en: "Strategic Insights", ar: "رؤى استراتيجية" },

  /** Label for the intelligence briefing sub-section */
  intelligenceBriefing: { en: "Intelligence Briefing", ar: "موجز الاستخبارات" },

  /** Label used on analyst perspective callouts */
  analystPerspective: { en: "Analyst Perspective", ar: "منظور المحلل" },

  /** Label for the official editorials section */
  officialUpdates: { en: "Official Editorials", ar: "افتتاحيات رسمية" },

  /** Short subtitle for the insights section */
  insightsDesc: { en: "Original editorial insights and deep dives", ar: "تحليلات ورؤى تحريرية أصلية" },

  /** Hero title for the insights index page */
  insightsIntroTitle: { en: "Regional Intelligence & Editorial Deep Dives", ar: "الاستخبارات الإقليمية والتعمق التحريري" },

  /** Hero body for the insights index page */
  insightsIntroBody: {
    en: "The Arabia Khaleej Insights terminal serves as a high-fidelity editorial hub for authoritative perspectives on the Gulf Cooperation Council's rapid transformation.",
    ar: "تعمل محطة رؤى عربية خليج كمركز تحريري عالي الدقة لوجهات النظر الموثوقة حول التحول السريع لدول مجلس التعاون الخليجي.",
  },

  /** Section heading for the editorial leadership block */
  editorialLeadership: { en: "Editorial Leadership", ar: "القيادة التحريرية" },

  /** Section heading for the featured insights block */
  featuredInsights: { en: "Featured Insights", ar: "رؤى مختارة" },

  /** Generic label for the regional intelligence category */
  regionalIntelligence: { en: "Regional Intelligence", ar: "الاستخبارات الإقليمية" },

  /** Share action label on article pages */
  shareArticle: { en: "Share Article", ar: "مشاركة المقال" },

  /** Button label to close the perspective overlay */
  closePerspective: { en: "Close Perspective", ar: "إغلاق المنظور" },

  /** Toggle label to switch article language to Arabic */
  perspectiveModeAR: { en: "Perspective Mode (AR)", ar: "عرض المنظور العربي" },

  /** Toggle label to switch article language to English */
  perspectiveModeEN: { en: "Perspective Mode (EN)", ar: "عرض المنظور الإنجليزي" },

  /** Shown when an article has no translation in the alternate language */
  translationUnavailable: { en: "No translation available for this article.", ar: "لا توجد ترجمة متاحة لهذا المقال." },

  /** Pagination / load-more label */
  moreInsights: { en: "More Insights", ar: "المزيد من الرؤى" },

  // ---------------------------------------------------------------------------
  // Editorial Team
  // ---------------------------------------------------------------------------

  team1Name: { en: "Arabia Khaleej Editorial Team", ar: "هيئة تحرير عربية خليج" },
  team1Role: { en: "Editorial Board", ar: "هيئة التحرير" },
  team1Bio: {
    en: "The Arabia Khaleej Editorial Team produces institutional-grade GCC regional intelligence, combining AI-assisted research with human editorial review. All content undergoes strict quality standards before publication.",
    ar: "تنتج هيئة تحرير عربية خليج استخبارات إقليمية لمجلس التعاون الخليجي بمستوى مؤسسي، تجمع بين البحث بمساعدة الذكاء الاصطناعي والمراجعة التحريرية البشرية. يتم فحص جميع المحتويات بمعايير جودة صارمة قبل النشر.",
  },

  // ---------------------------------------------------------------------------
  // AI Editorial Disclosure — rendered as the first card on /transparency
  // ---------------------------------------------------------------------------

  /** Card title for the AI methodology disclosure section */
  aiEditorialDisclosure: { en: "AI-Assisted Editorial Process", ar: "عملية التحرير المعززة بالذكاء الاصطناعي" },

  /** Card body explaining the AI-assisted drafting methodology */
  aiEditorialDisclosureDesc: {
    en: "Arabia Khaleej uses AI assistance for research and drafting support. All articles are reviewed by human editors before publication to ensure accuracy, quality, and compliance with AdSense policies. This disclosure applies to all generated content.",
    ar: "تستخدم عربية خليج المساعدة في الذكاء الاصطناعي للبحث ودعم الصياغة. يتم مراجعة جميع المقالات من قبل محررين بشرية قبل النشر لضمان الدقة والجودة والامتثال لسياسات AdSense. هذا الإخلاء ينطبق على جميع المحتويات المُنشأة.",
  },
};
