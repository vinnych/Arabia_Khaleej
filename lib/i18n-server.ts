import { cookies } from 'next/headers';
import { translations, Language } from './i18n-data';

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value;
  return (locale === 'ar' || locale === 'en') ? locale as Language : 'en';
}

// Why: Overloading getT with an optional lang parameter allows us to pass route locale (resolved from dynamic params)
// directly, bypassing the cookie check. This prevents search engine crawlers (which do not send cookies)
// from always defaulting to English translations on Arabic routes.
export async function getT(lang?: Language) {
  const resolvedLang = lang || await getServerLanguage();
  return (key: string): string => {
    return translations[key]?.[resolvedLang] || key;
  };
}
