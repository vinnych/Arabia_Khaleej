"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Calendar, ChevronLeft, ExternalLink, Globe, Newspaper, Share2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from "@/lib/fallbacks";
import MobileFAB from "./MobileFAB";
import { useRouter } from "next/navigation";

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

export default function NewsArticleClient({ initialArticle }: { initialArticle: NewsItem }) {
  const { t, isRTL, language } = useLanguage();
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const article = initialArticle;

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.description.substring(0, 100) + "...",
      url: window.location.href,
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
      {/* Navigation */}
      <Link 
        href="/news" 
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

      <article className="space-y-12">
        {/* Header Metadata */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              article.category === 'expat' 
                ? 'bg-accent/10 border-accent/20 text-accent' 
                : 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold'
            }`}>
              {article.source}
            </span>
            <div className="flex items-center gap-2 text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={14} />
              <span>{formatDate(article.pubDate)}</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{t('officialSource')}</p>
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
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-accent text-brand-obsidian text-[10px] font-black uppercase tracking-widest rounded-lg animate-in fade-in slide-in-from-bottom-1">
                  Link Copied
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
              unoptimized={true}
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-xl sm:text-2xl text-foreground/80 leading-relaxed font-medium">
            {article.description}
          </p>
          
          <div className="glass p-8 rounded-[2rem] border-brand-gold/10 space-y-6">
            <div className="flex items-start gap-4">
              <Newspaper className="text-brand-gold shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t('readMore')}</h3>
                <p className="text-sm text-foreground/50 mb-6 leading-relaxed">
                  {t('newsDisclaimer')}
                </p>
                <Link 
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-brand-gold text-brand-obsidian px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  <span>{t('officialSource')}</span>
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Footer Disclaimer */}
      <div className="mt-24 pt-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.5em] mb-4">
          {t('transparencyNotice')}
        </p>
        <div className="w-12 h-1 bg-brand-gold/10 mx-auto" />
      </div>
    </div>
  );
}
