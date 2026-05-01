"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Replace these slot IDs with the ones from your AdSense dashboard
// (Ads > By ad unit > Display ads > create unit, copy the data-ad-slot value)
export const AD_SLOTS = {
  footer:  "REPLACE_FOOTER_SLOT",   // 728x90 leaderboard above footer
  article: "REPLACE_ARTICLE_SLOT",  // 300x250 mid-article rectangle
  home:    "REPLACE_HOME_SLOT",     // responsive between-sections unit
} as const;

export default function AdUnit({
  slot,
  className = "",
}: {
  slot: string;
  className?: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    // 1. Skip if it's a placeholder (don't push for non-existent ads)
    if (slot.startsWith("REPLACE_")) return;

    // 2. Skip if already pushed for this instance
    if (pushed.current) return;

    try {
      if (typeof window !== "undefined") {
        const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);
        
        // Wait a tiny bit for the DOM element to be available
        // especially important in Next.js/React transitions
        const timeoutId = setTimeout(() => {
          try {
            // Check if there are any 'ins' elements that haven't been filled yet
            const unfilledAds = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"])');
            
            if (unfilledAds.length > 0) {
              adsbygoogle.push({});
              pushed.current = true;
            }
          } catch (e) {
            console.error("AdSense push error:", e);
          }
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    } catch (e) {
      // AdSense script not yet loaded or blocked
    }
  }, [slot]);

  // Don't render placeholder slots in production
  if (slot.startsWith("REPLACE_")) return null;

  return (
    <div className={`flex flex-col items-center gap-1 my-8 ${className}`}>
      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/20 mb-1">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7212871157824722"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
