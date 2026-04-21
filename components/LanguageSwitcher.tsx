"use client";

import { useLanguage } from "@/lib/i18n";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="glass px-4 py-3 rounded-full border-brand-gold/20 text-brand-gold hover:border-brand-gold/50 transition-all hover:scale-105 active:scale-90 shadow-lg group flex items-center gap-2.5"
      aria-label="Switch Language"
    >
      <Languages size={16} className="group-hover:rotate-12 transition-transform" />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
}
