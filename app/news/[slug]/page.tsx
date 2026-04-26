import { pageMeta } from "@/lib/seo";
import { NewsArticleSchema, BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import NewsArticleClient from "@/components/news/NewsArticleClient";
import { notFound } from "next/navigation";

// Since we use a transient cache for news, we can't easily pre-generate all pages.
export const dynamic = 'force-dynamic';

async function getArticle(slug: string, lang: string = 'en') {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news?slug=${slug}&lang=${lang}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      // If not found in requested lang, try the other one as a fallback
      const fallbackLang = lang === 'en' ? 'ar' : 'en';
      const fallbackRes = await fetch(`${baseUrl}/api/news?slug=${slug}&lang=${fallbackLang}`, {
        next: { revalidate: 3600 }
      });
      if (!fallbackRes.ok) return null;
      const fallbackData = await fallbackRes.json();
      return fallbackData.news?.[0] || null;
    }
    const data = await res.json();
    if (data.status === 'success' && data.news?.[0]) {
      return data.news[0];
    }
  } catch (e) {
    console.error('Error fetching article:', e);
  }
  return null;
}

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
  
  const article = await getArticle(slug, lang);
  
  if (article) {
    // Truncate description to ~160 chars for optimal SEO
    const seoDescription = article.description.length > 160 
      ? article.description.substring(0, 157) + "..." 
      : article.description;

    const isAr = article.language === 'ar' || /[\u0600-\u06FF]/.test(article.title);

    return pageMeta({
      title: article.title,
      // If the article is already Arabic, we don't need a separate titleAr for the combined title
      // unless we have an English translation (which we don't here).
      // pageMeta will handle the logic.
      titleAr: isAr ? undefined : undefined, 
      description: seoDescription,
      path: `/news/${slug}${lang === 'ar' ? '?lang=ar' : ''}`,
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

export default async function NewsArticlePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ lang?: string }>
}) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const lang = resolvedSearch.lang === 'ar' ? 'ar' : 'en';
  const article = await getArticle(resolvedParams.slug, lang);

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
        language={article.language === 'ar' ? 'ar' : article.language === 'en' ? 'en' : ['en', 'ar']}
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
