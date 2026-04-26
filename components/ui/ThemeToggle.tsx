"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="p-2 w-12 h-12" />;

  const isDark = theme === "dark";

  return (
    <div className="relative group/theme">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex items-center justify-center w-12 h-12 rounded-full glass hover:scale-110 active:scale-90 transition-all duration-500 group relative border-brand-gold/20 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="relative w-5 h-5">
          <Sun className={`absolute inset-0 w-full h-full transition-all duration-700 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-brand-burnished"}`} />
          <Moon className={`absolute inset-0 w-full h-full transition-all duration-700 ${isDark ? "rotate-0 scale-100 opacity-100 text-brand-gold" : "-rotate-90 scale-0 opacity-0"}`} />
        </div>
        
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 -z-10 ${isDark ? "bg-brand-gold/20 opacity-100" : "bg-brand-burnished/10 opacity-100"}`} />
      </button>

      {/* Purposeful Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-obsidian/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-brand-gold rounded-lg opacity-0 group-hover/theme:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-brand-gold/20 z-50">
        {isDark ? 'Daylight Vision' : 'Night Mode'}
      </div>
    </div>
  );
}
