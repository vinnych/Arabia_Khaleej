"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity, Coins, Globe, ArrowUpRight, BarChart3, Wallet } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import { Breadcrumbs } from "@/lib/seo";

interface MarketData {
  stocks: any[];
  commodities: any[];
  currencies: any[];
  timestamp: string;
}

export default function MarketInsightClient() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/market-data", {
          signal: AbortSignal.timeout(10000) // 10s timeout
        });
        const json = await res.json();
        if (json.status === 'success') {
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: t('home'), href: "/" },
    { name: t('marketInsights'), href: "/market-insight" }
  ];

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen pt-24 pb-32 px-4 max-w-7xl mx-auto w-full ${isRTL ? 'font-serif-ar text-right' : 'text-left'}`}>
      <div className="w-full mb-8">
        <Breadcrumbs items={breadcrumbItems} isRTL={isRTL} />
      </div>
      
      {/* Header Section */}
      <div className="w-full mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-accent mb-3">{t('marketInsights')}</p>
        <h1 className="text-4xl md:text-5xl font-black serif text-foreground mb-6">
          {t('marketOverview')}
        </h1>
        <p className="text-foreground/60 max-w-2xl text-sm md:text-base leading-relaxed font-medium">
          {t('marketSummary')}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Column: Stocks & Indices */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass rounded-[2.5rem] p-8 border-brand-gold/15 overflow-hidden relative group">
            <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-accent" aria-hidden="true">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black serif">{t('stockMarkets')}</h2>
                  <p className="text-[8px] uppercase font-black tracking-[0.2em] text-foreground/30 mt-0.5">
                    Updated {data ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2" aria-live="polite">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[9px] uppercase font-bold tracking-widest text-foreground/40">{t('marketsLive')}</span>
              </div>
            </div>

            <div className="space-y-4" role="list" aria-label={t('stockMarkets')}>
              {data?.stocks.map((stock) => (
                <div key={stock.id} role="listitem" className={`flex items-center justify-between p-4 rounded-2xl hover:bg-brand-gold/5 transition-all group/item border border-transparent hover:border-brand-gold/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40 font-bold text-xs uppercase">
                      {stock.id.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-black text-sm">{stock.name}</p>
                      <p className="text-[10px] uppercase font-bold text-foreground/30 tracking-wider">{stock.country}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-left' : 'text-right'}>
                      <p className="text-sm font-black tabular-nums">{stock.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      <p className={`text-[10px] font-bold flex items-center gap-1 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {stock.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {Math.abs(stock.change).toFixed(2)}%
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="text-foreground/20 group-hover/item:text-accent transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commodities Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" role="list" aria-label={t('commodities')}>
            {data?.commodities.map((item) => (
              <div key={item.id} role="listitem" className="group relative glass rounded-[2.5rem] p-8 border border-brand-gold/15 hover:border-brand-gold/40 active:scale-[0.98] transition-all duration-300 shadow-xl overflow-hidden select-none">
                {/* Subtle Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className={`flex items-center gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 rounded-[1.5rem] bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-all duration-500 shadow-inner">
                    {item.id === 'gold' ? <Coins size={28} /> : <Activity size={28} />}
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/40">{item.symbol}</p>
                    <h3 className="text-xl font-black serif leading-tight">{item.id === 'gold' ? t('gold') : t('brentCrude')}</h3>
                  </div>
                </div>
                
                <div className={`flex items-end justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-4xl font-black tabular-nums tracking-tighter mb-1">
                      ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-[11px] font-black flex items-center gap-1.5 ${item.change >= 0 ? 'text-green-500' : 'text-red-400'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="tracking-tight">{Math.abs(item.change).toFixed(2)}%</span>
                    </p>
                  </div>
                  
                  {/* High-Fidelity Chart Placeholder */}
                  <div className="h-16 w-28 bg-brand-gold/5 rounded-2xl flex items-center justify-center overflow-hidden border border-brand-gold/10">
                     <div className="w-full h-1/2 flex items-end gap-1.5 px-3">
                        {[30, 60, 45, 80, 55, 75, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-brand-gold/30 rounded-full animate-in slide-in-from-bottom duration-1000 fill-mode-both" style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }} />
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Currencies & Quick Insight */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass rounded-[2.5rem] p-8 border-brand-gold/15 relative overflow-hidden">
            <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-accent">
                <Wallet size={20} />
              </div>
              <h2 className="text-xl font-black serif">{t('currencies')}</h2>
            </div>
            
            <div className="space-y-6" role="list" aria-label={t('currencies')}>
              {data?.currencies.map((curr) => (
                <div key={curr.code} role="listitem" className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-[10px] font-black">
                      {curr.code}
                    </div>
                    <p className="text-sm font-bold text-foreground/80">{curr.code === 'AED' ? t('uaeDirham') : curr.code === 'SAR' ? t('saudiRiyal') : curr.code === 'QAR' ? t('qatariRiyal') : curr.code === 'KWD' ? t('kuwaitiDinar') : curr.code === 'OMR' ? t('omaniRial') : t('bahrainiDinar')}</p>
                  </div>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <p className="text-sm font-black tabular-nums">{curr.rate.toFixed(3)}</p>
                    <p className="text-[9px] uppercase font-bold text-foreground/30 tracking-tighter">vs 1 USD</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-brand-gold/10">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent mb-4 block text-center">
                {t('peggedStatus')}
              </p>
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
              </div>
              <Link href="/currency-exchange" className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/20 hover:border-brand-gold/40 text-accent text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                {isRTL ? 'تحويل العملات' : 'Currency Converter'}
                <ArrowUpRight size={12} strokeWidth={3} />
              </Link>
            </div>
          </div>

          <div className="bg-brand-gold rounded-[2.5rem] p-8 text-brand-obsidian relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Globe size={160} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-black tracking-[0.3em] mb-4 opacity-60">{t('marketSentiment')}</p>
              <h3 className="text-2xl font-black serif mb-4 leading-tight">
                {t('sentimentTitle')}
              </h3>
              <p className="text-[11px] font-bold leading-relaxed mb-8 opacity-70 max-w-[240px]">
                {t('sentimentDesc')}
              </p>
              <Link href="/market-insight/details" className="inline-flex items-center gap-3 px-8 py-3.5 bg-brand-obsidian text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-obsidian/90 hover:scale-105 transition-all shadow-lg active:scale-95">
                {t('viewDetails')}
                <ArrowUpRight size={14} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-20 text-center max-w-xl">
        <p className="text-[11px] text-foreground/40 font-bold uppercase tracking-[0.4em] leading-loose">
          {t('passionProject')}
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-12">
        <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent hover:tracking-[0.6em] transition-all">
          {isRTL ? 'الرئيسية ←' : '← Home'}
        </Link>
      </div>
    </div>
  );
}
