"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, TrendingUp, UserPlus, Newspaper } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import PrayerLite from "@/components/prayer/PrayerLite";
import FinanceTicker from "@/components/finance/FinanceTicker";
import PublicSurvey from "@/components/news/PublicSurvey";

export default function HomeClient() {
  const { t, isRTL } = useLanguage();

  const NAV_LINKS = [
    { name: t('prayerTimes'), href: "/prayer", icon: Clock },
    { name: t('marketInsights'), href: "/market-insight", icon: TrendingUp },
    { name: t('pressTerminal'), href: "/news", icon: Newspaper },
    { name: t('boutiqueEnquiry'), href: "/join", icon: UserPlus },
  ];


  return (
    <div className={`flex flex-col items-center justify-start min-h-[100dvh] text-center px-4 relative pt-24 pb-16 md:pb-24 ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>
      
      {/* Visually Hidden H1 for SEO */}
      <h1 className="sr-only">{t('siteName')} — {t('siteSlogan')}</h1>
      
      {/* Top Utility: Prayer Times Quick Look */}
      <div className="mb-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 duration-700">
        <PrayerLite />
      </div>

      {/* Main Branding Section */}
      <div className="relative mb-12 sm:mb-16 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-4 duration-1000 fill-mode-both">
        <div className="relative w-48 sm:w-[400px] h-24 sm:h-36 mx-auto mb-6">
          <Image 
            src="/logo-premium-gold.png" 
            alt="Arabia Khaleej Logo" 
            fill 
            sizes="(max-width: 768px) 192px, 512px"
            className="object-contain logo-shadow"
            priority
            fetchPriority="high"
          />
        </div>
        <p className="text-lg sm:text-xl font-semibold italic text-foreground/80 px-6 max-w-sm sm:max-w-2xl mx-auto leading-relaxed tracking-tight">
          "{t('siteSlogan')}"
        </p>
      </div>

      {/* Market Ticker Section */}
      <div className="w-full max-w-5xl mb-12">
        <FinanceTicker />
      </div>

      {/* Nav Tabs — 2×2 on mobile, single row on sm+ */}
      <nav className="w-full max-w-5xl px-4 sm:px-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
        <div className="glass rounded-[2rem] border-brand-gold/25 p-2 grid grid-cols-2 sm:flex gap-3 shadow-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ touchAction: 'manipulation' }}
              className="group flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 py-6 sm:py-5 min-h-[64px] rounded-[1.5rem] hover:bg-brand-gold/15 active:bg-brand-gold/25 active:scale-[0.97] transition-all duration-300 select-none border border-transparent hover:border-brand-gold/30 shadow-sm"
            >
              <link.icon size={24} strokeWidth={2} className="text-brand-gold group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm sm:text-base font-bold uppercase tracking-[0.15em] text-foreground/90 group-hover:text-brand-gold transition-colors duration-300 text-center leading-snug">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Regional Guides Section */}
      <div className="w-full max-w-5xl mt-20 sm:mt-28 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
        <div className="flex flex-col items-center mb-12 px-4">
          <div className="flex items-center gap-6 w-full max-w-lg">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
            <h2 className="text-sm font-extrabold text-brand-gold uppercase tracking-[0.4em] whitespace-nowrap">
              {t('regionalGuides')}
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-8 px-2">
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
              className="group relative glass rounded-[2.5rem] border border-brand-gold/20 hover:border-brand-gold/60 active:scale-[0.96] transition-all duration-700 overflow-hidden flex flex-col min-h-[160px] sm:min-h-[200px] select-none shadow-xl"
            >
              {/* Background Flag */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={country.flag}
                  alt={t(country.key)}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover opacity-25 group-hover:opacity-50 group-hover:scale-125 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/50 to-transparent z-10" />
              </div>

              {/* Content */}
              <div className="relative z-20 p-6 flex flex-col items-center justify-end h-full text-center">
                <div className="mb-4 w-6 h-[2px] bg-brand-gold/50 group-hover:w-20 group-hover:bg-brand-gold transition-all duration-700" />
                <span className="text-sm sm:text-base font-extrabold text-white uppercase tracking-[0.2em] drop-shadow-xl leading-tight group-hover:text-brand-gold transition-colors duration-500">
                  {t(country.key)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Interactive Section: Public Sentiment */}
      <div className="w-full mt-32">
        <div className="flex flex-col items-center mb-12 px-4">
          <div className="flex items-center gap-6 w-full max-w-lg">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
            <span className="text-xs font-bold text-brand-gold/60 uppercase tracking-[0.5em] whitespace-nowrap">
              Engagement
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          </div>
        </div>
        <PublicSurvey />
      </div>

      {/* Footer Transparency Link */}
      <div className="mt-24 text-center">
        <Link 
          href="/transparency"
          className="text-[10px] font-bold text-foreground/50 uppercase tracking-[0.5em] hover:text-brand-gold transition-all duration-500 underline underline-offset-8 decoration-brand-gold/20 hover:decoration-brand-gold"
        >
          {t('transparencyNotice')}
        </Link>
      </div>

      {/* Visual Separator */}
      <div className="mt-12 w-24 h-[1px] bg-brand-gold/20 rounded-full" />
    </div>
  );
}
