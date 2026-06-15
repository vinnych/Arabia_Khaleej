"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from '@/lib/i18n/i18n';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const AD_SLOTS = {
  footer:  "REPLACE_FOOTER_SLOT",
  article: "REPLACE_ARTICLE_SLOT",
  home:    "REPLACE_HOME_SLOT",
} as const;

export default function AdUnit({
   slot,
   className = "",
   variant = "standard",
 }: {
   slot: string;
   className?: string;
   variant?: "standard" | "premium";
 }) {
   const { t } = useLanguage();
   const pushed = useRef(false);

    useEffect(() => {
      if (variant === "premium") return;
      if (slot.startsWith("REPLACE_")) return;
      if (pushed.current) return;

      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        }
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }, [slot, variant]);

   if (variant === "premium") {
     return (
       <div className={`relative overflow-hidden rounded-xl border border-border bg-secondary p-10 text-center ${className}`}>
         <div className="relative z-10">
           <h3 className="mb-2 text-xl font-bold text-gold uppercase tracking-widest">{t('premium')} Intelligence</h3>
           <p className="mb-8 text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">{t('siteSlogan')}</p>
           <button className="rounded-full bg-amber-600 dark:bg-amber-500 px-10 py-3 text-sm font-bold text-white transition-all hover:opacity-80 active:scale-95">
             {t('boutiqueEnquiry')}
           </button>
         </div>
       </div>
     );
   }

   if (slot.startsWith("REPLACE_")) return null;

   return (
     <div className={`flex flex-col items-center gap-1 my-8 ${className}`}>
       <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/20 mb-1">
         Advertisement
       </span>
       <ins
         className="adsbygoogle"
         style={{ display: "block" }}
         data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-7212871157824722"}
         data-ad-slot={slot}
         data-ad-format="auto"
         data-full-width-responsive="true"
       />
     </div>
   );
 }