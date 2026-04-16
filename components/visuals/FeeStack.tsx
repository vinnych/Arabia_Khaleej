"use client";
 
import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type { FeeItem } from "@/lib/qatar-services-data";
 
interface Props {
  fees: FeeItem[];
}
 
function coinColor(amount?: number) {
  if (amount === undefined) return "#7c2d12"; // dark brown — official rate
  if (amount === 0) return "#9ca3af"; // gray — free
  if (amount < 200) return "#16a34a"; // green
  if (amount <= 500) return "#d97706"; // amber
  return "#dc2626"; // red
}
 
export default function FeeStack({ fees }: Props) {
  const shouldReduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const total = fees.reduce((s, f) => s + (f.amount || 0), 0);
 
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-surface-low rounded-xl border border-stone-200 min-w-[140px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Approx. fees</p>
 
      <div className="relative flex flex-col-reverse items-center gap-0.5 my-1" style={{ minHeight: 72 }}>
        {fees.map((fee, i) => (
          <motion.div
            key={fee.label}
            initial={shouldReduce ? false : { y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={shouldReduce ? { duration: 0 } : { delay: i * 0.1, duration: 0.35, ease: "easeOut" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative cursor-default"
          >
            {/* Coin SVG */}
            <svg width="72" height="16" viewBox="0 0 72 16">
              <ellipse cx="36" cy="8" rx="34" ry="7" fill={coinColor(fee.amount)} opacity="0.9" />
              <ellipse cx="36" cy="6" rx="34" ry="5" fill={coinColor(fee.amount)} />
              <ellipse cx="36" cy="5" rx="28" ry="3" fill="white" opacity="0.15" />
            </svg>
            {/* Tooltip */}
            {hovered === i && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 z-10 bg-gray-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                {fee.label}: {fee.amount === undefined ? "Official Rate" : (fee.amount === 0 ? "Free" : `QAR ${fee.amount}`)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
 
      <div className="text-center">
        <p className="text-lg font-bold text-on-surface">
          {total === 0 ? "Free" : `~QAR ${total}`}
        </p>
        <p className="text-[10px] text-gray-500">estimated total</p>
      </div>
    </div>
  );
}
