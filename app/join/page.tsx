import { pageMeta, SITE_NAME } from "@/lib/seo";
import JoinClient from "@/components/JoinClient";
import StructuredData from "@/components/StructuredData";

export const metadata = pageMeta({
  title: `Concierge Access — Access Arabia Khaleej | ${SITE_NAME}`,
  description: "Access our boutique concierge services and the definitive reference for a refined GCC experience.",
  path: "/join",
  keywords: ["GCC concierge", "concierge access", "Arabia Khaleej invite", "boutique services", "Qatar lifestyle", "Saudi lifestyle", "UAE lifestyle"],
});

export default function JoinPage() {
  const breadcrumbData = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://arabiakhaleej.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Boutique Access",
        "item": "https://arabiakhaleej.com/join"
      }
    ]
  };

  const serviceData = {
    "@type": "Service",
    "name": "Boutique Concierge Access",
    "description": "Exclusive concierge and boutique access for refined GCC residents and visitors.",
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "areaServed": ["QA", "SA", "AE", "KW", "OM", "BH"]
  };

  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />
      <StructuredData type="Service" data={serviceData} />
      <JoinClient />
    </>
  );
}
