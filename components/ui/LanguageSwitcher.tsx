"use client";

import { useLanguage } from "@/lib/i18n";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group/lang">
      <button
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="glass px-4 py-3 min-h-[44px] min-w-[44px] rounded-full border-brand-gold/20 text-brand-gold hover:border-brand-gold/50 transition-all hover:scale-105 active:scale-90 shadow-lg group flex items-center justify-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
        title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      >
        <Languages size={16} className="group-hover:rotate-12 transition-transform" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          {language === 'en' ? 'العربية' : 'English'}
        </span>
      </button>
      
      {/* Purposeful Tooltip for UX clarity */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-obsidian/90 backdrop-blur-md text-[8px] font-bold uppercase tracking-widest text-brand-gold rounded-lg opacity-0 group-hover/lang:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-brand-gold/20 z-50">
        {language === 'en' ? 'Translate Interface' : 'ترجمة الواجهة'}
      </div>
    </div>
  );
}
