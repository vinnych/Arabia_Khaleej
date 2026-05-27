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
      /* WHY: Replaced heavy visual shadow layers, glow rings, and bubbly rounded-[2.5rem] corners with crisp, modern rounded-xl geometries and subtle borders. */
      className="group relative glass p-0 rounded-xl border-brand-gold/10 hover:border-brand-gold/25 active:scale-[0.99] transition-all duration-300 flex flex-col h-full overflow-hidden select-none border border-white/5"
    >
      {/* Premium Reflection Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Article Image Container */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden shrink-0 border-b border-white/5">
        <Image
          src={imgError ? getDeterministicFallback(item.slug) : (item.image || getDeterministicFallback(item.slug))}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
          unoptimized={!!item.image && !item.image.startsWith('/') && !['unsplash.com', 'pexels.com', 'qna.org.qa', 'wam.ae', 'spa.gov.sa', 'bna.bh', 'omannews.gov.om', 'app.com.pk', 'pna.gov.ph'].some(d => item.image?.includes(d))}
          onError={() => setImgError(true)}
        />
        
        {/* Image Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian via-brand-obsidian/20 to-transparent opacity-80" />
        
        {/* Action Bar Overlaid on Image */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={handleShare}
            className="w-8 h-8 rounded glass border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-obsidian transition-all"
            aria-label={t('shareArticle')}
          >
            {sharing ? <CheckCircle2 size={14} /> : <Share2 size={14} />}
          </button>
        </div>

        {/* Badges Container */}
        {/* WHY: Standardized badge shapes from bubbly rounded-full pill blocks to clean, geometric rounded containers. */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="px-2.5 py-1 rounded bg-brand-gold text-brand-obsidian text-[8px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-obsidian animate-pulse" />
            {t('premium')}
          </div>
          <div className="px-2.5 py-1 rounded glass border-white/10 text-white text-[8px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            {t('analystPerspective')}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative z-20">
        <h2 className={`text-base sm:text-xl font-bold text-foreground leading-tight group-hover:text-brand-gold transition-colors duration-300 line-clamp-3 flex-1 ${
          item.language === 'regional' ? 'font-serif-hi' : 'font-sans'
        }`}>
          {item.title}
        </h2>
        
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-brand-gold/5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/50 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-brand-gold/40" />
              {new Date(item.pubDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold/70">
              {item.author?.name || item.source}
            </span>
          </div>
          {/* WHY: Converted bubbly 2xl/shadow container into a tight, flat geometric chevron square. */}
          <div className="w-9 h-9 rounded bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-all duration-300">
            <ExternalLink size={14} className="opacity-45 group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </Link>
  );
}
