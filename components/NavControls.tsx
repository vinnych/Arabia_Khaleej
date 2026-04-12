"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SEARCH_ITEMS = [
  { en: "Prayer Times", ar: "مواقيت الصلاة", keywords: ["prayer", "fajr", "dhuhr", "asr", "maghrib", "isha", "salah", "صلاة"], href: "/prayer", icon: "mosque" },
  { en: "Weather", ar: "الطقس", keywords: ["weather", "temperature", "forecast", "طقس"], href: "/weather", icon: "wb_sunny" },
  { en: "Currency Exchange", ar: "العملات", keywords: ["currency", "exchange", "rate", "qar", "dollar", "عملات"], href: "/currency", icon: "currency_exchange" },
  { en: "News", ar: "الأخبار", keywords: ["news", "headlines", "أخبار"], href: "/news", icon: "newspaper" },
  { en: "Jobs in Qatar", ar: "وظائف في قطر", keywords: ["jobs", "work", "career", "vacancy", "وظائف"], href: "/jobs", icon: "work" },
  { en: "Qatar Metro", ar: "مترو قطر", keywords: ["metro", "train", "subway", "transport", "مترو"], href: "/qatar-metro", icon: "subway" },
  { en: "Visa Requirements", ar: "متطلبات التأشيرة", keywords: ["visa", "requirements", "تأشيرة"], href: "/qatar-visa-requirements", icon: "id_card" },
  { en: "Labour Law", ar: "قانون العمل", keywords: ["labour", "labor", "law", "قانون"], href: "/qatar-labour-law", icon: "gavel" },
  { en: "Salary Guide", ar: "دليل الرواتب", keywords: ["salary", "guide", "pay", "رواتب"], href: "/qatar-salary-guide", icon: "payments" },
  { en: "Cost of Living", ar: "تكلفة المعيشة", keywords: ["cost", "living", "rent", "تكلفة"], href: "/cost-of-living-doha", icon: "home" },
  { en: "Public Holidays", ar: "الإجازات الرسمية", keywords: ["holidays", "public", "إجازات"], href: "/qatar-public-holidays", icon: "calendar_month" },
  { en: "Gov Services", ar: "الخدمات الحكومية", keywords: ["government", "services", "qid", "خدمات"], href: "/qatar-services", icon: "account_balance" },
  { en: "Working in Qatar", ar: "العمل في قطر", keywords: ["working", "expat", "guide", "العمل"], href: "/work-in-qatar", icon: "flight_land" },
];

function filterResults(query: string) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return SEARCH_ITEMS.filter(
    (item) =>
      item.en.toLowerCase().includes(q) ||
      item.ar.includes(q) ||
      item.keywords.some((k) => k.includes(q))
  ).slice(0, 6);
}

export default function NavControls() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const desktopRef = useRef<HTMLInputElement>(null);

  const results = filterResults(query);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (prefersDark) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  };

  const navigateTo = (href: string) => {
    setQuery("");
    setSearchOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && results.length > 0) {
      navigateTo(results[0].href);
    }
    if (e.key === "Escape") {
      setQuery("");
      setSearchOpen(false);
      desktopRef.current?.blur();
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 lg:gap-6 shrink-0">
        {/* Desktop search */}
        <div className="hidden sm:block relative">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-lg mr-2 rtl:ml-2 rtl:mr-0">search</span>
            <input
              ref={desktopRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-32 lg:w-56 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              placeholder={lang === "ar" ? "بحث عن الخدمات..." : "Search services..."}
            />
          </div>
          {/* Desktop dropdown results */}
          {query && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 rtl:left-auto rtl:right-0 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[300]">
              {results.map((item) => (
                <button
                  key={item.href}
                  onClick={() => navigateTo(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left rtl:text-right cursor-pointer"
                >
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400" style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    <span className="lang-en">{item.en}</span>
                    <span className="lang-ar">{item.ar}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {query && results.length === 0 && (
            <div className="absolute top-full mt-2 left-0 rtl:left-auto rtl:right-0 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[300]">
              <div className="px-4 py-3 text-sm text-slate-400">
                <span className="lang-en">No results found</span>
                <span className="lang-ar">لا توجد نتائج</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile search icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="sm:hidden flex items-center justify-center w-11 h-11 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 touch-manipulation cursor-pointer"
          aria-label="Search"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>search</span>
        </button>

        <div className="flex items-center gap-2 border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-slate-800 pl-4 rtl:pl-0 rtl:pr-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="material-symbols-outlined text-slate-600 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors touch-manipulation cursor-pointer"
            aria-label="Toggle theme"
            title="Toggle Theme"
          >
            <span className="dark:hidden">dark_mode</span>
            <span className="hidden dark:block">light_mode</span>
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm font-bold text-slate-900 dark:text-slate-100 touch-manipulation cursor-pointer"
            aria-label="Switch language"
          >
            <span className="material-symbols-outlined text-lg">language</span>
            <span className="lang-en">العربية</span>
            <span className="lang-ar">English</span>
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => { setSearchOpen(false); setQuery(""); }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "20px" }}>search</span>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none focus:outline-none text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                placeholder={lang === "ar" ? "بحث..." : "Search…"}
              />
              <button
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 touch-manipulation cursor-pointer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
              </button>
            </div>
            {/* Mobile search results */}
            {results.length > 0 ? (
              <div>
                {results.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigateTo(item.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left rtl:text-right cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400" style={{ fontSize: "18px" }}>{item.icon}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      <span className="lang-en">{item.en}</span>
                      <span className="lang-ar">{item.ar}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="px-4 py-3 text-sm text-slate-400">
                <span className="lang-en">No results found</span>
                <span className="lang-ar">لا توجد نتائج</span>
              </div>
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">
                <span className="lang-en">Search for prayer times, weather, currency, news & jobs</span>
                <span className="lang-ar">ابحث عن مواقيت الصلاة، الطقس، العملات، الأخبار والوظائف</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
