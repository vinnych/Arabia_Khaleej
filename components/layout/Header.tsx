"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function Header() {
  const { isRTL, language } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-8 py-4 flex justify-between items-center pointer-events-none">
      {/* Frosted Glass Background for the Logo area */}
      <div className="pointer-events-auto">
        <Link 
          href="/" 
          className="group flex items-center gap-3 glass px-4 py-2 rounded-2xl border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-brand-accent flex items-center justify-center text-brand-obsidian shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <span className="text-xs font-black tracking-tighter">AK</span>
            </div>
            {/* Live Indicator Dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-brand-obsidian animate-pulse" />
          </div>
          <div className={`hidden sm:flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold leading-none mb-1">
              {language === 'ar' ? 'عربية خليج' : 'Arabia Khaleej'}
            </span>
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest leading-none">
              {language === 'ar' ? 'بوابة الذكاء الإقليمية' : 'Regional Intelligence'}
            </span>
          </div>
        </Link>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass flex items-center gap-1 p-1.5 rounded-2xl border-brand-gold/10 shadow-xl">
          <LanguageSwitcher />
          <div className="w-[1px] h-4 bg-brand-gold/10 mx-1" />
          <ThemeToggle />
        </div>
        
        {/* Subtle Live Stats Indicator */}
        <div className="hidden md:flex glass px-4 py-2 rounded-2xl border-brand-gold/10 items-center gap-2 shadow-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-foreground/40">
            System Live
          </span>
        </div>
      </div>
    </header>
  );
}
