import { pageMeta } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import TransparencyClient from "./TransparencyClient";

export const metadata = pageMeta({
  title: "Transparency & Neutrality | Arabia Khaleej",
  titleAr: "الشفافية والحياد | عربية خليج",
  description: "Our official statement on regulatory compliance, data transparency, and independent neutrality across the GCC region.",
  descriptionAr: "بياننا الرسمي حول الامتثال التنظيمي وشفافية البيانات والحياد المستقل في منطقة دول مجلس التعاون الخليجي.",
  path: "/transparency",
});

export default function Page() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Transparency", item: "/transparency" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <TransparencyClient />
    </>
  );
}
