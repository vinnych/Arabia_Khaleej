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
  // Editorial Team — Analyst 1: Zaid Al-Harbi
  // Covers: Fiscal, Geopolitics, Energy articles
  // ---------------------------------------------------------------------------

  analyst1Name: { en: "Zaid Al-Harbi", ar: "زيد الحربي" },
  analyst1Role: { en: "Senior Economic Analyst", ar: "كبير محللي الاقتصاد" },
  analyst1Bio: {
    en: "Based in Riyadh, Zaid specializes in GCC macro-economics and the fiscal transformations of Vision 2030. With over 15 years of experience in regional markets, he provides institutional-grade insights into sovereign wealth and energy policy.",
    ar: "مقيم في الرياض، يتخصص زيد في الاقتصاد الكلي لدول مجلس التعاون الخليجي والتحولات المالية لرؤية 2030. مع أكثر من 15 عاماً من الخبرة في الأسواق الإقليمية، يقدم رؤى مؤسسية حول الثروة السيادية وسياسة الطاقة.",
  },

  // ---------------------------------------------------------------------------
  // Editorial Team — Analyst 2: Layla Mansour
  // Covers: Tech, Innovation, Startups
  // ---------------------------------------------------------------------------

  analyst2Name: { en: "Layla Mansour", ar: "ليلى منصور" },
  analyst2Role: { en: "Innovation & Tech Lead", ar: "رئيسة الابتكار والتكنولوجيا" },
  analyst2Bio: {
    en: "Layla is a Dubai-based researcher focusing on the intersection of AI, fintech, and the regional startup ecosystem. She tracks the digital acceleration across the UAE and Qatar, surfacing the trends shaping the future of the Khaleej.",
    ar: "ليلى باحثة مقيمة في دبي تركز على تقاطع الذكاء الاصطناعي والتكنولوجيا المالية والنظام البيئي للشركات الناشئة الإقليمية. تتابع التسارع الرقمي في الإمارات وقطر، وتبرز الاتجاهات التي تشكل مستقبل الخليج.",
  },

  // ---------------------------------------------------------------------------
  // Editorial Team — Analyst 3: Omar Qabbani
  // Covers: Policy, Infrastructure, Regional Integration
  // ---------------------------------------------------------------------------

  analyst3Name: { en: "Omar Qabbani", ar: "عمر قباني" },
  analyst3Role: { en: "Regional Policy Analyst", ar: "محلل السياسات الإقليمية" },
  analyst3Bio: {
    en: "Based in Doha, Omar provides deep-dive analysis on GCC inter-state policy, logistics, and infrastructure development. His work focuses on the strategic connectivity and legislative frameworks driving regional integration.",
    ar: "مقيم في الدوحة، يقدم عمر تحليلاً معمقاً لسياسة دول مجلس التعاون الخليجي والخدمات اللوجستية وتطوير البنية التحتية. يركز عمله على الاتصال الاستراتيجي والأطر التشريعية التي تدفع التكامل الإقليمي.",
  },

  // ---------------------------------------------------------------------------
  // AI Editorial Disclosure — rendered as the first card on /transparency
  // ---------------------------------------------------------------------------

  /** Card title for the AI methodology disclosure section */
  aiEditorialDisclosure: { en: "Augmented Editorial Intelligence", ar: "الذكاء التحريري المعزز" },

  /** Card body explaining the AI-assisted drafting methodology */
  aiEditorialDisclosureDesc: {
    en: "Arabia Khaleej employs an augmented editorial model where large language models are utilized for high-velocity data synthesis and preliminary drafting. Every output is meticulously structured, verified, and published under the rigorous oversight of our regional editorial desk. This methodology ensures institutional-grade insights with real-time grounding in GCC market dynamics.",
    ar: "تعتمد عربية خليج نموذجاً تحريرياً معززاً حيث يتم استخدام نماذج اللغة الكبيرة للتوليف السريع للبيانات والصياغة الأولية. يتم هيكلة كل مخرج والتحقق منه ونشره بدقة تحت إشراف صارم من مكتب التحرير الإقليمي لدينا. تضمن هذه المنهجية رؤى مؤسسية مع ترسيخ في الوقت الفعلي لديناميكيات السوق الخليجية.",
  },
};
