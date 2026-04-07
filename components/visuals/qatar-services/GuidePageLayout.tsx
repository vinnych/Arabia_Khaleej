import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ProcessingClock from "@/components/visuals/ProcessingClock";
import FeeStack from "@/components/visuals/FeeStack";
import EligibilityScale from "@/components/visuals/EligibilityScale";
import DocStack from "@/components/visuals/DocStack";
import StepGarden from "@/components/visuals/StepGarden";
import type { GuideData } from "@/lib/qatar-services-data";
import { GUIDES, GUIDE_SUMMARIES } from "@/lib/qatar-services-data";
 
interface Props {
  guide: GuideData;
}
 
export default function GuidePageLayout({ guide }: Props) {
  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/qatar-services"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft size={13} />
        Government Services
      </Link>
 
      {/* Hero */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
            For: {guide.role}
          </span>
          {guide.fastTrack && (
            <span className="text-xs bg-secondary-accent/20 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              Fast track available
            </span>
          )}
        </div>
        <h1 className="font-newsreader text-2xl font-bold text-on-surface mt-1 mb-2">{guide.title}</h1>
        <p className="text-gray-600 text-base leading-relaxed">{guide.intro}</p>
      </div>
 
      {/* Visual summary row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <ProcessingClock
            minDays={guide.minDays}
            maxDays={guide.maxDays}
            label="Processing time"
            fastTrack={guide.fastTrack}
          />
        </div>
        <div className="flex-1">
          <FeeStack fees={guide.fees} />
        </div>
      </div>
 
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <strong>Important:</strong> Fees, timelines, and requirements change frequently. Always verify current information directly with the relevant Qatar government portal before applying.
      </div>
 
      {/* Eligibility */}
      <EligibilityScale criteria={guide.eligibility} />
 
      {/* Documents */}
      <DocStack docs={guide.docs} />
 
      {/* Steps */}
      <StepGarden steps={guide.steps} />
 
      {/* Detailed fees table */}
      <section>
        <h2 className="text-base font-semibold text-on-surface mb-3">Fee breakdown</h2>
        <div className="rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-gray-700">
                <th className="px-4 py-2 text-left font-semibold">Item</th>
                <th className="px-4 py-2 text-right font-semibold">Amount (QAR)</th>
              </tr>
            </thead>
            <tbody>
              {guide.fees.map((fee, i) => (
                <tr
                  key={fee.label}
                  className={`border-t border-stone-100 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
                >
                  <td className="px-4 py-2 text-gray-700">{fee.label}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">
                    {fee.amount === 0 ? "Free" : fee.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-stone-300 bg-stone-100">
                <td className="px-4 py-2 font-semibold text-gray-900">Estimated total</td>
                <td className="px-4 py-2 text-right font-bold text-primary">
                  {guide.fees.reduce((s, f) => s + f.amount, 0) === 0
                    ? "Free"
                    : `~QAR ${guide.fees.reduce((s, f) => s + f.amount, 0).toLocaleString()}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
 
      {/* Tips */}
      {guide.tips.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-on-surface mb-2">Tips</h2>
          <ul className="space-y-2">
            {guide.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-secondary-accent mt-0.5 shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}
 
      {/* Portals */}
      {guide.portals.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-on-surface mb-2">Official portals</h2>
          <div className="flex flex-wrap gap-2">
            {guide.portals.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-primary/30 text-primary rounded-full px-3 py-1.5 hover:bg-primary/5 transition-colors"
              >
                {p.name}
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </section>
      )}
 
      {/* FAQ */}
      {guide.faq.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-on-surface mb-3">Frequently asked questions</h2>
          <div className="space-y-2">
            {guide.faq.map(({ q, a }) => (
              <details
                key={q}
                className="bg-stone-50 border border-stone-200 rounded-xl p-4 cursor-pointer group"
              >
                <summary className="font-semibold text-gray-900 text-sm list-none flex items-center justify-between gap-2">
                  {q}
                  <span className="text-gray-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
 
      {/* Related guides */}
      {guide.related.length > 0 && (
        <section className="bg-rose-50 border border-rose-100 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-rose-900 mb-2">Related guides</h2>
          <div className="flex flex-wrap gap-3">
            {guide.related.map((slug) => {
              const related = GUIDES[slug];
              const summary = GUIDE_SUMMARIES[slug];
              if (!related || !summary) return null;
              return (
                <Link
                  key={slug}
                  href={`/qatar-services/${slug}`}
                  className="text-rose-700 hover:underline text-sm"
                >
                  {summary.icon} {related.title}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
 