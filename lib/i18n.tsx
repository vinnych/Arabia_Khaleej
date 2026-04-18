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
    en: "Gold & GCC currency rates",
    ar: "أسعار الذهب والعملات الخليجية"
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

  // UI
  upcoming: { en: "Upcoming", ar: "قادم" },
  scheduleFor: { en: "Schedule for", ar: "جدول" },
  calculationMethod: { en: "Umm Al-Qura Calculation Method (Local Engine)", ar: "طريقة حساب أم القرى (محرك محلي)" },
  home: { en: "Home", ar: "الرئيسية" },
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
    en: "Arabia Khaleej is a premier regional reference — not an official government entity. Information is provided for convenience and should be verified with relevant authorities.",
    ar: "عربية خليج هي مرجع إقليمي متميز - وليست جهة حكومية رسمية. يتم توفير المعلومات للتسهيل ويجب التحقق منها لدى الجهات المختصة."
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
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
    } else if (navigator.language.startsWith('ar')) {
      setLanguageState('ar');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
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
