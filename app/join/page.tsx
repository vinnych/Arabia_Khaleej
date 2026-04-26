import { pageMeta, SITE_NAME } from "@/lib/seo";
import JoinClient from "@/components/join/JoinClient";
import {
  BreadcrumbSchema,
  WebPageSchema,
  ContactPageSchema,
} from "@/components/seo/StructuredData";
import StructuredData from "@/components/seo/StructuredData";

export const metadata = pageMeta({
  title: `Submit an Inquiry — Arabia Khaleej | ${SITE_NAME}`,
  titleAr: `إرسال استفسار — عربية خليج | ${SITE_NAME}`,
  description:
    "A direct channel for partnership proposals and specialised regional inquiries across the GCC. Submit your request to the Arabia Khaleej team.",
  descriptionAr:
    "قناة مباشرة لمقترحات الشراكة والاستفسارات الإقليمية المتخصصة في منطقة الخليج. أرسل طلبك إلى فريق عربية خليج.",
  path: "/join",
  keywords: [
    "GCC inquiry", "GCC partnership", "Arabia Khaleej contact",
    "boutique services GCC", "regional partnership",
    "Qatar business", "Saudi Arabia business", "UAE business",
    "استفسار خليجي", "شراكة إقليمية",
  ],
});

export default function JoinPage() {
  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Enquire", item: "/join" },
  ];

  return (
    <>
      <WebPageSchema
        name="Submit an Inquiry — Arabia Khaleej"
        description="Direct inquiry channel for partnership proposals and regional inquiries across Qatar, UAE, Saudi Arabia, Kuwait, Oman, and Bahrain."
        url="/join"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ContactPageSchema />
      <StructuredData
        type="Service"
        data={{
          name: "Arabia Khaleej Direct Inquiry Channel",
          alternateName: "قناة استفسار عربية خليج المباشرة",
          description:
            "A direct channel for partnership proposals and specialised regional inquiries across all Gulf Cooperation Council member states.",
          serviceType: "Partnership & Inquiry Service",
          provider: { "@id": "https://arabiakhaleej.com/#organization" },
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
          additionalProperty: [
            { "@type": "PropertyValue", name: "Response Time", value: "Within 48 hours" },
            { "@type": "PropertyValue", name: "Channel Type", value: "Direct form submission" },
            { "@type": "PropertyValue", name: "Languages Accepted", value: "English, Arabic" },
          ],
          url: "https://arabiakhaleej.com/join",
        }}
      />
      <JoinClient />
    </>
  );
}
