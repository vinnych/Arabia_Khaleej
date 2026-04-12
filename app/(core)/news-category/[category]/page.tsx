import { getNews } from "@/lib/rss";
import NewsSearch from "@/components/NewsSearch";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = "https://qatar-portal.vercel.app";

const CATEGORIES: Record<string, { label: string; keywords: string[] }> = {
  qatar: {
    label: "Qatar",
    keywords: ["qatar", "doha", "qatari", "al thani", "lusail", "pearl"],
  },
  business: {
    label: "Business",
    keywords: ["business", "economy", "economic", "trade", "investment", "market", "financial", "bank", "oil", "gas", "energy", "qatarenergy", "LNG"],
  },
  sports: {
    label: "Sports",
    keywords: ["sport", "football", "soccer", "fifa", "stadium", "cricket", "tennis", "F1", "formula", "olympic", "championship", "league", "match", "team", "player"],
  },
  world: {
    label: "World",
    keywords: ["world", "global", "international", "UN", "united nations", "war", "conflict", "peace", "diplomacy", "summit", "election"],
  },
  gulf: {
    label: "Gulf",
    keywords: ["gulf", "GCC", "saudi", "UAE", "dubai", "abu dhabi", "kuwait", "bahrain", "oman", "riyadh", "jeddah"],
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ category: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const entry = CATEGORIES[slug];
  if (!entry) return {};
  return {
    title: `${entry.label} News — Latest Qatar ${entry.label} Updates | Qatar Portal`,
    description: `Latest ${entry.label} news from Qatar and the Gulf, updated every 15 minutes from Al Jazeera, BBC, and Google News.`,
    keywords: [`${entry.label} news Qatar`, `Qatar ${entry.label.toLowerCase()}`, `${entry.label.toLowerCase()} news Doha`],
    alternates: { canonical: `${SITE_URL}/news-category/${slug}` },
    openGraph: {
      title: `${entry.label} News — Qatar Portal`,
      description: `Latest ${entry.label} news from Qatar and the Gulf.`,
      url: `${SITE_URL}/news-category/${slug}`,
      siteName: "Qatar Portal",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" as const, title: `${entry.label} News — Qatar Portal`, description: `Latest ${entry.label} news from Qatar and the Gulf.` },
  };
}

export default async function NewsCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const entry = CATEGORIES[slug];
  if (!entry) notFound();

  const allNews = await getNews(48);
  const lowerKeywords = entry.keywords.map((kw) => kw.toLowerCase());
  const filtered = allNews.filter((item) => {
    const titleLower = item.title.toLowerCase();
    const snippetLower = (item.contentSnippet ?? "").toLowerCase();
    return lowerKeywords.some((kw) =>
      titleLower.includes(kw) || snippetLower.includes(kw)
    );
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${entry.label} News — Qatar`,
    url: `${SITE_URL}/news-category/${slug}`,
    numberOfItems: filtered.length,
    itemListElement: filtered.slice(0, 10).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.title,
      url: `${SITE_URL}/news/${item.slug}`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mb-6">
        <h1 className="font-newsreader text-2xl sm:text-3xl font-bold text-on-surface">{entry.label} News</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length > 0 ? `${filtered.length} articles found` : "No articles in this category right now"}
          {" · "}
          <a href="/news" className="text-rose-700 hover:underline">View all Qatar news</a>
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(CATEGORIES)
            .filter(([s]) => s !== slug)
            .map(([s, e]) => (
              <a
                key={s}
                href={`/news-category/${s}`}
                className="px-3 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs text-sky-800 hover:bg-sky-100 transition-colors"
              >
                {e.label}
              </a>
            ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <NewsSearch items={filtered} />
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📰</p>
          <p>No {entry.label.toLowerCase()} news found right now. Check back soon.</p>
          <a href="/news" className="mt-4 inline-block text-rose-700 hover:underline text-sm">→ Browse all news</a>
        </div>
      )}
    </div>
  );
}
