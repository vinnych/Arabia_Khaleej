import { Translations } from "../i18n-data";

export const legal: Translations = {
  privacyDesc: { 
    en: "We built Arabia Khaleej to be read, not to harvest. Your privacy is not a feature — it is a default.", 
    ar: "لقد بنينا عربية خليج لتُقرأ، لا لتُحصد. خصوصيتك ليست ميزة - إنها وضع افتراضي." 
  },
  privacyDisclaimer: { 
    en: "We use advertising cookies to provide relevant content while maintaining your anonymity. We partner with Google AdSense, Pexels, and Unsplash for content and advertising.", 
    ar: "نحن نستخدم كوكيز الإعلانات لتقديم محتوى ذو صلة مع الحفاظ على سرية هويتك. نحن نتعاون مع Google AdSense وPexels وUnsplash للمحتوى والإعلانات." 
  },
  disclaimerWarning: { 
    en: "Arabia Khaleej is a professional independent regional reference — not a government portal, law firm, or advisory service.", 
    ar: "عربية خليج هي منصة استخبارات إقليمية مستقلة احترافية - وليست بوابة حكومية أو مكتب محاماة أو خدمة استشارية." 
  },
  transparencyNotice: { en: "Transparency & Ethical Content Notice", ar: "إشعار الشفافية والمحتوى الأخلاقي" },
  transparencyBody: { 
    en: "Arabia Khaleej is a professional regional intelligence reference. We aggregate, simplify, and surface authoritative information from official sources.", 
    ar: "عربية خليج هي مرجع استخبارات إقليمي احترافي. نحن نجمع ونبسط ونظهر المعلومات الموثوقة من المصادر الرسمية." 
  },
  regCompliance: { en: "Regulatory Compliance", ar: "الامتثال التنظيمي" },
  globalStandards: { en: "Global Standards", ar: "المعايير العالمية" },
  
  // Sections
  ppSection1Title: { en: "Information Collection", ar: "جمع المعلومات" },
  ppSection1Body: { 
    en: "We collect anonymous usage data through standard web analytics. We do not collect personally identifiable information (PII). We use transient Redis caching with aggressive TTLs for performance optimization.",
    ar: "نجمع بيانات الاستخدام المجهولة عبر التحليلات الويب القياسية. نحن لا نجمع معلومات يمكن التعرف عليها شخصياً (PII). نحن نستخدم التخزين المؤقت Redis العابر مع فترات TTL مرهقة لتحسين الأداء."
  },
  ppSection2Title: { en: "Google AdSense & Cookies", ar: "Google AdSense وملفات تعريف الارتباط" },
  ppSection2Body: { 
    en: "We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to this and other websites. You may opt out through Google Ads Settings. We also use Pexels and Unsplash for imagery, which may set their own cookies.",
    ar: "نحن نستخدم Google AdSense لعرض الإعلانات. Google تستخدم ملفات تعريف الارتباط لعرض الإعلانات استناداً إلى زياراتك السابقة لهذا الموقع وغيره من المواقع. يمكنك إلغاء الاشتراك من خلال إعدادات إعلانات Google. نحن نستخدم أيضاً Pexels وUnsplash للصور، والتي قد تضع ملفات تعريف ارتباط خاصة بها."
  },
  ppSection3Title: { en: "Data Retention", ar: "الاحتفاظ بالبيانات" },
  ppSection3Body: { 
    en: "We retain data for no longer than necessary. Redis cache entries expire within 24-48 hours. Logs are retained for debugging purposes only and automatically purged.",
    ar: "نحتفظ بالبيانات لمدة لا تتجاوز الحاجة. إدخالات ذاكرة التخزين المؤقت تنتهي صلاحيتها خلال 24-48 ساعة. يتم الاحتفاظ بالسجلات لأغراض التصحيح فقط ويتم مسحها تلقائياً."
  },
  ppSection4Title: { en: "Third-Party Services", ar: "الخدمات الطرفية" },
  ppSection4Body: { 
    en: "We integrate with Upstash Redis for caching, Pexels/Unsplash for imagery, and Google services including AdSense and Analytics. Each service has its own privacy policy.",
    ar: "نحن نتكامل مع Upstash Redis للتخزين المؤقت، وPexels / Unsplash للصور، وخدمات Google بما في ذلك AdSense والتحليلات. لكل خدمة سياسة خصوصية خاصة بها."
  },
  ppSection5Title: { en: "Your Rights", ar: "حقوقك" },
  ppSection5Body: { 
    en: "You may opt out of personalized advertising through Google Ads Settings. You may also use ad-blocking software or browser privacy settings to control cookie placement.",
    ar: "يمكنك إلغاء الاشتراك في الإعلانات المخصصة من خلال إعدادات إعلانات Google. يمكنك أيضاً استخدام برنامج حظر الإعلانات أو إعدادات خصوصية المتصفح للتحكم في وضع ملفات تعريف الارتباط."
  },
ppSection6Title: { en: "Policy Changes", ar: "تغييرات السياسة" },
   ppSection6Body: { 
     en: "We may update this policy periodically. Changes are effective immediately upon posting to this page.",
     ar: "قد نقوم بتحديث هذه السياسة بشكل دوري. تصبح التغييرات سارية فور نشرها على هذه الصفحة."
   },
   // Editorial Standards
   editorialCredentials: { 
     en: "Our analysis combines AI research with human editorial oversight from regional experts with verifiable GCC economic and policy backgrounds.", 
     ar: "تجمع تحليلاتنا بين البحث المدعوم بالذكاء الاصطناعي والإشراف التحريري البشري من خبراء إقليميين ذوي خلفية اقتصادية وسياسية خليجية قابلة للتحقق."
   },
   editorialMethodology: { 
     en: "Articles are generated using real-time GCC news sources and economic data, then reviewed for accuracy and regional relevance before publication.", 
     ar: "تُنشأ المقالات باستخدام مصادر الأخبار الخليجية الفعلية وبيانات الاقتصاد، ثم تُراجع للدقة والصلاحية الإقليمية قبل النشر."
   },
};
