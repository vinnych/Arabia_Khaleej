import { getT } from "@/lib/i18n-server";
import { pageMeta } from "@/lib/seo";
import DisclaimerClient from "./DisclaimerClient";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: "Disclaimer | Arabia Khaleej",
  titleAr: "إخلاء المسؤولية | عربية خليج",
  description:
    "Official disclaimer regarding the nature of information provided by Arabia Khaleej. High-fidelity regional insights provided for convenience.",
  descriptionAr:
    "إخلاء مسؤولية رسمي بشأن طبيعة المعلومات التي تقدمها عربية خليج. رؤى إقليمية عالية الدقة مقدمة للتسهيل.",
  path: "/disclaimer",
});



export default async function Page() {
  const t = await getT();
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('disclaimer'), item: "/disclaimer" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <DisclaimerClient />
    </>
  );
}

