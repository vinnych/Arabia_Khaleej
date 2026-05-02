"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language } from './i18n-data';

export type { Language };
export { translations };

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

  const setLanguage = useCallback((lang: Language) => {
    if (lang === language) return;
    
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure' : ''}`;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  }, [language]);

  useEffect(() => {
    setMounted(true);
    
    // Only sync if the URL has a lang parameter that differs from current state
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as Language;
    
    if (langParam && (langParam === 'en' || langParam === 'ar') && langParam !== language) {
      setLanguage(langParam);
    }
  }, [language, setLanguage]);


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


