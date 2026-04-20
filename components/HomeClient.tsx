"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, TrendingUp, UserPlus, Newspaper } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const { t, isRTL } = useLanguage();

  const NAV_LINKS = [
    { name: t('prayerTimes'), href: "/prayer", desc: t('prayerDesc'), icon: Clock },
    { name: t('marketInsights'), href: "/market-insight", desc: t('marketDesc'), icon: TrendingUp },
    { name: t('pressTerminal'), href: "/news", desc: t('newsDesc'), icon: Newspaper },
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

      {/* 4-Column Vertical Pillar Grid */}
      <nav className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
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

      {/* Regional Guides Section */}
      <div className="w-full max-w-6xl mt-24 sm:mt-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
        <div className="flex flex-col items-center mb-16 px-4">
          <div className="relative inline-block px-12 py-3 mb-6">
            {/* Elegant Corner Borders */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-gold/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-gold/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-gold/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-gold/40" />
            
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-[0.3em] text-accent text-center drop-shadow-sm">
              {t('regionalGuides')}
            </h2>
          </div>
          
          <div className="flex items-center gap-6 w-full max-w-md">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.6em] whitespace-nowrap">
              {t('guideDesc')}
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-2">
          {[
            { id: 'saudi-arabia', key: 'saudiArabia', flag: '/flags/saudi_new.png' },
            { id: 'united-arab-emirates', key: 'uae', flag: '/flags/uae_new.png' },
            { id: 'qatar', key: 'qatar', flag: '/flags/qatar_new.png' },
            { id: 'kuwait', key: 'kuwait', flag: '/flags/kuwait_new.png' },
            { id: 'oman', key: 'oman', flag: '/flags/oman_new.png' },
            { id: 'bahrain', key: 'bahrain', flag: '/flags/bahrain_new.png' },
          ].map((country) => (
            <Link
              key={country.id}
              href={`/countries/${country.id}`}
              className="group relative glass rounded-3xl border-brand-gold/10 hover:border-brand-gold/40 transition-all hover:-translate-y-2 hover:z-10 overflow-hidden flex flex-col min-h-[160px] shadow-lg hover:shadow-2xl"
            >
              {/* Flag Background / Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={country.flag} 
                  alt={t(country.key)}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110 transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-brand-obsidian via-black/30 dark:via-brand-obsidian/40 to-transparent z-10" />
              </div>

              <div className="relative z-20 p-6 flex flex-col items-center justify-end h-full text-center">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] group-hover:tracking-[0.4em] transition-all duration-500 drop-shadow-md">
                  {t(country.key)}
                </span>
                <div className="mt-4 w-4 h-[1.5px] bg-brand-gold/40 group-hover:w-8 group-hover:bg-brand-gold transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/transparency"
            className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] hover:text-brand-gold transition-colors"
          >
            {t('transparencyNotice')}
          </Link>
        </div>
      </div>

      {/* Decorative Line - Reduced */}
      <div className="mt-12 w-16 h-[1px] bg-brand-gold/15 rounded-full" />
    </div>

  );
}
