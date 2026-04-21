import { pageMeta } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
import NewsArticleClient from "@/components/NewsArticleClient";

// Since we use a transient cache for news, we can't easily pre-generate all pages.
// We'll use dynamic rendering for the individual article pages.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Try to fetch the article to get the title for SEO
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news?slug=${slug}`);
    const data = await res.json();
    
    if (data.status === 'success' && data.news?.[0]) {
      const article = data.news[0];
      return pageMeta({
        title: `${article.title} | Press Terminal`,
        description: article.description,
        path: `/news/${slug}`,
        image: article.image,
        type: 'article',
        datePublished: article.pubDate
      });
    }
  } catch (e) {
    console.error('Error generating metadata for news:', e);
  }

  return pageMeta({
    title: "News Article | Arabia Khaleej",
    description: "Detailed news coverage from official GCC and international sources.",
    path: `/news/${slug}`,
  });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  return (
    <main className="min-h-screen pt-20">
      <NewsArticleClient slug={resolvedParams.slug} />
    </main>
  );
}
