import { pageMeta } from "@/lib/seo";
import { NewsArticleSchema, BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import InsightArticleClient from "@/components/insights/InsightArticleClient";
import { notFound } from "next/navigation";
import { getArticleBySlug, getUnifiedNews, NewsItem } from "@/lib/insights";

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
      path: `/insights/${slug}${lang === 'ar' ? '?lang=ar' : ''}`,
      image: article.image,
      type: 'article',
      datePublished: article.pubDate,
      keywords: [article.source, article.category, "GCC insights", ...article.title.split(' ').filter((w: string) => w.length > 4)]
    });
  }

  return pageMeta({
    title: "Insight | Arabia Khaleej",
    description: "Detailed editorial coverage and deep dives.",
    path: `/insights/${slug}`,
  });
}

export default async function InsightArticlePage({ 
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

  // Improved Internal Linking: Fetch related insights to keep crawlers moving
  const moreInsights = await getUnifiedNews({ lang, limit: 6 });
  const filteredMoreInsights = moreInsights.filter((n: NewsItem) => n.slug !== resolvedParams.slug).slice(0, 4);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Insights", item: "/insights" },
    { name: article.title, item: `/insights/${resolvedParams.slug}` }
  ];

  const canonicalUrl = `https://arabiakhaleej.com/insights/${resolvedParams.slug}${lang === 'ar' ? '?lang=ar' : ''}`;

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

      <InsightArticleClient initialArticle={article} moreNews={filteredMoreInsights} />
    </main>
  );
}
