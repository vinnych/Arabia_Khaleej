import { pageMeta } from "@/lib/seo";
import StructuredData from "@/components/seo/StructuredData";
import InsightsClient from "@/components/insights/InsightsClient";

export const metadata = pageMeta({
  title: "Insights | Official GCC Editorials & Deep Dives",
  titleAr: "رؤى | افتتاحيات وتحليلات خليجية رسمية",
  description: "Original editorial insights, expert deep dives, and exclusive high-fidelity updates from Arabia Khaleej.",
  descriptionAr: "رؤى تحريرية أصلية، تحليلات خبراء، وتحديثات حصرية عالية الدقة من عربية خليج.",
  path: "/insights",
  keywords: ["GCC insights", "Middle East editorials", "Arabia Khaleej original", "GCC economy deep dive"],
});

export default function InsightsPage() {
  return (
    <div className="pt-20">
      <StructuredData 
        type="WebPage"
        data={{
          name: "Arabia Khaleej Insights",
          description: "Original regional editorials and insights.",
        }}
      />
      <InsightsClient />
    </div>
  );
}
