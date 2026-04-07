import { getNews } from "@/lib/rss";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta, SITE_URL } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Browse News by Category — Qatar Portal",
  description: "Browse Qatar and Gulf news by category: Qatar, Business, Sports, World, and Gulf news — updated every 15 minutes.",
  path: "/news-category",
  keywords: ["Qatar news categories", "Qatar business news", "Qatar sports news", "Gulf news", "Qatar world news"],
  ogDescription: "Qatar and Gulf news organised by category — Qatar, Business, Sports, World, Gulf.",
});

const CATEGORIES = [
  { slug: "qatar", label: "Qatar", icon: "🇶🇦", desc: "Local Qatar news, government, and Doha updates", keywords: ["qatar", "doha", "qatari", "al thani", "lusail", "pearl"] },
  { slug: "business", label: "Business", icon: "📈", desc: "Economy, trade, energy, banking, and investment news", keywords: ["business", "economy", "economic", "trade", "investment", "market", "financial", "bank", "oil", "gas", "energy", "qatarenergy", "LNG"] },
  { slug: "sports", label: "Sports", icon: "⚽", desc: "Football, cricket, F1, and Gulf sports coverage", keywords: ["sport", "football", "soccer", "fifa", "stadium", "cricket", "tennis", "F1", "formula", "olympic", "championship", "league", "match", "team", "player"] },
  { slug: "world", label: "World", icon: "🌍", desc: "International news, diplomacy, and global events", keywords: ["world", "global", "international", "UN", "united nations", "war", "conflict", "peace", "diplomacy", "summit", "election"] },
  { slug: "gulf", label: "Gulf", icon: "🏙️", desc: "Saudi Arabia, UAE, Kuwait, Bahrain, and Oman news", keywords: ["gulf", "GCC", "saudi", "UAE", "dubai", "abu dhabi", "kuwait", "bahrain", "oman", "riyadh", "jeddah"] },
];

export default async function NewsCategoryHubPage() {
  let allNews: Awaited<ReturnType<typeof getNews>> = [];
  try {
    allNews = await getNews(48);
  } catch { /* show empty state */ }

  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: allNews.filter((item) =>
      cat.keywords.some((kw) =>
        item.title.toLowerCase().includes(kw.toLowerCase()) ||
        (item.contentSnippet ?? "").toLowerCase().includes(kw.toLowerCase())
      )
    ).length,
    preview: allNews
      .filter((item) =>
        cat.keywords.some((kw) =>
          item.title.toLowerCase().includes(kw.toLowerCase()) ||
          (item.contentSnippet ?? "").toLowerCase().includes(kw.toLowerCase())
        )
      )
      .slice(0, 3),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Qatar News Categories",
    url: `${SITE_URL}/news-category`,
    itemListElement: CATEGORIES.map((cat, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${cat.label} News`,
      url: `${SITE_URL}/news-category/${cat.slug}`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mb-6">
        <h1 className="font-newsreader text-2xl sm:text-3xl font-bold text-on-surface mb-1">Browse News by Category</h1>
        <p className="text-gray-500 text-sm">
          Qatar and Gulf news organised by topic — <a href="/news" className="text-rose-700 hover:underline">view all news →</a>
        </p>
      </div>

      <div className="page-sections">
        {categoryCounts.map((cat) => (
          <div key={cat.slug} className="bg-sky-50 border border-sky-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h2 className="font-bold text-gray-900">{cat.label} News</h2>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
              </div>
              <a
                href={`/news-category/${cat.slug}`}
                className="text-xs text-sky-700 hover:underline font-medium whitespace-nowrap"
              >
                {cat.count} articles →
              </a>
            </div>
            {cat.preview.length > 0 ? (
              <ul className="divide-y divide-sky-100">
                {cat.preview.map((item) => (
                  <li key={item.slug}>
                    <a
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-3 px-5 py-3 hover:bg-sky-100 transition-colors"
                    >
                      <span className="text-sky-400 text-xs mt-0.5 flex-shrink-0">•</span>
                      <span className="text-sm text-gray-800 line-clamp-2 leading-snug">{item.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-sm text-gray-400">No articles in this category right now.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
