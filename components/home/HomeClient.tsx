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
    <div className={`flex flex-col items-center min-h-[100dvh] relative ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>
      
      {/* ── BACKGROUND ORCHESTRATION ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/5 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>

      {/* ── HERO ── */}
      <section className="relative w-full pt-32 pb-24 px-4 flex flex-col items-center text-center overflow-hidden z-10">
        {/* Subtle Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        {/* Logo */}
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="relative w-44 sm:w-72 h-16 sm:h-24 mx-auto mb-10 group cursor-pointer">
            <Image
              src="/logo-premium-gold.png"
              alt={`${t('siteName')} Logo`}
              fill
              sizes="(max-width: 768px) 176px, 288px"
              className="object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-500"
              priority
              fetchPriority="high"
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="animate-fade-up max-w-4xl mx-auto" style={{ animationDelay: "100ms" }}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-foreground mb-6 leading-[0.9] tracking-tighter">
            {t('siteName')}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-brand-gold tracking-[0.5em] uppercase mb-6 opacity-80">
            {t('siteSlogan')}
          </p>
          <div className="w-12 h-px bg-brand-gold/30 mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light italic">
            {isRTL
              ? 'مواقيت الصلاة · أسعار العملات · أسواق المال · تحليلات الخليج'
              : 'Prayer times · Currency rates · Market data · GCC editorial intelligence'}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row gap-6 mb-16" style={{ animationDelay: "200ms" }}>
          <Link
            href="/insights"
            className="gold-liquid px-10 py-4 rounded-full font-bold text-sm flex items-center gap-3 shadow-[0_10px_30px_rgba(212,175,55,0.2)] active:scale-95"
          >
            <Newspaper size={18} />
            {t('pressTerminal')}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/prayer"
            className="glass px-10 py-4 rounded-full font-bold text-sm text-foreground flex items-center gap-3 active:scale-95"
          >
            <Clock size={18} className="text-brand-gold" />
            {t('prayerTimes')}
          </Link>
        </div>

        {/* Prayer Strip Refinement */}
        <div className="animate-fade-up w-full max-w-3xl glass p-1 rounded-[2rem]" style={{ animationDelay: "300ms" }}>
          <PrayerLite />
        </div>
      </section>

      {/* ── MARKET TICKER ── */}
      <div className="w-full border-y border-border/50 bg-brand-obsidian/40 backdrop-blur-md z-10">
        <FinanceTicker />
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-24 flex flex-col gap-24 z-10">

        {/* ── QUICK NAV CARDS ── */}
        <section className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group mesh-surface rounded-[2rem] p-8 flex flex-col gap-6 hover:border-brand-gold/30 transition-all duration-500 hover:-translate-y-2 shadow-xl"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                    <Icon size={24} className="text-brand-gold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xl font-display font-bold text-foreground group-hover:text-brand-gold transition-colors">
                      {t(link.key)}
                    </span>
                    <span className="text-sm text-muted-foreground/70 leading-relaxed font-light">
                      {t(link.desc as any)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-gold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-xs font-bold uppercase tracking-widest">{t('explore')}</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── COUNTRY GUIDES ── */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-display font-bold text-foreground tracking-tighter">{t('regionalGuides')}</h2>
              <div className="w-16 h-1 bg-brand-gold" />
            </div>
            <Link href="/countries" className="text-xs font-bold text-brand-gold hover:opacity-80 flex items-center gap-2 uppercase tracking-[0.2em] border-b border-brand-gold/20 pb-1">
              {t('viewAllCountries')} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {GCC_COUNTRIES.map((country) => (
              <Link
                key={country.id}
                href={`/countries/${country.id}`}
                className="group relative h-64 rounded-[2rem] overflow-hidden shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <Image
                  src={country.flag}
                  alt={t(country.key)}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-white drop-shadow-md">
                    {t(country.key)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── EDITORIAL HIGHLIGHTS ── */}
        {initialInsights.length > 0 && (
          <section className="mesh-surface rounded-[3rem] p-8 md:p-16 border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="text-center md:text-left">
                <p className="text-xs text-brand-gold uppercase tracking-[0.4em] font-bold mb-4">{t('regionalIntelligence')}</p>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tighter">{t('featuredInsights')}</h2>
              </div>
              <Link href="/insights" className="gold-liquid px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg">
                {t('openTerminal')}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {initialInsights.map((insight) => (
                <Link
                  key={insight.slug}
                  href={`/insights/${insight.slug}`}
                  className="group flex flex-col gap-6 glass rounded-[2.5rem] p-6 hover:bg-white/5 transition-all duration-500"
                >
                  <div className="relative w-full h-64 rounded-[2rem] overflow-hidden">
                    <Image
                      src={insight.image || "/images/insights/default.png"}
                      alt={insight.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6 px-4 py-2 glass text-[10px] font-bold rounded-full text-brand-gold uppercase tracking-widest border-brand-gold/20">
                      {insight.tags?.[0] || 'Insight'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 px-2">
                    <h3 className="text-2xl font-display font-bold text-foreground leading-tight group-hover:text-brand-gold transition-colors">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed font-light italic">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/10 p-0.5 border border-brand-gold/20">
                          <Image 
                            src={
                              insight.author?.id === 'layla-mansour' ? '/authors/layla.png' : 
                              insight.author?.id === 'omar-qabbani' ? '/authors/omar.png' : 
                              '/authors/zaid.png'
                            } 
                            alt={insight.author?.name || t('siteName')} 
                            width={32} 
                            height={32}
                            className="rounded-full grayscale group-hover:grayscale-0 transition-all"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">
                          {insight.author?.name || t('siteName')}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-brand-gold/50 uppercase tracking-tighter">
                        {new Date(insight.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── SURVEY ── */}
        <section className="relative py-24 px-8 glass rounded-[4rem] text-center overflow-hidden">
           {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-[0.5em] mb-6 block">
              {t('engagement')}
            </span>
            <PublicSurvey />
          </div>
        </section>

      </div>

      {/* ── FOOTER STRIP ── */}
      <footer className="w-full border-t border-border/10 py-16 px-4 flex flex-col items-center gap-6 z-10">
        <Link
          href="/transparency"
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.5em] hover:text-brand-gold transition-all duration-300"
        >
          {t('transparencyNotice')}
        </Link>
        <div className="w-12 h-px bg-brand-gold/20 rounded-full" />
      </footer>

    </div>
  );
}
