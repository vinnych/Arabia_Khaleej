import { pageMeta, SITE_NAME } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, TrendingUp, ShieldCheck, Globe, Zap } from "lucide-react";
import StructuredData, { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: `GCC Economic Outlook & Regional Stability Analysis | ${SITE_NAME}`,
  titleAr: `التوقعات الاقتصادية الخليجية وتحليل الاستقرار الإقليمي | ${SITE_NAME}`,
  description:
    "In-depth analysis of GCC regional economic stability, energy resilience, non-oil sector growth, and equity market outlook for investors and residents.",
  descriptionAr:
    "تحليل معمق للاستقرار الاقتصادي الإقليمي الخليجي ومرونة الطاقة ونمو القطاع غير النفطي وتوقعات سوق الأسهم للمستثمرين والمقيمين.",
  path: "/market-insight/details",
  keywords: [
    "GCC economy",
    "GCC stability",
    "GCC market outlook",
    "Vision 2030",
    "Saudi economy",
    "UAE growth",
    "energy resilience",
    "non-oil sector",
    "اقتصاد الخليج",
    "استقرار إقليمي",
  ],
  type: "article",
  datePublished: "2024-01-01T00:00:00Z",
});

export default function SentimentDetailsPage() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Market Insight", item: "/market-insight" },
    { name: "Economic Outlook", item: "/market-insight/details" },
  ];

  const articleData = {
    headline: "GCC Regional Stability with Positive Outlook",
    description:
      "GCC markets continue to show resilience amid global volatility, supported by strong energy prices and non-oil sector growth.",
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
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={14} />
          Back to Overview
        </Link>
      </div>

      <article className="glass rounded-[3rem] p-10 md:p-16 border-brand-gold/15 relative overflow-hidden w-full">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12">
          <Globe size={300} />
        </div>

        <p className="text-[10px] tracking-[0.6em] uppercase font-black text-accent mb-6">
          Regional Analysis
        </p>
        <h1 className="text-4xl md:text-6xl font-black serif text-foreground mb-12 leading-tight">
          Stability in a <br />
          <span className="text-brand-gold">Global Shift</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-accent">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-black serif">Energy Resilience</h2>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              Sustained energy prices provide a robust fiscal buffer for GCC
              nations, enabling continued investment in infrastructure and Vision
              2030-style diversification projects.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-accent">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-black serif">Non-Oil Growth</h2>
            <p className="text-sm text-foreground/60 leading-relaxed font-medium">
              The acceleration of tourism, tech, and manufacturing sectors in
              Saudi Arabia and the UAE is creating new alpha opportunities beyond
              traditional energy exports.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10 mb-12">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-4">
            Outlook Summary
          </h3>
          <p className="text-lg serif italic text-foreground/80 leading-relaxed">
            "The GCC remains a safe haven for capital seeking stability and
            structural growth. We maintain a positive outlook for the regional
            equity markets through 2025."
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
          ← Return Home
        </Link>
      </div>
    </div>
  );
}
