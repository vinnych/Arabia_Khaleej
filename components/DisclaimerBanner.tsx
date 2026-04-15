interface DisclaimerBannerProps {
  officialSourceUrl: string;
  officialSourceName: string;
  lastReviewed: string; // e.g. "March 2026"
}

/**
 * Renders a consistent legal disclaimer at the top of every guide page.
 * Required by LEGAL_RULES.md — maintains our "unofficial reference only" status
 * and directs users to authoritative government sources.
 */
export default function DisclaimerBanner({ officialSourceUrl, officialSourceName, lastReviewed }: DisclaimerBannerProps) {
  return (
    <div className="flex gap-4 p-4 sm:p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-sm">
      {/* Icon */}
      <span
        className="material-symbols-outlined text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
        aria-hidden="true"
      >
        info
      </span>

      {/* Text */}
      <div className="space-y-1.5 min-w-0">
        <p className="font-semibold text-amber-900 dark:text-amber-200 leading-snug">
          This guide is independently researched for informational purposes only. It does not constitute legal advice.
        </p>
        <p className="text-amber-800 dark:text-amber-300/80 leading-relaxed">
          For binding, up-to-date information consult the{" "}
          <a
            href={officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2 hover:text-primary transition-colors"
          >
            {officialSourceName} <span className="material-symbols-outlined align-middle" style={{ fontSize: "13px" }}>open_in_new</span>
          </a>
          . This portal has no affiliation with the State of Qatar or its ministries.
        </p>
        <p className="text-xs text-amber-700/60 dark:text-amber-400/50 font-medium">
          Last verified: {lastReviewed}
        </p>
      </div>
    </div>
  );
}
