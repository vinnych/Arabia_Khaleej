"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const { t, isRTL, language } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-8 py-4 flex justify-between items-center pointer-events-none">
      {/* Frosted Glass Background for the Logo area */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <Link 
          href="/" 
          aria-label={t('home')}
          className="group flex items-center gap-3 glass px-4 py-2 rounded-2xl border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-brand-accent flex items-center justify-center text-brand-obsidian shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <span className="text-xs font-black tracking-tighter">AK</span>
              </div>
            </div>
            <div className={`hidden sm:flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold leading-none mb-1">
                {t('siteName')}
              </span>
              <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest leading-none">
                {t('siteTagline')}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 glass p-1.5 rounded-2xl border-brand-gold/10 shadow-xl">
          {[
            { name: t('prayerTimes'), href: "/prayer" },
            { name: t('marketInsights'), href: "/market-insight" },
            { name: t('marketplace'), href: "/marketplace" },
            { name: t('pressTerminal'), href: "/insights" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-brand-gold hover:bg-brand-gold/5 transition-all"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass flex items-center gap-1 p-1.5 rounded-2xl border-brand-gold/10 shadow-xl">
          <LanguageSwitcher />
          <div className="w-[1px] h-4 bg-brand-gold/10 mx-1" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
