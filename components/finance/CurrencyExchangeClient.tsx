"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ArrowDownUp, Search, Star, Clock, TrendingUp, ChevronDown, X, RefreshCw, Globe, Copy, Check, Share2, Settings2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import { Breadcrumbs } from "@/lib/seo";

interface Currency {
  code: string; name: string; nameAr: string; symbol: string; flag: string; region: string; rate: number;
}

const REGION_LABELS: Record<string, { en: string; ar: string }> = {
  gcc: { en: "GCC Currencies", ar: "عملات الخليج" },
  major: { en: "Major Currencies", ar: "العملات الرئيسية" },
  asia: { en: "Asian Currencies", ar: "عملات آسيا" },
  mena: { en: "MENA Currencies", ar: "عملات الشرق الأوسط" },
  other: { en: "Other Currencies", ar: "عملات أخرى" },
};

export default function CurrencyExchangeClient() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("QAR");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [includeSpread, setIncludeSpread] = useState(false);
  const [spreadValue, setSpreadValue] = useState("1.5");
  const [historicalRates, setHistoricalRates] = useState<number[]>([]);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [matrixCurrencies, setMatrixCurrencies] = useState(["USD", "EUR", "GBP", "AED", "SAR"]);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const { t, isRTL, language } = useLanguage();

  const fetchRates = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/exchange-rates");
      const json = await res.json();
      if (json.status === "success") {
        setCurrencies(json.currencies);
        setRates(json.rates);
        setLastUpdated(json.timestamp);
      }
    } catch (e) { console.error("Exchange rate fetch failed"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    fetchRates();
    try {
      const saved = localStorage.getItem("ak_fav_currencies");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) {
      console.warn("localStorage unavailable for favorites");
    }
    const interval = setInterval(() => fetchRates(), 60000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  useEffect(() => {
    async function fetchHistory() {
      setHistoricalLoading(true);
      try {
        const res = await fetch(`/api/historical-rates?from=${fromCode}&to=${toCode}`);
        const data = await res.json();
        if (data.status === 'success') {
          setHistoricalRates(data.rates);
        }
      } catch(e) {
        setHistoricalRates([]);
      } finally {
        setHistoricalLoading(false);
      }
    }
    fetchHistory();
  }, [fromCode, toCode]);

  const convert = useCallback((val: number, from: string, to: string): number => {
    if (!rates[from] || !rates[to]) return 0;
    let rate = rates[to] / rates[from];
    if (includeSpread) {
      const spread = parseFloat(spreadValue) || 0;
      rate = rate * (1 - (spread / 100));
    }
    return val * rate;
  }, [rates, includeSpread, spreadValue]);

  const parsedAmount = parseFloat(amount) || 0;
  const result = convert(parsedAmount, fromCode, toCode);
  const baseRate = rates[toCode] && rates[fromCode] ? rates[toCode] / rates[fromCode] : 0;
  const spreadDeduction = includeSpread ? (parsedAmount * baseRate) - result : 0;
  const exchangeRate = baseRate;
  const inverseRate = rates[toCode] && rates[fromCode] ? rates[fromCode] / rates[toCode] : 0;

  const fromCurrency = currencies.find(c => c.code === fromCode);
  const toCurrency = currencies.find(c => c.code === toCode);

  const toggleFavorite = (code: string) => {
    const next = favorites.includes(code) ? favorites.filter(f => f !== code) : [...favorites, code];
    setFavorites(next);
    try {
      localStorage.setItem("ak_fav_currencies", JSON.stringify(next));
    } catch (e) {
      // Ignored
    }
  };

  const handleSwap = () => {
    setIsSwapping(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFromCode(toCode);
        setToCode(fromCode);
        setIsSwapping(false);
      });
    });
  };

  const handleCopy = () => {
    const text = `${parsedAmount} ${fromCode} = ${result.toFixed(4)} ${toCode}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `${parsedAmount} ${fromCode} = ${result.toFixed(4)} ${toCode}`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: t("currencyConversionTitle"), text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) { console.warn("Share failed"); }
  };

  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return currencies.filter(c =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.nameAr.includes(searchQuery) ||
      c.symbol.toLowerCase().includes(q)
    );
  }, [currencies, searchQuery]);

  const grouped = useMemo(() => {
    const favList = filteredCurrencies.filter(c => favorites.includes(c.code));
    const groups: Record<string, Currency[]> = {};
    for (const c of filteredCurrencies) {
      if (!groups[c.region]) groups[c.region] = [];
      groups[c.region].push(c);
    }
    return { favList, groups };
  }, [filteredCurrencies, favorites]);

  // Quick conversion amounts
  const quickAmounts = [1, 10, 50, 100, 500, 1000];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-14 h-14 rounded-full border-2 border-brand-gold/20 border-t-brand-gold animate-spin mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent animate-pulse">
          {t('loadingRates')}
        </p>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: t("home"), href: "/" },
    { name: t("currencyExchange"), href: "/currency-exchange" },
  ];

  const renderPicker = (
    isOpen: boolean,
    onSelect: (code: string) => void,
    currentCode: string,
    id?: string,
    onClose?: () => void
  ) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-obsidian/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
        <div 
          id={id} 
          role="dialog" 
          aria-modal="true"
          className="relative w-full max-w-md max-h-[85vh] flex flex-col glass rounded-[2.5rem] border border-brand-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
             <h3 className="text-lg font-black tracking-wide text-foreground">{t("searchCurrency") || "Select Currency"}</h3>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-foreground/50 hover:text-foreground" aria-label="Close">
               <X size={20} />
             </button>
          </div>
          
          <div className="p-4 px-6 border-b border-brand-gold/10 bg-brand-obsidian/30">
            <div className="relative">
              <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-foreground/30 ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                id="currency-search"
                name="currency-search"
                aria-label={t("searchCurrency")}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchCurrency")}
                className={`w-full py-3 ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} bg-foreground/5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold/30 border border-transparent focus:border-brand-gold/20 placeholder:text-foreground/30`}
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-foreground/30 hover:text-foreground`}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-2 px-4 pb-6 [&::-webkit-scrollbar]:hidden">
            {grouped.favList.length > 0 && (
              <div className="px-2 pt-3">
                <p className={`text-[9px] uppercase font-black tracking-[0.3em] text-accent mb-2 ${isRTL ? 'text-right' : ''}`}>
                  ★ {t("favorites")}
                </p>
                {grouped.favList.map(c => (
                  <CurrencyRow key={`fav-${c.code}`} currency={c} isRTL={isRTL} lang={language} isActive={c.code === currentCode} isFav onToggleFav={() => toggleFavorite(c.code)} onSelect={() => { onSelect(c.code); setSearchQuery(""); }} />
                ))}
              </div>
            )}
            {["gcc", "major", "mena", "asia", "other"].map(region => {
              const list = grouped.groups[region];
              if (!list || list.length === 0) return null;
              return (
                <div key={region} className="px-2 pt-3 pb-1">
                  <p className={`text-[9px] uppercase font-black tracking-[0.3em] text-foreground/30 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {REGION_LABELS[region]?.[language] || region}
                  </p>
                  {list.map(c => (
                    <CurrencyRow key={c.code} currency={c} isRTL={isRTL} lang={language} isActive={c.code === currentCode} isFav={favorites.includes(c.code)} onToggleFav={() => toggleFavorite(c.code)} onSelect={() => { onSelect(c.code); setSearchQuery(""); }} />
                  ))}
                </div>
              );
            })}
            {filteredCurrencies.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-foreground/30 text-sm font-medium">{t("noResults")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto w-full ${isRTL ? "font-serif-ar text-right" : "text-left"}`}>
      <div className="w-full mb-8">
        <Breadcrumbs items={breadcrumbItems} isRTL={isRTL} />
      </div>

      {/* Header */}
      <div className="w-full mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-accent mb-3">
          {t("currencyExchange")}
        </p>
        <h1 className="text-4xl md:text-5xl font-black serif text-foreground mb-4">
          {t("currencyConverter")}
        </h1>
        <p className="text-foreground/60 max-w-xl text-sm md:text-base leading-relaxed font-medium">
          {t("currencyExchangeDesc")}
        </p>
      </div>

      {/* ARIA Live Region for results */}
      <div className="sr-only" aria-live="polite" role="status">
        {parsedAmount} {fromCode} {t("equals")} {result.toFixed(4)} {toCode}
      </div>

      {/* ═══ MAIN CONVERTER CARD ═══ */}
      <div className="w-full max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <div className="glass rounded-[2.5rem] p-6 md:p-10 border-brand-gold/15 relative overflow-visible">
          {/* From Section */}
          <div className="mb-3">
            <label htmlFor="from-amount" className={`text-[10px] uppercase font-black tracking-[0.3em] text-foreground/40 mb-3 block ${isRTL ? 'text-right' : ''}`}>
              {t("from")}
            </label>
            <div className={`flex gap-3 items-stretch ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Currency Selector */}
              <div ref={fromRef} className="relative">
                <button
                  id="from-currency-selector"
                  onClick={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); setSearchQuery(""); }}
                  className={`flex items-center gap-2.5 px-4 py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 border border-transparent hover:border-brand-gold/20 transition-all min-w-[140px] ${isRTL ? 'flex-row-reverse' : ''}`}
                  aria-haspopup="listbox"
                  aria-expanded={showFromPicker}
                  aria-controls="from-currency-list"
                >
                  <span className="text-2xl" aria-hidden="true">{fromCurrency?.flag}</span>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-black">{fromCode}</p>
                    <p className="text-[9px] text-foreground/40 font-bold truncate max-w-[80px]">
                      {language === 'ar' ? fromCurrency?.nameAr : fromCurrency?.name}
                    </p>
                  </div>
                  <ChevronDown size={14} className={`text-foreground/30 transition-transform ${showFromPicker ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {/* Amount Input */}
              <div className="flex-1 relative">
                <input
                  id="from-amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(v) || v === "") setAmount(v);
                  }}
                  className={`w-full h-full text-3xl md:text-4xl font-black tabular-nums bg-transparent focus:outline-none ${isRTL ? 'text-left' : 'text-right'} placeholder:text-foreground/15`}
                  placeholder="0"
                />
                <span className={`absolute bottom-1 text-[9px] font-bold text-foreground/20 uppercase tracking-widest ${isRTL ? 'left-0' : 'right-0'}`}>
                  {fromCurrency?.symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center my-4 relative">
            <div className="absolute left-0 right-0 h-px bg-brand-gold/10" />
            <button
              id="swap-currencies"
              onClick={handleSwap}
              className={`relative z-10 w-12 h-12 rounded-2xl gold-gradient text-brand-obsidian flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg hover:shadow-xl ${isSwapping ? 'animate-spin' : ''}`}
              aria-label={t('swapCurrencies')}
            >
              <ArrowDownUp size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* To Section */}
          <div className="mb-6">
            <label className={`text-[10px] uppercase font-black tracking-[0.3em] text-foreground/40 mb-3 block ${isRTL ? 'text-right' : ''}`}>
              {t("to")}
            </label>
            <div className={`flex gap-3 items-stretch ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div ref={toRef} className="relative">
                <button
                  id="to-currency-selector"
                  onClick={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); setSearchQuery(""); }}
                  className={`flex items-center gap-2.5 px-4 py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 border border-transparent hover:border-brand-gold/20 transition-all min-w-[140px] ${isRTL ? 'flex-row-reverse' : ''}`}
                  aria-haspopup="listbox"
                  aria-expanded={showToPicker}
                  aria-controls="to-currency-list"
                >
                  <span className="text-2xl" aria-hidden="true">{toCurrency?.flag}</span>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-black">{toCode}</p>
                    <p className="text-[9px] text-foreground/40 font-bold truncate max-w-[80px]">
                      {language === 'ar' ? toCurrency?.nameAr : toCurrency?.name}
                    </p>
                  </div>
                  <ChevronDown size={14} className={`text-foreground/30 transition-transform ${showToPicker ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {/* Result */}
              <div className={`flex-1 flex flex-col justify-center ${isRTL ? 'text-left' : 'text-right'}`}>
                <p className="text-3xl md:text-4xl font-black tabular-nums tracking-tight text-accent">
                  {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
                <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'justify-start flex-row-reverse' : 'justify-end'}`}>
                  <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">
                    {toCurrency?.symbol}
                  </p>
                  {includeSpread && spreadDeduction > 0 && (
                    <span className="text-[9px] font-black text-red-500/90 bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      -{spreadDeduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCode} {t('fee') || 'Fee'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Remittance Spread Toggle */}
          <div className="mb-6 flex flex-col gap-2 p-4 rounded-2xl bg-foreground/5 border border-brand-gold/10">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={includeSpread}
                  onChange={(e) => setIncludeSpread(e.target.checked)}
                />
                <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${includeSpread ? 'bg-brand-gold' : 'bg-foreground/20'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${includeSpread ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-foreground/60">{t('includeExchangeSpread') || 'Include Bank/Exchange Spread'}</span>
              </label>
              {includeSpread && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={spreadValue}
                    onChange={(e) => setSpreadValue(e.target.value)}
                    className="w-16 bg-transparent border-b border-brand-gold/30 text-right text-sm font-black focus:outline-none focus:border-brand-gold"
                    step="0.1"
                  />
                  <span className="text-xs font-bold text-foreground/40">%</span>
                </div>
              )}
            </div>
            {includeSpread && (
              <p className="text-[10px] text-foreground/40 leading-relaxed">
                {t('spreadDisclaimer') || 'Simulates actual payout after average bank or exchange house profit margins.'}
              </p>
            )}
          </div>

          {/* Rate Info Bar with Sparkline */}
          <div className={`flex flex-col gap-4 pt-5 border-t border-brand-gold/10`}>
            {/* Sparkline */}
            {!historicalLoading && historicalRates.length > 1 && (
              <div className="w-full h-12 relative flex items-end border-b border-white/5 pb-2">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 10 100 90">
                  <defs>
                    <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={historicalRates[historicalRates.length - 1] >= historicalRates[0] ? '#22c55e' : '#ef4444'} stopOpacity="0.2" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 100 L 0 ${100 - (((historicalRates[0] - Math.min(...historicalRates)) / (Math.max(...historicalRates) - Math.min(...historicalRates) || 1)) * 80 + 10)} ${historicalRates.slice(1).map((rate, i) => {
                      const max = Math.max(...historicalRates);
                      const min = Math.min(...historicalRates);
                      const range = max === min ? 1 : max - min;
                      const x = ((i + 1) / (historicalRates.length - 1)) * 100;
                      const y = 100 - (((rate - min) / range) * 80 + 10);
                      return `L ${x} ${y}`;
                    }).join(' ')} L 100 100 Z`}
                    fill="url(#sparkGradient)"
                  />
                  <path
                    d={`M 0 ${100 - (((historicalRates[0] - Math.min(...historicalRates)) / (Math.max(...historicalRates) - Math.min(...historicalRates) || 1)) * 80 + 10)} ${historicalRates.slice(1).map((rate, i) => {
                      const max = Math.max(...historicalRates);
                      const min = Math.min(...historicalRates);
                      const range = max === min ? 1 : max - min;
                      const x = ((i + 1) / (historicalRates.length - 1)) * 100;
                      const y = 100 - (((rate - min) / range) * 80 + 10);
                      return `L ${x} ${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke={historicalRates[historicalRates.length - 1] >= historicalRates[0] ? '#22c55e' : '#ef4444'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="absolute inset-0 flex justify-between items-end pb-1 text-[8px] font-bold text-foreground/30 uppercase tracking-widest pointer-events-none">
                  <span>7D Ago</span>
                  <span>Today</span>
                </div>
              </div>
            )}
            
            <div className={`flex flex-wrap items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp size={12} className="text-green-500" />
                  <p className="text-[10px] font-bold text-foreground/50 tabular-nums">
                    1 {fromCode} = {exchangeRate.toFixed(4)} {toCode}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 bg-foreground/5 px-2 py-1 rounded-md border border-brand-gold/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Globe size={10} className="text-foreground/40" />
                  <p className="text-[9px] font-bold text-foreground/40 tabular-nums">
                    1 {toCode} = {inverseRate.toFixed(4)} {fromCode}
                  </p>
                </div>
              </div>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/30 hover:text-accent" aria-label={t('shareResult')}>
                <Share2 size={14} />
              </button>
              <button onClick={handleCopy} className="p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/30 hover:text-accent" aria-label={t('copyResult')}>
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button onClick={() => fetchRates(true)} className={`p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/30 hover:text-accent ${refreshing ? 'animate-spin' : ''}`} aria-label={t('refreshRates')}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ═══ CROSS-RATE MATRIX ═══ */}
      <div className="w-full max-w-4xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <p className={`text-[10px] uppercase font-black tracking-[0.3em] text-foreground/30 mb-4 ${isRTL ? 'text-right' : ''}`}>
          {t("crossRateMatrix") || "Cross-Rate Matrix"}
        </p>
        <div className="glass rounded-[2rem] p-6 border-brand-gold/10 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b border-white/5 bg-brand-obsidian sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]"></th>
                {matrixCurrencies.map(c => (
                  <th key={`th-${c}`} className="p-3 border-b border-white/5 text-xs font-bold text-brand-gold tracking-widest text-center">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixCurrencies.map(rowC => (
                <tr key={`tr-${rowC}`} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border-b border-white/5 font-black text-sm bg-brand-obsidian sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">{rowC}</td>
                  {matrixCurrencies.map(colC => {
                    if (rowC === colC) return <td key={`${rowC}-${colC}`} className="p-3 border-b border-white/5 text-foreground/20 text-xs text-center">-</td>;
                    const r = rates[colC] && rates[rowC] ? rates[colC] / rates[rowC] : 0;
                    return <td key={`${rowC}-${colC}`} className="p-3 border-b border-white/5 text-foreground/80 tabular-nums text-sm font-medium text-center">{r.toFixed(4)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ QUICK AMOUNTS ═══ */}
      <div className="w-full max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <p className={`text-[10px] uppercase font-black tracking-[0.3em] text-foreground/30 mb-4 ${isRTL ? 'text-right' : ''}`}>
          {t("quickConversions")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickAmounts.map(amt => (
            <button
              key={amt}
              onClick={() => setAmount(String(amt))}
              className={`glass rounded-2xl p-4 border-brand-gold/10 hover:border-brand-gold/30 transition-all group text-left ${isRTL ? 'text-right' : ''} ${amount === String(amt) ? 'border-brand-gold/40 bg-brand-gold/5' : ''}`}
            >
              <p className="text-xs font-bold text-foreground/40 mb-1">{amt.toLocaleString()} {fromCode}</p>
              <p className="text-lg font-black tabular-nums tracking-tight group-hover:text-accent transition-colors">
                {convert(amt, fromCode, toCode).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-[10px] font-bold text-foreground/30 ml-1">{toCode}</span>
              </p>
            </button>
          ))}
        </div>
      </div>


      {/* ═══ GCC RATE CARDS ═══ */}
      <div className="w-full max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <p className={`text-[10px] uppercase font-black tracking-[0.3em] text-accent mb-6 ${isRTL ? 'text-right' : ''}`}>
          {t("gccCurrencyRates")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {currencies.filter(c => c.region === "gcc").map(c => (
            <button
              key={c.code}
              onClick={() => { setFromCode("USD"); setToCode(c.code); setAmount("1"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="glass rounded-2xl p-4 border-brand-gold/10 hover:border-brand-gold/30 transition-all text-center group"
            >
              <span className="text-2xl mb-2 block">{c.flag}</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">{c.code}</p>
              <p className="text-lg font-black tabular-nums group-hover:text-accent transition-colors">{c.rate.toFixed(3)}</p>
              <p className="text-[8px] font-bold text-foreground/20 uppercase tracking-wider mt-1">{t('vsUSD')}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Currency Peg Detail - Substantive Content for AdSense */}
      <div className="w-full max-w-4xl mx-auto mt-24 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-gold mb-8 tracking-tight">
          {t('currencyDetailTitle')}
        </h2>
        <div className="space-y-6">
          {t('currencyDetailBody').split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-base sm:text-lg text-foreground/70 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Last Updated & Disclaimer */}
      <div className="text-center max-w-xl mb-12">
        {lastUpdated && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock size={10} className="text-foreground/30" />
            <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
              {t("lastUpdatedColon")} {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
        <p className="text-[11px] text-foreground/40 font-bold uppercase tracking-[0.3em] leading-loose">
          {t("ratesInfoOnly")}
        </p>
      </div>

      {/* Back */}
      <div className="mt-8">
        <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent hover:tracking-[0.6em] transition-all">
          {isRTL ? `← ${t('home')}` : `← ${t('home')}`}
        </Link>
      </div>

      {/* MODALS */}
      {showFromPicker && renderPicker(showFromPicker, (code) => { setFromCode(code); setShowFromPicker(false); }, fromCode, "from-currency-list", () => setShowFromPicker(false))}
      {showToPicker && renderPicker(showToPicker, (code) => { setToCode(code); setShowToPicker(false); }, toCode, "to-currency-list", () => setShowToPicker(false))}
    </div>
  );
}

/* ═══ Currency Row Sub-component ═══ */
function CurrencyRow({ currency, isRTL, lang, isActive, isFav, onToggleFav, onSelect }: {
  currency: Currency; isRTL: boolean; lang: string; isActive: boolean; isFav: boolean;
  onToggleFav: () => void; onSelect: () => void;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-foreground/5 transition-all cursor-pointer group ${isActive ? 'bg-brand-gold/10 border border-brand-gold/20' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div 
        role="button"
        tabIndex={0}
        className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`} 
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      >
        <span className="text-xl" aria-hidden="true">{currency.flag}</span>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-sm font-black">{currency.code}</p>
          <p className="text-[10px] text-foreground/40 font-medium">{lang === 'ar' ? currency.nameAr : currency.name}</p>
        </div>
      </div>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <p className="text-xs font-bold tabular-nums text-foreground/50">{currency.rate.toFixed(3)}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          className={`p-1 rounded-lg transition-all ${isFav ? 'text-brand-gold' : 'text-foreground/15 hover:text-brand-gold/50'}`}
          aria-label={`${isFav ? 'Remove from' : 'Add to'} favorites`}
        >
          <Star size={12} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
