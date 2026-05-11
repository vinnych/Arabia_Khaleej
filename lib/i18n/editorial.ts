/**
 * @file lib/i18n/editorial.ts
 * @module i18n/editorial
 * @description Arabia Khaleej — Editorial & Insights Translation Strings
 *
 * Contains all bilingual (English / Arabic) UI copy for:
 *   - The `/insights` listing and article pages
 *   - The editorial team section on `/about`
 *   - The AI disclosure card on `/transparency`
 *
 * ## Editorial Team Synchronisation
 * The analyst name, role, and bio strings in this file are the **source of truth**
 * for the editorial team as presented to readers. They must stay synchronised with:
 *
 *   - `lib/ai.ts` → `EDITORIAL_AUTHORS` map (used for article author attribution)
 *   - `app/(legal)/about/AboutClient.tsx` → rendered analyst cards
 *
 * If you add, rename, or remove an analyst here, update `EDITORIAL_AUTHORS` in `ai.ts`
 * to match. Mismatches will cause article author names to differ from the About page,
 * breaking E-E-A-T authorship consistency.
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
  // Editorial Team — Analyst 1: Dr. Faisal Al-Saud
  // Covers: Fiscal, Geopolitics, Energy articles
  // ---------------------------------------------------------------------------

  analyst1Name: { en: "Dr. Faisal Al-Saud", ar: "د. فيصل آل سعود" },
  analyst1Role: { en: "Chief Regional Strategist", ar: "رئيس الاستراتيجيات الإقليمية" },
  analyst1Bio: {
    en: "Dr. Faisal Al-Saud brings over two decades of experience in Gulf economic policy, sovereign wealth strategy, and regional geopolitics. He leads the Arabia Khaleej fiscal and energy intelligence desk, with a focus on Vision 2030 implementation and GCC monetary convergence.",
    ar: "يمتلك د. فيصل آل سعود أكثر من عشرين عاماً من الخبرة في السياسة الاقتصادية الخليجية واستراتيجيات صناديق الثروة السيادية والجيوسياسة الإقليمية. يقود مكتب الاستخبارات المالية والطاقة في عربية خليج، مع التركيز على تنفيذ رؤية 2030 والتقارب النقدي الخليجي.",
  },

  // ---------------------------------------------------------------------------
  // Editorial Team — Analyst 2: Amna Al-Hashimi
  // Covers: Culture articles
  // ---------------------------------------------------------------------------

  analyst2Name: { en: "Amna Al-Hashimi", ar: "آمنة الهاشمي" },
  analyst2Role: { en: "Director of Cultural Intelligence", ar: "مديرة الاستخبارات الثقافية" },
  analyst2Bio: {
    en: "Amna Al-Hashimi specialises in cultural transformation, gender policy, and soft-power dynamics across the GCC. Her analysis bridges heritage preservation and modernisation, offering nuanced perspectives on youth identity, creative economies, and the evolution of Gulf social norms.",
    ar: "تتخصص آمنة الهاشمي في التحول الثقافي وسياسات النوع الاجتماعي وديناميكيات القوة الناعمة في منطقة الخليج. يجمع تحليلها بين الحفاظ على التراث والتحديث، مع تقديم وجهات نظر دقيقة حول هوية الشباب والاقتصادات الإبداعية وتطور الأعراف الاجتماعية الخليجية.",
  },

  // ---------------------------------------------------------------------------
  // Editorial Team — Analyst 3: Marcus Thorne
  // Covers: Technology, Infrastructure articles
  // ---------------------------------------------------------------------------

  analyst3Name: { en: "Marcus Thorne", ar: "ماركوس ثورن" },
  analyst3Role: { en: "Head of Market Dynamics", ar: "رئيس ديناميكيات السوق" },
  analyst3Bio: {
    en: "Marcus Thorne covers technology adoption, infrastructure investment, and capital market dynamics across the Gulf. With a background in emerging-market research, he tracks the GCC's transition from hydrocarbon dependency to a diversified, knowledge-driven economic model.",
    ar: "يغطي ماركوس ثورن التكنولوجيا والاستثمار في البنية التحتية وديناميكيات أسواق رأس المال في منطقة الخليج. وبخلفيته في أبحاث الأسواق الناشئة، يرصد انتقال دول الخليج من الاعتماد على الهيدروكربونات نحو نموذج اقتصادي متنوع قائم على المعرفة.",
  },

  // ---------------------------------------------------------------------------
  // AI Editorial Disclosure — rendered as the first card on /transparency
  // ---------------------------------------------------------------------------

  /** Card title for the AI methodology disclosure section */
  aiEditorialDisclosure: { en: "AI-Assisted Editorial Process", ar: "العملية التحريرية بمساعدة الذكاء الاصطناعي" },

  /** Card body explaining the AI-assisted drafting methodology */
  aiEditorialDisclosureDesc: {
    en: "Arabia Khaleej articles are produced using AI-assisted drafting, powered by large language models, and then structured and published under the oversight of our named editorial team. Author attribution reflects the relevant desk lead responsible for each content category. We disclose this methodology in the interest of full transparency.",
    ar: "تُنتج مقالات عربية خليج باستخدام الصياغة بمساعدة الذكاء الاصطناعي عبر نماذج اللغة الكبيرة، ثم تُهيكل وتُنشر تحت إشراف فريق التحرير المُسمّى لدينا. يعكس ائتمان المؤلف المسؤول المعني بكل فئة محتوى. نُفصح عن هذه المنهجية في سبيل الشفافية الكاملة.",
  },
};
