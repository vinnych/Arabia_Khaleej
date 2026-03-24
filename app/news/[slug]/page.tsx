import { getNews, fetchPexelsImage, type NewsItem } from "@/lib/rss";
import { safeJsonLd, isValidHttpUrl } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import { redis } from "@/lib/redis";
import { summarizeArticle } from "@/lib/groq";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

const getCachedNews = cache(() => getNews(48));

const SITE_URL = "https://qatar-portal.vercel.app";

async function getNewsItem(slug: string): Promise<NewsItem | null> {
  // 1. Try Redis (persisted up to 7 days)
  if (redis) {
    try {
      const cached = await redis.get<NewsItem>(`news:${slug}`);
      if (cached) return cached;
    } catch { /* fall through */ }
  }
  // 2. Fall back to live feed
  const news = await getCachedNews();
  return news.find((n) => n.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) return {};
  const rawSnippet = item.contentSnippet || `Read the latest news from ${item.source} on Qatar Portal.`;
  const description = rawSnippet.length > 160 ? rawSnippet.slice(0, 157) + "…" : rawSnippet;
  return {
    title: `${item.title} | Qatar Portal`,
    description,
    keywords: [item.source, "Qatar news", "Gulf news", "Doha news", ...item.title.split(" ").filter(w => w.length > 4).slice(0, 4)],
    alternates: { canonical: `${SITE_URL}/news/${slug}` },
    openGraph: {
      title: item.title,
      description,
      url: `${SITE_URL}/news/${slug}`,
      siteName: "Qatar Portal",
      type: "article",
      images: [{ url: item.imageUrl ?? `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, news] = await Promise.all([getNewsItem(slug), getCachedNews()]);
  if (!item) {
    let link: string | null = null;
    try {
      const decoded = Buffer.from(slug, "base64url").toString();
      if (isValidHttpUrl(decoded)) link = decoded;
    } catch { /* invalid slug */ }
    if (link) redirect(link);
    notFound();
  }

  // Fetch image on-demand if not already present (cached in Redis)
  if (!item.imageUrl) {
    const img = await fetchPexelsImage(item.slug, item.title, item.link);
    if (img) item.imageUrl = img;
  }

  const summary = await summarizeArticle(slug, item.title, item.contentSnippet, item.source);

  const isoDate = (() => { try { return new Date(item.pubDate).toISOString(); } catch { return item.pubDate; } })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    url: `${SITE_URL}/news/${slug}`,
    datePublished: isoDate,
    author: { "@type": "Organization", name: item.source },
    publisher: {
      "@type": "Organization",
      name: "Qatar Portal",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    description: summary ?? item.contentSnippet,
    mainEntityOfPage: `${SITE_URL}/news/${slug}`,
    image: item.imageUrl ?? `${SITE_URL}/opengraph-image`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
      { "@type": "ListItem", position: 3, name: item.title, item: `${SITE_URL}/news/${slug}` },
    ],
  };

  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <div className="mb-4">
        <a href="/news" className="inline-block text-xs text-gray-400 hover:text-primary py-2">
          ← Back to News
        </a>
      </div>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full rounded-xl object-cover max-h-56 mb-5"
        />
      ) : (
        <div className="w-full rounded-lg h-40 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center mb-5">
          <span className="text-5xl opacity-30">📰</span>
        </div>
      )}
      <span className="inline-block text-[10px] text-primary font-semibold uppercase tracking-wide bg-primary/5 border border-primary/15 px-2 py-0.5 rounded-full mb-3">
        {item.source}
      </span>
      <h1 className="font-newsreader text-xl font-bold text-on-surface mt-2 mb-2 leading-snug">
        {item.title}
      </h1>
      {item.pubDate && (
        <p className="text-xs text-gray-400 mb-4 tabular-nums">{new Date(item.pubDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
      )}
      {summary ? (
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span>✨</span> AI-generated summary · Read the full article below
          </p>
        </div>
      ) : item.contentSnippet ? (
        <p className="text-gray-600 mb-6 leading-relaxed text-sm">{item.contentSnippet}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:scale-[1.02] transition-transform w-full sm:w-auto text-center"
        >
          Read Full Article on {item.source} →
        </a>
        <ShareButton title={item.title} url={`${SITE_URL}/news/${slug}`} />
      </div>

      {/* Related articles */}
      {(() => {
        const titleWords = item.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
        const related = (news ?? [])
          .filter((n) => n.slug !== slug)
          .filter((n) => {
            const t = n.title.toLowerCase();
            return titleWords.filter((w) => t.includes(w)).length >= 2;
          })
          .slice(0, 3);
        if (related.length === 0) return null;
        return (
          <div className="mt-6 pt-6 border-t border-stone-200">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Related News</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <a key={r.slug} href={`/news/${r.slug}`}
                  className="bg-white rounded-lg ring-1 ring-stone-900/5 shadow-ambient hover:shadow-ambient-hover transition-shadow flex flex-col overflow-hidden">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt={r.title} className="w-full h-24 object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-24 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                      <span className="text-3xl opacity-40">📰</span>
                    </div>
                  )}
                  <div className="p-3 flex flex-col flex-1">
                    <span className="text-[11px] text-primary font-semibold mb-1">{r.source}</span>
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-3">{r.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
