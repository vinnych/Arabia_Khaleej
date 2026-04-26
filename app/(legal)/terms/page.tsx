import { pageMeta } from "@/lib/seo";
import TermsClient from "./TermsClient";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: "Terms & Conditions | Arabia Khaleej",
  titleAr: "الشروط والأحكام | عربية خليج",
  description:
    "Official terms of service for the Arabia Khaleej regional platform. Understanding our standards and your usage of the GCC Standard.",
  descriptionAr:
    "الشروط الرسمية لخدمة منصة عربية خليج الإقليمية. فهم معاييرنا واستخدامك للمعيار الخليجي.",
  path: "/terms",
});

export default function Page() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Terms", item: "/terms" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <TermsClient />
    </>
  );
}
