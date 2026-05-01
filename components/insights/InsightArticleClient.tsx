"use client";

import { useEffect, useState } from "react";
import { InsightItem } from "@/lib/insights";
import { useLanguage } from "@/lib/i18n";
import { Calendar, ChevronLeft, Globe, Share2, Clock, AlertCircle, Languages, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from "@/lib/fallbacks";
import MobileFAB from "@/components/layout/MobileFAB";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import AdUnit, { AD_SLOTS } from "@/components/ui/AdUnit";

export default function InsightArticleClient({ 
  initialArticle, 
  moreInsights = [] 
}: { 
  initialArticle: InsightItem, 
  moreInsights?: InsightItem[] 
}) {
  const { t, isRTL, language } = useLanguage();
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [perspectiveMode, setPerspectiveMode] = useState(false);
  const [translation, setTranslation] = useState<InsightItem | null>(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const article = initialArticle;

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const togglePerspective = async () => {
    if (!perspectiveMode && !translation) {
      setLoadingTranslation(true);
      const targetLang = language === 'en' ? 'ar' : 'en';
      try {
        const res = await fetch(`/api/insights?slug=${article.slug}&lang=${targetLang}`);
        const data = await res.json();
        if (data.status === 'success' && data.insights?.[0]) {
          setTranslation(data.insights[0]);
        }
      } catch (e) { console.error("Translation fetch failed"); }
      finally { setLoadingTranslation(false); }
    }
    setPerspectiveMode(!perspectiveMode);
  };

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.description.substring(0, 100) + "...",
      url: `${window.location.origin}/insights/${article.slug}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'ar' ? 'ar-QA' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-12 pb-32 ${isRTL ? 'font-serif-ar' : ''}`}>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[110] bg-white/5 pointer-events-none">
        <div 
          className="h-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <Link 
        href="/insights" 
        className="hidden md:inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-12 group"
      >
        <ChevronLeft size={20} className={isRTL ? 'rotate-180' : ''} />
        <span className="text-xs font-bold uppercase tracking-widest">{t('back')}</span>
      </Link>

      {/* Mobile Back FAB - Ergonomic */}
      <MobileFAB 
        icon={ChevronLeft} 
        onClick={() => router.back()} 
        label={t('back')}
        className={isRTL ? "[&_svg]:rotate-180" : ""}
      />

      {/* Perspective Mode Toggle */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={togglePerspective}
          disabled={loadingTranslation}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${
            perspectiveMode 
            ? 'bg-brand-gold text-brand-obsidian border-brand-gold' 
            : 'glass border-brand-gold/10 text-foreground/60 hover:text-accent'
          }`}
        >
          {loadingTranslation ? <RefreshCw size={16} className="animate-spin" /> : <Languages size={16} />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {perspectiveMode ? t('closePerspective') : (isRTL ? t('perspectiveModeEN') : t('perspectiveModeAR'))}
          </span>
        </button>
      </div>

      <article className={`space-y-12 transition-all duration-700 ${perspectiveMode ? 'max-w-none' : ''}`}>
        {/* Header Metadata */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-brand-gold/10 border-brand-gold/20 text-brand-gold">
              {article.source}
            </span>
            <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={14} />
              <span>{formatDate(article.pubDate)}</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">{t('officialSource')}</p>
                <p className="text-sm font-bold text-foreground">{article.source}</p>
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground/40 hover:text-accent transition-all active:scale-95"
              >
                <Share2 size={18} />
              </button>
              {copied && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-accent text-brand-obsidian text-[10px] font-bold uppercase tracking-widest rounded-lg animate-in fade-in slide-in-from-bottom-1">
                  {t('linkCopied')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {article.image && (
          <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <Image
              src={imgError ? getDeterministicFallback(article.slug) : article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              unoptimized={!article.image?.startsWith('https://images.unsplash.com') && !article.image?.startsWith('https://images.pexels.com')}
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Mid-Article Ad */}
        <AdUnit slot={AD_SLOTS.article} className="w-full" />

        {/* Article Content */}
        <div className={`grid grid-cols-1 ${perspectiveMode ? 'lg:grid-cols-2' : ''} gap-12 max-w-none`}>
          <div className="space-y-8">
            <p className="text-xl sm:text-2xl text-foreground/90 leading-relaxed font-normal italic">
              {article.description}
            </p>

            {article.content && (
              <div className={`prose prose-invert prose-brand-gold max-w-none mt-12 space-y-6 text-foreground/80 leading-loose ${isRTL ? 'text-right' : 'text-left'}`}>
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-10 mb-5 text-foreground/90" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-foreground/80" {...props} />,
                    p: ({node, ...props}) => <p className="text-lg mb-6 opacity-80" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 opacity-80" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 opacity-80" {...props} />,
                    li: ({node, ...props}) => <li className="text-lg" {...props} />,
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {perspectiveMode && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className={`p-8 rounded-[2rem] glass border-brand-gold/20 ${!isRTL ? 'font-serif-ar text-right' : ''}`}>
                <h3 className="text-sm font-black uppercase tracking-widest text-accent mb-6 border-b border-brand-gold/10 pb-4">
                  {isRTL ? 'English Translation' : 'الترجمة العربية'}
                </h3>
                {translation ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold leading-tight">{translation.title}</h2>
                    <p className="text-lg leading-relaxed opacity-80">{translation.description}</p>
                  </div>
                ) : (
                  <p className="text-sm italic opacity-40">{t('translationUnavailable')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Footer Disclaimer */}
      <div className="mt-24 pt-12 border-t border-white/5">
        
        {/* More Insights Section */}
        {moreInsights.length > 0 && (
          <div className="mb-24">
            <h2 className="text-2xl font-bold mb-8 opacity-60 uppercase tracking-widest text-center">
              {t('moreInsights')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {moreInsights.map((insight) => (
                <Link 
                  key={insight.id} 
                  href={`/insights/${insight.slug}${language === 'ar' ? '?lang=ar' : ''}`}
                  className="glass overflow-hidden rounded-3xl border-white/5 hover:border-brand-gold/30 transition-all group flex flex-col"
                >
                  {insight.image && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image 
                        src={insight.image} 
                        alt={insight.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian/80 to-transparent opacity-60" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-3 opacity-60">
                      {insight.source}
                    </p>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {insight.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.5em] mb-4">
            {t('transparencyNotice')}
          </p>
          <div className="w-12 h-1 bg-brand-gold/10 mx-auto" />
        </div>
      </div>
    </div>
  );
}
