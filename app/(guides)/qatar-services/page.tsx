import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import { GUIDES, GUIDE_SUMMARIES, GUIDE_SLUGS } from "@/lib/qatar-services-data";
 
export const metadata = pageMeta({
  title: "Qatar Government Services Guide 2026 | Qatar Portal",
  description:
    "Step-by-step guides for Qatar government services: QID application, work visa, family visa, business registration, driving licence, exit permit, and document attestation.",
  path: "/qatar-services",
  keywords: [
    "Qatar government services",
    "Qatar QID application",
    "Qatar work visa guide",
    "Qatar business registration",
    "Qatar driving licence",
    "Qatar exit permit",
    "Qatar document attestation 2026",
  ],
  ogTitle: "Qatar Government Services Guide 2026 | Qatar Portal",
  ogDescription: "Step-by-step guides for QID application, work visa, family visa, business registration, driving licence, exit permit and more.",
});
 
export default function QatarServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Qatar Government Services",
    url: "https://qatar-portal.vercel.app/qatar-services",
    itemListElement: GUIDE_SLUGS.map((slug, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: GUIDES[slug].title,
      url: `https://qatar-portal.vercel.app/qatar-services/${slug}`,
    })),
  };
 
  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" },
              { "@type": "ListItem", position: 2, name: "Government Services", item: "https://qatar-portal.vercel.app/qatar-services" },
            ],
          }),
        }}
      />
 
      <div>
        <h1 className="font-newsreader text-2xl font-bold text-on-surface mb-2">
          Qatar Government Services
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Step-by-step guides for the most common Qatar government processes — with accurate fees, timelines, and required documents for 2026.
        </p>
      </div>
 
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <strong>Disclaimer:</strong> These guides are for informational purposes only. Always verify current requirements on the official Qatar government portals before submitting any application.
      </div>
 
      {/* Guide cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {GUIDE_SLUGS.map((slug) => {
          const guide = GUIDES[slug];
          const summary = GUIDE_SUMMARIES[slug];
          const totalFees = guide.fees.reduce((s, f) => s + f.amount, 0);
          const timeLabel =
            guide.minDays === guide.maxDays
              ? `${guide.minDays} days`
              : `${guide.minDays}–${guide.maxDays} days`;
 
          return (
            <Link
              key={slug}
              href={`/qatar-services/${slug}`}
              className="group bg-surface-low border border-stone-200 rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{summary.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {guide.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{summary.tagline}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[10px] font-medium text-gray-600 bg-stone-200 rounded-full px-2 py-0.5">
                      ⏱ {timeLabel}
                    </span>
                    <span className="text-[10px] font-medium text-gray-600 bg-stone-200 rounded-full px-2 py-0.5">
                      {totalFees === 0 ? "Free" : `~QAR ${totalFees.toLocaleString()}`}
                    </span>
                    {guide.fastTrack && (
                      <span className="text-[10px] font-medium text-amber-800 bg-amber-100 rounded-full px-2 py-0.5">
                        Fast track
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-primary transition-colors shrink-0 mt-0.5">›</span>
              </div>
            </Link>
          );
        })}
      </div>
 
      {/* Internal links */}
      <section className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm">
        <p className="font-semibold text-rose-900 mb-2">New to Qatar?</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/qatar-visa-requirements" className="text-rose-700 hover:underline">→ Visa Requirements</Link>
          <Link href="/work-in-qatar" className="text-rose-700 hover:underline">→ Working in Qatar</Link>
          <Link href="/cost-of-living-doha" className="text-rose-700 hover:underline">→ Cost of Living</Link>
          <Link href="/qatar-labour-law" className="text-rose-700 hover:underline">→ Labour Law</Link>
        </div>
      </section>
    </div>
  );
}