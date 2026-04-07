"use client";
 
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
 
interface Props {
  minDays: number;
  maxDays: number;
  label?: string;
  fastTrack?: boolean;
}
 
function arcColor(maxDays: number) {
  if (maxDays <= 7) return "#16a34a"; // green-600
  if (maxDays <= 30) return "#d97706"; // amber-600
  return "#dc2626"; // red-600
}
 
const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MAX_DAYS_SCALE = 90;
 
export default function ProcessingClock({ minDays, maxDays, label = "Processing time", fastTrack }: Props) {
  const shouldReduce = useReducedMotion();
  const color = arcColor(maxDays);
  const fillRatio = Math.min(maxDays / MAX_DAYS_SCALE, 1);
  const targetDash = fillRatio * CIRCUMFERENCE;
 
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-surface-low rounded-xl border border-stone-200 min-w-[140px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="8"
          />
          {/* Arc */}
          <motion.circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: shouldReduce ? CIRCUMFERENCE - targetDash : CIRCUMFERENCE - targetDash }}
            transition={shouldReduce ? { duration: 0 } : { duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold leading-tight text-on-surface">
            {minDays === maxDays ? `${minDays}` : `${minDays}–${maxDays}`}
          </span>
          <span className="text-[10px] text-gray-500">days</span>
        </div>
      </div>
      {fastTrack && (
        <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary-accent/20 text-amber-800 px-2 py-0.5 rounded-full">
          Fast track available
        </span>
      )}
    </div>
  );
}
 