export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation & Branding
  siteName: { en: "Arabia Khaleej", ar: "عربية خليج" },
  siteTagline: { en: "The GCC Standard", ar: "المعيار الخليجي" },
  pressTerminal: { en: "Insights", ar: "رؤى" },
  officialUpdates: { en: "Official Editorials", ar: "افتتاحيات رسمية" },
  insightsDesc: { en: "Original editorial insights and deep dives", ar: "تحليلات ورؤى تحريرية أصلية" },
  siteSlogan: { en: "The definitive reference for a refined GCC experience.", ar: "المرجع النهائي لتجربة خليجية متميزة." },
  prayerTimes: { en: "Prayer Times", ar: "مواقيت الصلاة" },
  fajr: { en: "Fajr", ar: "الفجر" },
  sunrise: { en: "Sunrise", ar: "الشروق" },
  dhuhr: { en: "Dhuhr", ar: "الظهر" },
  asr: { en: "Asr", ar: "العصر" },
  maghrib: { en: "Maghrib", ar: "المغرب" },
  isha: { en: "Isha", ar: "العشاء" },
  scheduleFor: { en: "Prayer Schedule for", ar: "جدول الصلاة لـ" },
  active: { en: "Active", ar: "الآن" },
  calculationMethod: { en: "Calculation Method: Umm Al-Qura University, Makkah", ar: "طريقة الحساب: جامعة أم القرى، مكة المكرمة" },
  viewHijri: { en: "View Hijri Calendar", ar: "عرض التقويم الهجري" },
  marketSummary: { en: "Real-time GCC market data across major indices, commodities, and regional currencies.", ar: "بيانات السوق الخليجية الفورية عبر المؤشرات الرئيسية والسلع والعملات الإقليمية." },
  stockMarkets: { en: "Stock Markets", ar: "أسواق الأسهم" },
  marketsOpen: { en: "Markets Open", ar: "الأسواق مفتوحة" },
  marketsClosed: { en: "Markets Closed", ar: "الأسواق مغلقة" },
  gold: { en: "Gold", ar: "الذهب" },
  brentCrude: { en: "Brent Crude", ar: "خام برنت" },
  commodities: { en: "Commodities", ar: "السلع" },
  currencies: { en: "Currencies", ar: "العملات" },
  peggedStatus: { en: "GCC Currencies are pegged to the US Dollar", ar: "العملات الخليجية مرتبطة بالدولار الأمريكي" },
  marketInsights: { en: "Market Insights", ar: "رؤى السوق" },
  boutiqueEnquiry: { en: "Enquire", ar: "استفسار" },
  prayerDesc: { en: "Local & regional schedules", ar: "الجداول المحلية والإقليمية" },
  marketDesc: { en: "Stocks, Gold & GCC Currencies", ar: "الأسهم والذهب والعملات الخليجية" },
  boutiqueDesc: { en: "Direct channel for all inquiries", ar: "قناة مباشرة لجميع الاستفسارات" },
  countries: { en: "Countries", ar: "الدول" },

  // Short Nav (Mobile)
  navMarket: { en: "Market", ar: "السوق" },
  navInsights: { en: "Insights", ar: "رؤى" },
  navPrayer: { en: "Prayer", ar: "الصلاة" },
  navJoin: { en: "Join", ar: "انضم" },

  marketOverview: { en: "Market Overview", ar: "نظرة عامة على السوق" },
  marketSentiment: { en: "Market Sentiment", ar: "نبض السوق" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  gccFinanceCurrency: { en: "GCC Finance & Currency", ar: "المالية والعملات الخليجية" },
  updatedLabel: { en: "Last updated: %s", ar: "آخر تحديث: %s" },
  indicativeData: { en: "Indicative Data", ar: "بيانات استرشادية" },
  marketsLive: { en: "Live", ar: "مباشر" },
  closedSession: { en: "Closed", ar: "مغلق" },
  sentimentTitle: { en: "The regional landscape remains stable with positive indicators.", ar: "لا يزال المشهد الإقليمي مستقراً مع مؤشرات إيجابية." },
  sentimentDesc: { en: "Arabia Khaleej tracks real-time market sentiment across major GCC exchanges for executive precision.", ar: "عربية خليج تتتبع نبض السوق الفوري عبر البورصات الخليجية الرئيسية لدقة التنفيذيين." },
  passionProject: { en: "Designed with Passion for the GCC Community", ar: "صُمم بشغف للمجتمع الخليجي" },

  // Countries
  qatar: { en: "Qatar", ar: "قطر" },
  uae: { en: "United Arab Emirates", ar: "الإمارات" },
  saudiArabia: { en: "Saudi Arabia", ar: "السعودية" },
  kuwait: { en: "Kuwait", ar: "الكويت" },
  oman: { en: "Oman", ar: "عمان" },
  bahrain: { en: "Bahrain", ar: "البحرين" },
  doha: { en: "Doha", ar: "الدوحة" },
  dubai: { en: "Dubai", ar: "دبي" },
  riyadh: { en: "Riyadh", ar: "الرياض" },
  kuwaitCity: { en: "Kuwait City", ar: "مدينة الكويت" },
  muscat: { en: "Muscat", ar: "مسقط" },
  manama: { en: "Manama", ar: "المنامة" },

  // Country Guides
  regionalGuides: { en: "Regional Guides", ar: "أدلة إقليمية" },
  guideDesc: { en: "High-Fidelity Regional Intelligence", ar: "استخبارات إقليمية عالية الدقة" },
  population: { en: "Population", ar: "السكان" },
  capital: { en: "Capital", ar: "العاصمة" },
  currency: { en: "Currency", ar: "العملة" },
  language: { en: "Official Language", ar: "اللغة الرسمية" },
  economy: { en: "Economy", ar: "الاقتصاد" },
  vision: { en: "National Vision", ar: "الرؤية الوطنية" },
  
  saudiIntro: { 
    en: "The Kingdom of Saudi Arabia is the largest economy in the Middle East and the heart of the Islamic world. Under Vision 2030, the Kingdom is undergoing a historic transformation into a global investment powerhouse.", 
    ar: "المملكة العربية السعودية هي أكبر اقتصاد في الشرق الأوسط وقلب العالم الإسلامي. تحت رؤية 2030، تشهد المملكة تحولاً تاريخياً إلى قوة استثمارية عالمية." 
  },
  uaeIntro: { 
    en: "The United Arab Emirates is a global hub for innovation, trade, and tourism. Comprising seven emirates, it has established itself as a pioneer in technology, space exploration, and sustainable energy.", 
    ar: "دولة الإمارات العربية المتحدة هي مركز عالمي للابتكار والتجارة والسياحة. تضم سبع إمارات، وقد أثبتت نفسها كرائدة في التكنولوجيا واستكشاف الفضاء والطاقة المستدامة." 
  },
  qatarIntro: { 
    en: "Qatar is a high-income sovereign state, world-leading in LNG exports. Known for its sophisticated diplomacy and sports heritage, it continues to define modern luxury and cultural excellence.", 
    ar: "قطر هي دولة ذات سيادة عالية الدخل، ورائدة عالمياً في صادرات الغاز الطبيعي المسال. تشتهر بدبلوماسيتها المتطورة وتراثها الرياضي، وتستمر في تحديد الرفاهية الحديثة والتميز الثقافي." 
  },
  kuwaitIntro: { 
    en: "Kuwait maintains a unique position with its rich parliamentary history and significant oil reserves. It is a cornerstone of regional stability with a deeply rooted cultural identity.", 
    ar: "تحافظ الكويت على مكانة فريدة بفضل تاريخها البرلماني الغني واحتياطياتها النفطية الكبيرة. إنها حجر الزاوية في الاستقرار الإقليمي مع هوية ثقافية متجذرة." 
  },
  omanIntro: { 
    en: "Oman is a land of incredible natural beauty and deep-rooted traditions. Its strategic location at the mouth of the Persian Gulf has made it a vital maritime hub for centuries.", 
    ar: "عمان هي أرض الجمال الطبيعي المذهل والتقاليد المتجذرة. جعلها موقعها الاستراتيجي عند مدخل الخليج العربي مركزاً بحرياً حيوياً لقرون." 
  },
  bahrainIntro: { 
    en: "Bahrain is an island nation with a rich history of trade and pearling. It was the first GCC nation to discover oil and has since transformed into a major financial hub.", 
    ar: "البحرين هي دولة جزرية ذات تاريخ غني في التجارة والغوص بحثاً عن اللؤلؤ. كانت أول دولة خليجية تكتشف النفط وتحولت منذ ذلك الحين إلى مركز مالي رئيسي." 
  },

  // Country Stats values
  saudiPop: { en: "36.4 Million", ar: "36.4 مليون" },
  uaePop: { en: "9.9 Million", ar: "9.9 مليون" },
  qatarPop: { en: "2.9 Million", ar: "2.9 مليون" },
  kuwaitPop: { en: "4.3 Million", ar: "4.3 مليون" },
  omanPop: { en: "5.2 Million", ar: "5.2 مليون" },
  bahrainPop: { en: "1.5 Million", ar: "1.5 مليون" },

  saudiGdp: { en: "$1.1 Trillion (Nominal)", ar: "1.1 تريليون دولار (اسمي)" },
  uaeGdp: { en: "$507 Billion", ar: "507 مليار دولار" },
  qatarGdp: { en: "$237 Billion", ar: "237 مليار دولار" },
  kuwaitGdp: { en: "$184 Billion", ar: "184 مليار دولار" },
  omanGdp: { en: "$104 Billion", ar: "104 مليار دولار" },
  bahrainGdp: { en: "$44 Billion", ar: "44 مليار دولار" },

  saudiCurrencyName: { en: "Saudi Riyal (SAR)", ar: "ريال سعودي (SAR)" },
  uaeCurrencyName: { en: "UAE Dirham (AED)", ar: "درهم إماراتي (AED)" },
  qatarCurrencyName: { en: "Qatari Riyal (QAR)", ar: "ريال قطري (QAR)" },
  kuwaitCurrencyName: { en: "Kuwaiti Dinar (KWD)", ar: "دينار كويتي (KWD)" },
  omanCurrencyName: { en: "Omani Rial (OMR)", ar: "ريال عماني (OMR)" },
  bahrainCurrencyName: { en: "Bahraini Dinar (BHD)", ar: "دينار بحريني (BHD)" },

  // Dedicated Currency Names
  uaeDirham: { en: "UAE Dirham", ar: "درهم إماراتي" },
  saudiRiyal: { en: "Saudi Riyal", ar: "ريال سعودي" },
  qatariRiyal: { en: "Qatari Riyal", ar: "ريال قطري" },
  kuwaitiDinar: { en: "Kuwaiti Dinar", ar: "دينار كويتي" },
  omaniRial: { en: "Omani Rial", ar: "ريال عماني" },
  bahrainiDinar: { en: "Bahraini Dinar", ar: "دينار بحريني" },

  saudiVision: { en: "Vision 2030", ar: "رؤية 2030" },
  uaeVision: { en: "UAE Centennial 2071", ar: "مئوية الإمارات 2071" },
  qatarVision: { en: "National Vision 2030", ar: "الرؤية الوطنية 2030" },
  kuwaitVision: { en: "New Kuwait 2035", ar: "كويت جديدة 2035" },
  omanVision: { en: "Oman 2040", ar: "عمان 2040" },
  bahrainVision: { en: "Economic Vision 2030", ar: "الرؤية الاقتصادية 2030" },

  // Metadata & SEO
  marketUpdate: { en: "Market Update", ar: "تحديث السوق" },
  todayMarket: { en: "Today's Market Highlights", ar: "أبرز أحداث السوق اليوم" },
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About", ar: "حول" },
  contact: { en: "Contact", ar: "اتصل بنا" },
  privacy: { en: "Privacy", ar: "الخصوصية" },
  terms: { en: "Terms", ar: "الشروط" },
  disclaimer: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
  transparencyNotice: { en: "Transparency & Ethical Content Notice", ar: "إشعار الشفافية والمحتوى الأخلاقي" },
  transparencyBody: { 
    en: "Arabia Khaleej is a regional reference project. We aggregate, simplify, and surface authoritative information from official sources across the GCC to provide high-fidelity insights.", 
    ar: "عربية خليج هو مشروع مرجعي إقليمي. نحن نجمع ونبسط ونظهر المعلومات الموثوقة من المصادر الرسمية عبر دول مجلس التعاون الخليجي لتوفير رؤى عالية الدقة." 
  },

  // Country Detail Titles
  econPower: { en: "Economic Powerhouse", ar: "القوة الاقتصادية" },
  globalLead: { en: "Global Leadership", ar: "القيادة العالمية" },
  megaProj: { en: "Mega Projects", ar: "المشاريع العملاقة" },
  innovationHub: { en: "Innovation Hub", ar: "مركز الابتكار" },
  spaceTech: { en: "Space & Tech", ar: "الفضاء والتكنولوجيا" },
  culturalDiv: { en: "Cultural Diversity", ar: "التنوع الثقافي" },
  energyGiant: { en: "Energy Giant", ar: "عملاق الطاقة" },
  diplomaticHub: { en: "Diplomatic Hub", ar: "المركز الدبلوماسي" },
  sportsExcellence: { en: "Sports Excellence", ar: "التميز الرياضي" },
  finHeritage: { en: "Financial Heritage", ar: "التراث المالي" },
  parlTradition: { en: "Parliamentary Tradition", ar: "التقليد البرلماني" },
  culturalHeart: { en: "Cultural Heart", ar: "القلب الثقافي" },
  naturalMajesty: { en: "Natural Majesty", ar: "العظمة الطبيعية" },
  strategicNeutrality: { en: "Strategic Neutrality", ar: "الحياد الاستراتيجي" },
  maritimeLegacy: { en: "Maritime Legacy", ar: "الإرث البحري" },
  finInnovation: { en: "Financial Innovation", ar: "الابتكار المالي" },
  ancientHistory: { en: "Ancient History", ar: "التاريخ القديم" },
  motorsportsHub: { en: "Motorsports Hub", ar: "مركز رياضة المحركات" },
  flagOf: { en: "Flag of %s", ar: "علم %s" },
  regCompliance: { en: "Regulatory Compliance", ar: "الامتثال التنظيمي" },
  regComplianceDesc: { 
    en: "We adhere to all local digital regulations and ensure that our platform serves as a positive contributor to the regional digital ecosystem.", 
    ar: "نحن نلتزم بجميع اللوائح الرقمية المحلية ونضمن أن منصتنا تعمل كمسهم إيجابي في المنظومة الرقمية الإقليمية." 
  },
  globalStandards: { en: "Global Standards", ar: "المعايير العالمية" },
  globalStandardsDesc: { 
    en: "Our data practices follow international best practices for information accuracy and source attribution.", 
    ar: "تتبع ممارسات البيانات لدينا أفضل الممارسات الدولية لدقة المعلومات وإسناد المصادر." 
  },
  regInquiry: { en: "Regulatory Inquiry", ar: "الاستفسار التنظيمي" },
  regInquiryDesc: { 
    en: "We welcome dialogue with regional regulatory bodies. For official inquiries, please use our primary communication channel.", 
    ar: "نرحب بالحوار مع الهيئات التنظيمية الإقليمية. للاستفسارات الرسمية، يرجى استخدام قناة الاتصال الرئيسية لدينا." 
  },
  active: { en: "Active", ar: "نشط" },
  calculationMethod: { 
    en: "Calculation Method: Umm Al-Qura University, Makkah", 
    ar: "طريقة الحساب: جامعة أم القرى، مكة المكرمة" 
  },


  // Common UI
  processing: { en: "Processing", ar: "جاري المعالجة" },
  refresh: { en: "Refresh", ar: "تحديث" },
  loadMore: { en: "Load More", ar: "تحميل المزيد" },
  premium: { en: "Premium", ar: "مميز" },
  somethingWentWrong: { en: "Something went wrong", ar: "حدث خطأ ما" },
  retryConnection: { en: "Retry Connection", ar: "إعادة الاتصال" },
  back: { en: "Back", ar: "رجوع" },
  backHome: { en: "Back to Home", ar: "العودة للرئيسية" },
  submit: { en: "Submit", ar: "إرسال" },
  yourLocation: { en: "Your Location", ar: "موقعك" },
  scheduleFor: { en: "Schedule for", ar: "جدول" },
  viewHijri: { en: "View Hijri Calendar", ar: "عرض التقويم الهجري" },

  // Forms & Contact
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  emailAddress: { en: "Email Address", ar: "البريد الإلكتروني" },
  message: { en: "Message", ar: "الرسالة" },
  messagePlaceholder: { en: "Tell us how we can help...", ar: "أخبرنا كيف يمكننا مساعدتك..." },
  sendMessage: { en: "Send Message", ar: "إرسال الرسالة" },
  thankYou: { en: "Thank You", ar: "شكراً لك" },
  submissionReceived: { en: "Your message has been received. Our regional team will be in touch shortly.", ar: "تم استلام رسالتك. سيتواصل معك فريقنا الإقليمي قريباً." },

  // Privacy Page
  privacyDesc: { 
    en: "We built Arabia Khaleej to be read, not to harvest. Your privacy is not a feature — it is a default.", 
    ar: "لقد بنينا عربية خليج لتُقرأ، لا لتُحصد. خصوصيتك ليست ميزة - إنها وضع افتراضي." 
  },
  privacyDisclaimer: { 
    en: "We use advertising cookies to provide relevant content while maintaining your anonymity.", 
    ar: "نحن نستخدم كوكيز الإعلانات لتقديم محتوى ذو صلة مع الحفاظ على سرية هويتك." 
  },
  termsDesc: { 
    en: "Plain-language terms for an honest platform. Read on — it is shorter than you expect.", 
    ar: "شروط لغة مبسطة لمنصة صادقة. اقرأها - إنها أقصر مما تتوقع." 
  },
  disclaimerDesc: { 
    en: "Please read before relying on any information you find here. We are honest about what we are — and what we are not.", 
    ar: "يرجى القراءة قبل الاعتماد على أي معلومات تجدها هنا. نحن صادقون بشأن ما نحن عليه - وما لسنا عليه." 
  },
  importantNotice: { en: "Important Notice", ar: "تنبيه هام" },
  disclaimerWarning: { 
    en: "Arabia Khaleej is a professional independent regional reference — not a government portal, law firm, or advisory service. All information is provided 'as-is' for guidance only. Verify everything with official sources before taking action.", 
    ar: "عربية خليج هي منصة استخبارات إقليمية مستقلة احترافية - وليست بوابة حكومية أو مكتب محاماة أو خدمة استشارية. يتم توفير جميع المعلومات 'كما هي' للإرشاد فقط. تحقق من كل شيء من المصادر الرسمية قبل اتخاذ أي إجراء." 
  },

  // Privacy Policy Detailed Sections
  ppSection1Title: { en: "Information Collection", ar: "جمع المعلومات" },
  ppSection1Body: { 
    en: "We collect minimal information required to provide our services. This includes device information, browser type, and interaction data to optimize the regional experience for our users.", 
    ar: "نحن نجمع الحد الأدنى من المعلومات المطلوبة لتقديم خدماتنا. يتضمن ذلك معلومات الجهاز ونوع المتصفح وبيانات التفاعل لتحسين التجربة الإقليمية لمستخدمينا." 
  },
  ppSection2Title: { en: "Google AdSense & Cookies", ar: "Google AdSense وملفات تعريف الارتباط" },
  ppSection2Body: { 
    en: "Arabia Khaleej uses Google AdSense to serve advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Ads Settings.", 
    ar: "تستخدم عربية خليج Google AdSense لتقديم الإعلانات. يستخدم Google ملفات تعريف الارتباط لتقديم الإعلانات بناءً على زياراتك السابقة لموقعنا أو مواقع الويب الأخرى. يمكنك اختيار عدم تلقي الإعلانات الشخصية من خلال زيارة إعدادات الإعلانات." 
  },
  ppSection3Title: { en: "Regional Data Sovereignty", ar: "سيادة البيانات الإقليمية" },
  ppSection3Body: { 
    en: "We respect the data protection regulations of all GCC member states. Your data is handled with the highest level of security and in compliance with regional digital governance standards.", 
    ar: "نحن نحترم لوائح حماية البيانات لجميع الدول الأعضاء في مجلس التعاون الخليجي. يتم التعامل مع بياناتك بأعلى مستوى من الأمان ووفقاً لمعايير الحوكمة الرقمية الإقليمية." 
  },
  ppSection4Title: { en: "Third-Party Analytics", ar: "تحليلات الطرف الثالث" },
  ppSection4Body: { 
    en: "We use Google Analytics to understand traffic patterns and improve content relevance. These tools collect anonymous data such as page views and session duration.", 
    ar: "نحن نستخدم Google Analytics لفهم أنماط الحركة وتحسين ملاءمة المحتوى. تجمع هذه الأدوات بيانات مجهولة الهوية مثل مشاهدات الصفحة ومدة الجلسة." 
  },
  ppSection6Title: { en: "Your Rights", ar: "حقوقك" },
  ppSection6Body: { 
    en: "You have the right to access, correct, or request the deletion of any personal information you have shared with us through our contact forms or join requests.", 
    ar: "لديك الحق في الوصول إلى أي معلومات شخصية شاركتها معنا من خلال نماذج الاتصال أو طلبات الانضمام، أو تصحيحها أو طلب حذفها." 
  },

  // About Page
  aboutDesc: { 
    en: "Arabia Khaleej is the definitive independent reference for a refined GCC experience. We aggregate, simplify, and surface authoritative regional information.", 
    ar: "عربية خليج هي المرجع المستقل النهائي لتجربة خليجية متميزة. نحن نجمع ونبسط ونظهر المعلومات الإقليمية الموثوقة." 
  },
  mission: { en: "Our Mission", ar: "مهمتنا" },
  missionDesc: { 
    en: "To provide residents and visitors with a high-fidelity portal that captures the essence of modern Gulf life—from spiritual schedules to economic intelligence.", 
    ar: "لتزويد المقيمين والزوار ببوابة عالية الدقة تلتقط جوهر الحياة الخليجية الحديثة - من الجداول الروحية إلى الاستخبارات الاقتصادية." 
  },
  pillars: { en: "Our Pillars", ar: "ركائزنا" },
  independence: { en: "Independence", ar: "الاستقلالية" },
  independenceDesc: { en: "Editorial freedom to ensure accuracy and relevance.", ar: "حرية تحريرية لضمان الدقة والملاءمة." },
  simplicity: { en: "Simplicity", ar: "البساطة" },
  simplicityDesc: { en: "Premium design that removes noise and surfaces value.", ar: "تصميم متميز يزيل الضوضاء ويظهر القيمة." },
  transparency: { en: "Transparency", ar: "الشفافية" },
  transparencyDesc: { en: "Clear attribution and ethical content guidelines.", ar: "إسناد واضح وإرشادات محتوى أخلاقية." },
  passionProject: { en: "A regional intelligence project dedicated to the GCC.", ar: "مشروع استخبارات إقليمي مخصص لدول مجلس التعاون الخليجي." },

  // Legal
  legal: { en: "Legal", ar: "قانوني" },
  contactTitle: { en: "Get in Touch", ar: "تواصل معنا" },
  contactDesc: { en: "Our regional intelligence team is available for press enquiries, partnership proposals, and feedback.", ar: "فريق الاستخبارات الإقليمي لدينا متاح لاستفسارات الصحافة ومقترحات الشراكة والملاحظات." },
  privacyTitle: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  termsTitle: { en: "Terms of Service", ar: "شروط الخدمة" },
  disclaimerTitle: { en: "Legal Disclaimer", ar: "إخلاء المسؤولية القانونية" },
  lastUpdated: { en: "Last Updated", ar: "آخر تحديث" },

  // Disclaimer Details
  discSection1Title: { en: "No Professional Advice", ar: "لا توجد نصيحة مهنية" },
  discSection1Body: { 
    en: "The information provided on Arabia Khaleej is for general informational purposes only. All information is provided in good faith, however we make no representation or warranty of any kind.", 
    ar: "المعلومات المقدمة في عربية خليج هي لأغراض معلوماتية عامة فقط. يتم تقديم جميع المعلومات بحسن نية، ومع ذلك لا نقدم أي تمثيل أو ضمان من أي نوع." 
  },
  discSection2Title: { en: "External Links", ar: "روابط خارجية" },
  discSection2Body: { 
    en: "This site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy.", 
    ar: "قد يحتوي هذا الموقع على روابط لمواقع أخرى أو محتوى ينتمي إلى أو ينشأ من أطراف ثالثة. لا يتم التحقيق في هذه الروابط الخارجية أو مراقبتها أو التحقق من دقتها." 
  },
  discSection3Title: { en: "Market Data", ar: "بيانات السوق" },
  discSection3Body: { 
    en: "Financial market data, including stock indices, gold prices, and exchange rates, are provided for reference only. Arabia Khaleej is not a financial advisor. Always consult with a professional before making investment decisions.", 
    ar: "يتم توفير بيانات السوق المالية، بما في ذلك مؤشرات الأسهم وأسعار الذهب وأسعار الصرف، كمرجع فقط. عربية خليج ليست مستشاراً مالياً. استشر دائماً متخصصاً قبل اتخاذ قرارات الاستثمار." 
  },
  discSection5Title: { en: "Trademarks", ar: "العلامات التجارية" },
  discSection5Body: { 
    en: "Any trademarks, service marks, or government names referenced on this site remain the property of their respective owners. Their mention is purely for informational context and does not imply endorsement or affiliation.",
    ar: "أي علامات تجارية أو علامات خدمة أو أسماء حكومية مشار إليها في هذا الموقع تظل ملكاً لأصحابها المعنيين. إن ذكرها هو فقط للسياق المعلوماتي ولا يعني التأييد أو الانتساب."
  },

  // Engagement
  engagement: { en: "Engagement", ar: "المشاركة" },
  publicSentiment: { en: "Public Sentiment", ar: "استطلاع الرأي العام" },
  voteRecorded: { en: "Vote Recorded", ar: "تم التصويت" },
  globalParticipants: { en: "Global Participants", ar: "مشارك" },
  realTimeIntelligence: { en: "Real-time Intelligence", ar: "تحليلات في الوقت الفعلي" },

  // FAQs - Home
  faqWhatIsTitle: { en: "What is Arabia Khaleej?", ar: "ما هي عربية خليج؟" },
  faqWhatIsBody: { 
    en: "Arabia Khaleej is an independent regional intelligence platform for the Gulf Cooperation Council (GCC). It provides accurate Islamic prayer times, live GCC market data (stocks, gold, currencies), and in-depth country guides for Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain.", 
    ar: "عربية خليج هي منصة استخبارات إقليمية مستقلة لدول مجلس التعاون الخليجي. توفر مواقيت صلاة إسلامية دقيقة، وبيانات سوق حية (أسهم، ذهب، عملات)، وأدلة دول متعمقة لقطر والإمارات والسعودية والكويت وعمان والبحرين." 
  },
  faqCountriesTitle: { en: "Which countries does Arabia Khaleej cover?", ar: "ما هي الدول التي تغطيها عربية خليج؟" },
  faqCountriesBody: { 
    en: "Arabia Khaleej covers all six GCC member states: Qatar, United Arab Emirates, Saudi Arabia, Kuwait, Sultanate of Oman, and Kingdom of Bahrain.", 
    ar: "تغطي عربية خليج جميع الدول الست الأعضاء في مجلس التعاون الخليجي: قطر، الإمارات العربية المتحدة، المملكة العربية السعودية، الكويت، سلطنة عمان، ومملكة البحرين." 
  },
  faqPrayerTitle: { en: "Does Arabia Khaleej have prayer times?", ar: "هل توفر عربية خليج مواقيت الصلاة؟" },
  faqPrayerBody: { 
    en: "Yes. Arabia Khaleej provides daily Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha prayer times for Doha, Dubai, Riyadh, Kuwait City, Muscat, and Manama — calculated using the Umm Al-Qura University method.", 
    ar: "نعم. توفر عربية خليج مواقيت الصلاة اليومية (الفجر، الشروق، الظهر، العصر، المغرب، العشاء) للدوحة ودبي والرياض ومدينة الكويت ومسقط والمنامة - محسوبة بطريقة جامعة أم القرى." 
  },
  faqBilingualTitle: { en: "Does Arabia Khaleej support Arabic?", ar: "هل تدعم عربية خليج اللغة العربية؟" },
  faqBilingualBody: { 
    en: "Yes. Arabia Khaleej is fully bilingual in English and Arabic, with RTL (right-to-left) layout support, Arabic typography (Amiri font), and bilingual metadata for all GCC Arabic locales.", 
    ar: "نعم. عربية خليج ثنائية اللغة تماماً بالإنجليزية والعربية، مع دعم تخطيط RTL (من اليمين إلى اليسار)، وخطوط عربية (خط أميري)، وبيانات وصفية ثنائية اللغة لجميع المناطق العربية في دول مجلس التعاون الخليجي." 
  },
  faqMarketTitle: { en: "What GCC market data does Arabia Khaleej provide?", ar: "ما هي بيانات السوق الخليجية التي توفرها عربية خليج؟" },
  faqMarketBody: { 
    en: "Arabia Khaleej provides live data for major GCC stock indices (Tadawul/TASI, ADX, DFM, QE Index, Boursa Kuwait), gold spot price (XAU/USD), Brent crude oil, and all six GCC currency exchange rates versus the US Dollar.", 
    ar: "توفر عربية خليج بيانات حية لمؤشرات الأسهم الخليجية الرئيسية (تداول، سوق أبوظبي، سوق دبي، مؤشر بورصة قطر، بورصة الكويت)، وسعر الذهب (XAU/USD)، وخام برنت، وأسعار صرف العملات الخليجية الست مقابل الدولار الأمريكي." 
  },

  // FAQs - Prayer
  faqPrayerCalcTitle: { en: "How are prayer times calculated?", ar: "كيف يتم حساب مواقيت الصلاة؟" },
  faqPrayerCalcBody: { 
    en: "Prayer times are calculated using the Umm Al-Qura University (Makkah) method, the official standard for Saudi Arabia and widely used across the GCC. A local engine is used as a failover.", 
    ar: "يتم حساب مواقيت الصلاة باستخدام طريقة جامعة أم القرى (مكة المكرمة)، وهي المعيار الرسمي للمملكة العربية السعودية وتستخدم على نطاق واسع في دول الخليج. يتم استخدام محرك محلي كاحتياطي." 
  },
  faqPrayerCitiesTitle: { en: "Which GCC cities are covered?", ar: "ما هي المدن الخليجية المشمولة؟" },
  faqPrayerCitiesBody: { 
    en: "Arabia Khaleej provides prayer times for Doha (Qatar), Dubai and Abu Dhabi (UAE), Riyadh (Saudi Arabia), Kuwait City (Kuwait), Muscat (Oman), and Manama (Bahrain).", 
    ar: "توفر عربية خليج مواقيت الصلاة للدوحة (قطر)، دبي وأبو ظبي (الإمارات)، الرياض (السعودية)، مدينة الكويت (الكويت)، مسقط (عمان)، والمنامة (البحرين)." 
  },
  faqPrayerListTitle: { en: "What prayers are listed?", ar: "ما هي الصلوات المدرجة؟" },
  faqPrayerListBody: { 
    en: "The five daily prayers plus Sunrise are listed: Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha.", 
    ar: "يتم إدراج الصلوات الخمس اليومية بالإضافة إلى الشروق: الفجر، الشروق، الظهر، العصر، المغرب، العشاء." 
  },
  faqPrayerHijriTitle: { en: "Does it show the Hijri calendar?", ar: "هل يعرض التقويم الهجري؟" },
  faqPrayerHijriBody: { 
    en: "Yes. A full 7-day Hijri (Islamic) calendar is available for each city, showing the corresponding Hijri dates alongside Gregorian dates.", 
    ar: "نعم. يتوفر تقويم هجري (إسلامي) كامل لمدة 7 أيام لكل مدينة، يعرض التواريخ الهجرية المقابلة للتواريخ الميلادية." 
  },
  faqPrayerUpdateTitle: { en: "How often are times updated?", ar: "كم مرة يتم تحديث الأوقات؟" },
  faqPrayerUpdateBody: { 
    en: "Prayer times are refreshed every 60 seconds. The next upcoming prayer is highlighted in real time.", 
    ar: "يتم تحديث مواقيت الصلاة كل 60 ثانية. يتم تمييز الصلاة القادمة في الوقت الفعلي." 
  },

  // Country Detail Content
  saudiEconContent: { 
    en: "As the largest economy in the GCC and a G20 member, Saudi Arabia is the regional anchor for trade and investment. The nation is currently executing 'Vision 2030', a strategic framework to reduce dependence on oil and develop public service sectors such as health, education, infrastructure, recreation, and tourism.", 
    ar: "باعتبارها أكبر اقتصاد في مجلس التعاون الخليجي وعضو في مجموعة العشرين، تعد المملكة العربية السعودية الركيزة الإقليمية للتجارة والاستثمار. تنفذ الدولة حالياً 'رؤية 2030'، وهي إطار استراتيجي لتقليل الاعتماد على النفط وتطوير قطاعات الخدمات العامة مثل الصحة والتعليم والبنية التحتية والترفيه والسياحة." 
  },
  saudiGlobalContent: { 
    en: "Saudi Arabia holds a unique position as the birthplace of Islam and the custodian of the Two Holy Mosques in Makkah and Madinah. This spiritual significance, combined with its energy leadership, makes it a pivotal global actor.", 
    ar: "تحتل المملكة العربية السعودية مكانة فريدة كمهد للإسلام وخادم الحرمين الشريفين في مكة المكرمة والمدينة المنورة. هذه الأهمية الروحية، إلى جانب قيادتها في مجال الطاقة، تجعلها لاعباً عالمياً محورياً." 
  },
  saudiMegaContent: { 
    en: "The Kingdom is home to some of the world's most ambitious urban developments, including NEOM—a $500 billion futuristic city—The Red Sea Project, and Qiddiya, which are set to redefine global tourism and sustainable living.", 
    ar: "تعد المملكة موطناً لبعض أكثر التطورات الحضرية طموحاً في العالم، بما في ذلك نيوم - وهي مدينة مستقبلية بقيمة 500 مليار دولار - ومشروع البحر الأحمر، والقدية، والتي من المقرر أن تعيد تعريف السياحة العالمية والحياة المستدامة." 
  },
  uaeInnovationContent: { 
    en: "The UAE is a federation of seven emirates that has become a global leader in logistics, aviation, and financial services. Cities like Dubai and Abu Dhabi are synonymous with world-class infrastructure and architectural marvels like the Burj Khalifa.", 
    ar: "دولة الإمارات العربية المتحدة هي اتحاد من سبع إمارات أصبحت رائدة عالمياً في الخدمات اللوجستية والطيران والخدمات المالية. مدن مثل دبي وأبو ظبي مرادفة للبنية التحتية العالمية والعجائب المعمارية مثل برج خليفة." 
  },
  uaeSpaceContent: { 
    en: "The UAE has made significant strides in space exploration with the Hope Probe reaching Mars and its successful astronaut missions. It is also a leader in AI, being the first country to appoint a Minister for Artificial Intelligence.", 
    ar: "خطت دولة الإمارات خطوات كبيرة في استكشاف الفضاء مع وصول مسبار الأمل إلى المريخ وبعثاتها الناجحة لرواد الفضاء. كما أنها رائدة في مجال الذكاء الاصطناعي، حيث كانت أول دولة تعين وزيراً للذكاء الاصطناعي." 
  },
  uaeCultureContent: { 
    en: "With over 200 nationalities living and working in harmony, the UAE is a model of tolerance and coexistence. The Louvre Abu Dhabi and Museum of the Future showcase its commitment to cultural and intellectual enrichment.", 
    ar: "مع وجود أكثر من 200 جنسية تعيش وتعمل في وئام، تعد دولة الإمارات نموذجاً للتسامح والتعايش. يعرض متحف اللوفر أبوظبي ومتحف المستقبل التزامها بالإثراء الثقافي والفكري." 
  },
  qatarEnergyContent: { 
    en: "Qatar is one of the world's leading exporters of Liquefied Natural Gas (LNG). Its immense energy wealth has been channeled into world-class infrastructure, education, and healthcare systems.", 
    ar: "تعد قطر واحدة من الشركات الرائدة في العالم في تصدير الغاز الطبيعي المسال. تم توجيه ثروتها الهائلة من الطاقة إلى أنظمة البنية التحتية والتعليم والرعاية الصحية العالمية." 
  },
  qatarDiplomaticContent: { 
    en: "Known for its sophisticated diplomacy, Qatar often serves as a mediator in international conflicts. It is also home to Al Jazeera Media Network, which has significantly influenced the global media landscape.", 
    ar: "تشتهر قطر بدبلوماسيتها المتطورة، وغالباً ما تعمل كوسيط في النزاعات الدولية. كما أنها موطن لشبكة الجزيرة الإعلامية، التي أثرت بشكل كبير على المشهد الإعلامي العالمي." 
  },
  qatarSportsContent: { 
    en: "After successfully hosting the FIFA World Cup 2022—the first in the Arab world—Qatar has established itself as a premier global destination for major sporting events and high-performance training.", 
    ar: "بعد استضافتها الناجحة لكأس العالم فيفا 2022 - الأول في العالم العربي - أثبتت قطر نفسها كوجهة عالمية رائدة للأحداث الرياضية الكبرى والتدريب عالي الأداء." 
  },
  kuwaitFinContent: { 
    en: "Kuwait has a long-standing tradition of maritime trade and was a financial pioneer in the region. The Kuwait Investment Authority is one of the world's oldest and largest sovereign wealth funds.", 
    ar: "تتمتع الكويت بتقاليد عريقة في التجارة البحرية وكانت رائدة مالية في المنطقة. تعد الهيئة العامة للاستثمار في الكويت واحدة من أقدم وأكبر صناديق الثروة السيادية في العالم." 
  },
  kuwaitParlContent: { 
    en: "Kuwait is distinguished by its vibrant parliamentary system and active political life, which is unique in the GCC. This tradition fosters a robust public discourse and civic engagement.", 
    ar: "تتميز الكويت بنظامها البرلماني الحيوي وحياتها السياسية النشطة، وهي فريدة من نوعها في مجلس التعاون الخليجي. يعزز هذا التقليد خطاباً عاماً قوياً ومشاركة مدنية." 
  },
  kuwaitCultureContent: { 
    en: "Historically known as a center for arts and literature, Kuwait continues to invest in its cultural landscape through the Sheikh Jaber Al-Ahmad Cultural Centre and other major initiatives.", 
    ar: "عُرفت الكويت تاريخياً كمركز للفنون والأدب، وتستمر في الاستثمار في مشهدها الثقافي من خلال مركز الشيخ جابر الأحمد الثقافي والمبادرات الرئيسية الأخرى." 
  },
  omanNaturalContent: { 
    en: "Oman is celebrated for its diverse geography, from the rugged Al Hajar Mountains to the lush greenery of Salalah during the Khareef season. It prioritizes environmental conservation and sustainable tourism.", 
    ar: "تُعرف عمان بجغرافيتها المتنوعة، من جبال الحجر الوعرة إلى المساحات الخضراء المورقة في صلالة خلال موسم الخريف. وتولي الأولوية للحفاظ على البيئة والسياحة المستدامة." 
  },
  omanNeutralContent: { 
    en: "Oman's foreign policy is built on a foundation of 'friend to all, enemy to none'. This strategic neutrality has made it an essential mediator and a beacon of peace in a complex region.", 
    ar: "تبنى سياسة عمان الخارجية على أساس 'صديق للجميع، عدو لا أحد'. هذا الحياد الاستراتيجي جعلها وسيطاً أساسياً ومنارة للسلام في منطقة معقدة." 
  },
  omanMaritimeContent: { 
    en: "With a coastline stretching over 3,000 kilometers, Oman has a rich maritime history as a dominant seafaring nation. Today, its ports like Salalah and Duqm are critical nodes in global trade routes.", 
    ar: "مع ساحل يمتد لأكثر من 3000 كيلومتر، تتمتع عمان بتاريخ بحري غني كدولة بحرية مهيمنة. اليوم، تعد موانئها مثل صلالة والدقم عقدًا حيوية في طرق التجارة العالمية." 
  },
  bahrainFinContent: { 
    en: "Bahrain was the first GCC nation to diversify its economy and is now a global leader in Islamic finance and FinTech. The Bahrain Bay and Financial Harbour are symbols of its economic modernization.", 
    ar: "كانت البحرين أول دولة خليجية تنوع اقتصادها وهي الآن رائدة عالمياً في التمويل الإسلامي والتكنولوجيا المالية. يعد خليج البحرين والمرفأ المالي رموزاً لتحديثها الاقتصادي." 
  },
  bahrainHistoryContent: { 
    en: "Home to the ancient Dilmun civilization, Bahrain has a history spanning over 5,000 years. The Bahrain Fort (Qal'at al-Bahrain) is a UNESCO World Heritage site that tells the story of this island's rich past.", 
    ar: "موطن لحضارة دلمون القديمة، تمتلك البحرين تاريخاً يمتد لأكثر من 5000 عام. قلعة البحرين هي أحد مواقع التراث العالمي لليونسكو التي تحكي قصة الماضي الغني لهذه الجزيرة." 
  },
  bahrainMotorsportsContent: { 
    en: "Bahrain made history in 2004 by hosting the first Formula 1 Grand Prix in the Middle East. The Bahrain International Circuit remains a crown jewel of global motorsports.", 
    ar: "دخلت البحرين التاريخ في عام 2004 باستضافة أول سباق فورمولا 1 في الشرق الأوسط. تظل حلبة البحرين الدولية جوهرة التاج في رياضة المحركات العالمية." 
  },

  // UI Strings
  featuredInsights: { en: "Featured Insights", ar: "رؤى مختارة" },
  regionalIntelligence: { en: "Regional Intelligence", ar: "الاستخبارات الإقليمية" },
  today: { en: "Today", ar: "اليوم" },
  close: { en: "Close", ar: "إغلاق" },
  calendar: { en: "Calendar", ar: "التقويم" },
  hijriSchedule: { en: "7-Day Hijri & Prayer Schedule", ar: "جدول الصلاة والتقويم الهجري - 7 أيام" },
  all: { en: "All", ar: "الكل" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  hq: { en: "HQ", ar: "المقر الرئيسي" },
  status: { en: "Status", ar: "الحالة" },
  dohaQatar: { en: "Doha, State of Qatar", ar: "الدوحة، دولة قطر" },
  independentGccRef: { en: "Independent GCC Reference", ar: "مرجع خليجي مستقل" },
  ummAlQuraUnified: { en: "Umm Al-Qura Unified", ar: "توحيد أم القرى" },
  portalBranding: { en: "ARABIA KHALEEJ PORTAL", ar: "بوابة عربية خليج" },

  // Hijri Months
  muharram: { en: "Muharram", ar: "محرم" },
  safar: { en: "Safar", ar: "صفر" },
  rabiAlAwwal: { en: "Rabi' al-Awwal", ar: "ربيع الأول" },
  rabiAlThani: { en: "Rabi' al-Thani", ar: "ربيع الآخر" },
  jumadaAlUla: { en: "Jumada al-Ula", ar: "جمادى الأولى" },
  jumadaAlAkhira: { en: "Jumada al-Akhira", ar: "جمادى الآخرة" },
  rajab: { en: "Rajab", ar: "رجب" },
  shaban: { en: "Sha'ban", ar: "شعبان" },
  ramadan: { en: "Ramadan", ar: "رمضان" },
  shawwal: { en: "Shawwal", ar: "شوال" },
  dhuAlQidah: { en: "Dhu al-Qi'dah", ar: "ذو القعدة" },
  dhuAlHijjah: { en: "Dhu al-Hijjah", ar: "ذو الحجة" },

  // Currency Exchange
  currencyExchange: { en: "Currency Exchange", ar: "تحويل العملات" },
  currencyConverter: { en: "Currency Converter", ar: "محوّل العملات" },
  currencyExchangeDesc: { 
    en: "Convert between 40+ world currencies with live rates. GCC currencies, major pairs, and more.", 
    ar: "حوّل بين أكثر من 40 عملة عالمية بأسعار مباشرة. عملات الخليج والعملات الرئيسية وأكثر." 
  },
  loadingRates: { en: "Loading rates...", ar: "جاري تحميل الأسعار..." },
  searchCurrency: { en: "Search currency...", ar: "ابحث عن عملة..." },
  favorites: { en: "Favorites", ar: "المفضلة" },
  noResults: { en: "No results found", ar: "لا توجد نتائج" },
  equals: { en: "equals", ar: "يساوي" },
  from: { en: "from", ar: "من" },
  to: { en: "to", ar: "إلى" },
  amount: { en: "Amount", ar: "المبلغ" },

  // Join / Contact Page
  contactUs: { en: "Contact Us", ar: "اتصل بنا" },
  transmitting: { en: "Transmitting...", ar: "جاري الإرسال..." },
  systemError: { en: "System Error. Please try again later.", ar: "حدث خطأ في النظام. يرجى المحاولة لاحقاً." },
  returnHome: { en: "Return Home", ar: "العودة للرئيسية" },
  yourFullName: { en: "Your Full Name...", ar: "اسمك بالكامل..." },
  professionalEmail: { en: "Professional Email Address...", ar: "عنوان بريدك الإلكتروني..." },

  // Survey
  publicSurvey: { en: "Public Survey", ar: "استطلاع رأي" },
  submitVote: { en: "Submit Vote", ar: "إرسال التصويت" },
  nextQuestion: { en: "Next Question", ar: "السؤال التالي" },
  previousQuestion: { en: "Previous Question", ar: "السؤال السابق" },
  featured: { en: "Featured", ar: "مختار" },
  quickConversions: { en: "Quick Conversions", ar: "تحويلات سريعة" },
  inverseRate: { en: "Inverse Rate", ar: "سعر الصرف المعكوس" },
  gccCurrencyRates: { en: "GCC Currency Rates", ar: "أسعار عملات الخليج" },
  lastUpdatedColon: { en: "Last Updated:", ar: "آخر تحديث:" },
  ratesInfoOnly: { en: "Rates for informational purposes only. Verify with local financial institutions for official rates.", ar: "الأسعار لأغراض إعلامية فقط. تحقق من المؤسسات المالية المحلية للأسعار الرسمية." },
  currencyExchangeSchemaName: { en: "Currency Exchange — Live GCC & World Currency Converter", ar: "تحويل العملات — محوّل العملات الخليجية والعالمية المباشر" },
  currencyExchangeSchemaDesc: { en: "Convert between 40+ currencies with live exchange rates. Featuring all GCC currencies, major global pairs, MENA, and Asian currencies.", ar: "حوّل بين أكثر من 40 عملة بأسعار صرف مباشرة. يضم جميع عملات الخليج والعملات العالمية الرئيسية والآسيوية." },
  currencyExchangeDatasetName: { en: "Arabia Khaleej Live Currency Exchange Rates", ar: "أسعار صرف العملات المباشرة من عربية خليج" },
  currencyExchangeDatasetDesc: { en: "Real-time exchange rates for 40+ currencies including all GCC currencies, major pairs, and regional currencies.", ar: "أسعار صرف فورية لأكثر من 40 عملة بما في ذلك جميع عملات الخليج والعملات الرئيسية والعملات الإقليمية." },
  vs1USD: { en: "vs 1 USD", ar: "مقابل 1 دولار أمريكي" },
  vsUSD: { en: "vs USD", ar: "مقابل الدولار" },
  financeSrOnly: { en: "GCC Finance, Market Insights & Currency Exchange Rates", ar: "المالية الخليجية، رؤى السوق وأسعار صرف العملات" },
  swapCurrencies: { en: "Swap currencies", ar: "تبديل العملات" },
  shareResult: { en: "Share result", ar: "مشاركة النتيجة" },
  copyResult: { en: "Copy result", ar: "نسخ النتيجة" },
  refreshRates: { en: "Refresh rates", ar: "تحديث الأسعار" },
  refreshInsights: { en: "Refresh Insights", ar: "تحديث الرؤى" },
  shareArticle: { en: "Share Article", ar: "مشاركة المقال" },
  breadcrumb: { en: "Breadcrumb", ar: "مسار التنقل" },
  ariaLearn: { en: "Learn about Arabia Khaleej", ar: "تعرف على عربية خليج" },
  ariaPrivacy: { en: "View Privacy Policy", ar: "عرض سياسة الخصوصية" },
  ariaTerms: { en: "Read Terms of Service", ar: "قراءة شروط الخدمة" },
  ariaDisclaimer: { en: "Read Legal Disclaimer", ar: "قراءة إخلاء المسؤولية القانونية" },
  ariaContact: { en: "Contact Arabia Khaleej", ar: "اتصل بعربية خليج" },
  homeSchemaName: { en: "Arabia Khaleej — The GCC Standard", ar: "عربية خليج — المعيار الخليجي" },
  homeSchemaDesc: { en: "The definitive independent reference for the Gulf Cooperation Council. Prayer times, market data, and country guides for all 6 GCC states.", ar: "المرجع المستقل النهائي لدول مجلس التعاون الخليجي. مواقيت الصلاة، بيانات السوق، وأدلة الدول لجميع دول مجلس التعاون الخليجي الست." },
  homeDatasetName: { en: "Arabia Khaleej GCC Regional Intelligence", ar: "عربية خليج الاستخبارات الإقليمية الخليجية" },
  homeDatasetDesc: { en: "Comprehensive structured data platform covering Islamic prayer schedules, GCC equity market indices, gold and commodity prices, GCC currency exchange rates, and sovereign country profiles for Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain.", ar: "منصة بيانات منظمة شاملة تغطي جداول الصلاة الإسلامية، ومؤشرات أسواق الأسهم الخليجية، وأسعار الذهب والسلع، وأسعار صرف العملات الخليجية، وملفات تعريف الدول السيادية لقطر والإمارات والسعودية والكويت وعمان والبحرين." },
  transparencyTitle: { en: "Transparency & Neutrality", ar: "الشفافية والحياد" },
  currencyConversionTitle: { en: "Currency Conversion | Arabia Khaleej", ar: "تحويل العملات | عربية خليج" },

  reviewsCount: { en: "reviews", ar: "مراجعة" },
  closePerspective: { en: "Close Perspective", ar: "إغلاق المنظور" },
  perspectiveModeAR: { en: "Perspective Mode (AR)", ar: "عرض المنظور العربي" },
  perspectiveModeEN: { en: "Perspective Mode (EN)", ar: "عرض المنظور الإنجليزي" },
  translationUnavailable: { en: "No translation available for this article.", ar: "لا توجد ترجمة متاحة لهذا المقال." },
  moreInsights: { en: "More Insights", ar: "المزيد من الرؤى" },
  linkCopied: { en: "Link Copied", ar: "تم نسخ الرابط" },
  updatedLabel: { en: "Updated %s", ar: "تحديث %s" },
  indicativeData: { en: "Indicative Data", ar: "بيانات استرشادية" },
  marketsLive: { en: "Markets Live", ar: "الأسواق مباشرة" },
  closedSession: { en: "Closed Session", ar: "جلسة مغلقة" },
  sentimentTitle: { en: "GCC Stability with Positive Outlook", ar: "الاستقرار الخليجي مع نظرة إيجابية" },
  sentimentDesc: { 
    en: "GCC markets continue to show resilience amid global volatility, supported by strong energy prices.", 
    ar: "تواصل الأسواق الخليجية إظهار المرونة وسط التقلبات العالمية، بدعم من أسعار الطاقة القوية." 
  },
  economicOutlook: { en: "Economic Outlook", ar: "التوقعات الاقتصادية" },
  stabilityGlobalShift: { en: "Stability in a Global Shift", ar: "الاستقرار في ظل التحول العالمي" },
  energyResilience: { en: "Energy Resilience", ar: "مرونة الطاقة" },
  energyResilienceDesc: { 
    en: "Sustained energy prices provide a robust fiscal buffer for GCC nations, enabling continued investment in infrastructure and Vision 2030-style diversification projects.", 
    ar: "توفر أسعار الطاقة المستدامة حاجزاً مالياً قوياً لدول مجلس التعاون الخليجي، مما يسمح بالاستثمار المستمر في البنية التحتية ومشاريع التنويع على غرار رؤية 2030." 
  },
  nonOilGrowth: { en: "Non-Oil Growth", ar: "النمو غير النفطي" },
  nonOilGrowthDesc: { 
    en: "The acceleration of tourism, tech, and manufacturing sectors in Saudi Arabia and the UAE is creating new alpha opportunities beyond traditional energy exports.", 
    ar: "إن تسارع قطاعات السياحة والتكنولوجيا والتصنيع في المملكة العربية السعودية والإمارات العربية المتحدة يخلق فرصاً استثمارية جديدة تتجاوز صادرات الطاقة التقليدية." 
  },

  stabilityIndex: { en: "Stability Index", ar: "مؤشر الاستقرار" },
  currentRatingColon: { en: "Current Rating:", ar: "التصنيف الحالي:" },
  fiscalBuffer: { en: "Fiscal Buffer", ar: "الحاجز المالي" },
  diversificationSpeed: { en: "Diversification Speed", ar: "سرعة التنويع" },
  digitalInfrastructure: { en: "Digital Infrastructure", ar: "البنية التحتية الرقمية" },
  regionalIntegration: { en: "Regional Integration", ar: "التكامل الإقليمي" },
  outlookSummary: { en: "Outlook Summary", ar: "ملخص التوقعات" },
  outlookSummaryBody: { 
    en: "The GCC remains a safe haven for capital seeking stability and structural growth. We maintain a positive outlook for the regional equity markets through 2025.", 
    ar: "تظل دول مجلس التعاون الخليجي ملاذاً آمناً لرؤوس الأموال الباحثة عن الاستقرار والنمو الهيكلي. نحن نحافظ على نظرة إيجابية لأسواق الأسهم الإقليمية حتى عام 2025." 
  },
  backToOverview: { en: "Back to Overview", ar: "العودة للملخص" },
  regionalAnalysis: { en: "Regional Analysis", ar: "التحليل الإقليمي" },
};
