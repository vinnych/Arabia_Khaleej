"use client";

import { useLanguage } from "@/lib/i18n";

export default function PrivacyPage() {
  const { t, isRTL } = useLanguage();

  const sections = [
    {
      title: t('ppSection1Title'),
      body: t('ppSection1Body'),
    },
    {
      title: t('ppSection2Title'),
      body: t('ppSection2Body'),
    },
    {
      title: t('ppSection3Title'),
      body: t('ppSection3Body'),
    },
    {
      title: t('ppSection4Title'),
      body: t('ppSection4Body'),
    },
    {
      title: t('ppSection5Title'),
      body: t('ppSection5Body'),
    },
    {
      title: t('ppSection6Title'),
      body: t('ppSection6Body'),
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
          {t('privacyPolicy')}
        </h1>
        <div className={`w-16 h-[2px] bg-gradient-to-r ${isRTL ? 'from-transparent to-brand-gold mr-auto ml-0' : 'from-brand-gold to-transparent'} rounded-full mb-8`} />
        <p className={`text-base sm:text-lg font-light leading-relaxed opacity-70 max-w-xl ${isRTL ? 'text-right' : ''}`}>
          {t('privacyDesc')}
        </p>
      </header>

      {/* Privacy-first badge */}
      <div className={`glass rounded-2xl px-8 py-6 mb-10 border border-brand-gold/15 flex ${isRTL ? 'flex-row-reverse text-right' : ''} items-center gap-5`}>
        <div className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-brand-gold/80" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1">
            {t('transparencyNotice')}
          </p>
          <p className="text-sm font-light opacity-70 leading-relaxed">
            {t('privacyDisclaimer')}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map(({ title, body }, i) => (
          <details
            key={title}
            className="group glass rounded-xl border border-brand-gold/5 hover:border-brand-gold/15 transition-colors duration-500 overflow-hidden"
            open
          >
            <summary className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-4 px-6 py-5 cursor-pointer list-none select-none`}>
              <span className="text-[10px] font-bold text-brand-gold/40 w-5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest flex-grow ${isRTL ? 'text-right' : ''}`}>
                {title}
              </span>
              <span className="text-brand-gold/40 text-xs group-open:rotate-180 transition-transform duration-300">
                ▾
              </span>
            </summary>
            <p className={`px-6 pb-5 text-sm font-light leading-loose opacity-70 border-t border-brand-gold/5 pt-4 ${isRTL ? 'mr-9 text-right' : 'ml-9'}`}>
              {body}
            </p>
          </details>
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
