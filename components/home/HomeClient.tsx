"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, TrendingUp, Newspaper, Mail, ArrowRight, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import PrayerLite from "@/components/prayer/PrayerLite";
import FinanceTicker from "@/components/finance/FinanceTicker";
import PublicSurvey from "@/components/insights/PublicSurvey";
import AdUnit, { AD_SLOTS } from "@/components/ui/AdUnit";

const NAV_LINKS = [
  { key: 'prayerTimes', href: "/prayer", icon: Clock, desc: "prayerTimesDesc" },
  { key: 'marketInsights', href: "/market-insight", icon: TrendingUp, desc: "marketInsightsDesc" },
  { key: 'pressTerminal', href: "/insights", icon: Newspaper, desc: "pressTerminalDesc" },
  { key: 'boutiqueEnquiry', href: "/join", icon: Mail, desc: "boutiqueEnquiryDesc" },
];

const GCC_COUNTRIES = [
  { id: 'saudi-arabia', key: 'saudiArabia', flag: '/flags/saudi_new.png', code: 'SA' },
  { id: 'united-arab-emirates', key: 'uae', flag: '/flags/uae_new.png', code: 'AE' },
  { id: 'qatar', key: 'qatar', flag: '/flags/qatar_new.png', code: 'QA' },
  { id: 'kuwait', key: 'kuwait', flag: '/flags/kuwait_new.png', code: 'KW' },
  { id: 'oman', key: 'oman', flag: '/flags/oman_new.png', code: 'OM' },
  { id: 'bahrain', key: 'bahrain', flag: '/flags/bahrain_new.png', code: 'BH' },
];

import { InsightItem } from "@/lib/insights";

interface HomeClientProps {
  initialInsights?: InsightItem[];
}

export default function HomeClient({ initialInsights = [] }: HomeClientProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex flex-col items-center min-h-[100dvh] ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>

      {/* ── HERO ── */}
      <section className="w-full pt-28 pb-16 px-4 flex flex-col items-center text-center border-b border-border">

        {/* Logo */}
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="relative w-44 sm:w-64 h-12 sm:h-20 mx-auto mb-6">
            <Image
              src="/logo-premium-gold.png"
              alt={`${t('siteName')} Logo`}
              fill
              sizes="(max-width: 768px) 176px, 256px"
              className="object-contain"
              priority
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Visible H1 — The GCC Standard */}
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight mb-3">
            {t('siteName')}
          </h1>
          <p className="text-sm sm:text-base font-medium text-muted-foreground tracking-widest uppercase mb-2">
            {t('siteSlogan')}
          </p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mt-3 mb-8 leading-relaxed">
            {isRTL
              ? 'مواقيت الصلاة · أسعار العملات · أسواق المال · تحليلات الخليج'
              : 'Prayer times · Currency rates · Market data · GCC editorial intelligence'}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row gap-3 mb-10" style={{ animationDelay: "120ms" }}>
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md"
          >
            <Newspaper size={16} />
            {t('pressTerminal')}
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/prayer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full card-surface font-semibold text-sm text-foreground hover:border-primary/30 active:scale-95 transition-all duration-200"
          >
            <Clock size={16} className="text-gold" />
            {t('prayerTimes')}
          </Link>
        </div>

        {/* Prayer Strip */}
        <div className="animate-fade-up w-full max-w-2xl" style={{ animationDelay: "180ms" }}>
          <PrayerLite />
        </div>
      </section>

      {/* ── MARKET TICKER ── */}
      <div className="w-full border-b border-border bg-secondary/40">
        <FinanceTicker />
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-14 flex flex-col gap-16">

        {/* ── QUICK NAV CARDS ── */}
        <section className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group card-surface rounded-xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-foreground leading-tight">
                      {t(link.key)}
                    </span>
                    <span className="text-xs text-muted-foreground leading-snug line-clamp-2">
                      {t(link.desc as any)}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200 mt-auto" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── COUNTRY GUIDES ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">{t('regionalGuides')}</h2>
            <div className="divider flex-1 mx-6" />
            <Link href="/countries" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
              {t('viewAll')} <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {GCC_COUNTRIES.map((country) => (
              <Link
                key={country.id}
                href={`/countries/${country.id}`}
                className="group card-surface rounded-xl overflow-hidden flex flex-col items-center hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
              >
                {/* Flag */}
                <div className="relative w-full h-[70px] overflow-hidden">
                  <Image
                    src={country.flag}
                    alt={t(country.key)}
                    fill
                    sizes="(max-width: 640px) 33vw, 16vw"
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                {/* Label */}
                <div className="w-full px-2 py-2.5 text-center border-t border-border">
                  <span className="text-xs font-bold uppercase tracking-wide text-foreground/80 group-hover:text-gold transition-colors duration-200 leading-tight block">
                    {t(country.key)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── EDITORIAL HIGHLIGHTS ── */}
        {initialInsights.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-serif font-bold text-foreground">{t('featuredInsights')}</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{t('regionalIntelligence')}</p>
              </div>
              <Link href="/insights" className="text-xs font-bold text-gold hover:underline flex items-center gap-1 uppercase tracking-tighter">
                {t('viewAll')} <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialInsights.map((insight) => (
                <Link
                  key={insight.slug}
                  href={`/insights/${insight.slug}`}
                  className="group flex flex-col sm:flex-row gap-4 card-surface rounded-2xl p-4 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={insight.image || "/images/insights/default.png"}
                      alt={insight.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-brand-gold text-[10px] font-bold rounded-md text-brand-obsidian uppercase tracking-tighter">
                      {insight.tags?.[0] || 'Insight'}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-gold transition-colors">
                      {insight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {insight.description}
                    </p>
                      <div className="flex items-center gap-2 mt-auto pt-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <Image 
                            src={
                              insight.author?.id === 'layla-mansour' ? '/authors/layla.png' : 
                              insight.author?.id === 'omar-qabbani' ? '/authors/omar.png' : 
                              '/authors/zaid.png'
                            } 
                            alt={insight.author?.name || t('siteName')} 
                            width={20} 
                            height={20}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-tight">
                          {insight.author?.name || t('siteName')}
                        </span>
                      </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── AD UNIT ── */}
        <AdUnit slot={AD_SLOTS.home} className="w-full" />

        {/* ── ABOUT SECTION ── */}
        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t('welcomeSectionTitle')}
          </h2>
          <div className="space-y-4">
            {t('welcomeSectionBody').split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* ── SURVEY ── */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="divider flex-1" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              {t('engagement')}
            </span>
            <div className="divider flex-1" />
          </div>
          <PublicSurvey />
        </section>

      </div>

      {/* ── FOOTER STRIP ── */}
      <div className="w-full border-t border-border py-8 px-4 flex flex-col items-center gap-3">
        <Link
          href="/transparency"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-gold transition-colors duration-200"
        >
          {t('transparencyNotice')}
        </Link>
        <div className="w-8 h-px bg-border rounded-full" />
      </div>

    </div>
  );
}
