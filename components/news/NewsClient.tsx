"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw, AlertCircle, Share2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from "@/lib/fallbacks";
import MobileFAB from "@/components/layout/MobileFAB";

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
  isPremium?: boolean;
}

export default function NewsClient({ category: initialCategory }: { category?: string }) {
  const { t, isRTL, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [displayCount, setDisplayCount] = useState(12);
  const [activeTab, setActiveTab] = useState<string>(initialCategory || 'all');
  const [sharingId, setSharingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All Updates' },
    { id: 'gcc', label: language === 'ar' ? 'أخبار الخليج' : 'GCC News' },
    { id: 'expat', label: language === 'ar' ? 'المجتمعات' : 'Communities' },
    { id: 'politics', label: language === 'ar' ? 'سياسة' : 'Politics' },
    { id: 'tech', label: language === 'ar' ? 'تكنولوجيا' : 'Tech' },
    { id: 'entertainment', label: language === 'ar' ? 'ترفيه' : 'Entertainment' },
    { id: 'sports', label: language === 'ar' ? 'رياضة' : 'Sports' },
  ];

  const markFailed = (id: string) =>
    setFailedImages(prev => { const s = new Set(prev); s.add(id); return s; });

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const categoryParam = activeTab !== 'all' ? `&category=${activeTab}` : '';
      const res = await fetch(`/api/news?lang=${language}${categoryParam}&t=${Date.now()}`, {
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
  }, [language, activeTab]);

  const handleShare = async (e: React.MouseEvent, item: NewsItem) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/news/${item.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setSharingId(item.id);
        setTimeout(() => setSharingId(null), 2000);
      }
    } catch (err) {}
  };

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
    <div className={`w-full max-w-6xl mx-auto px-4 pt-6 pb-12 ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>

      {/* Header — image clipped inside letterforms */}
      <div className="text-center mb-10 pt-2">
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
          {activeTab === 'all' ? 'UPDATES' : activeTab.toUpperCase()}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8">
          {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === tab.id 
                  ? 'bg-brand-gold text-brand-obsidian shadow-lg scale-105' 
                  : 'glass text-foreground/60 hover:text-foreground/90'
                }`}
              >
                {tab.label}
              </button>
          ))}
          
          <button
            onClick={fetchNews}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full glass border-brand-gold/15 hover:border-brand-gold/35 active:scale-95 transition-all duration-150 ml-2"
            aria-label="Refresh Feed"
          >
            <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''} text-accent`} />
          </button>
        </div>
      </div>

      {/* Mobile Floating Refresh Button */}
      <MobileFAB 
        icon={RefreshCw} 
        onClick={fetchNews} 
        label={loading ? t('processing') : t('refresh')}
        className={loading ? "opacity-50 pointer-events-none" : ""}
      />

      {/* Content Grid */}
      {loading && news.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass h-[400px] rounded-[2.5rem] animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="glass p-16 rounded-[2.5rem] text-center border-brand-gold/10">
          <p className="text-foreground/50 mb-6 text-sm font-medium">{t('somethingWentWrong')}</p>
          <button
            onClick={fetchNews}
            className="px-8 py-3 bg-brand-gold/10 text-brand-gold rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold/20 active:scale-95 transition-all"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {news.slice(0, displayCount).map((item, idx) => (
              <Link
                key={item.id + idx}
                href={`/news/${item.slug}`}
                className={`group relative glass p-0 rounded-[2.5rem] border-brand-gold/10 hover:border-brand-gold/30 active:scale-[0.98] transition-all duration-500 flex flex-col h-full overflow-hidden select-none shadow-xl hover:shadow-2xl ${
                  item.isPremium ? 'ring-1 ring-brand-gold/20' : ''
                }`}
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
                    unoptimized={true}
                    onError={() => markFailed(item.id)}
                  />
                  
                  {/* Image Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/20 to-transparent opacity-80" />
                  
                  {/* Action Bar Overlaid on Image */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => handleShare(e, item)}
                      className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-obsidian transition-all shadow-xl"
                      aria-label="Share Article"
                    >
                      {sharingId === item.id ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                    </button>
                  </div>

                    {/* Premium Badge */}
                    {item.isPremium && (
                      <div className="absolute top-6 left-6 z-20">
                        <div className="px-4 py-1.5 rounded-full bg-brand-gold text-brand-obsidian text-xs font-bold uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-obsidian animate-pulse" />
                          Premium
                        </div>
                      </div>
                    )}

                    {/* Source badge */}
                    <div className="absolute bottom-6 left-6 flex items-center gap-1.5 z-20">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.25em] bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 ${
                        item.category === 'expat' ? 'text-accent' : 'text-brand-gold'
                      }`}>
                        {sourceLabels[item.source] || item.source}
                        <CheckCircle2 size={10} strokeWidth={3} className="opacity-60" />
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1 relative z-20">
                    <h2 className={`text-lg sm:text-2xl font-bold text-foreground leading-tight group-hover:text-brand-gold transition-colors duration-500 line-clamp-3 flex-1 ${
                      item.language === 'regional' ? (item.source === 'PAKISTAN' ? 'font-serif-ur text-2xl' : 'font-serif-hi') : 'font-sans'
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
          
          {displayCount < news.length && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="group px-10 py-4 rounded-full border border-brand-gold/20 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60 hover:bg-brand-gold hover:text-brand-obsidian hover:border-brand-gold active:scale-95 transition-all duration-500 shadow-xl"
              >
                {t('loadMore') || "Discover More"}
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
