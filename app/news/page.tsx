import { pageMeta } from "@/lib/seo";
import StructuredData from "@/components/seo/StructuredData";
import NewsClient from "@/components/news/NewsClient";
import PublicSurvey from "@/components/news/PublicSurvey";

export const metadata = pageMeta({
  title: "Press Terminal | Official GCC & Community News",
  titleAr: "محطة الصحافة | أخبار الخليج والمجتمع الرسمية",
  description: "Real-time official updates from QNA, WAM, SPA, and international community news for expats in the GCC.",
  descriptionAr: "تحديثات رسمية في الوقت الفعلي من وكالات الأنباء الخليجية والأخبار الدولية للمقيمين في دول مجلس التعاون.",
  path: "/news",
  keywords: ["GCC official news", "Qatar News Agency", "Saudi Press Agency", "Emirates News Agency", "India expat news GCC"],
});

export default function NewsPage() {
  return (
    <div className="pt-20">
      <StructuredData 
        type="WebPage"
        data={{
          name: "Arabia Khaleej Press Terminal",
          description: "Official regional news and updates aggregator from GCC state agencies.",
        }}
      />
      <NewsClient />
      <PublicSurvey />
    </div>
  );
}
