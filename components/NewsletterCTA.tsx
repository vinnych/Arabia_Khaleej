"use client";

import { useState, useEffect } from "react";

export default function NewsletterCTA() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem("newsletter_dismissed") === "1");
  }, []);

  if (dismissed) return null;

  function dismiss() {
    localStorage.setItem("newsletter_dismissed", "1");
    setDismissed(true);
  }

  return (
    <div className="bg-secondary-accent/10 rounded-xl px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
      <div className="flex-1">
        <p className="font-semibold text-amber-900 dark:text-amber-300 text-sm">Get weekly Qatar updates — free, no spam</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href="https://qatarportal.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:scale-[1.02] transition-transform"
        >
          Subscribe free →
        </a>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-lg leading-none p-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
