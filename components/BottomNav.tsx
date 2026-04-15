"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import NavControls from "./NavControls";

const PRIMARY_NAV = [
  { path: "/",        icon: "home",    en: "Home",    ar: "الرئيسية" },
  { path: "/prayer",  icon: "mosque",  en: "Prayer",  ar: "الصلاة"   },
  { path: "/currency",icon: "payments",en: "Rates",   ar: "العملات"  },
];

const GUIDES_ITEMS = [
  { path: "/qatar-visa-requirements", icon: "id_card",        en: "Visa",           ar: "التأشيرات"    },
  { path: "/qatar-metro",             icon: "subway",          en: "Metro",          ar: "المترو"       },
  { path: "/qatar-salary-guide",      icon: "bar_chart",       en: "Salaries",       ar: "الرواتب"      },
  { path: "/qatar-public-holidays",   icon: "calendar_month",  en: "Holidays",       ar: "الإجازات"     },
  { path: "/qatar-labour-law",        icon: "gavel",           en: "Labour Law",     ar: "قانون العمل"  },
  { path: "/cost-of-living-doha",     icon: "home_work",       en: "Cost of Living", ar: "تكلفة المعيشة"},
  { path: "/work-in-qatar",           icon: "work",            en: "Work in Qatar",  ar: "العمل في قطر" },
  { path: "/emergency-numbers-qatar", icon: "emergency",       en: "Emergency",      ar: "الطوارئ"      },
  { path: "/qatar-services/qid",      icon: "badge",           en: "QID",            ar: "البطاقة"      },
  { path: "/qatar-services/work-visa",icon: "work_history",    en: "Work Visa",      ar: "تأشيرة العمل" },
];

const MORE_ITEMS = [
  { path: "/weather",             icon: "wb_sunny",      en: "Weather",    ar: "الطقس"    },
  { path: "/sky",                 icon: "nights_stay",   en: "Sky View",   ar: "السماء"   },
  { path: "/emergency-numbers-qatar", icon: "emergency", en: "Emergency",  ar: "الطوارئ"  },
  { path: "/about",               icon: "info",          en: "About",      ar: "حول"      },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<"guides" | "more" | null>(null);

  const closeSheet = () => setSheet(null);

  return (
    <>
      {/* Bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
        <nav className="flex items-center justify-around px-2 h-16" role="navigation" aria-label="Mobile navigation">

          {/* Primary items */}
          {PRIMARY_NAV.map(({ path, icon, en, ar }) => {
            const isActive = pathname === path;
            return (
              <a
                key={path}
                href={path}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all touch-active ${
                  isActive ? "text-primary" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${isActive ? "bg-primary/10 scale-110" : ""}`}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings: isActive
                        ? "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24"
                        : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    {icon}
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}>
                  <span className="lang-ar">{ar}</span>
                  <span className="lang-en">{en}</span>
                </span>
              </a>
            );
          })}

          {/* Guides trigger */}
          <button
            onClick={() => setSheet(sheet === "guides" ? null : "guides")}
            aria-expanded={sheet === "guides"}
            aria-label="All Guides"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all touch-active ${
              sheet === "guides" ? "text-primary" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${sheet === "guides" ? "bg-primary/10 scale-110" : ""}`}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px", fontVariationSettings: sheet === "guides" ? "'FILL' 1" : "'FILL' 0" }}>
                menu_book
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              <span className="lang-ar">الأدلة</span>
              <span className="lang-en">Guides</span>
            </span>
          </button>

          {/* More trigger */}
          <button
            onClick={() => setSheet(sheet === "more" ? null : "more")}
            aria-expanded={sheet === "more"}
            aria-label="More pages"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all touch-active ${
              sheet === "more" ? "text-primary" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${sheet === "more" ? "bg-primary/10 scale-110" : ""}`}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px", fontVariationSettings: sheet === "more" ? "'FILL' 1" : "'FILL' 0" }}>
                more_horiz
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              <span className="lang-ar">المزيد</span>
              <span className="lang-en">More</span>
            </span>
          </button>

        </nav>
      </div>

      {/* Backdrop */}
      {sheet && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={closeSheet}
          aria-hidden="true"
        />
      )}

      {/* Guides sheet */}
      <div
        className={`md:hidden fixed left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl transition-transform duration-300 max-h-[85vh] overflow-y-auto pb-safe ${
          sheet === "guides" ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        style={{ bottom: "calc(4rem + env(safe-area-inset-bottom))" }}
        role="dialog"
        aria-label="Guides menu"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        {/* System Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
          <NavControls />
          <button 
            onClick={closeSheet}
            className="p-2 -me-2 text-slate-400 hover:text-primary transition-colors touch-active"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Category Header */}
        <div className="px-6 pt-8 pb-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">
            <span className="lang-ar">الأدلة الأساسية</span>
            <span className="lang-en">Essential Guides</span>
          </p>
          <div className="w-12 h-1 bg-accent rounded-full mb-6" />
        </div>

        <div className="px-5 pb-8">
          <div className="grid grid-cols-2 gap-3 pb-4">
            {GUIDES_ITEMS.map(({ path, icon, en, ar }) => (
              <a
                key={path}
                href={path}
                onClick={closeSheet}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
              >
                <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 0" }}>
                  {icon}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                  <span className="lang-ar">{ar}</span>
                  <span className="lang-en">{en}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* More sheet */}
      <div
        className={`md:hidden fixed left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl transition-transform duration-300 max-h-[85vh] overflow-y-auto pb-safe ${
          sheet === "more" ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        style={{ bottom: "calc(4rem + env(safe-area-inset-bottom))" }}
        role="dialog"
        aria-label="More menu"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        {/* System Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
          <NavControls />
          <button 
            onClick={closeSheet}
            className="p-2 -me-2 text-slate-400 hover:text-primary transition-colors touch-active"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Category Header */}
        <div className="px-6 pt-8 pb-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">
            <span className="lang-ar">المزيد</span>
            <span className="lang-en">More</span>
          </p>
          <div className="w-12 h-1 bg-accent rounded-full mb-6" />
        </div>

        <div className="px-5 pb-10">
          <div className="grid grid-cols-2 gap-3">
            {MORE_ITEMS.map(({ path, icon, en, ar }) => (
              <a
                key={path}
                href={path}
                onClick={closeSheet}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
              >
                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 shrink-0" style={{ fontSize: "20px" }}>
                  {icon}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                  <span className="lang-ar">{ar}</span>
                  <span className="lang-en">{en}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
