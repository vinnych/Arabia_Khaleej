"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, RefreshCw, Share2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from "@/lib/fallbacks";
import MobileFAB from "@/components/layout/MobileFAB";

interface InsightItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  language: 'en' | 'ar' | 'regional';
  image?: string;
}

export default function InsightsClient() {
  const { t, isRTL, language } = useLanguage();
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [displayCount, setDisplayCount] = useState(12);
  const [sharingId, setSharingId] = useState<string | null>(null);

  const markFailed = (id: string) =>
    setFailedImages(prev => { const s = new Set(prev); s.add(id); return s; });

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/insights?lang=${language}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (data.status === 'success') {
        setInsights(data.insights);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Insights fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleShare = async (e: React.MouseEvent, item: InsightItem) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/insights/${item.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setSharingId(item.id);
        setTimeout(() => setSharingId(null), 2000);
      }
    } catch (err) {
      console.warn("Share failed or was cancelled:", err);
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 pt-6 pb-12 ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>

      {/* Header */}
      <div className="text-center mb-16 pt-2">
        <h1
          className="font-extrabold uppercase leading-[0.95] tracking-tighter select-none"
          style={{
            fontSize: 'clamp(3.5rem, 18vw, 9rem)',
            backgroundImage: 'linear-gradient(135deg, #8B6914 0%, #D4AF37 25%, #F5E090 50%, #C5A028 75%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            fontFamily: 'var(--font-inter), var(--font-serif)',
          }}
        >
          {t('pressTerminal')}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8">
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-full glass border-brand-gold/15 hover:border-brand-gold/35 active:scale-95 transition-all duration-150"
            aria-label={t('refreshInsights')}
          >
            <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''} text-accent`} />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">{loading ? t('processing') : t('refresh')}</span>
          </button>
        </div>
      </div>

      {/* Mobile Floating Refresh Button */}
      <MobileFAB 
        icon={RefreshCw} 
        onClick={fetchInsights} 
        label={loading ? t('processing') : t('refresh')}
        className={loading ? "opacity-50 pointer-events-none" : ""}
      />

      {/* Top Stories Section */}
      {!loading && insights.length > 0 && (
        <div className="mb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">{t('featuredInsights')}</h2>
            <div className="h-px flex-1 bg-brand-gold/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insights.slice(0, 2).map((item, idx) => (
              <Link
                key={`top-${item.id}-${idx}`}
                href={`/insights/${item.slug}${language === 'ar' ? '?lang=ar' : ''}`}
                className="group relative h-[400px] rounded-[3rem] overflow-hidden border border-brand-gold/20 shadow-2xl hover:border-brand-gold/40 transition-all duration-700"
              >
                <Image
                  src={failedImages.has(item.id) ? getDeterministicFallback(item.slug) : (item.image || getDeterministicFallback(item.slug))}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                  unoptimized={!!item.image && !item.image.startsWith('/') && !item.image.startsWith('https://images.unsplash.com') && !item.image.startsWith('https://images.pexels.com')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-brand-gold text-brand-obsidian text-[8px] font-black uppercase tracking-widest">
                      {t('premium')}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight group-hover:text-brand-gold transition-colors duration-500">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content Grid */}
      {loading && insights.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass h-[400px] rounded-[2.5rem] animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="glass p-16 rounded-[2.5rem] text-center border-brand-gold/10">
          <p className="text-foreground/50 mb-6 text-sm font-medium">{t('somethingWentWrong')}</p>
          <button
            onClick={fetchInsights}
            className="px-8 py-3 bg-brand-gold/10 text-brand-gold rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold/20 active:scale-95 transition-all"
          >
            {t('retryConnection')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {insights.slice(0, displayCount).map((item, idx) => (
              <Link
                key={item.id + idx}
                href={`/insights/${item.slug}${language === 'ar' ? '?lang=ar' : ''}`}
                className="group relative glass p-0 rounded-[2.5rem] border-brand-gold/10 hover:border-brand-gold/30 active:scale-[0.98] transition-all duration-500 flex flex-col h-full overflow-hidden select-none shadow-xl hover:shadow-2xl ring-1 ring-brand-gold/20"
              >
                {/* Premium Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Article Image Container */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden shrink-0">
                  <Image
                    src={failedImages.has(item.id) ? getDeterministicFallback(item.slug) : (item.image || getDeterministicFallback(item.slug))}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    unoptimized={!!item.image && !item.image.startsWith('/') && !item.image.startsWith('https://images.unsplash.com') && !item.image.startsWith('https://images.pexels.com')}
                    onError={() => markFailed(item.id)}
                  />
                  
                  {/* Image Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/20 to-transparent opacity-80" />
                  
                  {/* Action Bar Overlaid on Image */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => handleShare(e, item)}
                      className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-obsidian transition-all shadow-xl"
                      aria-label={t('shareArticle')}
                    >
                      {sharingId === item.id ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                    </button>
                  </div>

                  {/* Premium Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="px-4 py-1.5 rounded-full bg-brand-gold text-brand-obsidian text-xs font-bold uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-obsidian animate-pulse" />
                      {t('premium')}
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 relative z-20">
                  <h2 className={`text-lg sm:text-2xl font-bold text-foreground leading-tight group-hover:text-brand-gold transition-colors duration-500 line-clamp-3 flex-1 ${
                    item.language === 'regional' ? 'font-serif-hi' : 'font-sans'
                  }`}>
                    {item.title}
                  </h2>
                  
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-gold/10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
                      {new Date(item.pubDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-brand-gold/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-all duration-500 shadow-inner">
                      <ExternalLink size={18} className="opacity-40 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {displayCount < insights.length && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="group px-10 py-4 rounded-full border border-brand-gold/20 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60 hover:bg-brand-gold hover:text-brand-obsidian hover:border-brand-gold active:scale-95 transition-all duration-500 shadow-xl"
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </>
      )}

      {/* Transparency Note */}
      <div className="mt-24 text-center max-w-lg mx-auto">
        <div className="w-12 h-[1px] bg-brand-gold/30 mx-auto mb-6" />
        <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.4em] leading-loose">
          {t('transparencyNotice')}
        </p>
      </div>
    </div>
  );
}
