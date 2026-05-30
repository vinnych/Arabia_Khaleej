"use client";

import { useLanguage } from "@/lib/i18n";

export default function DisclaimerPage() {
  const { t, isRTL } = useLanguage();

  const points = [
    {
      title: t('discSection1Title'),
      body: t('discSection1Body'),
    },
    {
      title: t('discSection2Title'),
      body: t('discSection2Body'),
    },
    {
      title: t('discSection3Title'),
      body: t('discSection3Body'),
    },
    {
      title: t('discSection4Title'),
      body: t('discSection4Body'),
    },
    {
      title: t('discSection5Title'),
      body: t('discSection5Body'),
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
          {t('disclaimerTitle')}
        </h1>
        <div className={`w-16 h-[2px] bg-gradient-to-r ${isRTL ? 'from-transparent to-brand-gold mr-auto ml-0' : 'from-brand-gold to-transparent'} rounded-full mb-8`} />
        <p className={`text-base sm:text-lg font-light leading-relaxed opacity-70 max-w-xl ${isRTL ? 'text-right' : ''}`}>
          {t('disclaimerDesc')}
        </p>
      </header>

      {/* Warning banner */}
      <div className={`glass rounded-2xl px-8 py-6 mb-10 border border-brand-gold/20 relative overflow-hidden ${isRTL ? 'text-right' : ''}`}>
        <div className="absolute inset-0 bg-brand-gold/3 pointer-events-none" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/70 mb-2">
          {t('importantNotice')}
        </p>
        <p className="text-sm font-light leading-relaxed opacity-75">
          {t('disclaimerWarning')}
        </p>
      </div>

      {/* Points */}
      <div className="space-y-4">
        {points.map(({ title, body }) => (
          <div
            key={title}
            className={`glass rounded-xl border border-brand-gold/5 hover:border-brand-gold/15 transition-colors duration-500 px-7 py-6 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gold/80 mb-3">
              {title}
            </h2>
            <p className="text-sm font-light leading-loose opacity-70">
              {body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-brand-gold/10">
        <p className="text-[11px] font-light leading-relaxed opacity-40 uppercase tracking-widest text-center">
          {t('lastReviewed')} — April 2026
        </p>
      </div>
    </div>
  );
}
