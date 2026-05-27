"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, TrendingUp, Newspaper, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import PrayerLite from "@/components/prayer/PrayerLite";
import FinanceTicker from "@/components/finance/FinanceTicker";
import PublicSurvey from "@/components/insights/PublicSurvey";
import { getDeterministicFallback } from "@/lib/fallbacks";
import { InsightItem } from "@/lib/insights";

// ─── WHY A SEPARATE SUB-COMPONENT ────────────────────────────────────────────
// Each featured insight card needs its OWN imgError state. If we kept the map
// inside the parent, all cards would share one error flag and a single broken
// image would hide every card's image. Extracting to FeaturedInsightCard gives
// each card independent error tracking — identical to the pattern in InsightCard.tsx.
function FeaturedInsightCard({
  insight,
  formatDateSafe,
  t,
}: {
  insight: InsightItem;
  formatDateSafe: (d: string | undefined) => string;
  t: (key: string) => string;
}) {
  // Per-card error flag: when the external news image 404s, fall back to deterministic Unsplash image.
  const [imgError, setImgError] = useState(false);

  // WHY unoptimized guard: insight.image can be from any external news agency (QNA, WAM, SPA, BNA…).
  // Next.js image optimizer only works for domains listed in next.config.ts remotePatterns.
  // For unlisted domains it throws a 400 error. So we detect external-unknown URLs and bypass
  // the optimizer for them, while still optimizing local paths and known CDN URLs.
  const KNOWN_DOMAINS = ['unsplash.com', 'pexels.com', 'qna.org.qa', 'wam.ae', 'spa.gov.sa', 'bna.bh', 'omannews.gov.om', 'app.com.pk', 'pna.gov.ph'];
  const isExternalUnknown = !!insight.image && !insight.image.startsWith('/') && !KNOWN_DOMAINS.some(d => insight.image?.includes(d));

  const imgSrc = imgError
    ? getDeterministicFallback(insight.slug)         // deterministic Unsplash fallback
    : (insight.image || getDeterministicFallback(insight.slug)); // real image or fallback

  return (
    <Link
      key={insight.slug}
      href={`/insights/${insight.slug}`}
      className="group flex flex-col gap-5 glass rounded-xl p-5 hover:border-white/10 transition-all duration-350"
    >
      <div className="relative w-full h-56 rounded-lg overflow-hidden border border-white/5">
        <Image
          src={imgSrc}
          alt={insight.title}
          fill
          // WHY sizes: Required for `fill` images. Tells the browser which image variant
          // to fetch at each breakpoint. Without it, Next.js defaults to 100vw which
          // downloads a needlessly large image for a 50%-wide grid column on desktop.
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          // WHY unoptimized: Bypasses the Next.js image proxy for unknown external domains.
          // Avoids 400 errors from the optimizer when an image comes from a non-allowlisted CDN.
          unoptimized={isExternalUnknown}
          onError={() => setImgError(true)}
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
              {/* WHY: Author avatar mapped by ID to local static images. Width/height = container size (32px). */}
              <Image
                src={
                  insight.author?.id === 'layla-mansour' ? '/images/authors/layla-mansour.png' :
                  '/images/authors/zaid-alharbi.png'
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
            {formatDateSafe(insight.pubDate)}
          </div>
        </div>
      </div>
    </Link>
  );
}

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

interface HomeClientProps {
  initialInsights?: InsightItem[];
}

export default function HomeClient({ initialInsights = [] }: HomeClientProps) {
  const { t, isRTL } = useLanguage();

  const formatDateSafe = (dateString: string | undefined) => {
    if (!dateString) return 'Recent';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`flex flex-col items-center min-h-[100dvh] relative ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>
      
      {/* ── BACKGROUND ORCHESTRATION ── */}
      {/* WHY: Completely stripped the absolute floating gradient blurs to maintain a solid, clean, dark-obsidian background. */}

      {/* ── HERO ── */}
      <section className="relative w-full pt-32 pb-24 px-4 flex flex-col items-center text-center overflow-hidden z-10">
        {/* Subtle Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        {/* Logo */}
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="relative w-44 sm:w-72 h-16 sm:h-24 mx-auto mb-10 group cursor-pointer">
            {/* WHY: Removed glowing visual drop-shadows under the brand logo to respect minimalist typographic cleanliness. */}
            <Image
              src="/logo-premium-gold.png"
              alt={`${t('siteName')} Logo`}
              fill
              sizes="(max-width: 768px) 176px, 288px"
              className="object-contain transition-opacity duration-300 group-hover:opacity-85"
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
        {/* WHY: Replaced rounded bubbly capsule styles and moving glowing gradients with clean, classic rounded-lg geometry and solid brand borders. */}
        <div className="animate-fade-up flex flex-col sm:flex-row gap-4 mb-16" style={{ animationDelay: "200ms" }}>
          <Link
            href="/insights"
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-obsidian px-8 py-3 rounded-lg font-bold text-sm flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]"
          >
            <Newspaper size={16} />
            {t('pressTerminal')}
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/prayer"
            className="glass px-8 py-3 rounded-lg font-bold text-sm text-foreground flex items-center gap-2.5 hover:border-white/15 transition-all duration-200 active:scale-[0.98]"
          >
            <Clock size={16} className="text-brand-gold" />
            {t('prayerTimes')}
          </Link>
        </div>

        {/* Prayer Strip Refinement */}
        {/* WHY: Shifted rounding standard from large round 2rem to minimal rounded-xl to keep layout structures crisp. */}
        <div className="animate-fade-up w-full max-w-3xl glass p-1 rounded-xl" style={{ animationDelay: "300ms" }}>
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
          {/* WHY: Redesigned the cards grid with minimal geometries, removing heavy translation lifts, bubbles, and visual shadows. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group mesh-surface rounded-xl p-6 flex flex-col gap-4 hover:border-brand-gold/20 transition-all duration-300 border border-white/5"
                >
                  <div className="w-10 h-10 rounded bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/15 transition-colors">
                    <Icon size={18} className="text-brand-gold" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-display font-bold text-foreground group-hover:text-brand-gold transition-colors">
                      {t(link.key)}
                    </span>
                    <span className="text-xs text-muted-foreground/75 leading-relaxed font-light">
                       {t(link.desc)}
                     </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-gold opacity-60 group-hover:opacity-100 transition-opacity mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('explore')}</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1 duration-200" />
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
                /* WHY: Replaced bubbly rounding and heavy grid offsets with sleek rounded-xl boundaries and low-profile opacity transitions. */
                className="group relative h-60 rounded-xl overflow-hidden border border-white/5 hover:opacity-95 transition-opacity duration-300"
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
        {/* WHY: Swapped extremely round containers with crisp, modern, low-profile layouts that highlight editorial text instead of shiny frames. */}
        {initialInsights.length > 0 && (
          <section className="mesh-surface rounded-xl p-8 md:p-12 border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div className="text-center md:text-left">
                <p className="text-[10px] text-brand-gold uppercase tracking-[0.3em] font-black mb-3">{t('regionalIntelligence')}</p>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tighter">{t('featuredInsights')}</h2>
              </div>
              <Link href="/insights" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-obsidian px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors duration-200">
                {t('openTerminal')}
              </Link>
            </div>

            {/* WHY: Delegating each card to FeaturedInsightCard so each card gets its own
                 independent imgError state. A shared flag in the parent would cause all cards
                 to fall back simultaneously when just one image fails. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialInsights.map((insight) => (
                <FeaturedInsightCard
                  key={insight.slug}
                  insight={insight}
                  formatDateSafe={formatDateSafe}
                  t={t}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── SURVEY ── */}
        {/* WHY: Tightened survey boundary from bubbly rounded-[4rem] to sleek, unified rounded-xl container. */}
        <section className="relative py-20 px-8 glass rounded-xl text-center overflow-hidden">
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
