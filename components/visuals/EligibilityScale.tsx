"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { EligibilityCriterion } from "@/lib/qatar-services-data";

interface Props {
  criteria: EligibilityCriterion[];
}

// SVG layout constants
const CX = 140;          // pivot x
const CY = 76;           // pivot y (beam centre)
const BEAM_HALF = 108;   // half beam length
const STRING_LEN = 22;   // chain length
const PAN_RX = 30;       // pan ellipse x-radius
const PAN_RY = 11;       // pan ellipse y-radius

const LEFT_X  = CX - BEAM_HALF;  // 32
const RIGHT_X = CX + BEAM_HALF;  // 248

export default function EligibilityScale({ criteria }: Props) {
  const shouldReduce = useReducedMotion();

  const met   = criteria.filter((c) =>  c.met).length;
  const unmet = criteria.filter((c) => !c.met).length;
  const ratio = criteria.length > 0 ? (met - unmet) / criteria.length : 0;

  // positive ratio (more met) → left pan heavier → beam tilts left (negative angle)
  const beamAngle = shouldReduce ? 0 : ratio * -16;

  const allMet   = unmet === 0;
  const statusColor = allMet
    ? "text-green-600"
    : unmet > met
    ? "text-red-500"
    : "text-amber-600";

  return (
    <div className="bg-surface-low rounded-xl border border-stone-200 p-4">
      <h3 className="text-sm font-semibold text-on-surface mb-4">Can you apply?</h3>

      {/* Scale — sm and above */}
      <div className="hidden sm:flex justify-center mb-5" aria-hidden="true">
        <svg
          viewBox="0 0 280 145"
          width="280"
          height="145"
          overflow="visible"
        >
          {/* ── Fulcrum ── */}
          {/* Base plate */}
          <rect x="116" y="112" width="48" height="5" rx="2.5" fill="#78716c" />
          {/* Triangle */}
          <polygon points={`${CX},${CY + 2} ${CX - 14},113 ${CX + 14},113`} fill="#9c9793" />
          {/* Pin cap */}
          <circle cx={CX} cy={CY} r="5" fill="#5c5855" />

          {/* ── Animated beam + pans ── */}
          <motion.g
            animate={{ rotate: beamAngle }}
            transition={
              shouldReduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 90, damping: 14, mass: 1 }
            }
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            {/* Beam bar */}
            <rect
              x={CX - BEAM_HALF}
              y={CY - 4}
              width={BEAM_HALF * 2}
              height={8}
              rx="4"
              fill="#78716c"
            />

            {/* ── Left pan (met) ── */}
            {/* String */}
            <line
              x1={LEFT_X}
              y1={CY + 4}
              x2={LEFT_X}
              y2={CY + 4 + STRING_LEN}
              stroke="#a8a29e"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Pan shadow */}
            <ellipse
              cx={LEFT_X}
              cy={CY + 4 + STRING_LEN + PAN_RY + 2}
              rx={PAN_RX - 2}
              ry={PAN_RY - 3}
              fill="rgba(0,0,0,0.08)"
            />
            {/* Pan */}
            <ellipse
              cx={LEFT_X}
              cy={CY + 4 + STRING_LEN + PAN_RY}
              rx={PAN_RX}
              ry={PAN_RY}
              fill={met > 0 ? "#16a34a" : "#d6d3d1"}
            />
            {/* Pan highlight */}
            <ellipse
              cx={LEFT_X}
              cy={CY + 4 + STRING_LEN + PAN_RY - 3}
              rx={PAN_RX * 0.6}
              ry={PAN_RY * 0.35}
              fill="rgba(255,255,255,0.25)"
            />
            {/* Pan label */}
            <text
              x={LEFT_X}
              y={CY + 4 + STRING_LEN + PAN_RY + 4}
              textAnchor="middle"
              fontSize="11"
              fill="white"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >
              {met} ✓
            </text>

            {/* ── Right pan (unmet) ── */}
            {/* String */}
            <line
              x1={RIGHT_X}
              y1={CY + 4}
              x2={RIGHT_X}
              y2={CY + 4 + STRING_LEN}
              stroke="#a8a29e"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Pan shadow */}
            <ellipse
              cx={RIGHT_X}
              cy={CY + 4 + STRING_LEN + PAN_RY + 2}
              rx={PAN_RX - 2}
              ry={PAN_RY - 3}
              fill="rgba(0,0,0,0.08)"
            />
            {/* Pan */}
            <ellipse
              cx={RIGHT_X}
              cy={CY + 4 + STRING_LEN + PAN_RY}
              rx={PAN_RX}
              ry={PAN_RY}
              fill={unmet > 0 ? "#dc2626" : "#d6d3d1"}
            />
            {/* Pan highlight */}
            <ellipse
              cx={RIGHT_X}
              cy={CY + 4 + STRING_LEN + PAN_RY - 3}
              rx={PAN_RX * 0.6}
              ry={PAN_RY * 0.35}
              fill="rgba(255,255,255,0.25)"
            />
            {/* Pan label */}
            <text
              x={RIGHT_X}
              y={CY + 4 + STRING_LEN + PAN_RY + 4}
              textAnchor="middle"
              fontSize="11"
              fill="white"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >
              {unmet} ✗
            </text>
          </motion.g>

          {/* Pan axis labels (outside animated group so they don't rotate) */}
          <text x={LEFT_X}  y="138" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="system-ui, sans-serif">met</text>
          <text x={RIGHT_X} y="138" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="system-ui, sans-serif">needed</text>
        </svg>
      </div>

      {/* Criteria checklist — always visible */}
      <ul className="space-y-2">
        {criteria.map((c) => (
          <li key={c.label} className="flex items-start gap-2 text-xs">
            {c.met ? (
              <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            )}
            <span className={c.met ? "text-gray-700" : "text-gray-500"}>{c.label}</span>
          </li>
        ))}
      </ul>

      <p className={`mt-3 text-xs font-semibold ${statusColor}`}>
        {allMet
          ? "All criteria met — you appear eligible to apply."
          : `${unmet} requirement${unmet !== 1 ? "s" : ""} to verify before applying.`}
      </p>
    </div>
  );
}
