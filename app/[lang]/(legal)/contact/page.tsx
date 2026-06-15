import { getT } from '@/lib/i18n/i18n-server';
import { pageMeta } from '@/lib/seo/seo';
import ContactClient from "./ContactClient";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  return pageMeta({
    title: "Contact Us | Arabia Khaleej",
    titleAr: "اتصل بنا | عربية خليج",
    description: "Get in touch with Arabia Khaleej for editorial inquiries, strategic partnerships, and regional regulatory dialogue.",
    descriptionAr: "تواصل مع عربية خليج للاستفسارات التحريرية والشراكات الاستراتيجية والحوار التنظيمي الإقليمي.",
    path: "/contact",
    lang,
  });
}



export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'ar' ? 'ar' : 'en';
  const t = await getT(lang);
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

