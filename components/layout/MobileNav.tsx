"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Home, Newspaper, TrendingUp, Clock, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();

  const navItems = [
    {
      label: t("home"),
      href: "/",
      icon: Home,
    },
    {
      label: t("marketInsights"),
      href: "/market-insight",
      icon: TrendingUp,
    },
    {
      label: t("pressTerminal"),
      href: "/insights",
      icon: Newspaper,
      isPrimary: true,
    },
    {
      label: t("prayerTimes"),
      href: "/prayer",
      icon: Clock,
    },
    {
      label: t("boutiqueEnquiry"),
      href: "/join",
      icon: UserPlus,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      {/* Background with standardized glass effect */}
      <div className="absolute inset-0 glass rounded-none border-t border-brand-gold/15 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]" />
      
      {/* Navigation Links */}
      <div className="relative flex justify-around items-end h-20 px-2 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isPrimary = "isPrimary" in item && item.isPrimary;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ touchAction: 'manipulation' }}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300 relative select-none",
                isPrimary ? "mb-4" : "h-16 w-16",
                isActive ? "text-brand-gold" : "text-foreground/40"
              )}
            >
              {/* Active Indicator Bar - Hidden for Primary */}
              {!isPrimary && isActive && (
                <div className="absolute -top-2 w-10 h-1 bg-brand-gold rounded-full shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
              )}
              
              <div className={cn(
                "flex flex-col items-center justify-center transition-all duration-500",
                isPrimary ? (
                  "w-16 h-16 rounded-full bg-gradient-to-tr from-brand-gold via-brand-gold/90 to-brand-gold/70 shadow-[0_8px_30px_rgba(212,175,55,0.4)] border-4 border-background scale-110 active:scale-95"
                ) : (
                  "p-2 rounded-2xl active:scale-90"
                )
              )}>
                <Icon 
                  size={isPrimary ? 28 : 22} 
                  strokeWidth={isActive || isPrimary ? 2.5 : 2} 
                  className={isPrimary ? "text-background" : ""}
                />
                
                {/* Glow for active icon */}
                {isActive && !isPrimary && (
                  <div className="absolute inset-0 bg-brand-gold/15 blur-xl rounded-full -z-10" />
                )}
              </div>
              
              {!isPrimary && (
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em] mt-1 transition-all duration-300",
                  isActive ? "text-brand-gold opacity-100 scale-100" : "opacity-40 scale-95",
                  isRTL && "text-[10px] tracking-normal font-bold"
                )}>
                  {item.label}
                </span>
              )}

              {isPrimary && (
                <span className={cn(
                  "absolute -bottom-5 text-[8px] font-black uppercase tracking-[0.2em] text-brand-gold whitespace-nowrap",
                  isRTL && "text-[10px] tracking-normal font-bold"
                )}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Safe Area Spacer */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background/80 backdrop-blur-3xl" />
    </nav>
  );
}
