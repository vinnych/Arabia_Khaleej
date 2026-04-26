import { pageMeta, SITE_NAME, Breadcrumbs } from "@/lib/seo";
import MarketInsightClient from "@/components/finance/MarketInsightClient";
import { BreadcrumbSchema, DatasetSchema } from "@/components/seo/StructuredData";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
  
  return pageMeta({
    title: `${category} Insights — GCC Market Data | ${SITE_NAME}`,
    description: `Detailed market analysis and real-time data for GCC ${category}.`,
    path: `/market-insight/${rawCategory}`,
  });
}

export default async function CategoryInsightPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: rawCategory } = await params;
  const category = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Market Insight", item: "/market-insight" },
    { name: category, item: `/market-insight/${rawCategory}` }
  ];

  const visualBreadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Market Insight", href: "/market-insight" },
    { name: category, href: `/market-insight/${rawCategory}` }
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbItems} />
      <DatasetSchema 
        name={`GCC ${category} Market Intelligence`}
        description={`Real-time data and analysis for GCC ${category} markets.`}
        url={`/market-insight/${rawCategory}`}
      />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-4">
        <Breadcrumbs items={visualBreadcrumbs} />
      </div>

      <div className="fixed top-24 left-8 z-[50] hidden md:block">
         <Link href="/market-insight" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={14} />
            Back to Overview
         </Link>
      </div>
      <MarketInsightClient />
    </div>
  );
}
