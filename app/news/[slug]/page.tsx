import { getNews, type NewsItem } from "@/lib/rss";
import { safeJsonLd, isValidHttpUrl } from "@/lib/utils";
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
  return {
    title: `${item.title} | Qatar Portal`,
    description: item.contentSnippet || `Read the latest news from ${item.source} on Qatar Portal.`,
    alternates: { canonical: `${SITE_URL}/news/${slug}` },
    openGraph: {
      title: item.title,
      description: item.contentSnippet || `Read the latest news from ${item.source} on Qatar Portal.`,
      url: `${SITE_URL}/news/${slug}`,
      siteName: "Qatar Portal",
      type: "article",
      ...(item.imageUrl ? { images: [{ url: item.imageUrl }] } : {}),
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) {
    let link: string | null = null;
    try {
      const decoded = Buffer.from(slug, "base64url").toString();
      if (isValidHttpUrl(decoded)) link = decoded;
    } catch { /* invalid slug */ }
    if (link) redirect(link);
    notFound();
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
      name: item.source,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    description: summary ?? item.contentSnippet,
    mainEntityOfPage: `${SITE_URL}/news/${slug}`,
    image: item.imageUrl ?? `${SITE_URL}/opengraph-image`,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="mb-6">
        <a href="/news" className="text-sm text-sky-700 hover:underline font-medium">
          ← Back to News
        </a>
      </div>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full rounded-xl object-cover max-h-72 mb-5"
        />
      ) : (
        <div className="w-full rounded-xl h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center mb-5">
          <span className="text-5xl opacity-30">📰</span>
        </div>
      )}
      <span className="inline-block text-xs text-sky-700 font-semibold uppercase tracking-wide bg-sky-50 border border-sky-200 px-3 py-1 rounded-full mb-3">
        {item.source}
      </span>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-3 leading-snug">
        {item.title}
      </h1>
      {item.pubDate && (
        <p className="text-xs text-gray-400 mb-6">{item.pubDate}</p>
      )}
      {summary ? (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span>✨</span> AI-generated summary · Read the full article below
          </p>
        </div>
      ) : item.contentSnippet ? (
        <p className="text-gray-600 mb-8 leading-relaxed text-base">{item.contentSnippet}</p>
      ) : null}
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-sky-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-800 transition-colors"
      >
        Read Full Article on {item.source} →
      </a>
    </div>
  );
}
