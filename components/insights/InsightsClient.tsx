"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from "@/lib/fallbacks";
import MobileFAB from "@/components/layout/MobileFAB";
import InsightCard from "./InsightCard";

import { InsightItem } from "@/lib/insights";

export default function InsightsClient() {
   const { t, isRTL, language } = useLanguage();
   const [insights, setInsights] = useState<InsightItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const [displayCount, setDisplayCount] = useState(12);
   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
   const [activeCategory, setActiveCategory] = useState<string | null>(null);

   const categories = [...new Set(insights.map(i => i.category))].filter(Boolean);
   const filteredInsights = activeCategory ? insights.filter(i => i.category === activeCategory) : insights;

   const fetchInsights = useCallback(async (forceRefresh = false) => {
     setLoading(true);
     setError(false);
     try {
       const controller = new AbortController();
       const id = setTimeout(() => controller.abort(), 10000);
       const res = await fetch(`/api/insights?lang=${language}${forceRefresh ? '&t=' + Date.now() : ''}`, {
         signal: controller.signal,
         cache: forceRefresh ? 'no-store' : 'force-cache'
       });
       clearTimeout(id);
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
     const interval = setInterval(() => {
       fetchInsights(true);
     }, 60000);
     return () => clearInterval(interval);
   }, [fetchInsights]);

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 pt-6 pb-12 ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>

      {/* Header */}
      <div className="text-center mb-16 pt-2">
        {/* WHY: Shifted from visually heavy chrome multi-color gradient header text to a solid, understated brand gold. Sized slightly smaller for visual elegance. */}
        <h1
          className="font-extrabold uppercase leading-[0.95] tracking-tighter select-none text-brand-gold"
          style={{
            fontSize: 'clamp(2.5rem, 10vw, 5.5rem)',
            fontFamily: 'var(--font-sans)',
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
           <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-brand-gold/20 text-brand-gold cursor-default">
             {/* WHY: User requested to make 'Live' a normal indicator rather than an interactive toggle button, as auto-refresh is an always-on feature. */}
             🔴 Live
           </div>
           {lastUpdate && (
             <span className="text-xs text-gray-400">
               Updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
           )}
         </div>
      </div>

      {/* Editorial Intro Section */}
      <div className="w-full max-w-4xl mx-auto mb-24 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 hidden md:block">
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
                /* WHY: Standardized rounded boundaries to rounded-xl and stripped shadow highlights for clean editorial framing. */
                className="group relative h-[400px] rounded-xl overflow-hidden border border-brand-gold/15 hover:border-brand-gold/30 transition-all duration-500"
              >
                <Image
                  src={item.image || getDeterministicFallback(item.slug)}
                  alt={`${item.category} — ${item.source}`}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-[1200ms] ease-out"
                  priority={idx === 0}
                  unoptimized={!!item.image && !item.image.startsWith('/')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-brand-gold text-brand-obsidian text-[8px] font-black uppercase tracking-widest">
                      {t('premium')}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight group-hover:text-brand-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70 line-clamp-2 mt-2">{item.description}</p>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest mt-3 block">
                    {new Date(item.pubDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
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
            /* WHY: Adjusted placeholder skeleton rounding from bubbly rounded-2.5rem to crisp rounded-xl. */
            <div key={i} className="glass h-[400px] rounded-xl animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : error ? (
        /* WHY: Cleaned up error card geometry to standard rounded-xl, and converted bubbly button to rounded-lg container. */
        <div className="glass p-12 rounded-xl text-center border-brand-gold/10">
          <p className="text-foreground/50 mb-4 text-sm font-medium">{t('somethingWentWrong')}</p>
          <button
             onClick={() => fetchInsights(true)}
             className="px-6 py-2.5 bg-brand-gold/10 text-brand-gold rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold/15 active:scale-[0.98] transition-all"
           >
             {t('retryConnection')}
           </button>
        </div>
      ) : (
        <>
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${!activeCategory ? 'bg-brand-gold text-brand-obsidian' : 'bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-foreground'}`}
              >
                {t('all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-brand-gold text-brand-obsidian' : 'bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-foreground'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {filteredInsights.slice(0, displayCount).map((item) => (
              <InsightCard
                key={item.id}
                item={item}
                language={language}
                isRTL={isRTL}
                t={t}
              />
            ))}
          </div>
          
          {displayCount < filteredInsights.length && (
             <div className="mt-20 flex justify-center">
               <button
                 onClick={() => setDisplayCount(prev => prev + 12)}
                 /* WHY: Replaced rounded-full button and shadows with a sleek, low-profile rounded-lg layout border. */
                 className="group px-8 py-3 rounded-lg border border-brand-gold/20 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 hover:bg-brand-gold hover:text-brand-obsidian hover:border-brand-gold active:scale-[0.98] transition-all duration-300"
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
