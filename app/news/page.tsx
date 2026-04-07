import NewsSearch from "@/components/NewsSearch";
import NewsletterCTA from "@/components/NewsletterCTA";
import { getNews } from "@/lib/rss";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Qatar & Gulf Breaking News Today | Qatar Portal",
  description: "Latest breaking news from Qatar and the Gulf — updated every 15 minutes from Al Jazeera, BBC Middle East, and Google News.",
  path: "/news",
  keywords: ["Qatar news today", "Gulf news", "Al Jazeera Qatar", "BBC Middle East", "Qatar breaking news", "Doha news"],
  ogTitle: "Qatar & Gulf Breaking News Today | Qatar Portal",
  ogDescription: "Latest breaking news from Qatar and the Gulf — updated every 15 minutes from Al Jazeera, BBC and Google News.",
});

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Qatar News", item: "https://qatar-portal.vercel.app/news" }] }) }} />
      <h1 className="font-newsreader text-xl sm:text-2xl font-bold text-on-surface mb-4">
        Qatar &amp; Gulf News
      </h1>
      <NewsletterCTA />
      <NewsSearch items={news} />
    </div>
  );
}
