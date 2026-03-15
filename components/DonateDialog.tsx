"use client";

import { useState } from "react";

const PRESETS = [1, 5, 10, 100];
const DONATE_URL = "https://razorpay.me/@qatarportal";

export default function DonateDialog() {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<number>(5);
  const [custom, setCustom] = useState("");

  const amount = custom || selected;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-40 bg-amber-400 hover:bg-amber-500 text-rose-900 font-bold text-xs px-3 py-2 rounded-full shadow-lg transition-colors"
        aria-label="Support Qatar Portal"
      >
        🕌 Support
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-4 z-40 w-64 bg-white rounded-2xl shadow-2xl border border-amber-100 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕌</span>
          <h2 className="text-sm font-bold text-rose-900">Support Qatar Portal</h2>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Message */}
      <p className="text-gray-500 text-xs leading-relaxed">
        Free &amp; ad-free, maintained by one person. A small contribution keeps it running.
      </p>

      {/* Preset amounts */}
      <div className="grid grid-cols-4 gap-1.5">
        {PRESETS.map((amt) => (
          <button
            key={amt}
            onClick={() => { setSelected(amt); setCustom(""); }}
            className={`py-1.5 rounded-lg text-xs font-bold border-2 transition-colors ${
              !custom && selected === amt
                ? "bg-amber-400 border-amber-400 text-rose-900"
                : "bg-white border-gray-200 text-gray-700 hover:border-amber-300"
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">$</span>
        <input
          type="number"
          min="1"
          placeholder="Custom amount"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setSelected(0); }}
          className="w-full pl-6 pr-3 py-1.5 border-2 border-gray-200 rounded-lg text-xs focus:outline-none focus:border-amber-400 text-center"
        />
      </div>

      {/* Donate button */}
      <a
        href={DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#2D81F7] hover:bg-[#1a6fe0] text-white font-bold py-2 px-4 rounded-xl transition-colors text-xs text-center"
      >
        💙 Donate ${amount} via Razorpay
      </a>

      <p className="text-xs text-gray-400 text-center">Cards, UPI &amp; net banking · No account needed</p>
    </div>
  );
}
