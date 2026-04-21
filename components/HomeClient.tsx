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
    { name: t('prayerTimes'), href: "/prayer", icon: Clock },
    { name: t('marketInsights'), href: "/market-insight", icon: TrendingUp },
    { name: t('pressTerminal'), href: "/news", icon: Newspaper },
    { name: t('boutiqueEnquiry'), href: "/join", icon: UserPlus },
  ];

  useEffect(() => setMounted(true), []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 relative py-8 pb-32 md:pb-12 ${isRTL ? 'font-serif-ar' : ''}`}>
      
      {/* Visually Hidden H1 for SEO */}
      <h1 className="sr-only">{t('siteName')} — {t('siteSlogan')}</h1>
      
      {/* Main Branding Section */}
      <div className="relative mb-8 sm:mb-10 animate-in fade-in zoom-in duration-1000 slide-in-from-top-4">
        <div className="relative w-40 sm:w-[340px] h-20 sm:h-32 mx-auto mb-4">
          <Image 
            src="/logo-premium-gold.png" 
            alt="Arabia Khaleej Logo" 
            fill 
            sizes="(max-width: 768px) 192px, 420px"
            className="object-contain logo-shadow"
            priority
          />
        </div>
        <p className="text-sm sm:text-base font-light italic serif text-foreground/60 px-6 max-w-sm sm:max-w-lg mx-auto leading-relaxed">
          "{t('siteSlogan')}"
        </p>
      </div>

      {/* Nav Tabs — 2×2 on mobile, single row on sm+ */}
      <nav className="w-full max-w-xl px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
        <div className="glass rounded-2xl border-brand-gold/15 p-1.5 grid grid-cols-2 sm:flex gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ touchAction: 'manipulation' }}
              className="group flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-3 py-4 sm:py-3 rounded-xl hover:bg-brand-gold/10 active:bg-brand-gold/20 active:scale-[0.96] transition-all duration-150 select-none"
            >
              <link.icon size={18} strokeWidth={1.75} className="text-accent shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/55 group-hover:text-accent transition-colors duration-150 text-center leading-snug">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Regional Guides Section */}
      <div className="w-full max-w-6xl mt-14 sm:mt-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
        <div className="flex flex-col items-center mb-8 px-4">
          <div className="flex items-center gap-4 w-full max-w-sm sm:max-w-md">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
            <h2 className="text-[11px] sm:text-xs font-bold text-accent uppercase tracking-[0.3em] whitespace-nowrap">
              {t('regionalGuides')}
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 px-2">
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
              style={{ touchAction: 'manipulation' }}
              className="group relative glass rounded-[2rem] border border-brand-gold/10 hover:border-brand-gold/50 active:scale-[0.95] transition-all duration-500 overflow-hidden flex flex-col min-h-[130px] sm:min-h-[160px] select-none shadow-xl active:shadow-none"
            >
              {/* Background Flag with high-fidelity treatment */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={country.flag}
                  alt={t(country.key)}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/40 to-transparent z-10" />
                
                {/* Glossy Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15" />
              </div>

              {/* Content */}
              <div className="relative z-20 p-5 flex flex-col items-center justify-end h-full text-center">
                <div className="mb-2 w-6 h-[2px] bg-brand-gold/30 group-hover:w-12 group-hover:bg-brand-gold transition-all duration-500" />
                <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-[0.2em] drop-shadow-lg leading-tight group-hover:text-brand-gold transition-colors duration-300">
                  {t(country.key)}
                </span>
                
                {/* Active Indicator (Mobile only visual) */}
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-brand-gold opacity-0 group-active:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
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
