import { pageMeta, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";
import HomeClient from "@/components/HomeClient";
import StructuredData from "@/components/StructuredData";

export const metadata = pageMeta({
  title: `${SITE_NAME} | The GCC Standard`,
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: ["GCC Guide", "Qatar", "Saudi Arabia", "UAE", "Dubai", "Riyadh", "Doha", "Prayer Times", "Gold Rates", "The GCC Standard", "Expat Reference"],
});

export default function Home() {
  const orgData = {
    "@type": "Organization",
    "name": SITE_NAME,
    "description": SITE_DESCRIPTION,
    "url": "https://arabiakhaleej.com",
    "logo": "https://arabiakhaleej.com/icon.png",
    "sameAs": [
      "https://twitter.com/arabiakhaleej"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Community Support",
      "areaServed": ["QA", "SA", "AE", "KW", "OM", "BH"],
      "availableLanguage": ["en", "ar"]
    }
  };

  const websiteData = {
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": "https://arabiakhaleej.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://arabiakhaleej.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const servicesData = {
    "@type": "ItemList",
    "name": "GCC Community Services",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Prayer Times Portal",
        "url": "https://arabiakhaleej.com/prayer"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Finance & Market Insights",
        "url": "https://arabiakhaleej.com/finance"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Concierge Services",
        "url": "https://arabiakhaleej.com/join"
      }
    ]
  };

  return (
    <>
      <StructuredData type="Organization" data={orgData} />
      <StructuredData type="WebSite" data={websiteData} />
      <StructuredData type="ItemList" data={servicesData} />
      <HomeClient />
    </>
  );
}

