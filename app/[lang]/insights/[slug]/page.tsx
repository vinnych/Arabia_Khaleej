import { pageMeta } from '@/lib/seo/seo';
import { InsightArticleSchema, BreadcrumbSchema, WebPageSchema, HowToSchema, ReviewSchema, FAQSchema } from "@/components/seo/StructuredData";
import InsightArticleClient from "@/components/insights/InsightArticleClient";
import { notFound } from "next/navigation";
import { getArticleBySlug, getUnifiedInsights, InsightItem } from '@/lib/database/insights';
import { getT } from '@/lib/i18n/i18n-server';
import { getAuthorById, EDITORIAL_AUTHORS } from '@/lib/core/authors';

// Use direct server-side data access for performance and GSC reliability
export const revalidate = 600;

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: string; slug: string }>,
  searchParams: Promise<{ lang?: string }>
}) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const slug = resolvedParams.slug;
  // Why: Check resolvedParams.lang first (from route subpath /[lang]/insights/[slug])
  // to correctly set page metadata language and canonical url for SEO crawlers.
  const lang = resolvedParams.lang === 'ar' || resolvedSearch.lang === 'ar' ? 'ar' : 'en';
  
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
      path: `/insights/${article.slug}`,
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
  params: Promise<{ lang: string; slug: string }>,
  searchParams: Promise<{ lang?: string }>
}) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  // Why: Retrieve the locale from the dynamic route parameter (resolvedParams.lang)
  // to avoid falling back to English when Googlebot crawls /ar paths.
  const lang = resolvedParams.lang === 'ar' || resolvedSearch.lang === 'ar' ? 'ar' : 'en';
  const article = await getArticleBySlug(resolvedParams.slug, lang);

  if (!article) {
    notFound();
  }

  // Improved Internal Linking: Fetch related insights to keep crawlers moving
  const moreInsights = await getUnifiedInsights({ lang, limit: 6 });
  const filteredMoreInsights = moreInsights.filter((n: InsightItem) => n.slug !== resolvedParams.slug).slice(0, 4);

  const t = await getT(lang);
  const breadcrumbs = [
    { name: t('home'), item: "/" },
    { name: t('insights'), item: "/insights" },
    { name: article.title, item: `/insights/${resolvedParams.slug}` }
  ];

  const canonicalUrl = `https://arabiakhaleej.com/${lang}/insights/${article.slug}`;

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
      {/* Primary Article Schema with Person Author */}
      <InsightArticleSchema 
        title={article.title}
        description={article.description}
        image={article.image}
        datePublished={article.pubDate}
        dateModified={article.editedAt || article.pubDate}
        author={richAuthor}
        url={canonicalUrl}
        language={article.language === 'ar' ? 'ar' : 'en'}
      />

      {/* Review Schema for search engines (premium quality rated out of 10) */}
      <ReviewSchema 
        itemReviewed={{ name: article.title }}
        reviewRating={article.qualityScore || 6}
        author={richAuthor.name}
        datePublished={article.pubDate}
        reviewBody={article.description}
        url={canonicalUrl}
      />

      {/* Supplemental Rich Results based on content type */}
      {(() => {
        if ((article.title.toLowerCase().includes('how to') || article.content?.toLowerCase().includes('step-by-step')) && article.content) {
          try {
            const steps = article.content.split('\n')
              .filter(l => /^\d+\./.test(l.trim()))
              .map(l => ({ name: l.replace(/^\d+\.\s*/, '').split(':')[0], text: l.replace(/^\d+\.\s*/, '') }))
              .slice(0, 10);
            
            if (steps.length > 0) {
              return (
                <HowToSchema 
                  name={article.title}
                  description={article.description}
                  image={article.image}
                  url={canonicalUrl}
                  steps={steps}
                />
              );
            }
          } catch (e) {
            console.error("Failed to parse HowToSchema steps", e);
          }
        }
        return null;
      })()}

      <BreadcrumbSchema items={breadcrumbs} />
      <WebPageSchema 
        name={article.title}
        description={article.description}
        url={canonicalUrl}
        datePublished={article.pubDate}
        dateModified={article.editedAt || article.pubDate}
      />

      <InsightArticleClient initialArticle={article} moreInsights={filteredMoreInsights} />
    </main>
  );
}
