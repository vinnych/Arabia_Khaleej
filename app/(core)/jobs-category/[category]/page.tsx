import { getJobs } from "@/lib/jobs";
import JobSearch from "@/components/JobSearch";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = "https://qatar-portal.vercel.app";

const CATEGORIES: Record<string, { label: string; keywords: string[] }> = {
  engineering: { label: "Engineering", keywords: ["engineer", "engineering", "technical", "mechanical", "electrical"] },
  it: { label: "IT & Technology", keywords: ["IT", "software", "developer", "tech", "programming", "data", "cyber", "cloud"] },
  healthcare: { label: "Healthcare", keywords: ["nurse", "doctor", "medical", "health", "clinical", "pharmacy", "hospital"] },
  finance: { label: "Finance & Banking", keywords: ["finance", "accounting", "banking", "accountant", "auditor", "financial"] },
  construction: { label: "Construction", keywords: ["construction", "civil", "architect", "site", "project manager", "contractor"] },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const entry = CATEGORIES[slug];
  if (!entry) return {};
  return {
    title: `${entry.label} Jobs in Qatar ${new Date().getFullYear()} | Qatar Portal`,
    description: `Latest ${entry.label.toLowerCase()} job vacancies in Qatar. Find ${entry.label.toLowerCase()} jobs in Doha and across Qatar updated daily.`,
    keywords: [`${entry.label} jobs Qatar`, `${entry.label} vacancies Qatar`, `Qatar ${entry.label} hiring`],
    alternates: { canonical: `${SITE_URL}/jobs-category/${slug}` },
    openGraph: {
      title: `${entry.label} Jobs in Qatar ${new Date().getFullYear()} | Qatar Portal`,
      description: `Latest ${entry.label.toLowerCase()} job vacancies in Qatar.`,
      url: `${SITE_URL}/jobs-category/${slug}`,
      siteName: "Qatar Portal",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" as const, title: `${entry.label} Jobs in Qatar ${new Date().getFullYear()} | Qatar Portal`, description: `Latest ${entry.label.toLowerCase()} job vacancies in Qatar.` },
  };
}

export default async function JobCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const entry = CATEGORIES[slug];
  if (!entry) notFound();

  const allJobs = await getJobs(48);
  const filtered = allJobs.filter((job) =>
    entry.keywords.some((kw) => job.title.toLowerCase().includes(kw.toLowerCase()))
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${entry.label} Jobs in Qatar`,
    url: `${SITE_URL}/jobs-category/${slug}`,
    numberOfItems: filtered.length,
    itemListElement: filtered.slice(0, 10).map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: job.title,
      url: `${SITE_URL}/jobs/${job.slug}`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mb-6">
        <h1 className="font-newsreader text-2xl sm:text-3xl font-bold text-on-surface">{entry.label} Jobs in Qatar</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length > 0 ? `${filtered.length} jobs found` : "No jobs found in this category right now"}
          {" · "}
          <a href="/jobs" className="text-rose-700 hover:underline">View all Qatar jobs</a>
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(CATEGORIES)
            .filter(([s]) => s !== slug)
            .map(([s, e]) => (
              <a
                key={s}
                href={`/jobs-category/${s}`}
                className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                {e.label}
              </a>
            ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <JobSearch jobs={filtered} />
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💼</p>
          <p>No {entry.label.toLowerCase()} jobs found right now. Check back soon.</p>
          <a href="/jobs" className="mt-4 inline-block text-rose-700 hover:underline text-sm">→ Browse all jobs</a>
        </div>
      )}
    </div>
  );
}
