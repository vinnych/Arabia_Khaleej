import { notFound } from "next/navigation";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import { GUIDES, GUIDE_SLUGS, type GuideSlug } from "@/lib/qatar-services-data";
import GuidePageLayout from "@/components/qatar-services/GuidePageLayout";
 
interface Props {
  params: Promise<{ slug: string }>;
}
 
export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}
 
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES[slug as GuideSlug];
  if (!guide) notFound();
 
  const totalFees = guide.fees.reduce((s, f) => s + f.amount, 0);
  const timeLabel =
    guide.minDays === guide.maxDays
      ? `${guide.minDays} days`
      : `${guide.minDays}–${guide.maxDays} days`;
 
  return pageMeta({
    title: `${guide.title} Guide 2026 — Qatar Portal`,
    description: `Complete ${guide.title} guide for Qatar 2026. Processing time: ${timeLabel}. Estimated fees: ${totalFees === 0 ? "Free" : `~QAR ${totalFees}`}. Step-by-step with required documents and public portals.`,
    path: `/qatar-services/${slug}`,
    keywords: [
      guide.title,
      `Qatar ${guide.title} 2026`,
      "Qatar government services",
      "Qatar expat guide",
    ],
    ogTitle: `${guide.title} Guide 2026 — Qatar Portal`,
    ogDescription: `Complete ${guide.title} guide for Qatar 2026. Processing time: ${timeLabel}. Fees: ${totalFees === 0 ? "Free" : `~QAR ${totalFees}`}. Step-by-step with required documents.`,
  });
}
 
export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES[slug as GuideSlug];
  if (!guide) notFound();
 
  const totalFees = guide.fees.reduce((s, f) => s + f.amount, 0);
 
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.intro,
    totalTime: `P${guide.maxDays}D`,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "QAR",
      value: totalFees.toString(),
    },
    step: guide.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.detail,
    })),
  };
 
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Government Services", item: `${SITE_URL}/qatar-services` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}/qatar-services/${slug}` },
    ],
  };
 
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <GuidePageLayout guide={guide} />
    </>
  );
}
 