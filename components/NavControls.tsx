"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavControls() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    // 1. Theme initialization
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (prefersDark) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }

    // 2. Language initialization (Arabic-first for mobile)
    const savedLang = localStorage.getItem("lang") as "en" | "ar" | null;
    const isMobile = window.innerWidth < 768;
    const defaultLang = savedLang || (isMobile ? "ar" : "en");
    
    setLang(defaultLang);
    document.documentElement.lang = defaultLang;
    document.documentElement.dir = defaultLang === "ar" ? "rtl" : "ltr";
  }, []);

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
    localStorage.setItem("lang", next);
  };

  return (
    <div className="flex items-center gap-4 lg:gap-6 shrink-0">
      <div className="flex items-center gap-2 border-slate-200 dark:border-slate-800">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="material-symbols-outlined text-slate-600 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-90 touch-manipulation cursor-pointer"
          aria-label="Toggle theme"
          title="Toggle Theme"
        >
          <span className="dark:hidden">dark_mode</span>
          <span className="hidden dark:block">light_mode</span>
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 text-sm font-bold text-slate-900 dark:text-slate-100 touch-manipulation cursor-pointer"
          aria-label="Switch language"
        >
          <span className="material-symbols-outlined text-lg">language</span>
          <span className="lang-en hidden xs:inline">العربية</span>
          <span className="lang-ar hidden xs:inline">English</span>
        </button>
      </div>
    </div>
  );
}
