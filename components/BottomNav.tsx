"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", icon: "home", en: "Home", ar: "الرئيسية" },
  { path: "/news", icon: "newspaper", en: "News", ar: "الأخبار" },
  { path: "/jobs", icon: "work", en: "Jobs", ar: "الوظائف" },
  { path: "/prayer", icon: "mosque", en: "Prayer", ar: "الصلاة" },
  { path: "/qatar-metro", icon: "subway", en: "Metro", ar: "المترو" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
      <nav className="flex items-center justify-around px-2 h-16">
        {navItems.map(({ path, icon, en, ar }) => {
          const isActive = pathname === path;
          return (
            <a
              key={path}
              href={path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <div className={`relative p-1 rounded-full transition-all duration-300 ${isActive ? "bg-blue-600/10 dark:bg-blue-400/10" : ""}`}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  {icon}
                </span>
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>
                <span className="lang-en">{en}</span>
                <span className="lang-ar">{ar}</span>
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
