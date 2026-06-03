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
    // Why: Set NEXT_LOCALE cookie so subsequent Server Component renders and requests are aligned on Cloudflare.
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure' : ''}`;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  }, [language]);

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as Language;

    if (langParam && (langParam === 'en' || langParam === 'ar') && langParam !== language) {
      setLanguage(langParam);
    }
  }, [language, setLanguage]);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

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

/**
 * Normalizes and prefixes an internal route path with the active language code.
 * Why: Ensures that client-side links point directly to the localized path,
 * avoiding redirect hops and ensuring Googlebot discovers canonical localized URLs.
 */
export function getLocalizedHref(path: string, lang: Language): string {
  // Why: Avoid prefixing external protocols (HTTP/HTTPS), mailto, or telephone links.
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  
  // Normalize leading slash to ensure we have a valid relative path.
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Why: Root path / points to /${lang} (e.g. /en or /ar).
  if (cleanPath === '/') {
    return `/${lang}`;
  }
  
  // Why: Prevent double-prefixing if the path already starts with /en/ or /ar/ or is exactly /en or /ar.
  if (cleanPath.startsWith('/en/') || cleanPath === '/en' || cleanPath.startsWith('/ar/') || cleanPath === '/ar') {
    return cleanPath;
  }
  
  return `/${lang}${cleanPath}`;
}
