import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock, Banknote, Zap } from "lucide-react";
import EligibilityScale from "@/components/visuals/EligibilityScale";
import DocStack from "@/components/visuals/DocStack";
import StepGarden from "@/components/visuals/StepGarden";
import type { GuideData } from "@/lib/qatar-services-data";
import { GUIDES, GUIDE_SUMMARIES } from "@/lib/qatar-services-data";

interface Props {
  guide: GuideData;
}

export default function GuidePageLayout({ guide }: Props) {
  const totalFees = guide.fees.reduce((s, f) => s + f.amount, 0);
  const timeLabel =
    guide.minDays === guide.maxDays
      ? `${guide.minDays} days`
      : `${guide.minDays}–${guide.maxDays} days`;

  return (
    <div className="page-sections">

      {/* ── Hero ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #640023 0%, #3A0E20 60%, #1e0810 100%)" }}>
        {/* Subtle texture overlay */}
        <div className="relative px-5 pt-5 pb-6 sm:px-8 sm:pt-7 sm:pb-8"
          style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)" }}>

          {/* Breadcrumb */}
          <Link
            href="/qatar-services"
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white/90 transition-colors mb-4"
          >
            <ArrowLeft size={12} />
            Government Services
          </Link>

          {/* Role badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: "rgba(212,175,55,0.18)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}>
              For: {guide.role}
            </span>
            {guide.fastTrack && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}>
                <Zap size={9} className="inline mr-1" />Fast track
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-newsreader text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            {guide.title}
          </h1>

          {/* Intro */}
          <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-2xl">
            {guide.intro}
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            <div className="guide-stat-chip">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-1">
                <Clock size={8} />Processing
              </span>
              <span className="text-sm font-bold text-white">{timeLabel}</span>
            </div>
            <div className="guide-stat-chip">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-1">
                <Banknote size={8} />Est. fees
              </span>
              <span className="text-sm font-bold text-white">
                {totalFees === 0 ? "Free" : `~QAR ${totalFees.toLocaleString()}`}
              </span>
            </div>
            <div className="guide-stat-chip">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">Documents</span>
              <span className="text-sm font-bold text-white">{guide.docs.length} required</span>
            </div>
            <div className="guide-stat-chip">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">Steps</span>
              <span className="text-sm font-bold text-white">{guide.steps.length} steps</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
        <strong>Important:</strong> Fees, timelines, and requirements change frequently. Always verify
        current information directly with the relevant Qatar government portal before applying.
      </div>

      {/* ── Eligibility + Docs (2-col desktop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EligibilityScale criteria={guide.eligibility} />
        <DocStack docs={guide.docs} />
      </div>

      {/* ── Steps ── */}
      <section>
        <h2 className="guide-section-label">Step-by-step process</h2>
        <StepGarden steps={guide.steps} />
      </section>

      {/* ── Fee breakdown + Tips (2-col desktop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fee table */}
        <section>
          <h2 className="guide-section-label">Fee breakdown</h2>
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-stone-100 text-gray-700">
                  <th className="px-3 py-2 text-left font-semibold">Item</th>
                  <th className="px-3 py-2 text-right font-semibold">QAR</th>
                </tr>
              </thead>
              <tbody>
                {guide.fees.map((fee, i) => (
                  <tr
                    key={fee.label}
                    className={`border-t border-stone-100 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}
                  >
                    <td className="px-3 py-2 text-gray-700">{fee.label}</td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      {fee.amount === 0 ? "Free" : fee.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-stone-300 bg-stone-100">
                  <td className="px-3 py-2 font-semibold text-gray-900">Estimated total</td>
                  <td className="px-3 py-2 text-right font-bold text-primary">
                    {totalFees === 0 ? "Free" : `~${totalFees.toLocaleString()}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips */}
        {guide.tips.length > 0 && (
          <section>
            <h2 className="guide-section-label">Tips</h2>
            <ul className="space-y-2">
              {guide.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-gray-700 bg-rose-50 border border-rose-100 rounded-lg p-3">
                  <span className="text-primary shrink-0 font-bold mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* ── Official portals ── */}
      {guide.portals.length > 0 && (
        <section>
          <h2 className="guide-section-label">Official portals</h2>
          <div className="flex flex-wrap gap-2">
            {guide.portals.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-primary/30 text-primary rounded-full px-3 py-2 hover:bg-primary/5 transition-colors min-h-[36px]"
              >
                {p.name}
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {guide.faq.length > 0 && (
        <section>
          <h2 className="guide-section-label">Frequently asked questions</h2>
          <div className="space-y-2">
            {guide.faq.map(({ q, a }) => (
              <details
                key={q}
                suppressHydrationWarning
                className="bg-stone-50 border border-stone-200 rounded-xl group"
              >
                <summary className="min-h-[44px] flex items-center justify-between gap-2 px-4 text-xs font-semibold text-gray-900 cursor-pointer list-none">
                  {q}
                  <span className="text-gray-400 shrink-0 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-4 pb-4 text-xs text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── Related guides ── */}
      {guide.related.length > 0 && (
        <section>
          <h2 className="guide-section-label">Related guides</h2>
          <div className="flex flex-wrap gap-3">
            {guide.related.map((slug) => {
              const related = GUIDES[slug];
              const summary = GUIDE_SUMMARIES[slug];
              if (!related || !summary) return null;
              return (
                <Link
                  key={slug}
                  href={`/qatar-services/${slug}`}
                  className="flex items-center gap-2 text-xs font-medium bg-white border border-stone-200 rounded-xl px-3 py-2.5 hover:border-primary/30 hover:bg-rose-50 transition-colors shadow-sm"
                >
                  <span className="text-base leading-none">{summary.icon}</span>
                  <span className="text-gray-800">{related.title}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
