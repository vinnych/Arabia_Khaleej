import NewsSearch from "@/components/NewsSearch";
import { getNews } from "@/lib/rss";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qatar & Gulf Breaking News Today — Al Jazeera, The Peninsula, Gulf Times | Qatar Portal",
  description: "Latest breaking news from Qatar and the Gulf — updated every 15 minutes from Al Jazeera, The Peninsula Qatar, Gulf Times, and Qatar News Agency.",
  alternates: { canonical: "https://qatar-portal.vercel.app/news" },
  keywords: ["Qatar news today", "Gulf news", "Al Jazeera Qatar", "The Peninsula Qatar", "Gulf Times", "Qatar breaking news"],
};

export default async function NewsPage() {
  let news: Awaited<ReturnType<typeof getNews>> = [];
  let jsonLd = null;

  try {
    news = await getNews(48);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Qatar & Gulf News",
      "itemListElement": news.slice(0, 10).map((item, i) => {
        const isoDate = (() => { try { return new Date(item.pubDate).toISOString(); } catch { return item.pubDate; } })();
        return {
          "@type": "ListItem",
          "position": i + 1,
          "url": `https://qatar-portal.vercel.app/news/${item.slug}`,
          "item": {
            "@type": "NewsArticle",
            "headline": item.title,
            "url": `https://qatar-portal.vercel.app/news/${item.slug}`,
            "datePublished": isoDate,
            "author": { "@type": "Organization", "name": item.source },
            "publisher": { "@type": "Organization", "name": item.source, "logo": { "@type": "ImageObject", "url": "https://qatar-portal.vercel.app/icon.svg" } },
            "image": item.imageUrl ?? "https://qatar-portal.vercel.app/opengraph-image",
          }
        };
      })
    };
  } catch { /* ignore */ }

  return (
    <div>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: safeJsonLd(jsonLd)}} />
      )}
      <h1 className="text-2xl font-bold text-sky-900 mb-6">
        <span aria-hidden="true">📰</span> Qatar &amp; Gulf News
      </h1>
      <NewsSearch items={news} />
    </div>
  );
}
