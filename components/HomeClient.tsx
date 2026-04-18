"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, TrendingUp, UserPlus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const { t, isRTL } = useLanguage();

  const NAV_LINKS = [
    { name: t('prayerTimes'), href: "/prayer", desc: t('prayerDesc'), icon: Clock },
    { name: t('marketInsights'), href: "/finance", desc: t('marketDesc'), icon: TrendingUp },
    { name: t('boutiqueEnquiry'), href: "/join", desc: t('boutiqueDesc'), icon: UserPlus },
  ];

  useEffect(() => setMounted(true), []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 relative py-6 ${isRTL ? 'font-serif-ar' : ''}`}>
      
      {/* Visually Hidden H1 for SEO */}
      <h1 className="sr-only">{t('siteName')} — {t('siteSlogan')}</h1>
      
      {/* Main Branding Section */}
      <div className="relative mb-12 sm:mb-16 animate-in fade-in zoom-in duration-1000 slide-in-from-top-4">
        <div className="relative w-48 sm:w-[420px] h-24 sm:h-40 mx-auto mb-6">
          <Image 
            src="/logo-premium-gold.png" 
            alt="Arabia Khaleej Logo" 
            fill 
            sizes="(max-width: 768px) 192px, 420px"
            className="object-contain logo-shadow"
            priority
          />
        </div>
        <p className="text-base sm:text-lg font-light italic serif text-foreground/70 px-4 max-w-lg mx-auto leading-relaxed">
          "{t('siteSlogan')}"
        </p>
      </div>

      {/* 3-Column Vertical Pillar Grid */}
      <nav className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative glass p-6 sm:p-8 rounded-[2.5rem] border-brand-gold/15 hover:border-brand-gold/40 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl flex flex-col items-center text-center overflow-hidden"
          >
            {/* Decorative Background Icon */}
            <div className={`absolute ${isRTL ? '-left-4' : '-right-4'} -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110`}>
              <link.icon size={100} />
            </div>

            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-accent mb-6 group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-all duration-500 shadow-inner">
              <link.icon size={20} strokeWidth={2} />
            </div>

            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-3 group-hover:tracking-[0.5em] transition-all duration-500">
              {link.name}
            </h2>
            
            <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest leading-relaxed">
              {link.desc}
            </p>

            <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 transform duration-500">
              <div className="w-6 h-[1.5px] bg-accent/40 rounded-full" />
            </div>
          </Link>
        ))}
      </nav>

      {/* Decorative Line - Reduced */}
      <div className="mt-12 w-16 h-[1px] bg-brand-gold/15 rounded-full" />
    </div>

  );
}
