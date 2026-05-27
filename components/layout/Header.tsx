"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useLanguage } from "@/lib/i18n";
import { usePathname } from "next/navigation";

const NAV = [
  { key: 'prayerTimes', href: "/prayer" },
  { key: 'marketInsights', href: "/market-insight" },
  { key: 'pressTerminal', href: "/insights" },
];

export default function Header() {
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center border-b border-white/5 bg-brand-obsidian/60 backdrop-blur-xl px-4 sm:px-8">
      <div className={`flex items-center justify-between w-full max-w-7xl mx-auto`}>

        {/* Logo */}
        <Link
          href="/"
          aria-label={t('home')}
          className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'} hover:opacity-70 transition-all duration-300 min-w-0 group`}
        >
          <span className="text-[14px] font-black uppercase tracking-[0.3em] text-foreground leading-none group-hover:text-brand-gold">
            {t('siteName')}
          </span>
          <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.4em] leading-none mt-1 opacity-80">
            {t('siteTagline')}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2">
          {NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                /* WHY: Transitioning from heavy capsule outlines (which compete with action buttons) to a relative block with an absolute bottom gradient underline maintains a premium, minimal route marker. */
                className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300
                  ${isActive
                    ? 'text-brand-gold'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {t(item.key)}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-brand-gold/30 via-brand-gold to-brand-gold/30 shadow-[0_1px_8px_rgba(212,175,55,0.4)] animate-in fade-in duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <div className="glass p-1 rounded-full flex items-center gap-1 border-white/10">
            <LanguageSwitcher />
            <div className="w-px h-4 bg-white/10 mx-1" />
            <ThemeToggle />
          </div>
        </div>

      </div>
    </header>
  );
}
