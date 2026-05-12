import { getT } from "@/lib/i18n-server";
import { pageMeta, SITE_URL } from "@/lib/seo";
import PrivacyClient from "./PrivacyClient";
import StructuredData from "@/components/seo/StructuredData";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: "Privacy Policy | Arabia Khaleej",
  titleAr: "سياسة الخصوصية | عربية خليج",
  description: "Transparency regarding our use of cookies, Google AdSense, and analytics to provide a premium, secure regional experience.",
  descriptionAr: "الشفافية بشأن استخدامنا لملفات تعريف الارتباط و Google AdSense والتحليلات لتوفير تجربة إقليمية متميزة وآمنة.",
  path: "/privacy",
});



export default async function Page() {
  const t = await getT();
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('privacy'), item: "/privacy" }
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <PrivacyClient />
    </>
  );
}


