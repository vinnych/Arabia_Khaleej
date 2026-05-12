"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Home, Sparkles, TrendingUp, Clock, UserPlus } from "lucide-react";
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
      label: t("navMarket"),
      href: "/market-insight",
      icon: TrendingUp,
    },
    {
      label: t("navInsights"),
      href: "/insights",
      icon: Sparkles,
      isPrimary: true,
    },
    {
      label: t("navPrayer"),
      href: "/prayer",
      icon: Clock,
    },
    {
      label: t("navJoin"),
      href: "/join",
      icon: UserPlus,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      {/* Background with standardized glass effect */}
      <div className="absolute inset-0 glass rounded-none border-t border-brand-gold/15 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]" />
      
      {/* Navigation Links */}
      <div className="relative flex justify-around items-center h-16 px-4 pb-2">
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
                isPrimary ? "z-10" : "h-12 w-12",
                isActive ? "text-brand-gold" : "text-foreground/30 hover:text-foreground/60"
              )}
            >
              {/* Active Indicator Dot */}
              {!isPrimary && isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              )}
              
              <div className={cn(
                "flex flex-col items-center justify-center transition-all duration-500",
                isPrimary ? (
                  "w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-gold to-brand-gold/80 shadow-[0_4px_20px_rgba(212,175,55,0.3)] border border-white/20 active:scale-95 translate-y-[-10px]"
                ) : (
                  "p-1.5 rounded-xl active:scale-90"
                )
              )}>
                <Icon 
                  size={isPrimary ? 24 : 20} 
                  strokeWidth={isActive || isPrimary ? 2 : 1.5} 
                  className={isPrimary ? "text-brand-obsidian" : ""}
                />
              </div>
              
              {!isPrimary && (
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-[0.2em] mt-1 transition-all duration-300",
                  isActive ? "text-brand-gold opacity-100" : "opacity-0 scale-90",
                  isRTL && "text-[10px] tracking-normal"
                )}>
                  {item.label}
                </span>
              )}

              {isPrimary && (
                <span className={cn(
                  "absolute bottom-[-14px] text-[9px] font-bold uppercase tracking-[0.3em] text-brand-gold/80",
                  isRTL && "text-[10px] tracking-normal"
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
