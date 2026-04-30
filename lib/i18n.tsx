"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation & Branding
  siteName: {
    en: "Arabia Khaleej",
    ar: "عربية خليج"
  },
  pressTerminal: {
    en: "Insights",
    ar: "رؤى"
  },
  officialUpdates: {
    en: "Official Editorials",
    ar: "افتتاحيات رسمية"
  },
  newsDesc: {
    en: "Original editorial insights and deep dives",
    ar: "تحليلات ورؤى تحريرية أصلية"
  },
  siteSlogan: {
    en: "The definitive reference for a refined GCC experience.",
    ar: "المرجع النهائي لتجربة خليجية متميزة."
  },
  prayerTimes: {
    en: "Prayer Times",
    ar: "مواقيت الصلاة"
  },
  marketInsights: {
    en: "Market Insights",
    ar: "رؤى السوق"
  },
  boutiqueEnquiry: {
    en: "Enquire",
    ar: "استفسار"
  },
  prayerDesc: {
    en: "Local & regional schedules",
    ar: "الجداول المحلية والإقليمية"
  },
  marketDesc: {
    en: "Stocks, Gold & GCC Currencies",
    ar: "الأسهم والذهب والعملات الخليجية"
  },
  boutiqueDesc: {
    en: "Direct channel for all inquiries",
    ar: "قناة مباشرة لجميع الاستفسارات"
  },

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
    en: "The Sultanate of Oman is celebrated for its natural beauty and balanced foreign policy. It remains a serene destination that harmonizes ancient heritage with forward-looking development.", 
    ar: "تُعرف سلطنة عمان بجمالها الطبيعي وسياستها الخارجية المتوازنة. تظل وجهة هادئة تجمع بين التراث القديم والتنمية المتطلعة للمستقبل." 
  },
  bahrainIntro: { 
    en: "Bahrain, the 'Island of Two Seas', was the first GCC nation to discover oil and the first to diversify into finance. It remains a vibrant financial and cultural crossroads.", 
    ar: "كانت البحرين، 'جزيرة السطرين'، أول دولة خليجية تكتشف النفط وأول من نوع اقتصاده إلى التمويل. تظل مفترق طرق مالي وثقافي حيوي." 
  },

  // Detailed Country Sections
  econPower: { en: "Economic Powerhouse", ar: "القوة الاقتصادية" },
  globalLead: { en: "Global Leadership", ar: "القيادة العالمية" },
  megaProj: { en: "Mega Projects", ar: "المشاريع الضخمة" },
  innovationHub: { en: "Global Innovation Hub", ar: "مركز الابتكار العالمي" },
  spaceTech: { en: "Space & Technology", ar: "الفضاء والتكنولوجيا" },
  culturalDiv: { en: "Cultural Diversity", ar: "التنوع الثقافي" },
  energyGiant: { en: "Energy Giant", ar: "عملاق الطاقة" },
  diplomaticHub: { en: "Diplomatic & Media Hub", ar: "المركز الدبلوماسي والإعلامي" },
  sportsExcellence: { en: "Sports Excellence", ar: "التميز الرياضي" },
  finHeritage: { en: "Financial Heritage", ar: "التراث المالي" },
  parlTradition: { en: "Parliamentary Tradition", ar: "التقليد البرلماني" },
  culturalHeart: { en: "Cultural Heartland", ar: "القلب الثقافي" },
  naturalMajesty: { en: "Natural Majesty", ar: "العظمة الطبيعية" },
  strategicNeutrality: { en: "Strategic Neutrality", ar: "الحياد الاستراتيجي" },
  maritimeLegacy: { en: "Maritime Legacy", ar: "الإرث البحري" },
  finInnovation: { en: "Financial Innovation", ar: "الابتكار المالي" },
  ancientHistory: { en: "Ancient History", ar: "التاريخ القديم" },
  motorsportsHub: { en: "Motorsports Hub", ar: "مركز رياضة المحركات" },

  // Transparency Notice (Anti-Ban)
  transparencyNotice: { en: "Transparency & Neutrality", ar: "الشفافية والحياد" },
  transparencyTitle: { en: "Official Compliance & Transparency Statement", ar: "بيان الامتثال الرسمي والشفافية" },
  transparencyBody: {
    en: "Arabia Khaleej is a strictly independent international digital reference platform. We aggregate and surface publicly available information provided by official government portals and state news agencies across the GCC. Our mission is to promote regional understanding and accessibility through high-fidelity data. We operate with full respect for the sovereign laws and digital regulations of every GCC member state. If you represent a regulatory authority and have inquiries regarding our content, please contact us directly via our formal channels. We are committed to transparency and constructive dialogue.",
    ar: "عربية خليج هي منصة مرجعية رقمية دولية مستقلة تماماً. نحن نجمع ونعرض المعلومات المتاحة للجمهور المقدمة من البوابات الحكومية الرسمية ووكالات الأنباء الرسمية عبر دول مجلس التعاون الخليجي. مهمتنا هي تعزيز الفهم الإقليمي وسهولة الوصول من خلال بيانات عالية الدقة. نحن نعمل باحترام كامل للقوانين السيادية واللوائح الرقمية لكل دولة عضو في مجلس التعاون الخليجي. إذا كنت تمثل سلطة تنظيمية ولديك استفسارات بشأن محتوانا، يرجى الاتصال بنا مباشرة عبر قنواتنا الرسمية. نحن ملتزمون بالشفافية والحوار البناء."
  },

  // UI
  upcoming: { en: "Upcoming", ar: "قادم" },
  scheduleFor: { en: "Schedule for", ar: "جدول" },
  calculationMethod: { en: "Umm Al-Qura Calculation Method (Local Engine)", ar: "طريقة حساب أم القرى (محرك محلي)" },
  home: { en: "Home", ar: "الرئيسية" },
  countries: { en: "Countries", ar: "الدول" },
  viewHijri: { en: "View Hijri Calendar", ar: "عرض التقويم الهجري" },
  processing: { en: "Processing...", ar: "جاري المعالجة..." },
  somethingWentWrong: { en: "Something went wrong. Please try again.", ar: "حدث خطأ ما. حاول مرة أخرى." },
  yourLocation: { en: "Your Location", ar: "موقعك" },

  // Finance
  gold: { en: "Gold (XAU/USD)", ar: "الذهب (XAU/USD)" },
  marketsLive: { en: "Markets Live", ar: "الأسواق مباشرة" },
  uaeDirham: { en: "UAE Dirham", ar: "درهم إماراتي" },
  saudiRiyal: { en: "Saudi Riyal", ar: "ريال سعودي" },
  kuwaitiDinar: { en: "Kuwaiti Dinar", ar: "دينار كويتي" },
  qatariRiyal: { en: "Qatari Riyal", ar: "ريال قطري" },
  omaniRial: { en: "Omani Rial", ar: "ريال عماني" },
  bahrainiDinar: { en: "Bahraini Dinar", ar: "دينار بحريني" },
  flagOf: { en: "Flag of %s", ar: "علم %s" },
  gccFinanceCurrency: { en: "GCC Finance & Currency", ar: "المالية والعملات الخليجية" },
  retryConnection: { en: "Retry Connection", ar: "إعادة الاتصال" },
  indicativeData: { en: "Indicative data. Markets are simulated for informational purposes.", ar: "بيانات استرشادية. يتم محاكاة الأسواق لأغراض إعلامية." },


  // About Page
  aboutTitle: { en: "About Arabia Khaleej", ar: "حول عربية خليج" },
  aboutSubtitle: { en: "The GCC Standard", ar: "المعيار الخليجي" },
  aboutDesc: { 
    en: "A premier digital destination providing high-fidelity regional insights and schedules across the GCC — fast, precise, and authoritative.",
    ar: "وجهة رقمية متميزة تقدم رؤى وجداول إقليمية عالية الدقة عبر دول مجلس التعاون الخليجي - سريعة ودقيقة وموثوقة."
  },
  mission: { en: "Mission", ar: "المهمة" },
  missionDesc: {
    en: "Arabia Khaleej exists to bridge the gap between curious visitors and the wealth of official information available across the GCC. We aggregate, simplify, and surface what matters — then point you back to the authoritative source.",
    ar: "توجد عربية خليج لسد الفجوة بين الزوار المهتمين والمعلومات الرسمية الوفيرة المتاحة عبر دول مجلس التعاون الخليجي. نحن نجمع ونبسط ونظهر ما يهم - ثم نوجهك مرة أخرى إلى المصدر الرسمي."
  },
  pillars: { en: "Our Pillars", ar: "ركائزنا" },
  independence: { en: "Global Excellence", ar: "التميز العالمي" },
  independenceDesc: { en: "Committed to international standards of service and quality across the GCC and beyond.", ar: "ملتزمون بالمعايير الدولية للخدمة والجودة في منطقة الخليج وخارجها." },
  simplicity: { en: "Simplicity", ar: "البساطة" },
  simplicityDesc: { en: "Speed and clarity over noise. Every word earns its place.", ar: "السرعة والوضوح فوق الضجيج. كل كلمة تأخذ مكانها المستحق." },
  transparency: { en: "Transparency", ar: "الشفافية" },
  transparencyDesc: { en: "We are a professional digital destination. We link to authoritative sources for absolute clarity.", ar: "نحن وجهة رقمية احترافية. نربط بالمصادر الرسمية للوضوح التام." },

  // Legal Footer note
  passionProject: { 
    en: "Arabia Khaleej is a premier international regional reference — not an official government entity. Information is aggregated from official sources for convenience and should be verified with relevant authorities.",
    ar: "عربية خليج هي مرجع إقليمي دولي متميز - وليست جهة حكومية رسمية. يتم جمع المعلومات من المصادر الرسمية للتسهيل ويجب التحقق منها لدى الجهات المختصة."
  },

  // Legal Titles
  privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  termsConditions: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
  disclaimerTitle: { en: "Disclaimer", ar: "إخلاء المسؤولية" },
  legal: { en: "Legal", ar: "قانوني" },
  lastReviewed: { en: "Last reviewed", ar: "آخر مراجعة" },

  // Footer
  about: {
    en: "About",
    ar: "من نحن"
  },
  privacy: {
    en: "Privacy",
    ar: "الخصوصية"
  },
  terms: {
    en: "Terms",
    ar: "الشروط"
  },
  disclaimer: {
    en: "Disclaimer",
    ar: "إخلاء المسؤولية"
  },

  // Common UI
  back: {
    en: "Back",
    ar: "رجوع"
  },
  selectCountry: {
    en: "Select Country",
    ar: "اختر الدولة"
  },
  loading: {
    en: "Loading...",
    ar: "جاري التحميل..."
  },
  
  // Prayer specific
  fajr: { en: "Fajr", ar: "الفجر" },
  sunrise: { en: "Sunrise", ar: "الشروق" },
  dhuhr: { en: "Dhuhr", ar: "الظهر" },
  asr: { en: "Asr", ar: "العصر" },
  maghrib: { en: "Maghrib", ar: "المغرب" },
  isha: { en: "Isha", ar: "العشاء" },
  nextPrayer: { en: "Next Prayer", ar: "الصلاة القادمة" },
  in: { en: "in", ar: "في" },
  ago: { en: "ago", ar: "منذ" },
  
  // Join Page
  requestInvite: {
    en: "Submit an Inquiry",
    ar: "إرسال استفسار"
  },
  membershipDesc: {
    en: "A direct channel for partnership proposals and specialized regional inquiries.",
    ar: "قناة مباشرة لمقترحات الشراكة والاستفسارات الإقليمية المتخصصة."
  },
  fullName: {
    en: "Full Name",
    ar: "الاسم الكامل"
  },
  emailAddress: {
    en: "Email Address",
    ar: "البريد الإلكتروني"
  },
  location: {
    en: "Current Location",
    ar: "الموقع الحالي"
  },
  submit: {
    en: "Submit Request",
    ar: "إرسال الطلب"
  },
  thankYou: {
    en: "Thank You",
    ar: "شكراً لك"
  },
  submissionReceived: {
    en: "Your inquiry has been received. Our team will review your proposal and be in touch shortly.",
    ar: "تم استلام استفسارك. سيراجع فريقنا مقترحك وسنتواصل معك قريباً."
  },

  // Market Insight
  stockMarkets: { en: "Stock Markets", ar: "أسواق الأسهم" },
  commodities: { en: "Commodities", ar: "السلع" },
  currencies: { en: "Currencies", ar: "العملات" },
  marketOverview: { en: "Market Overview", ar: "نظرة عامة على السوق" },
  liveIndices: { en: "Live Indices", ar: "المؤشرات المباشرة" },
  topPerformers: { en: "Top Performers", ar: "الأفضل أداءً" },
  marketSentiment: { en: "Market Sentiment", ar: "معنويات السوق" },
  brentCrude: { en: "Brent Crude", ar: "خام برنت" },
  naturalGas: { en: "Natural Gas", ar: "الغاز الطبيعي" },
  marketSummary: { 
    en: "Comprehensive real-time insights into GCC equity markets, global commodities, and regional currency performance.",
    ar: "رؤى شاملة في الوقت الفعلي لأسواق الأسهم في دول مجلس التعاون الخليجي، والسلع العالمية، وأداء العملات الإقليمية."
  },
  indexValue: { en: "Index Value", ar: "قيمة المؤشر" },
  dailyChange: { en: "Daily Change", ar: "التغيير اليومي" },
  peggedStatus: { en: "Pegged to USD", ar: "مثبت بالدولار" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  sentimentTitle: { en: "Regional Stability with Positive Outlook", ar: "استقرار إقليمي مع نظرة إيجابية" },
  sentimentDesc: { 
    en: "GCC markets continue to show resilience amid global volatility, supported by strong energy prices and non-oil sector growth.",
    ar: "تستمر الأسواق الخليجية في إظهار المرونة وسط التقلبات العالمية، مدعومة بأسعار الطاقة القوية ونمو القطاع غير النفطي."
  },

  // Currency Exchange
  currencyExchange: { en: "Currency Exchange", ar: "تحويل العملات" },
  currencyConverter: { en: "Currency Converter", ar: "محوّل العملات" },
  currencyExchangeDesc: {
    en: "Convert between 40+ world currencies with live rates. GCC currencies, major pairs, and more.",
    ar: "حوّل بين أكثر من 40 عملة عالمية بأسعار مباشرة. عملات الخليج والعملات الرئيسية وأكثر."
  },
  from: { en: "From", ar: "من" },
  to: { en: "To", ar: "إلى" },
  quickConversions: { en: "Quick Conversions", ar: "تحويلات سريعة" },
  inverseRate: { en: "Inverse Rate", ar: "سعر الصرف المعكوس" },
  gccRates: { en: "GCC Currency Rates", ar: "أسعار عملات الخليج" },
  searchCurrency: { en: "Search currency...", ar: "ابحث عن عملة..." },
  noResults: { en: "No results found", ar: "لا توجد نتائج" },
  ratesDisclaimer: {
    en: "Rates for informational purposes only. Verify with local financial institutions for official rates.",
    ar: "الأسعار لأغراض إعلامية فقط. تحقق من المؤسسات المالية المحلية للأسعار الرسمية."
  },

  // News
  officialSource: { en: "Official Source", ar: "المصدر الرسمي" },
  readMore: { en: "Read Full Article", ar: "اقرأ المقال كاملاً" },
  latestFrom: { en: "Latest from", ar: "آخر الأخبار من" },
  qna: { en: "Qatar News Agency", ar: "وكالة الأنباء القطرية" },
  wam: { en: "Emirates News Agency", ar: "وكالة أنباء الإمارات" },
  spa: { en: "Saudi Press Agency", ar: "وكالة الأنباء السعودية" },
  bna: { en: "Bahrain News Agency", ar: "وكالة أنباء البحرين" },
  ona: { en: "Oman News Agency", ar: "وكالة الأنباء العمانية" },
  newsDisclaimer: {
    en: "Direct feed from official state news agencies. Content is provided as-is without modification.",
    ar: "خلاصة مباشرة من وكالات الأنباء الرسمية للدولة. يتم توفير المحتوى كما هو دون تعديل."
  },
  communityNews: { en: "Community Terminal", ar: "محطة المجتمع" },
  expatNews: { en: "Expat Updates", ar: "تحديثات الوافدين" },
  india: { en: "India", ar: "الهند" },
  pakistan: { en: "Pakistan", ar: "باكستان" },
  bangladesh: { en: "Bangladesh", ar: "بنغلاديش" },
  philippines: { en: "Philippines", ar: "الفلبين" },
  regionalLanguage: { en: "Regional Language", ar: "اللغة الإقليمية" },
  allNews: { en: "All News", ar: "كل الأخبار" },
  gccNews: { en: "GCC Official", ar: "الرسمية الخليجية" },
  all: { en: "All News", ar: "كل الأخبار" },
  gcc: { en: "GCC Official", ar: "الرسمية الخليجية" },
  expat: { en: "Community Terminal", ar: "محطة المجتمع" },
  refresh: { en: "Refresh Feed", ar: "تحديث الخلاصات" },
  politics: { en: "Politics", ar: "سياسة" },
  tech: { en: "Tech", ar: "تكنولوجيا" },
  entertainment: { en: "Entertainment", ar: "ترفيه" },
  sports: { en: "Sports", ar: "رياضة" },
  loadMore: { en: "Discover More", ar: "اكتشف المزيد" },

  // Marketplace
  marketplace: { en: "Marketplace", ar: "السوق" },
  exclusiveOffers: { en: "Exclusive Offers", ar: "عروض حصرية" },
  boutiqueMarket: { en: "Boutique Marketplace", ar: "سوق البوتيك" },
  marketSearch: { en: "Search products and brands...", ar: "البحث عن المنتجات والعلامات التجارية..." },
  viewOnStore: { en: "View on Store", ar: "عرض في المتجر" },
  affiliateDisclosure: { 
    en: "Arabia Khaleej features curated products from trusted regional retailers. We may earn a commission when you purchase through our links.", 
    ar: "تتميز عربية خليج بمنتجات مختارة من بائعي التجزئة الإقليميين الموثوقين. قد نكسب عمولة عند الشراء من خلال روابطنا." 
  },
  categories: { en: "Categories", ar: "الفئات" },
  fashion: { en: "Fashion", ar: "أزياء" },
  electronics: { en: "Electronics", ar: "إلكترونيات" },
  beauty: { en: "Beauty & Grooming", ar: "الجمال والعناية" },
  homeLifestyle: { en: "Home & Lifestyle", ar: "المنزل وأسلوب الحياة" },
  wellness: { en: "Wellness", ar: "العافية" },
  bestSellers: { en: "Best Sellers", ar: "الأكثر مبيعاً" },
  trendingNow: { en: "Trending Now", ar: "رائج الآن" },
  trendingThisWeek: { en: "Top 10 Trending This Week", ar: "أفضل 10 منتجات رائجة هذا الأسبوع" },
  trendingOn: { en: "Top 10 Trending on %s", ar: "أفضل 10 منتجات رائجة على %s" },
  limitedOffer: { en: "Limited Offer", ar: "عرض محدود" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children,
  initialLanguage = 'en'
}: { 
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only sync if the URL has a lang parameter that differs from current state
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as Language;
    
    if (langParam && (langParam === 'en' || langParam === 'ar') && langParam !== language) {
      setLanguage(langParam);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure' : ''}`;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  };


  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
