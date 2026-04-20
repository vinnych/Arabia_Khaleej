"use client";

import { useEffect, useState } from "react";
import { Newspaper, ExternalLink, Clock, RefreshCw, AlertCircle, Globe, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";

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

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/news?lang=${language}`);
      const data = await res.json();
      if (data.status === 'success') {
        setNews(data.news);
      } else {
        setError(true);
      }
    } catch (err) {
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

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'ar' ? 'ar-QA' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 py-12 ${isRTL ? 'font-serif-ar' : ''}`}>
      
      {/* Hero Image Section */}
      <div className="relative w-full h-[200px] sm:h-[300px] rounded-[2.5rem] overflow-hidden mb-12 border border-brand-gold/20 shadow-2xl group">
        <Image 
          src="/press-terminal-hero.png" 
          alt={t('pressTerminal')} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 backdrop-blur-xl border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-1">
                {t('officialUpdates')}
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t('pressTerminal')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-accent">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('officialUpdates')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            {t('pressTerminal')}
          </h1>
          <p className="text-foreground/50 max-w-xl text-lg">
            {t('newsDesc')}
          </p>
        </div>
        
      <div className="flex items-center gap-4">
          <button 
            onClick={fetchNews}
            className="glass px-6 py-3 rounded-2xl border-brand-gold/10 hover:border-brand-gold/30 transition-all flex items-center gap-3 group"
            disabled={loading}
          >
            <RefreshCw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} text-accent`} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {loading ? t('processing') : t('refresh')}
            </span>
          </button>
        </div>
      </div>

      {/* Legal Banner */}
      <div className="glass p-4 rounded-2xl border-l-4 border-l-brand-gold mb-12 flex items-start gap-4">
        <AlertCircle className="text-brand-gold mt-1 shrink-0" size={20} />
        <p className="text-xs md:text-sm text-foreground/60 italic leading-relaxed">
          {t('newsDisclaimer')}
        </p>
      </div>

      {/* Content Grid */}
      {loading && news.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass h-64 rounded-3xl animate-pulse bg-white/5 border-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="glass p-12 rounded-[2.5rem] text-center border-brand-gold/10">
          <p className="text-foreground/40 mb-4">{t('somethingWentWrong')}</p>
          <button onClick={fetchNews} className="text-accent font-bold uppercase tracking-widest hover:underline">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {news.map((item, idx) => (
            <Link 
              key={item.id + idx}
              href={`/news/${item.slug}`}
              className={`group glass p-0 rounded-[2.5rem] border-brand-gold/5 hover:border-brand-gold/20 transition-all hover:scale-[1.02] flex flex-col h-full shadow-lg hover:shadow-2xl relative overflow-hidden ${
                item.category === 'expat' ? 'border-accent/10' : ''
              }`}
            >
              {/* Article Image */}
              <div className="relative w-full h-48 overflow-hidden">
                {item.image && (
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized={item.image.includes('unsplash') || item.image.includes('http')}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-8 pt-6 flex flex-col h-full">
                {/* Source Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/10 ${
                      item.category === 'expat' ? 'text-accent' : 'text-brand-gold'
                    }`}>
                      {sourceLabels[item.source] || item.source}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 px-2">
                      {item.category === 'gcc' ? t('gccNews') : t('expatNews')}
                    </span>
                  </div>
                </div>

                <h2 className={`text-xl font-bold text-foreground leading-tight group-hover:text-accent transition-colors line-clamp-3 ${
                  item.language === 'regional' ? (item.source === 'PAKISTAN' ? 'font-serif-ur text-2xl' : 'font-serif-hi') : ''
                }`}>
                  {item.title}
                </h2>

                <div className="flex items-center justify-between mt-auto pt-6">
                  <ExternalLink size={14} className="text-brand-gold/40 group-hover:text-brand-gold transition-colors ml-auto" />
                </div>

              </div>

              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                {item.category === 'expat' ? <Users size={120} /> : <Newspaper size={120} />}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 text-center space-y-4">
        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.4em]">
          {t('transparencyNotice')}
        </p>
        <div className="w-12 h-[1px] bg-brand-gold/20 mx-auto" />
      </div>
    </div>
  );
}
