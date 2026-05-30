"use client";

import { useLanguage } from "@/lib/i18n";

export default function TermsPage() {
  const { t, isRTL } = useLanguage();

  const clauses = [
    {
      number: "01",
      title: t('tosSection1Title'),
      body: t('tosSection1Body'),
    },
    {
      number: "02",
      title: t('tosSection2Title'),
      body: t('tosSection2Body'),
    },
    {
      number: "03",
      title: t('tosSection3Title'),
      body: t('tosSection3Body'),
    },
    {
      number: "04",
      title: t('tosSection4Title'),
      body: t('tosSection4Body'),
    },
    {
      number: "05",
      title: t('tosSection5Title'),
      body: t('tosSection5Body'),
    },
    {
      number: "06",
      title: t('tosSection6Title'),
      body: t('tosSection6Body'),
    },
    {
      number: "07",
      title: t('tosSection7Title'),
      body: t('tosSection7Body'),
    },
    {
      number: "08",
      title: t('tosSection8Title'),
      body: t('tosSection8Body'),
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
        <p className={`text-base sm:text-lg font-light leading-relaxed opacity-70 max-w-xl ${isRTL ? 'text-right' : ''}`}>
          {t('termsDesc')}
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
