import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolFlow from "@/components/protocols/ProtocolFlow";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Visa & Residency Protocols 2026 | Elite Entry Guide | Arabia Khaleej",
  description: "The definitive curator guide to Qatar entry protocols. Elite insights on residency procedures, Hayya platform requirements, and family sponsorship rules.",
  path: "/qatar-visa-requirements",
  keywords: ["Qatar residency protocol", "Qatar visa guide 2026", "Hayya platform entry", "Doha residency registry", "Arabia Khaleej visas"],
});

export default function QatarVisaRequirementsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which countries are visa-free for Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Over 100 nationalities including the US, UK, EU, and GCC citizens receive visa-free entry or free visa-on-arrival in Qatar.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Visa Protocols", item: `${SITE_URL}/qatar-visa-requirements` }] }) }} />
      
      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Entry & Residency"
          titleEn="Visa Protocols"
          titleAr="بروتوكولات التأشيرة"
          description="The definitive digital roadmap for entering and residing in the State of Qatar. Curated for international professionals, investors, and community members seeking elite residency insights."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Visa Protocols" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Visa-Free Status", value: "100+ Nations", icon: "public" },
            { label: "Residencies", value: "QID Regulated", icon: "badge" },
            { label: "Entry Platform", value: "Hayya Hub", icon: "door_front" },
            { label: "Insurance", value: "Mandatory", icon: "security" },
          ]}
        />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="insider-card space-y-6">
            <h3 className="luxury-text text-4xl">Status: Visa-Free</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Citizens of over 100 countries are eligible for visa-free entry. This allows visitors to enjoy the State of Qatar for periods ranging from 30 to 90 days. Eligibility is determined by nationality and passport validity.
            </p>
          </div>
          <div className="insider-card space-y-6">
            <h3 className="luxury-text text-4xl">Status: Work Residency</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Supported by employer sponsorship, work residency provides long-term stability. All residents are issued a Qatar ID (QID) which serves as the primary legal document for all public and private interactions within the State.
            </p>
          </div>
        </section>

        <ProtocolFlow 
          steps={[
            { title: "Verification", detail: "Check your nationality's current entry status on the Ministry of Interior protocol list." },
            { title: "Digital Submission", detail: "Apply via the Hayya platform or MOI portal with attested documentation and biometrics." },
            { title: "Registry Processing", detail: "Applications are typically verified by the central immigration registry within standard business cycles." },
            { title: "Entry Declaration", detail: "Present your digital verification at Hamad International Airport terminals upon arrival." }
          ]}
        />

        <ProtocolVerification 
          sourceName="Ministry of Interior (MOI)" 
          sourceUrl="https://portal.moi.gov.qa" 
        />

        <RelatedGuides guides={[
          { href: "/work-in-qatar",       icon: "work",        title: "Work in Qatar",    description: "The full roadmap for relocating and starting your professional life in Qatar." },
          { href: "/qatar-services/qid",  icon: "badge",       title: "QID Application",  description: "Step-by-step guide to getting your Qatar ID card after arrival." },
          { href: "/qatar-metro",         icon: "subway",      title: "Doha Metro",       description: "Navigate the city — metro lines, fares, and station guide." },
        ]} />
      </div>
    </>
  );
}

