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
      {/* WHY: We refactored to a completely flat, symmetric mobile bar. By removing the heavy, floating offset primary button and visual gold gradient shadows, we achieve an elegant, balanced editorial navigation standard that aligns with high-end news portals (e.g. Bloomberg). */}
      <div className="relative flex justify-around items-center h-16 px-4 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ touchAction: 'manipulation' }}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300 relative select-none h-12 w-12",
                isActive ? "text-brand-gold" : "text-foreground/30 hover:text-foreground/60"
              )}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              )}
              
              <div className="flex flex-col items-center justify-center transition-all duration-300 p-1.5 rounded-xl active:scale-90">
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2 : 1.5} 
                />
              </div>
              
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-[0.2em] mt-1 transition-all duration-300",
                isActive ? "text-brand-gold opacity-100" : "opacity-0 scale-90",
                isRTL && "text-[10px] tracking-normal"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      
      {/* Safe Area Spacer */}
      <div className="h-[env(safe-area-inset-bottom)] bg-background/80 backdrop-blur-3xl" />
    </nav>
  );
}
