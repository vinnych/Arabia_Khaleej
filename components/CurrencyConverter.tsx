"use client";

import { useState } from "react";
import type { CurrencyRate } from "@/lib/currency";

export default function CurrencyConverter({ rates }: { rates: CurrencyRate[] }) {
  const [amount, setAmount] = useState("1");

  const qty = parseFloat(amount) || 1;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">QAR Converter</h2>

      {/* Input */}
      <div className="flex items-center gap-3 mb-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-xl px-4 py-3">
        <label htmlFor="qar-amount" className="text-sm font-semibold text-rose-800 dark:text-rose-300 whitespace-nowrap">
          Convert
        </label>
        <input
          id="qar-amount"
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 text-xl font-bold text-gray-900 dark:text-slate-100 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 rounded text-right min-w-0"
          placeholder="1"
        />
        <span className="text-sm font-semibold text-rose-800 dark:text-rose-300">QAR</span>
      </div>

      {/* Rates grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {rates.map((rate) => {
          const converted = qty * rate.value;
          const formatted = converted < 1 ? converted.toFixed(4) : converted.toFixed(2);
          return (
            <div
              key={rate.code}
              className="flex items-center justify-between bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm hover:border-rose-200 dark:hover:border-rose-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{rate.flag}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm">{rate.code}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{rate.name}</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-slate-100">{formatted}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
