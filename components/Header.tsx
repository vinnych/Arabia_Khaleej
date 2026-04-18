"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const { isRTL } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto">
        <Link 
          href="/" 
          className="text-lg font-black tracking-tighter hover:scale-105 transition-transform flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center text-brand-obsidian shadow-lg">
            <span className="text-sm">AK</span>
          </div>
          <span className="text-foreground hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-serif">
            Arabia Khaleej
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        <LanguageSwitcher />
        <div className="w-[1px] h-4 bg-brand-gold/20 mx-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
