"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function FinanceTicker() {
  const [rates, setRates] = useState<any>(null);
  const [goldPrice, setGoldPrice] = useState<number>(2385.40); // Base live price
  const [mounted, setMounted] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    setMounted(true);
    
    async function fetchData() {
      try {
        const res = await fetch("/api/market-data", {
          signal: AbortSignal.timeout(8000) // 8s timeout
        });
        const json = await res.json();
        if (json.status === 'success') {
          const rateMap = json.currencies.reduce((acc: any, curr: any) => {
            acc[curr.code] = curr.rate;
            return acc;
          }, {});
          setRates(rateMap);
          
          const gold = json.commodities.find((c: any) => c.id === 'gold');
          if (gold) setGoldPrice(gold.value);
        }
      } catch (e) {
        console.error("Finance API failed", e);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !rates) return null;

  const gccCurrencies = [
    { code: "AED", name: t('uaeDirham'), symbol: "د.إ" },
    { code: "SAR", name: t('saudiRiyal'), symbol: "ر.س" },
    { code: "KWD", name: t('kuwaitiDinar'), symbol: "د.ك" },
    { code: "QAR", name: t('qatariRiyal'), symbol: "ر.ق" },
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both ${isRTL ? 'font-serif-ar' : 'font-sans'}`}>
      <div className="glass rounded-full py-3 px-6 flex flex-wrap items-center justify-between gap-6 border-brand-gold/15 overflow-hidden shadow-lg">
        
        {/* Gold Section */}
        <div className={`flex items-center gap-3 ${isRTL ? 'pl-6 border-l' : 'pr-6 border-r'} border-brand-gold/15 group`}>
          <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-accent group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-all">
            <Coins size={14} strokeWidth={2.5} />
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-foreground/50 leading-none mb-1">{t('gold')}</p>
            <p className="text-sm font-bold text-foreground tabular-nums leading-none">
              ${goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className={`ml-2 text-[10px] text-green-600 dark:text-green-400 font-bold ${isRTL ? 'mr-2' : 'ml-2'}`}>+0.12%</span>
            </p>
          </div>
        </div>

        {/* Currency Scroll/List */}
        <div className="flex-grow flex items-center gap-10 overflow-x-auto no-scrollbar py-2">
          {gccCurrencies.map((curr) => (
            <div key={curr.code} className="flex flex-col min-w-fit">
              <p className={`text-[10px] uppercase font-bold tracking-[0.15em] text-foreground/50 ${isRTL ? 'text-right' : ''}`}>{curr.code} / USD</p>
              <p className={`text-sm font-bold text-foreground tabular-nums ${isRTL ? 'text-right' : ''}`}>
                {rates[curr.code]?.toFixed(3)}
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-[10px] opacity-40 font-medium uppercase`}>{curr.symbol}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Market Status */}
        <div className={`hidden lg:flex items-center gap-3 ${isRTL ? 'pr-8 border-r' : 'pl-8 border-l'} border-brand-gold/25`}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/50">{t('marketsLive')}</span>
        </div>
      </div>
    </div>
  );
}
