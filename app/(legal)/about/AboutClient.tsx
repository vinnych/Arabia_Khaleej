"use client";

import { useLanguage } from "@/lib/i18n";
import { EDITORIAL_AUTHORS } from "@/lib/authors";

export default function AboutPage() {
  const { t, isRTL } = useLanguage();

  const pillars = [
    {
      label: t('independence'),
      body: t('independenceDesc'),
    },
    {
      label: t('simplicity'),
      body: t('simplicityDesc'),
    },
    {
      label: t('transparency'),
      body: t('transparencyDesc'),
    },
  ];

  return (
    <div className={isRTL ? 'font-serif-ar' : ''}>
      {/* Header */}
      <header className={`mb-16 ${isRTL ? 'text-right' : ''}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/50 mb-5">
          {t('about')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
          {t('siteName')}
        </h1>
        <div className={`w-16 h-[2px] bg-gradient-to-r ${isRTL ? 'from-transparent to-brand-gold mr-auto ml-0' : 'from-brand-gold to-transparent'} rounded-full mb-8`} />
        <p className="text-base sm:text-lg font-light leading-relaxed opacity-70 max-w-xl">
          {t('aboutDesc')}
        </p>
      </header>

      {/* Mission */}
      <section className={`glass rounded-2xl p-8 sm:p-10 mb-8 border border-brand-gold/8 ${isRTL ? 'text-right' : ''}`}>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/60 mb-4">
          {t('mission')}
        </h2>
        <p className="text-sm sm:text-base font-light leading-loose opacity-80">
          {t('missionDesc')}
        </p>
      </section>

      {/* Pillars */}
      <section className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/50 mb-6">
          {t('pillars')}
        </h2>
        <div className="grid gap-4">
          {pillars.map(({ label, body }) => (
            <div
              key={label}
              className={`group flex ${isRTL ? 'flex-row-reverse' : ''} gap-5 items-start glass rounded-xl px-6 py-5 border border-brand-gold/5 hover:border-brand-gold/20 transition-colors duration-500`}
            >
              <div className="mt-[3px] w-[6px] h-[6px] rounded-full bg-brand-gold/60 flex-shrink-0 group-hover:bg-brand-gold transition-colors duration-300" />
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1">
                  {label}
                </p>
                <p className="text-sm font-light leading-relaxed opacity-70">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* Team */}
      <section className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/50 mb-2">
          {t('editorialTeam')}
        </h2>
        <p className="text-xs font-light opacity-50 mb-8 italic">
          {t('editorialTeamDesc')}
        </p>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {/* WHY: Dynamic rendering of editorial team cards. Improves verification presence and E-E-A-T profiles. */}
          {EDITORIAL_AUTHORS.map((author) => {
            const name = isRTL ? author.nameAr : author.name;
            const role = isRTL ? author.roleAr : author.role;
            const bio = isRTL ? author.bioAr : author.bio;
            return (
              <div 
                key={author.id} 
                className={`glass rounded-xl p-6 border border-brand-gold/5 flex gap-5 items-start ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex-shrink-0 flex items-center justify-center border border-brand-gold/10">
                  {author.image ? (
                    // WHY: Renders premium generated author headshots directly to boost credibility and E-E-A-T aesthetics
                    <img 
                      src={author.image} 
                      alt={name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-brand-gold text-lg font-bold">
                      {name ? name[0] : "E"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-gold mb-1 uppercase tracking-wider">
                    {name}
                  </p>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mb-3">
                    {role}
                  </p>
                  <p className="text-xs font-light leading-relaxed opacity-60">
                    {bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer note */}
      <div className="mt-12 pt-8 border-t border-brand-gold/10">
        <p className="text-[11px] font-light leading-relaxed opacity-40 uppercase tracking-widest text-center">
          {t('passionProject')}
        </p>
      </div>
    </div>
  );
}
