import { pageMeta } from "@/lib/seo";
import NewsClient from "@/components/news/NewsClient";
import PublicSurvey from "@/components/news/PublicSurvey";

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = params.category;
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  
  return pageMeta({
    title: `${title} News | Arabia Khaleej`,
    description: `Latest ${category} news and updates from the GCC and international community.`,
    path: `/news/category/${category}`,
  });
}

export default function CategoryNewsPage({ params }: { params: { category: string } }) {
  return (
    <div className="pt-20">
      <NewsClient category={params.category} />
      <PublicSurvey />
    </div>
  );
}
