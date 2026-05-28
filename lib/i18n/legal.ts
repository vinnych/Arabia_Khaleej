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
  transparencyPageBody: { 
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

    // ─── Terms of Service & Disclaimer Translations ───────────────────────────
    // Why: These keys were previously missing from the modular translation schemas,
    // causing raw keys (e.g. 'tosSection1Title') to render on the legal pages.
    // Adding them in English and Arabic completes the bilingual platform layout.
    
    legal: { en: "Legal", ar: "قانوني" },
    termsConditions: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
    termsDesc: { en: "Plain-language terms for an honest platform. Read on — it is shorter than you expect.", ar: "شروط لغة مبسطة لمنصة صادقة. اقرأها - إنها أقصر مما تتوقع." },
    lastReviewed: { en: "Last Reviewed", ar: "آخر مراجعة" },

    // Terms of Service Clauses (1 to 8)
    // Why: We explicitly retain "financial advice" disclaimers in clause 2 because the platform 
    // tracks dynamic GCC currency conversion rates and fiscal stability indicators.
    tosSection1Title: { en: "Acceptance of Terms", ar: "القبول بالشروط" },
    tosSection1Body: { en: "By accessing or using Arabia Khaleej, you agree to be bound by these Terms. If you do not agree, please discontinue use immediately. Your continued use after any revision constitutes acceptance of the updated Terms.", ar: "من خلال الوصول إلى عربية خليج أو استخدامها، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق، يرجى التوقف عن الاستخدام على الفور. استمرار استخدامك بعد أي تعديل يشكل قبولاً للشروط المحدثة." },

    tosSection2Title: { en: "Informational Use Only", ar: "للاستخدام الإعلامي فقط" },
    tosSection2Body: { en: "All content published on Arabia Khaleej is provided for general informational purposes only. Nothing on this site constitutes legal, financial, immigration, or professional advice of any kind. Always verify information with the relevant official authority before acting on it.", ar: "يتم تقديم جميع المحتويات المنشورة على عربية خليج لأغراض إعلامية عامة فقط. لا شيء في هذا الموقع يشكل نصيحة قانونية أو مالية أو هجرة أو مهنية من أي نوع. تحقق دائماً من المعلومات مع السلطات الرسمية المختصة قبل اتخاذ أي إجراء بناءً عليها." },

    tosSection3Title: { en: "No Warranties", ar: "لا ضمانات" },
    tosSection3Body: { en: "Arabia Khaleej is provided on an \"as-is\" and \"as-available\" basis without any warranty, express or implied. We make no representations regarding the accuracy, completeness, or timeliness of any content.", ar: "يتم تقديم منصة عربية خليج على أساس \"كما هي\" و \"حسب توفرها\" دون أي ضمان، صريح أو ضمني. نحن لا نقدم أي تعهدات فيما يتعلق بدقة أو اكتمال أو توقيت أي محتوى." },

    tosSection4Title: { en: "Limitation of Liability", ar: "تحديد المسؤولية" },
    tosSection4Body: { en: "To the fullest extent permitted by applicable law, Arabia Khaleej and its maintainers shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or inability to use, this site or its content.", ar: "إلى أقصى حد يسمح به القانون المعمول به، لن تكون عربية خليج والقائمين عليها مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية تنشأ عن استخدامك للموقع أو عدم قدرتك على استخدامه أو محتواه." },

    tosSection5Title: { en: "Intellectual Property", ar: "الملكية الفكرية" },
    tosSection5Body: { en: "All original content, design, and code on Arabia Khaleej is the property of its respective creators. Reproduction or redistribution for commercial purposes without explicit written permission is prohibited.", ar: "جميع المحتويات الأصلية والتصميم والشيفرة البرمجية على عربية خليج هي ملك لمبدعيها المعنيين. يحظر إعادة إنتاجها أو إعادة توزيعها لأغراض تجارية دون إذن كتابي صريح." },

    tosSection6Title: { en: "Third-Party Links", ar: "روابط الطرف الثالث" },
    tosSection6Body: { en: "This site may link to external government portals, official databases, and third-party resources. We do not control those sites and accept no responsibility for their content, availability, or privacy practices.", ar: "قد يحتوي هذا الموقع على روابط لبوابات حكومية خارجية، وقواعد بيانات رسمية، وموارد لأطراف ثالثة. نحن لا نتحكم في تلك المواقع ولا نتحمل أي مسؤولية عن محتواها أو توفرها أو ممارسات الخصوصية الخاصة بها." },

    tosSection7Title: { en: "Governing Law", ar: "القانون الواجب التطبيق" },
    tosSection7Body: { en: "These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from use of the site shall be subject to the jurisdiction agreed upon by the parties involved.", ar: "تخضع هذه الشروط وتفسر وفقاً للقوانين المعمول بها. أي نزاعات تنشأ عن استخدام الموقع تخضع للاختصاص القضائي المتفق عليه من قبل الأطراف المعنية." },

    tosSection8Title: { en: "Changes to Terms", ar: "تغييرات على الشروط" },
    tosSection8Body: { en: "We reserve the right to revise these Terms at any time. Changes take effect immediately upon publication. It is your responsibility to review these Terms periodically.", ar: "نحتفظ بالحق في مراجعة هذه الشروط في أي وقت. تسري التغييرات فور نشرها. تقع على عاتقك مسؤولية مراجعة هذه الشروط بشكل دوري." },

    // Disclaimer Clauses (1 to 5)
    disclaimerTitle: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
    disclaimerDesc: { en: "Please read before relying on any information you find here. We are honest about what we are — and what we are not.", ar: "يرجى القراءة قبل الاعتماد على أي معلومات تجدها هنا. نحن صادقون بشأن ما نحن عليه - وما لسنا عليه." },
    importantNotice: { en: "Important Notice", ar: "تنبيه هام" },

    discSection1Title: { en: "Not an Official Source", ar: "ليس مصدراً رسمياً" },
    discSection1Body: { en: "Arabia Khaleej is an unofficial hobbyist project. It is not affiliated with, endorsed by, or sponsored by any government body, ministry, municipality, or official institution in the GCC or elsewhere.", ar: "منصة عربية خليج هي مشروع هواة غير رسمي. ولا تتبع أو تعتمد أو ترعاها أي جهة حكومية أو وزارة أو بلدية أو مؤسسة رسمية في دول مجلس التعاون الخليجي أو أي مكان آخر." },

    discSection2Title: { en: "Informational Purposes Only", ar: "لأغراض إعلامية فقط" },
    discSection2Body: { en: "All content is published for general guidance. It does not constitute legal, immigration, financial, medical, or professional advice. Regulations, fees, and procedures change; always confirm critical information directly with the relevant authority.", ar: "يتم نشر جميع المحتويات للإرشاد العام فقط. ولا يشكل ذلك نصيحة قانونية أو متعلقة بالهجرة أو مالية أو طبية أو مهنية. تتغير اللوائح والرسوم والإجراءات؛ قم دائماً بتأكيد المعلومات الحيوية مباشرة مع الجهة المختصة." },

    discSection3Title: { en: "Accuracy & Completeness", ar: "الدقة والاكتمال" },
    discSection3Body: { en: "While we make reasonable efforts to ensure content is accurate at the time of writing, we cannot guarantee that every detail remains current. Arabia Khaleej makes no representation or warranty, express or implied, regarding the accuracy, completeness, or fitness for a particular purpose of any information published here.", ar: "بينما نبذل جهوداً معقولة لضمان دقة المحتوى وقت الكتابة، لا يمكننا ضمان بقاء كل التفاصيل محدثة. لا تقدم عربية خليج أي تعهد أو ضمان، صريحاً أو ضمنياً، فيما يتعلق بدقة أو اكتمال أو ملاءمة أي معلومات منشورة هنا لغرض معين." },

    discSection4Title: { en: "No Liability", ar: "عدم المسؤولية" },
    discSection4Body: { en: "Arabia Khaleej and its contributors accept no liability for any loss, damage, inconvenience, or harm arising from reliance on information published on this site. Use of this site is entirely at your own risk.", ar: "لا تقبل عربية خليج والمساهمون فيها أي مسؤولية عن أي خسارة أو ضرر أو إزعاج أو أذى ينشأ عن الاعتماد على المعلومات المنشورة على هذا الموقع. استخدام هذا الموقع يكون بالكامل على مسؤوليتك الخاصة." },

    discSection5Title: { en: "Trademarks & References", ar: "العلامات التجارية والمراجع" },
    discSection5Body: { en: "Any trademarks, service marks, or government names referenced on this site remain the property of their respective owners. Their mention is purely for informational context and does not imply endorsement or affiliation.", ar: "تظل أي علامات تجارية أو علامات خدمة أو أسماء حكومية تتم الإشارة إليها في هذا الموقع ملكاً لأصحابها المعنيين. ذكرها هو لأغراض السياق الإعلامي البحت ولا يعني المصادقة عليها أو التبعية لها." },
};
