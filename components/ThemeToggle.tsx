"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="p-2 w-12 h-12" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-12 h-12 rounded-full glass hover:scale-110 active:scale-90 transition-all duration-500 group relative border-brand-gold/20 shadow-lg"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 w-full h-full transition-all duration-700 ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-brand-burnished"}`} />
        <Moon className={`absolute inset-0 w-full h-full transition-all duration-700 ${theme === "dark" ? "rotate-0 scale-100 opacity-100 text-brand-gold" : "-rotate-90 scale-0 opacity-0"}`} />
      </div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 -z-10 ${theme === "dark" ? "bg-brand-gold/20 opacity-100" : "bg-brand-burnished/10 opacity-100"}`} />
    </button>
  );
}
