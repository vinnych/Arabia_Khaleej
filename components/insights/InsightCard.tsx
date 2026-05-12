"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Share2, CheckCircle2 } from "lucide-react";
import { getDeterministicFallback } from "@/lib/fallbacks";

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

interface InsightCardProps {
  item: InsightItem;
  language: string;
  isRTL: boolean;
  t: (key: string) => string;
}

export default function InsightCard({ item, language, isRTL, t }: InsightCardProps) {
  const [imgError, setImgError] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/insights/${item.slug}${language === 'ar' ? '?lang=ar' : ''}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setSharing(true);
        setTimeout(() => setSharing(false), 2000);
      }
    } catch (err) {
      console.warn("Share failed:", err);
    }
  };

  return (
    <Link
      href={`/insights/${item.slug}${language === 'ar' ? '?lang=ar' : ''}`}
      className="group relative glass p-0 rounded-[2.5rem] border-brand-gold/10 hover:border-brand-gold/30 active:scale-[0.98] transition-all duration-500 flex flex-col h-full overflow-hidden select-none shadow-xl hover:shadow-2xl ring-1 ring-brand-gold/20"
    >
      {/* Premium Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Article Image Container */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden shrink-0">
        <Image
          src={imgError ? getDeterministicFallback(item.slug) : (item.image || getDeterministicFallback(item.slug))}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          unoptimized={!!item.image && !item.image.startsWith('/') && !['unsplash.com', 'pexels.com', 'qna.org.qa', 'wam.ae', 'spa.gov.sa', 'bna.bh', 'omannews.gov.om', 'app.com.pk', 'pna.gov.ph'].some(d => item.image?.includes(d))}
          onError={() => setImgError(true)}
        />
        
        {/* Image Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/20 to-transparent opacity-80" />
        
        {/* Action Bar Overlaid on Image */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-obsidian transition-all shadow-xl"
            aria-label={t('shareArticle')}
          >
            {sharing ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
          </button>
        </div>

        {/* Badges Container */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
          <div className="px-4 py-1.5 rounded-full bg-brand-gold text-brand-obsidian text-[9px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-obsidian animate-pulse" />
            {t('premium')}
          </div>
          <div className="px-4 py-1.5 rounded-full glass border-white/20 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            {t('analystPerspective')}
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
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
              {new Date(item.pubDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold/70">
              {item.author?.name || item.source}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-gold/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-all duration-500 shadow-inner">
            <ExternalLink size={18} className="opacity-40 group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </Link>
  );
}
