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
    <header className="fixed top-0 left-0 right-0 z-[100] h-14 flex items-center border-b border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6">
      <div className={`flex items-center justify-between w-full max-w-6xl mx-auto`}>

        {/* Logo */}
        <Link
          href="/"
          aria-label={t('home')}
          className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'} hover:opacity-70 transition-opacity duration-200 min-w-0`}
        >
          <span className="text-[13px] font-black uppercase tracking-[0.2em] text-foreground leading-none">
            {t('siteName')}
          </span>
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
            {t('siteTagline')}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-150
                  ${isActive
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <div className="w-px h-4 bg-border mx-1" />
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
