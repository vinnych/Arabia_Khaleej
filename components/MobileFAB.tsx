"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileFABProps {
  icon: LucideIcon;
  onClick: () => void;
  label?: string;
  className?: string;
  show?: boolean;
}

export default function MobileFAB({ icon: Icon, onClick, label, className, show = true }: MobileFABProps) {
  if (!show) return null;

  return (
    <div className={cn(
      "fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-6 z-50 md:hidden",
      "animate-in fade-in slide-in-from-bottom-10 duration-500",
      className
    )}>
      <button
        onClick={onClick}
        style={{ touchAction: 'manipulation' }}
        className={cn(
          "group relative flex items-center justify-center w-14 h-14 rounded-full",
          "bg-brand-gold shadow-[0_10px_30px_rgba(212,175,55,0.4)]",
          "border-2 border-white/10 active:scale-90 transition-all duration-200"
        )}
      >
        <Icon size={24} className="text-background group-active:rotate-45 transition-transform duration-300" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-brand-gold/30 blur-xl -z-10 animate-pulse" />
        
        {/* Label (Optional) */}
        {label && (
          <span className="absolute -top-10 right-0 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-brand-gold/20 text-[10px] font-black uppercase tracking-widest text-brand-gold whitespace-nowrap shadow-xl">
            {label}
          </span>
        )}
      </button>
    </div>
  );
}
