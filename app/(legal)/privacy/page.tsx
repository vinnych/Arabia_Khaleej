import { pageMeta } from "@/lib/seo";
import PrivacyClient from "./PrivacyClient";
import StructuredData from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/seo";

import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: "Privacy Policy | Arabia Khaleej",
  titleAr: "سياسة الخصوصية | عربية خليج",
  description: "Our privacy-first commitment: No accounts, no cookies, no trackers. Full anonymity by design for a clean regional experience.",
  descriptionAr: "التزامنا بالخصوصية أولاً: لا حسابات، لا ملفات تعريف ارتباط، لا متتبعات. مجهول تماماً حسب التصميم لتجربة إقليمية نظيفة.",
  path: "/privacy",
});

export default function Page() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Privacy", item: "/privacy" }
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <PrivacyClient />
    </>
  );
}

