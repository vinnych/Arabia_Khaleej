import { getT } from "@/lib/i18n-server";

export default async function TransparencyClient({ lang }: { lang: 'en' | 'ar' }) {
  const t = await getT(lang);
  const isRTL = lang === 'ar';

  return (
    <div className={`space-y-12 ${isRTL ? 'font-serif-ar text-right' : ''}`}>
      {/* Header */}
      <header className="mb-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/50 mb-5">
          {t('transparency')}
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
          {t('transparencyTitle')}
        </h1>
        <div className={`w-16 h-[2px] bg-gradient-to-r ${isRTL ? 'from-transparent to-brand-gold mr-auto ml-0' : 'from-brand-gold to-transparent'} rounded-full mb-8`} />
        <p className="text-base sm:text-lg font-light leading-relaxed opacity-70 max-w-2xl">
          {t('transparencyPageBody')}
        </p>
      </header>

      {/* AI Editorial Disclosure Highlight Box */}
      <section className="glass rounded-2xl p-8 sm:p-10 border border-brand-gold/15 bg-gradient-to-br from-brand-gold/[0.03] to-transparent">
        <div className="flex gap-4 items-start flex-col sm:flex-row">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0 border border-brand-gold/25 mt-1">
            <span className="text-brand-gold text-lg font-bold">⌘</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-gold uppercase tracking-wider mb-3">
              {t('aiEditorialDisclosure')}
            </h2>
            <p className="text-sm font-light leading-loose opacity-80">
              {t('aiEditorialDisclosureDesc')}
            </p>
            <p className="text-xs font-light leading-relaxed opacity-50 mt-4 italic border-t border-brand-gold/10 pt-4">
              {isRTL 
                ? "ملاحظة: هذا الإفصاح مُعد لتزويد القراء والجهات التنظيمية بالشفافية الكاملة بما يتوافق مع إرشادات جودة المحتوى المفيد من جوجل."
                : "Note: This ethical disclosure is provided to guarantee absolute clarity for both our readers and automated quality raters, in line with Google's Helpful Content Guidelines."}
            </p>
          </div>
        </div>
      </section>

      {/* Methodology and Pillar Sections */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Data Provenance Card */}
        <div className="glass rounded-xl p-6 border border-brand-gold/5 hover:border-brand-gold/20 transition-all duration-300">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/5 flex items-center justify-center border border-brand-gold/10 mb-4">
            <span className="text-brand-gold text-xs font-bold">1</span>
          </div>
          <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-2">
            {t('dataProvenance')}
          </h3>
          <p className="text-xs font-light leading-relaxed opacity-70">
            {t('dataProvenanceDesc')}
          </p>
        </div>

        {/* Editorial Integrity Card */}
        <div className="glass rounded-xl p-6 border border-brand-gold/5 hover:border-brand-gold/20 transition-all duration-300">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/5 flex items-center justify-center border border-brand-gold/10 mb-4">
            <span className="text-brand-gold text-xs font-bold">2</span>
          </div>
          <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-2">
            {t('editorialIntegrity')}
          </h3>
          <p className="text-xs font-light leading-relaxed opacity-70">
            {t('editorialIntegrityDesc')}
          </p>
        </div>

        {/* Ethical Intelligence Card */}
        <div className="glass rounded-xl p-6 border border-brand-gold/5 hover:border-brand-gold/20 transition-all duration-300 md:col-span-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/5 flex items-center justify-center border border-brand-gold/10 mb-4">
            <span className="text-brand-gold text-xs font-bold">3</span>
          </div>
          <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-2">
            {t('ethicalIntelligence')}
          </h3>
          <p className="text-xs font-light leading-relaxed opacity-70">
            {t('ethicalIntelligenceDesc')}
          </p>
        </div>
      </section>

      {/* Regulatory & Institutional Contacts */}
      <section className="glass rounded-xl p-6 border border-brand-gold/5">
        <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-3">
          {t('regInquiry')}
        </h3>
        <p className="text-xs font-light leading-relaxed opacity-70 mb-4">
          {t('regInquiryDesc')}
        </p>
        <p className="text-[10px] font-mono leading-relaxed opacity-45 uppercase tracking-widest border-t border-brand-gold/5 pt-4">
          {t('regComplianceDesc')}
        </p>
      </section>
    </div>
  );
}