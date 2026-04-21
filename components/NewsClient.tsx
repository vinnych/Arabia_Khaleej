"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from "@/lib/fallbacks";
import MobileFAB from "./MobileFAB";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'gcc' | 'expat';
  language: 'en' | 'ar' | 'regional';
  image?: string;
}

export default function NewsClient() {
  const { t, isRTL, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const markFailed = (id: string) =>
    setFailedImages(prev => { const s = new Set(prev); s.add(id); return s; });

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/news?lang=${language}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (data.status === 'success') {
        setNews(data.news);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("News fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [language]);

  const sourceLabels: Record<string, string> = {
    QNA: t('qna'),
    WAM: t('wam'),
    SPA: t('spa'),
    BNA: t('bna'),
    ONA: t('ona'),
    INDIA: t('india'),
    PAKISTAN: t('pakistan'),
    BANGLADESH: t('bangladesh'),
    PHILIPPINES: t('philippines'),
  };


  return (
    <div className={`w-full max-w-6xl mx-auto px-4 pt-6 pb-32 md:pb-12 ${isRTL ? 'font-serif-ar' : ''}`}>

      {/* Header — image clipped inside letterforms */}
      <div className="text-center mb-6 pt-2">
        <h1
          className="font-black uppercase leading-[0.9] tracking-tight select-none"
          style={{
            fontSize: 'clamp(3.5rem, 18vw, 9rem)',
            backgroundImage: 'linear-gradient(135deg, #8B6914 0%, #D4AF37 25%, #F5E090 50%, #C5A028 75%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            fontFamily: 'var(--font-playfair), Georgia, serif',
          }}
        >
          UPDATES
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/40">
            {t('officialUpdates')}
          </p>
          <button
            onClick={fetchNews}
            disabled={loading}
            style={{ touchAction: 'manipulation' }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border-brand-gold/15 hover:border-brand-gold/35 active:scale-95 transition-all duration-150 select-none"
          >
            <RefreshCw size={12} className={`${loading ? 'animate-spin' : ''} text-accent`} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/55">
              {loading ? t('processing') : t('refresh')}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Floating Refresh Button - High Reachability */}
      <MobileFAB 
        icon={RefreshCw} 
        onClick={fetchNews} 
        label={loading ? t('processing') : t('refresh')}
        className={loading ? "opacity-50 pointer-events-none" : ""}
      />

      {/* Legal Banner */}
      <div className="glass px-4 py-3 rounded-xl border-l-2 border-l-brand-gold mb-6 flex items-start gap-3">
        <AlertCircle className="text-brand-gold mt-0.5 shrink-0" size={14} />
        <p className="text-[11px] text-foreground/55 italic leading-relaxed">
          {t('newsDisclaimer')}
        </p>
      </div>

      {/* Content Grid */}
      {loading && news.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass h-52 rounded-2xl animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-2xl text-center border-brand-gold/10">
          <p className="text-foreground/40 mb-4 text-sm">{t('somethingWentWrong')}</p>
          <button
            onClick={fetchNews}
            style={{ touchAction: 'manipulation' }}
            className="text-accent font-bold uppercase tracking-widest text-xs hover:underline active:opacity-70"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {news.map((item, idx) => (
            <Link
              key={item.id + idx}
              href={`/news/${item.slug}`}
              style={{ touchAction: 'manipulation' }}
              className={`group relative glass p-0 rounded-[2rem] border-brand-gold/10 hover:border-brand-gold/30 active:scale-[0.97] transition-all duration-300 flex flex-col h-full overflow-hidden select-none shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:shadow-none ${
                item.category === 'expat' ? 'border-accent/10' : ''
              }`}
            >
              {/* Premium Reflection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10 opacity-0 group-active:opacity-100 transition-opacity" />

              {/* Article Image */}
              <div className="relative w-full h-48 sm:h-52 overflow-hidden shrink-0">
                <Image
                  src={failedImages.has(item.id) ? getDeterministicFallback(item.slug) : (item.image || getDeterministicFallback(item.slug))}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 group-active:scale-105 transition-transform duration-700 ease-out"
                  unoptimized={true}
                  onError={() => markFailed(item.id)}
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Source badge overlaid on image */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 z-20">
                  <span className={`text-[10px] font-black uppercase tracking-widest bg-brand-obsidian/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 ${
                    item.category === 'expat' ? 'text-accent' : 'text-brand-gold'
                  }`}>
                    {sourceLabels[item.source] || item.source}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-20">
                <h2 className={`text-base sm:text-lg font-bold text-foreground leading-tight group-hover:text-brand-gold transition-colors duration-300 line-clamp-3 flex-1 ${
                  item.language === 'regional' ? (item.source === 'PAKISTAN' ? 'font-serif-ur text-lg' : 'font-serif-hi') : ''
                }`}>
                  {item.title}
                </h2>
                
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-brand-gold/10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
                    {new Date(item.pubDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand-gold/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-all duration-300">
                    <ExternalLink size={14} className="opacity-40 group-hover:opacity-100" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">
          {t('transparencyNotice')}
        </p>
        <div className="w-10 h-[1px] bg-brand-gold/20 mx-auto mt-3" />
      </div>
    </div>
  );
}
