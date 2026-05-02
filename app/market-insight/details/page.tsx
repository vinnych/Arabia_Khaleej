import { pageMeta, SITE_NAME } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, TrendingUp, ShieldCheck, Globe, Zap } from "lucide-react";
import StructuredData, { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { getT, getServerLanguage } from "@/lib/i18n-server";

export async function generateMetadata() {
  const t = await getT();
  return pageMeta({
    title: `${t('economicOutlook')} | ${SITE_NAME}`,
    description: t('sentimentDesc'),
    path: "/market-insight/details",
    type: "article",
    datePublished: "2024-01-01T00:00:00Z",
  });
}

export default async function SentimentDetailsPage() {
  const t = await getT();
  const lang = await getServerLanguage();
  const isRTL = lang === 'ar';
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('marketInsights'), item: "/market-insight" },
    { name: t('economicOutlook'), item: "/market-insight/details" },
  ];

  const articleData = {
    headline: t('sentimentTitle'),
    description: t('sentimentDesc'),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: "2024-01-01T00:00:00Z",
    url: "https://arabiakhaleej.com/market-insight/details",
    about: [
      { "@type": "Thing", name: "GCC Economy" },
      { "@type": "Thing", name: "Energy Markets" },
      { "@type": "Thing", name: "Market Sentiment" },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto w-full">
      <BreadcrumbSchema items={breadcrumbItems} />
      <StructuredData type="Article" data={articleData} />

      <div className="w-full mb-8">
        <Link
          href="/market-insight"
          className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:translate-x-[-4px] transition-transform ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft size={14} className={isRTL ? 'rotate-180' : ''} />
          {t('backToOverview')}
        </Link>
      </div>

      <article className="glass rounded-[3rem] p-10 md:p-16 border-brand-gold/15 relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12">
          <Globe size={300} />
        </div>

        <p className="text-[10px] tracking-[0.6em] uppercase font-black text-accent mb-6">
          {t('regionalAnalysis')}
        </p>
        <h1 className="text-4xl md:text-6xl font-black serif text-foreground mb-12 leading-tight">
          {t('stabilityGlobalShift')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-accent">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-black serif">{t('energyResilience')}</h2>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              {t('energyResilienceDesc')}
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-accent">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-black serif">{t('nonOilGrowth')}</h2>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              {t('nonOilGrowthDesc')}
            </p>
          </div>
        </div>

        {/* Regional Stability Index Visualization */}
        <div className="mb-16 p-8 md:p-12 glass rounded-[2.5rem] border-brand-gold/20 bg-brand-gold/5 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-accent mb-2">{t('regionalIntelligence')}</h3>
              <h2 className="text-2xl font-black serif">{t('stabilityIndex')} <span className="text-brand-gold">2026</span></h2>
            </div>
            <div className="px-5 py-2 rounded-xl bg-brand-gold text-brand-obsidian text-[10px] font-black uppercase tracking-widest shadow-lg">
              {t('currentRatingColon')} AAA-
            </div>
          </div>

          <div className="space-y-10">
            {[
              { label: t("fiscalBuffer"), value: 92, color: "bg-brand-gold" },
              { label: t("diversificationSpeed"), value: 78, color: "bg-accent" },
              { label: t("digitalInfrastructure"), value: 88, color: "bg-brand-gold" },
              { label: t("regionalIntegration"), value: 72, color: "bg-accent" }
            ].map((metric, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">{metric.label}</span>
                  <span className="text-sm font-black tabular-nums text-foreground">{metric.value}%</span>
                </div>
                <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-foreground/5">
                  <div 
                    className={`h-full ${metric.color} rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(212,175,55,0.3)]`}
                    style={{ 
                      width: `${metric.value}%`,
                      transitionDelay: `${i * 200}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden" style={{ backgroundImage: 'radial-gradient(#D4AF37 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10 mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-4">
            {t('outlookSummary')}
          </h3>
          <p className="text-lg serif italic text-foreground/80 leading-relaxed">
            &quot;{t('outlookSummaryBody')}&quot;
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-2 rounded-full border border-brand-gold/20 text-[10px] font-black uppercase tracking-widest text-accent">
            #Economy
          </div>
          <div className="px-4 py-2 rounded-full border border-brand-gold/20 text-[10px] font-black uppercase tracking-widest text-accent">
            #GCC
          </div>
          <div className="px-4 py-2 rounded-full border border-brand-gold/20 text-[10px] font-black uppercase tracking-widest text-accent">
            #Markets
          </div>
        </div>
      </article>

      <div className="mt-20 text-center">
        <Link
          href="/"
          className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent hover:tracking-[0.6em] transition-all"
        >
          {isRTL ? `â† ${t('returnHome')}` : `â† ${t('returnHome')}`}
        </Link>
      </div>
    </div>
  );
}

