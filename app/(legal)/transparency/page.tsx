import { pageMeta } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import StructuredData from "@/components/seo/StructuredData";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import TransparencyClient from "./TransparencyClient";

import { getT } from "@/lib/i18n-server";

export async function generateMetadata() {
  const t = await getT();
  return pageMeta({
    title: `${t('transparency')} | ${SITE_NAME}`,
    description: t('transparencyDesc'),
    path: "/transparency",
  });
}

export default async function Page() {
  const t = await getT();
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('transparency'), item: "/transparency" },
  ];

  const serviceData = {
    "headline": t('transparencyTitle'),
    "description": t('transparencyDesc'),
    "author": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo-premium-gold.png`
      }
    },
    "datePublished": "2024-04-18T00:00:00Z",
    "dateModified": new Date().toISOString()
  };

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <StructuredData type="Service" data={serviceData} />
      <TransparencyClient />
    </>
  );
}

