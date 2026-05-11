import { pageMeta } from "@/lib/seo";
import { InsightArticleSchema, BreadcrumbSchema, WebPageSchema, HowToSchema, ReviewSchema, FAQSchema } from "@/components/seo/StructuredData";
import InsightArticleClient from "@/components/insights/InsightArticleClient";
import { notFound } from "next/navigation";
import { getArticleBySlug, getUnifiedInsights, InsightItem } from "@/lib/insights";
import { getT } from "@/lib/i18n-server";

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
      path: `/insights/${article.slug}${lang === 'ar' ? '?lang=ar' : ''}`,
      image: article.image,
      type: 'article',
      lang,
      datePublished: article.pubDate,
      keywords: [
        article.source, 
        article.category, 
        "GCC intelligence", 
        "regional analysis",
        ...(article.tags || []),
        ...article.title.split(' ').filter((w: string) => w.length > 4)
      ]
    });
  }

  return pageMeta({
    title: "Insight | Arabia Khaleej",
    description: "Detailed editorial coverage and deep dives.",
    path: `/insights/${slug}`,
    lang,
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
  const moreInsights = await getUnifiedInsights({ lang, limit: 6 });
  const filteredMoreInsights = moreInsights.filter((n: InsightItem) => n.slug !== resolvedParams.slug).slice(0, 4);

  const t = await getT();
  const breadcrumbs = [
    { name: t('home'), item: "/" },
    { name: t('insights'), item: "/insights" },
    { name: article.title, item: `/insights/${resolvedParams.slug}` }
  ];

  const canonicalUrl = `https://arabiakhaleej.com/insights/${article.slug}${lang === 'ar' ? '?lang=ar' : ''}`;

  return (
    <main className="min-h-screen pt-20">
      {/* Primary Article Schema */}
      <InsightArticleSchema 
        title={article.title}
        description={article.description}
        image={article.image}
        datePublished={article.pubDate}
        dateModified={article.pubDate} // Using pubDate for now, update if your API provides modifiedDate
        authorName={article.source}
        url={canonicalUrl}
        language={article.language === 'ar' ? 'ar' : 'en'}
      />

      {/* Supplemental Rich Results based on content type */}
      {(article.title.toLowerCase().includes('how to') || article.content?.toLowerCase().includes('step-by-step')) && article.content ? (
        <HowToSchema 
          name={article.title}
          description={article.description}
          image={article.image}
          url={canonicalUrl}
          steps={article.content.split('\n')
            .filter(l => /^\d+\./.test(l.trim()))
            .map(l => ({ name: l.replace(/^\d+\.\s*/, '').split(':')[0], text: l.replace(/^\d+\.\s*/, '') }))
            .slice(0, 10)}
        />
      ) : null}

      {(article.title.toLowerCase().includes('review') || article.tags?.includes('review')) && (
        <ReviewSchema 
          itemReviewed={{ name: article.title.replace(/review/i, '').trim() }}
          reviewRating={5} // Default to 5 for premium insights
          author={article.source}
          datePublished={article.pubDate}
          reviewBody={article.description}
          url={canonicalUrl}
        />
      )}

      {(article.title.toLowerCase().includes('why') || article.content?.includes('?')) && (
        <FAQSchema 
          questions={[
            { question: article.title, answer: article.description }
          ]}
        />
      )}

      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema 
        name={article.title}
        description={article.description}
        url={canonicalUrl}
        datePublished={article.pubDate}
        dateModified={article.pubDate}
      />

      <InsightArticleClient initialArticle={article} moreInsights={filteredMoreInsights} />
    </main>
  );
}
