"use client";

import { useLanguage, translations } from "@/lib/i18n";
import { useEffect } from "react";
import Link from "next/link";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { language, t, isRTL } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return (
    <div className={isRTL ? "font-serif-ar" : ""}>
      <main className="flex-grow">{children}</main>
      
      <footer className="p-10 border-t border-brand-gold/15 flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
        <Link href="/about" className="px-5 py-2 rounded-full bg-white/70 dark:bg-brand-obsidian/30 text-foreground/80 dark:text-brand-gold hover:text-accent transition-all hover:scale-105 active:scale-95 border border-brand-gold/20 shadow-sm hover:shadow-xl">
          {t('about')}
        </Link>
        <Link href="/privacy" className="px-5 py-2 rounded-full bg-white/70 dark:bg-brand-obsidian/30 text-foreground/80 dark:text-brand-gold hover:text-accent transition-all hover:scale-105 active:scale-95 border border-brand-gold/20 shadow-sm hover:shadow-xl">
          {t('privacy')}
        </Link>
        <Link href="/terms" className="px-5 py-2 rounded-full bg-white/70 dark:bg-brand-obsidian/30 text-foreground/80 dark:text-brand-gold hover:text-accent transition-all hover:scale-105 active:scale-95 border border-brand-gold/20 shadow-sm hover:shadow-xl">
          {t('terms')}
        </Link>
        <Link href="/disclaimer" className="px-5 py-2 rounded-full bg-white/70 dark:bg-brand-obsidian/30 text-foreground/80 dark:text-brand-gold hover:text-accent transition-all hover:scale-105 active:scale-95 border border-brand-gold/20 shadow-sm hover:shadow-xl">
          {t('disclaimer')}
        </Link>
      </footer>
    </div>
  );
}
