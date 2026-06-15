"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLocalizedHref } from '@/lib/i18n/i18n';

export default function NotFound() {
  const pathname = usePathname();
  // Why: Since not-found is rendering on unknown paths, we extract the lang prefix from current pathname (e.g. /ar/unknown -> ar)
  const lang = pathname?.startsWith("/ar") ? "ar" : "en";

  useEffect(() => {
    document.title = lang === "ar" ? "الصفحة غير موجودة | عربية خليج" : "Page Not Found | Arabia Khaleej";
  }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[88vh] text-center px-6 relative overflow-hidden">
      {/* Why: Crawlers must not index 404 pages, and this HTML tag is respected by all indexers */}
      <meta name="robots" content="noindex, nofollow" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-gold/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* 404 numeral */}
      <p className="text-[140px] sm:text-[180px] font-black leading-none tracking-tighter text-gold-gradient select-none mb-2 animate-in fade-in zoom-in duration-700">
        404
      </p>

      {/* Separator */}
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent mx-auto mb-8 animate-in fade-in duration-700 delay-200 fill-mode-both" />

      {/* Message */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
          {lang === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
        </h1>
        <p className="text-sm font-light opacity-50 max-w-xs mx-auto leading-relaxed mb-10">
          {lang === "ar" 
            ? "الصفحة التي تبحث عنها قد تكون نقلت أو لم تعد موجودة." 
            : "The page you're looking for may have moved or no longer exists."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
        <Link
          href={getLocalizedHref("/", lang)}
          className="gold-gradient text-brand-obsidian font-bold text-[11px] uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-all duration-300 active:scale-95"
        >
          {lang === "ar" ? "العودة للرئيسية" : "Return Home"}
        </Link>
        <Link
          href={getLocalizedHref("/about", lang)}
          className="glass border border-brand-gold/20 hover:border-brand-gold/50 text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded-full transition-all duration-300 active:scale-95"
        >
          {lang === "ar" ? "من نحن" : "About"}
        </Link>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-12 w-full max-w-xs h-[1px] bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent mx-auto" />
    </div>
  );
}
