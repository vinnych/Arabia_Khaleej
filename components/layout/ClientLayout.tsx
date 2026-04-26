"use client";

import { useLanguage, translations } from "@/lib/i18n";
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
      
      <footer className="p-10 border-t border-brand-gold/15 flex flex-wrap justify-center gap-6 text-xs md:text-sm font-black uppercase tracking-widest mb-32 md:mb-0 relative overflow-hidden">
        {/* Subtle decorative glow for the footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        
        <Link 
          href="/about" 
          className="px-6 py-2.5 rounded-full glass border-brand-gold/20 hover:border-brand-gold/60 text-foreground/40 hover:text-brand-gold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-gold outline-none"
          aria-label="Learn about Arabia Khaleej"
        >
          {t('about')}
        </Link>
        <Link 
          href="/privacy" 
          className="px-6 py-2.5 rounded-full glass border-brand-gold/20 hover:border-brand-gold/60 text-foreground/40 hover:text-brand-gold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-gold outline-none"
          aria-label="View Privacy Policy"
        >
          {t('privacy')}
        </Link>
        <Link 
          href="/terms" 
          className="px-6 py-2.5 rounded-full glass border-brand-gold/20 hover:border-brand-gold/60 text-foreground/40 hover:text-brand-gold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-gold outline-none"
          aria-label="Read Terms of Service"
        >
          {t('terms')}
        </Link>
        <Link 
          href="/disclaimer" 
          className="px-6 py-2.5 rounded-full glass border-brand-gold/20 hover:border-brand-gold/60 text-foreground/40 hover:text-brand-gold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-xl focus-visible:ring-2 focus-visible:ring-brand-gold outline-none"
          aria-label="Read Legal Disclaimer"
        >
          {t('disclaimer')}
        </Link>
      </footer>
    </div>
  );
}
