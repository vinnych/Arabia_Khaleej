"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ArrowDownUp, Search, Star, Clock, TrendingUp, ChevronDown, X, RefreshCw, Globe, Copy, Check } from "lucide-react";
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
    const saved = localStorage.getItem("ak_fav_currencies");
    if (saved) setFavorites(JSON.parse(saved));
    const interval = setInterval(() => fetchRates(), 60000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Close pickers on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) setShowFromPicker(false);
      if (toRef.current && !toRef.current.contains(e.target as Node)) setShowToPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const convert = useCallback((val: number, from: string, to: string): number => {
    if (!rates[from] || !rates[to]) return 0;
    return (val / rates[from]) * rates[to];
  }, [rates]);

  const parsedAmount = parseFloat(amount) || 0;
  const result = convert(parsedAmount, fromCode, toCode);
  const exchangeRate = convert(1, fromCode, toCode);
  const inverseRate = convert(1, toCode, fromCode);

  const fromCurrency = currencies.find(c => c.code === fromCode);
  const toCurrency = currencies.find(c => c.code === toCode);

  const toggleFavorite = (code: string) => {
    const next = favorites.includes(code) ? favorites.filter(f => f !== code) : [...favorites, code];
    setFavorites(next);
    localStorage.setItem("ak_fav_currencies", JSON.stringify(next));
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
    const start = performance.now();
    const reset = (now: number) => {
      if (now - start >= 2000) { setCopied(false); return; }
      requestAnimationFrame(reset);
    };
    requestAnimationFrame(reset);
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
          {isRTL ? "جاري تحميل الأسعار..." : "Loading rates..."}
        </p>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: t("home"), href: "/" },
    { name: t("marketInsights"), href: "/market-insight" },
    { name: isRTL ? "تحويل العملات" : "Currency Exchange", href: "/currency-exchange" },
  ];

  const renderPicker = (
    isOpen: boolean,
    onSelect: (code: string) => void,
    currentCode: string,
    id?: string
  ) => {
    if (!isOpen) return null;
    return (
      <div id={id} role="listbox" className="absolute top-full mt-2 left-0 right-0 z-50 glass rounded-3xl border border-brand-gold/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Search */}
        <div className="p-4 border-b border-brand-gold/10">
          <div className="relative">
            <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-foreground/30 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              id="currency-search"
              name="currency-search"
              aria-label={isRTL ? "ابحث عن عملة" : "Search currency"}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "ابحث عن عملة..." : "Search currency..."}
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
        {/* Currency List */}
        <div className="max-h-[360px] overflow-y-auto overscroll-contain">
          {/* Favorites */}
          {grouped.favList.length > 0 && (
            <div className="px-4 pt-3">
              <p className={`text-[9px] uppercase font-black tracking-[0.3em] text-accent mb-2 ${isRTL ? 'text-right' : ''}`}>
                ★ {isRTL ? "المفضلة" : "Favorites"}
              </p>
              {grouped.favList.map(c => (
                <CurrencyRow key={`fav-${c.code}`} currency={c} isRTL={isRTL} lang={language} isActive={c.code === currentCode} isFav onToggleFav={() => toggleFavorite(c.code)} onSelect={() => { onSelect(c.code); setSearchQuery(""); }} />
              ))}
            </div>
          )}
          {/* Grouped Regions */}
          {["gcc", "major", "mena", "asia", "other"].map(region => {
            const list = grouped.groups[region];
            if (!list || list.length === 0) return null;
            return (
              <div key={region} className="px-4 pt-3 pb-1">
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
              <p className="text-foreground/30 text-sm font-medium">{isRTL ? "لا توجد نتائج" : "No results found"}</p>
            </div>
          )}
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
          {isRTL ? "تحويل العملات" : "Currency Exchange"}
        </p>
        <h1 className="text-4xl md:text-5xl font-black serif text-foreground mb-4">
          {isRTL ? "محوّل العملات" : "Currency Converter"}
        </h1>
        <p className="text-foreground/60 max-w-xl text-sm md:text-base leading-relaxed font-medium">
          {isRTL ? "حوّل بين أكثر من 40 عملة عالمية بأسعار مباشرة. عملات الخليج والعملات الرئيسية وأكثر." : "Convert between 40+ world currencies with live rates. GCC currencies, major pairs, and more."}
        </p>
      </div>

      {/* ARIA Live Region for results */}
      <div className="sr-only" aria-live="polite" role="status">
        {parsedAmount} {fromCode} {isRTL ? "يساوي" : "equals"} {result.toFixed(4)} {toCode}
      </div>

      {/* ═══ MAIN CONVERTER CARD ═══ */}
      <div className="w-full max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <div className="glass rounded-[2.5rem] p-6 md:p-10 border-brand-gold/15 relative overflow-visible">
          {/* From Section */}
          <div className="mb-3">
            <label htmlFor="from-amount" className={`text-[10px] uppercase font-black tracking-[0.3em] text-foreground/40 mb-3 block ${isRTL ? 'text-right' : ''}`}>
              {isRTL ? "من" : "From"}
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
                {renderPicker(showFromPicker, (code) => { setFromCode(code); setShowFromPicker(false); }, fromCode, "from-currency-list")}
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
              aria-label="Swap currencies"
            >
              <ArrowDownUp size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* To Section */}
          <div className="mb-6">
            <label className={`text-[10px] uppercase font-black tracking-[0.3em] text-foreground/40 mb-3 block ${isRTL ? 'text-right' : ''}`}>
              {isRTL ? "إلى" : "To"}
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
                {renderPicker(showToPicker, (code) => { setToCode(code); setShowToPicker(false); }, toCode, "to-currency-list")}
              </div>
              {/* Result */}
              <div className={`flex-1 flex flex-col justify-center ${isRTL ? 'text-left' : 'text-right'}`}>
                <p className="text-3xl md:text-4xl font-black tabular-nums tracking-tight text-accent">
                  {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
                <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">
                  {toCurrency?.symbol}
                </p>
              </div>
            </div>
          </div>

          {/* Rate Info Bar */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-brand-gold/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp size={12} className="text-green-500" />
              <p className="text-[10px] font-bold text-foreground/50 tabular-nums">
                1 {fromCode} = {exchangeRate.toFixed(4)} {toCode}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/30 hover:text-accent" aria-label="Copy result">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button onClick={() => fetchRates(true)} className={`p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/30 hover:text-accent ${refreshing ? 'animate-spin' : ''}`} aria-label="Refresh rates">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ QUICK AMOUNTS ═══ */}
      <div className="w-full max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <p className={`text-[10px] uppercase font-black tracking-[0.3em] text-foreground/30 mb-4 ${isRTL ? 'text-right' : ''}`}>
          {isRTL ? "تحويلات سريعة" : "Quick Conversions"}
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

      {/* ═══ INVERSE RATE ═══ */}
      <div className="w-full max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
        <div className="glass rounded-[2rem] p-6 border-brand-gold/10">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-xl bg-brand-gold/10 flex items-center justify-center text-accent">
              <Globe size={16} />
            </div>
            <p className="text-sm font-black">{isRTL ? "سعر الصرف المعكوس" : "Inverse Rate"}</p>
          </div>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <p className="text-foreground/50 text-sm font-medium">1 {toCode}</p>
            <p className="text-lg font-black tabular-nums">{inverseRate.toFixed(4)} <span className="text-foreground/40 text-sm">{fromCode}</span></p>
          </div>
        </div>
      </div>

      {/* ═══ GCC RATE CARDS ═══ */}
      <div className="w-full max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <p className={`text-[10px] uppercase font-black tracking-[0.3em] text-accent mb-6 ${isRTL ? 'text-right' : ''}`}>
          {isRTL ? "أسعار عملات الخليج" : "GCC Currency Rates"}
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
              <p className="text-[8px] font-bold text-foreground/20 uppercase tracking-wider mt-1">vs USD</p>
            </button>
          ))}
        </div>
      </div>

      {/* Last Updated & Disclaimer */}
      <div className="text-center max-w-xl mb-12">
        {lastUpdated && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock size={10} className="text-foreground/30" />
            <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">
              {isRTL ? "آخر تحديث:" : "Last updated:"} {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
        <p className="text-[11px] text-foreground/40 font-bold uppercase tracking-[0.3em] leading-loose">
          {isRTL ? "الأسعار لأغراض إعلامية فقط. تحقق من المؤسسات المالية المحلية للأسعار الرسمية." : "Rates for informational purposes only. Verify with local financial institutions for official rates."}
        </p>
      </div>

      {/* Back */}
      <div className="mt-8">
        <Link href="/market-insight" className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent hover:tracking-[0.6em] transition-all">
          {isRTL ? "رؤى السوق ←" : "← Market Insights"}
        </Link>
      </div>
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
      <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={onSelect}>
        <span className="text-xl">{currency.flag}</span>
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
