import { pageMeta, SITE_NAME, Breadcrumbs } from "@/lib/seo";
import MarketInsightClient from "@/components/finance/MarketInsightClient";
import { BreadcrumbSchema, DatasetSchema } from "@/components/seo/StructuredData";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getT, getServerLanguage } from "@/lib/i18n-server";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const t = await getT();
  const categoryLabel = t(rawCategory as any) !== rawCategory ? t(rawCategory as any) : rawCategory;
  
  return pageMeta({
    title: `${categoryLabel} ${t('marketInsights')} | ${SITE_NAME}`,
    description: `${t('guideDesc')} ${categoryLabel}.`,
    path: `/market-insight/${rawCategory}`,
  });
}

export default async function CategoryInsightPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
  const t = await getT();
  const lang = await getServerLanguage();
  const categoryLabel = t(rawCategory as any) !== rawCategory ? t(rawCategory as any) : category;

  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('marketInsights'), item: "/market-insight" },
    { name: categoryLabel, item: `/market-insight/${rawCategory}` }
  ];

  const visualBreadcrumbs = [
    { name: t('home'), href: "/" },
    { name: t('marketInsights'), href: "/market-insight" },
    { name: categoryLabel, href: `/market-insight/${rawCategory}` }
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbItems} />
      <DatasetSchema 
        name={`GCC ${categoryLabel} ${t('regionalIntelligence')}`}
        description={`${t('guideDesc')} GCC ${categoryLabel}.`}
        url={`/market-insight/${rawCategory}`}
      />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-4">
        <Breadcrumbs items={visualBreadcrumbs} />
      </div>

      <div className="fixed top-24 left-8 z-[50] hidden md:block">
         <Link href="/market-insight" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:translate-x-[-4px] transition-transform ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
            {t('backToOverview')}
         </Link>
      </div>
      <MarketInsightClient />
    </div>
  );
}
