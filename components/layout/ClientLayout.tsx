"use client";

import { useLanguage, translations } from "@/lib/i18n";
import { useEffect } from "react";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { motion, AnimatePresence } from "framer-motion";
import AdUnit, { AD_SLOTS } from "@/components/ui/AdUnit";

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

      <AdUnit slot={AD_SLOTS.footer} className="w-full max-w-5xl mx-auto px-4" />

        <div className="w-full flex flex-col items-center gap-6 mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about" className="text-foreground/40 hover:text-brand-gold transition-colors">{t('about')}</Link>
            <Link href="/privacy" className="text-foreground/40 hover:text-brand-gold transition-colors">{t('privacy')}</Link>
            <Link href="/terms" className="text-foreground/40 hover:text-brand-gold transition-colors">{t('terms')}</Link>
            <Link href="/disclaimer" className="text-foreground/40 hover:text-brand-gold transition-colors">{t('disclaimer')}</Link>
            <Link href="/contact" className="text-foreground/40 hover:text-brand-gold transition-colors">{t('contact')}</Link>
          </div>
          <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-[0.4em] text-center">
            © {new Date().getFullYear()} {t('siteName')}. {t('passionProject')}
          </p>
        </div>
      </footer>
    </div>
  );
}
