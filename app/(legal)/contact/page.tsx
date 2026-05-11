import { pageMeta } from "@/lib/seo";
import ContactClient from "./ContactClient";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: "Contact Us | Arabia Khaleej",
  titleAr: "اتصل بنا | عربية خليج",
  description: "Get in touch with Arabia Khaleej for editorial inquiries, strategic partnerships, and regional regulatory dialogue.",
  descriptionAr: "تواصل مع عربية خليج للاستفسارات التحريرية والشراكات الاستراتيجية والحوار التنظيمي الإقليمي.",
  path: "/contact",
});

import { getT } from "@/lib/i18n-server";

export default async function ContactPage() {
  const t = await getT();
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('contact'), item: "/contact" }
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ContactClient />
    </>
  );
}

