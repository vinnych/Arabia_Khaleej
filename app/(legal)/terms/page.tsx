"use client";

import { useLanguage } from "@/lib/i18n";

export default function TermsPage() {
  const { t, isRTL } = useLanguage();

  const clauses = [
    {
      number: "01",
      title: "Acceptance",
      body: "By accessing or using Arabia Khaleej you agree to be bound by these Terms. If you do not agree, please discontinue use immediately. Your continued use after any revision constitutes acceptance of the updated Terms.",
    },
    {
      number: "02",
      title: "Informational Use Only",
      body: "All content published on Arabia Khaleej is provided for general informational purposes only. Nothing on this site constitutes legal, financial, immigration, or professional advice of any kind. Always verify information with the relevant official authority before acting on it.",
    },
    {
      number: "03",
      title: "No Warranties",
      body: "Arabia Khaleej is provided on an \"as-is\" and \"as-available\" basis without any warranty, express or implied. We make no representations regarding the accuracy, completeness, or timeliness of any content.",
    },
    {
      number: "04",
      title: "Limitation of Liability",
      body: "To the fullest extent permitted by applicable law, Arabia Khaleej and its maintainers shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or inability to use, this site or its content.",
    },
    {
      number: "05",
      title: "Intellectual Property",
      body: "All original content, design, and code on Arabia Khaleej is the property of its respective creators. Reproduction or redistribution for commercial purposes without explicit written permission is prohibited.",
    },
    {
      number: "06",
      title: "Third-Party Links",
      body: "This site may link to external government portals, official databases, and third-party resources. We do not control those sites and accept no responsibility for their content, availability, or privacy practices.",
    },
    {
      number: "07",
      title: "Governing Law",
      body: "These Terms are governed by and construed in accordance with applicable laws. Any disputes arising from use of the site shall be subject to the jurisdiction agreed upon by the parties involved.",
    },
    {
      number: "08",
      title: "Changes to Terms",
      body: "We reserve the right to revise these Terms at any time. Changes take effect immediately upon publication. It is your responsibility to review these Terms periodically.",
    },
  ];

  return (
    <div className={isRTL ? 'font-serif-ar' : ''}>
      {/* Header */}
      <header className={`mb-16 ${isRTL ? 'text-right' : ''}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/50 mb-5">
          {t('legal')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
          {t('termsConditions')}
        </h1>
        <div className={`w-16 h-[2px] bg-gradient-to-r ${isRTL ? 'from-transparent to-brand-gold mr-auto ml-0' : 'from-brand-gold to-transparent'} rounded-full mb-8`} />
        <p className="text-base sm:text-lg font-light leading-relaxed opacity-70 max-w-xl">
          {isRTL 
            ? "شروط لغة مبسطة لمنصة صادقة. اقرأها - إنها أقصر مما تتوقع."
            : "Plain-language terms for an honest platform. Read on — it is shorter than you expect."
          }
        </p>
      </header>

      {/* Clauses */}
      <ol className="space-y-0">
        {clauses.map(({ number, title, body }, i) => (
          <li
            key={number}
            className={`group relative flex ${isRTL ? 'flex-row-reverse text-right' : 'flex-row'} gap-6 pb-8`}
          >
            {/* Timeline line */}
            {i < clauses.length - 1 && (
              <div className={`absolute ${isRTL ? 'right-[18px]' : 'left-[18px]'} top-10 bottom-0 w-[1px] bg-gradient-to-b from-brand-gold/20 to-transparent`} />
            )}

            {/* Number dot */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-9 h-9 rounded-full border border-brand-gold/25 flex items-center justify-center group-hover:border-brand-gold/60 transition-colors duration-500">
                <span className="text-[9px] font-bold text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-500 tabular-nums">
                  {number}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="pt-[6px] pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-brand-gold/90">
                {title}
              </h2>
              <p className="text-sm font-light leading-loose opacity-70">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 pt-8 border-t border-brand-gold/10">
        <p className="text-[11px] font-light leading-relaxed opacity-40 uppercase tracking-widest text-center">
          {t('lastReviewed')} — April 2026
        </p>
      </div>
    </div>
  );
}
