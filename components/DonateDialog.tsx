"use client";

import { useState, useEffect } from "react";

export default function DonateDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't pop instantly on load
    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
        {/* Icon */}
        <div className="text-4xl">🕌</div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-rose-900">Support Qatar Portal</h2>

        {/* Message */}
        <p className="text-gray-600 text-sm leading-relaxed">
          Qatar Portal is free, ad-free, and maintained by one person. If it
          helps you with prayer times, news, or job searches — please consider
          a small contribution to keep it running.
        </p>

        {/* Donate button */}
        <a
          href="https://paypal.me/qatarportal"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-amber-400 hover:bg-amber-500 text-rose-900 font-bold py-3 px-6 rounded-xl transition-colors text-sm"
          onClick={() => setOpen(false)}
        >
          💛 Donate via PayPal
        </a>

        {/* Dismiss */}
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
