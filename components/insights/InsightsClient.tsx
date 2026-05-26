"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from "@/lib/fallbacks";
import MobileFAB from "@/components/layout/MobileFAB";
import InsightCard from "./InsightCard";

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
  author?: {
    id: string;
    name: string;
    role: string;
  };
}

export default function InsightsClient() {
   const { t, isRTL, language } = useLanguage();
   const [insights, setInsights] = useState<InsightItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const [displayCount, setDisplayCount] = useState(12);
   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
   const [autoRefresh, setAutoRefresh] = useState(true);

   const fetchInsights = useCallback(async (forceRefresh = false) => {
     setLoading(true);
     setError(false);
     try {
       const res = await fetch(`/api/insights?lang=${language}${forceRefresh ? '&t=' + Date.now() : ''}`, {
         signal: AbortSignal.timeout(10000),
         cache: forceRefresh ? 'no-store' : 'force-cache'
       });
       if (!res.ok) throw new Error('Network response was not ok');
       const data = await res.json();
       if (data.status === 'success') {
         setInsights(data.insights);
         setLastUpdate(new Date());
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

   useEffect(() => {
     if (!autoRefresh) return;
     const interval = setInterval(() => {
       fetchInsights(true);
     }, 60000);
     return () => clearInterval(interval);
   }, [autoRefresh, fetchInsights]);

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
          {t('intelligenceTerminal')}
        </h1>
        
<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8">
           <button
             onClick={() => fetchInsights(true)}
             disabled={loading}
             className="flex items-center gap-2 px-6 py-3 rounded-full glass border-brand-gold/15 hover:border-brand-gold/35 active:scale-95 transition-all duration-150"
             aria-label={t('refreshInsights')}
           >
             <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''} text-accent`} />
             <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">{loading ? t('processing') : t('refresh')}</span>
           </button>
           <button
             onClick={() => setAutoRefresh(!autoRefresh)}
             className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${autoRefresh ? 'bg-brand-gold/20 text-brand-gold' : 'bg-gray-800/50 text-gray-400'}`}
           >
             {autoRefresh ? '🔴 Live' : '⚪ Paused'}
           </button>
           {lastUpdate && (
             <span className="text-xs text-gray-400">
               Updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
           )}
         </div>
      </div>

      {/* Editorial Intro Section */}
      <div className="w-full max-w-4xl mx-auto mb-24 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-gold mb-8 tracking-tight uppercase tracking-[0.1em]">
          {t('insightsIntroTitle')}
        </h2>
        <div className="space-y-6">
          {t('insightsIntroBody').split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-base sm:text-lg text-foreground/70 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-12 h-px w-24 bg-brand-gold/20 mx-auto" />
      </div>

{/* Mobile Floating Refresh Button */}
       <MobileFAB 
         icon={RefreshCw} 
         onClick={() => fetchInsights(true)}
         label={loading ? t('processing') : t('refresh')}
         className={loading ? "opacity-50 pointer-events-none" : ""}
       />

      {/* Top Stories Section */}
      {!loading && insights.length > 0 && (
        <div className="mb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">{t('intelligenceBriefing')}</h2>
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
                  src={item.image || getDeterministicFallback(item.slug)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                  priority={idx === 0}
                  unoptimized={!!item.image && !item.image.startsWith('/')}
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
             onClick={() => fetchInsights(true)}
             className="px-8 py-3 bg-brand-gold/10 text-brand-gold rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold/20 active:scale-95 transition-all"
           >
             {t('retryConnection')}
           </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {insights.slice(0, displayCount).map((item) => (
              <InsightCard
                key={item.id}
                item={item}
                language={language}
                isRTL={isRTL}
                t={t}
              />
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
