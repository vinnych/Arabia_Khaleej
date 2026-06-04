import { pageMeta } from "@/lib/seo";
import { InsightArticleSchema, BreadcrumbSchema, WebPageSchema, HowToSchema, ReviewSchema, FAQSchema } from "@/components/seo/StructuredData";
import InsightArticleClient from "@/components/insights/InsightArticleClient";
import { notFound } from "next/navigation";
import { getArticleBySlug, getUnifiedInsights, InsightItem } from "@/lib/insights";
import { getT } from "@/lib/i18n-server";
import { getAuthorById, EDITORIAL_AUTHORS } from "@/lib/authors";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string; slug: string }>,
  searchParams: Promise<{ preview?: string; lang?: string }>
}) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug;
  // Why: Check resolvedParams.lang first (from route subpath /[lang]/preview/[slug])
  // to correctly set page metadata language and canonical url.
  const lang = resolvedParams.lang === 'ar' || resolvedSearch.lang === 'ar' ? 'ar' : 'en';
  
  // For preview, we want to use the same logic as the regular article page
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
      robots: {
        index: false,
        follow: false,
      },
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
    title: "Preview | Arabia Khaleej",
    description: "Preview of article before publishing.",
    path: `/preview/${slug}`,
    lang,
    robots: {
      index: false,
      follow: false,
    },
  });
}

export default async function PreviewArticlePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ lang: string; slug: string }>,
  searchParams: Promise<{ preview?: string; lang?: string }>
}) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  // Why: Retrieve language preference directly from the dynamic route parameter (resolvedParams.lang)
  // to avoid falling back to English when Googlebot crawls /ar paths.
  const lang = resolvedParams.lang === 'ar' || resolvedSearch.lang === 'ar' ? 'ar' : 'en';
  const article = await getArticleBySlug(resolvedParams.slug, lang);

  if (!article) {
    notFound();
  }

  // Get related insights for internal linking
  const moreInsights = await getUnifiedInsights({ lang, limit: 6 });
  const filteredMoreInsights = moreInsights.filter((n: InsightItem) => n.slug !== resolvedParams.slug).slice(0, 4);

  const t = await getT(lang);
  const breadcrumbs = [
    { name: t('home'), item: "/" },
    { name: t('insights'), item: "/insights" },
    { name: article.title, item: `/preview/${resolvedParams.slug}` }
  ];

  const canonicalUrl = `https://arabiakhaleej.com/insights/${article.slug}${lang === 'ar' ? '?lang=ar' : ''}`;

  // High-Fidelity Author Mapping for E-E-A-T
  const getRichAuthor = (article: InsightItem) => {
    // 1. Try to use the author metadata from the article object (if set by the worker)
    if (article.author?.id) {
      const matched = getAuthorById(article.author.id);
      if (matched) {
        return {
          name: lang === 'ar' ? matched.nameAr : matched.name,
          role: lang === 'ar' ? matched.roleAr : matched.role,
          image: matched.image,
          social: matched.social,
          bio: lang === 'ar' ? matched.bioAr : matched.bio
        };
      }
    }

    // 2. Legacy fallback based on source strings
    const source = article.source || "";
    if (source.includes('Editorial') || source.includes('Editorial Leadership') || source.includes('Arabia Khaleej')) {
      const defaultAuthor = EDITORIAL_AUTHORS[0]; // Zaid Al-Harbi
      return {
        name: lang === 'ar' ? defaultAuthor.nameAr : defaultAuthor.name,
        role: lang === 'ar' ? defaultAuthor.roleAr : defaultAuthor.role,
        image: defaultAuthor.image,
        social: defaultAuthor.social
      };
    }

    // 3. Absolute fallback
    const fallbackAuthor = EDITORIAL_AUTHORS[1]; // Layla Mansour
    return {
      name: lang === 'ar' ? fallbackAuthor.nameAr : fallbackAuthor.name,
      role: lang === 'ar' ? fallbackAuthor.roleAr : fallbackAuthor.role,
      image: fallbackAuthor.image,
      social: fallbackAuthor.social
    };
  };

  const richAuthor = getRichAuthor(article);

  return (
    <main className="min-h-screen pt-20">
      {/* Add a banner to indicate this is a preview */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm font-medium text-yellow-800">
          PREVIEW MODE - This is a preview of the article before publishing
        </p>
      </div>

      {/* Primary Article Schema with Person Author */}
      <InsightArticleSchema 
        title={article.title}
        description={article.description}
        image={article.image}
        datePublished={article.pubDate}
        dateModified={article.pubDate}
        author={richAuthor}
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
          author={richAuthor.name}
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

      {/* Main content */}
      <InsightArticleClient initialArticle={article} moreInsights={filteredMoreInsights} />
    </main>
  );
}