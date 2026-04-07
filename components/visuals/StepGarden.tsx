"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { Step } from "@/lib/qatar-services-data";

interface Props {
  steps: Step[];
}

export default function StepGarden({ steps }: Props) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div className="bg-surface-low rounded-xl border border-stone-200 p-4">
      <h3 className="text-sm font-semibold text-on-surface mb-5">Step-by-step process</h3>

      <ol ref={ref} className="relative space-y-0">
        {/* Animated vertical line */}
        <motion.span
          aria-hidden="true"
          className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-stone-300 origin-top"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
        />

        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            className="relative flex gap-4 pb-6 last:pb-0"
            initial={{ opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={
              shouldReduce
                ? { duration: 0 }
                : { duration: 0.35, ease: "easeOut", delay: 0.15 + i * 0.1 }
            }
          >
            {/* Step number circle */}
            <motion.span
              className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center mt-0.5"
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : { scale: 0 }}
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : { duration: 0.3, ease: "backOut", delay: 0.2 + i * 0.1 }
              }
            >
              {i + 1}
            </motion.span>

            {/* Step content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-on-surface leading-snug">{step.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.detail}</p>
              {step.portal && (
                <p className="text-xs text-primary mt-1 font-medium">{step.portal}</p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
