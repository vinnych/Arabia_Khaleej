import { pageMeta } from "@/lib/seo";
import { NewsArticleSchema, BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import NewsArticleClient from "@/components/news/NewsArticleClient";
import { notFound } from "next/navigation";
import { getArticleBySlug, getUnifiedNews, NewsItem } from "@/lib/news";

// Use direct server-side data access for performance and GSC reliability
export const dynamic = 'force-dynamic';

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ lang?: string }>
}) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug;
  const lang = resolvedSearch.lang === 'ar' ? 'ar' : 'en';
  
  const article = await getArticleBySlug(slug, lang);
  
  if (article) {
    // Truncate description to ~160 chars for optimal SEO
    const seoDescription = article.description.length > 160 
      ? article.description.substring(0, 157) + "..." 
      : article.description;

    // Use clean path for pageMeta, it now handles alternates robustly
    return pageMeta({
      title: article.title,
      description: seoDescription,
      path: `/news/${slug}${lang === 'ar' ? '?lang=ar' : ''}`,
      image: article.image,
      type: 'article',
      datePublished: article.pubDate,
      keywords: [article.source, article.category, "GCC news", ...article.title.split(' ').filter((w: string) => w.length > 4)]
    });
  }

  return pageMeta({
    title: "News Article | Arabia Khaleej",
    description: "Detailed news coverage from official GCC and international sources.",
    path: `/news/${slug}`,
  });
}

export default async function NewsArticlePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ lang?: string }>
}) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const lang = resolvedSearch.lang === 'ar' ? 'ar' : 'en';
  const article = await getArticleBySlug(resolvedParams.slug, lang);

  if (!article) {
    notFound();
  }

  // Improved Internal Linking: Fetch related news to keep crawlers moving
  const moreNews = await getUnifiedNews({ lang, limit: 6 });
  const filteredMoreNews = moreNews.filter((n: NewsItem) => n.slug !== resolvedParams.slug).slice(0, 4);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Press Terminal", item: "/news" },
    { name: article.title, item: `/news/${resolvedParams.slug}` }
  ];

  const canonicalUrl = `https://arabiakhaleej.com/news/${resolvedParams.slug}${lang === 'ar' ? '?lang=ar' : ''}`;

  return (
    <main className="min-h-screen pt-20">
      {/* SEO Schemas */}
      <NewsArticleSchema 
        title={article.title}
        description={article.description}
        image={article.image}
        datePublished={article.pubDate}
        authorName={article.source}
        url={canonicalUrl}
        language={article.language === 'ar' ? 'ar' : 'en'}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema 
        name={article.title}
        description={article.description}
        url={canonicalUrl}
        datePublished={article.pubDate}
      />

      <NewsArticleClient initialArticle={article} moreNews={filteredMoreNews} />
    </main>
  );
}
