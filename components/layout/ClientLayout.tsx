"use client";

import { useLanguage, translations, getLocalizedHref } from '@/lib/i18n/i18n';
import { useEffect } from "react";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { language, t, isRTL } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return (
    <div className={isRTL ? "font-serif-ar" : ""}>
      <AnimatePresence mode="wait">
        <motion.main
          key={language}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex-grow pb-32 md:pb-0"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      <MobileNav />

      {/* Why: We replaced hardcoded bg-brand-obsidian/20 with bg-card/25 in the footer to ensure that
               the footer container blends dynamically with the primary card theme in both daylight and night mode. */}
      <footer className="w-full py-12 border-t border-brand-gold/5 bg-card/25 backdrop-blur-sm">
        <div className="w-full flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {/* Why: Prepend language to internal links so crawlers discover direct URLs without redirects */}
            <Link href={getLocalizedHref("/about", language)} className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-brand-gold transition-colors">{t('about')}</Link>
            <Link href={getLocalizedHref("/privacy", language)} className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-brand-gold transition-colors">{t('privacy')}</Link>
            <Link href={getLocalizedHref("/terms", language)} className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-brand-gold transition-colors">{t('terms')}</Link>
            <Link href={getLocalizedHref("/disclaimer", language)} className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-brand-gold transition-colors">{t('disclaimer')}</Link>
            <Link href={getLocalizedHref("/contact", language)} className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-brand-gold transition-colors">{t('contact')}</Link>
          </div>
          <p className="text-xs text-foreground/50 font-medium uppercase tracking-[0.3em] text-center">
            © {new Date().getFullYear()} {t('siteName')}. {t('passionProject')}
          </p>
        </div>
      </footer>
    </div>
  );
}
