import { pageMeta, SITE_NAME, SITE_URL } from "@/lib/seo";
import JoinClient from "@/components/join/JoinClient";
import {
  BreadcrumbSchema,
  WebPageSchema,
  ContactPageSchema,
} from "@/components/seo/StructuredData";
import StructuredData from "@/components/seo/StructuredData";
import { getT } from "@/lib/i18n-server";

export async function generateMetadata() {
  const t = await getT();
  return pageMeta({
    title: `${t('boutiqueEnquiry')} | ${SITE_NAME}`,
    description: t('contactDesc'),
    path: "/join",
    type: "website",
  });
}

export default async function JoinPage() {
  const t = await getT();
  const breadcrumbItems = [
    { name: t('home'), item: "/" },
    { name: t('boutiqueEnquiry'), item: "/join" },
  ];

  return (
    <>
      <WebPageSchema
        name={`${t('boutiqueEnquiry')} — ${SITE_NAME}`}
        description={t('contactDesc')}
        url="/join"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ContactPageSchema />
      <StructuredData
        type="Service"
        data={{
          name: t('boutiqueEnquiry'),
          description: t('contactDesc'),
          serviceType: "Partnership & Inquiry Service",
          provider: { "@id": `${SITE_URL}/#organization` },
          areaServed: [
            { "@type": "Country", name: "Qatar" },
            { "@type": "Country", name: "Saudi Arabia" },
            { "@type": "Country", name: "United Arab Emirates" },
            { "@type": "Country", name: "Kuwait" },
            { "@type": "Country", name: "Oman" },
            { "@type": "Country", name: "Bahrain" },
          ],
          availableLanguage: [
            { "@type": "Language", name: "English" },
            { "@type": "Language", name: "Arabic", alternateName: "العربية" },
          ],
          url: `${SITE_URL}/join`,
        }}
      />
      <JoinClient />
    </>
  );
}
