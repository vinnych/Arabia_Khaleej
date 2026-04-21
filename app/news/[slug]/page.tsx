import { pageMeta } from "@/lib/seo";
import { NewsArticleSchema, BreadcrumbSchema, WebPageSchema } from "@/components/StructuredData";
import NewsArticleClient from "@/components/NewsArticleClient";
import { notFound } from "next/navigation";

// Since we use a transient cache for news, we can't easily pre-generate all pages.
export const dynamic = 'force-dynamic';

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news?slug=${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === 'success' && data.news?.[0]) {
      return data.news[0];
    }
  } catch (e) {
    console.error('Error fetching article:', e);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await getArticle(slug);
  
  if (article) {
    // Truncate description to ~160 chars for optimal SEO
    const seoDescription = article.description.length > 160 
      ? article.description.substring(0, 157) + "..." 
      : article.description;

    return pageMeta({
      title: `${article.title}`,
      description: seoDescription,
      path: `/news/${slug}`,
      image: article.image,
      type: 'article',
      datePublished: article.pubDate,
      keywords: [article.source, article.category, "GCC news", "Press Terminal", ...article.title.split(' ').filter((w: string) => w.length > 4)]
    });
  }

  return pageMeta({
    title: "News Article | Arabia Khaleej",
    description: "Detailed news coverage from official GCC and international sources.",
    path: `/news/${slug}`,
  });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Press Terminal", item: "/news" },
    { name: article.title, item: `/news/${resolvedParams.slug}` }
  ];

  return (
    <main className="min-h-screen pt-20">
      {/* SEO Schemas */}
      <NewsArticleSchema 
        title={article.title}
        description={article.description}
        image={article.image}
        datePublished={article.pubDate}
        authorName={article.source}
        url={`/news/${resolvedParams.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema 
        name={article.title}
        description={article.description}
        url={`/news/${resolvedParams.slug}`}
        datePublished={article.pubDate}
      />

      <NewsArticleClient initialArticle={article} />
    </main>
  );
}
