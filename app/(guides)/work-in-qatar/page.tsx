import ProtocolHero from "@/components/protocols/ProtocolHero";
import ProtocolGrid from "@/components/protocols/ProtocolGrid";
import ProtocolFlow from "@/components/protocols/ProtocolFlow";
import ProtocolVerification from "@/components/protocols/ProtocolVerification";
import RelatedGuides from "@/components/RelatedGuides";
import { pageMeta, SITE_URL } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Qatar Professional Onboarding | Elite Career Protocol 2026 | Arabia Khaleej",
  description: "Elite digital concierge for professionals relocating to Qatar. Independent roadmap for tax-efficient salaries, residency protocols, and corporate life in Doha.",
  path: "/work-in-qatar",
  keywords: ["work in Qatar protocol", "Doha career guide 2026", "Qatar professional onboarding", "tax-free salary Qatar", "Arabia Khaleej career"],
});

export default function WorkInQatarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Qatar tax-free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, Qatar has 0% personal income tax, providing one of the most efficient compensation environments globally." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Visa Protocols", item: `${SITE_URL}/qatar-visa-requirements` }] }) }} />

      <div className="max-w-7xl mx-auto px-6 py-2 sm:py-12 flex flex-col gap-24">
        <ProtocolHero 
          category="Career & Onboarding"
          titleEn="Work Protocols"
          titleAr="بروتوكولات العمل"
          description="Everything the global professional needs to know before and after arriving in the State of Qatar. Seamlessly navigate your career transition into one of the world's most stable and tax-efficient economies."
          crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: "Work Protocols" }]}
        />

        <ProtocolGrid 
          points={[
            { label: "Personal Tax", value: "0.00%", icon: "payments" },
            { label: "Economic Status", value: "Triple-A", icon: "trending_up" },
            { label: "Career Gateway", value: "Global Hub", icon: "hub" },
            { label: "Stability", icon: "verified_user", value: "Elite Tier" },
          ]}
        />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="insider-card space-y-6">
            <h3 className="luxury-text text-5xl">The Advantage</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Qatar offers a unique compensation environment with zero personal income tax on salaries, wages, and allowances. This allows for maximum capital accumulation and a high standard of professional life.
            </p>
          </div>
          <div className="insider-card bg-primary !text-white border-none space-y-6">
             <h3 className="luxury-text text-5xl">The Mandate</h3>
             <p className="text-sm text-white/70 leading-relaxed font-medium">
               All private sector employment is regulated by the Ministry of Labour. Contracts must be electronically registered to ensure full protection of both the professional and the employer.
             </p>
          </div>
        </section>

        <ProtocolFlow 
          steps={[
            { title: "Sponsorship", detail: "Formalize your onboarding with a licensed Qatar-based employer or established corporate entity." },
            { title: "Credential Verification", detail: "Ensure all educational certificates are attested by your country's MFA and the Qatar Embassy." },
            { title: "Compliance Screening", detail: "Undergo the mandatory medical fitness protocol and biometric recording upon entry." },
            { title: "Electronic Registry", detail: "Finalize your professional status via the digital QID issuance and labour contract registration." }
          ]}
        />

        <ProtocolVerification 
          sourceName="Ministry of Labour (MOL)" 
          sourceUrl="https://www.mol.gov.qa" 
        />

        <RelatedGuides guides={[
          { href: "/qatar-salary-guide",     icon: "bar_chart",  title: "Salary Guide",        description: "Benchmark your package across Tech, Engineering, and Finance sectors." },
          { href: "/qatar-visa-requirements", icon: "id_card",   title: "Visa Requirements",   description: "Visa-free entry, work residency, and family visit rules explained." },
        ]} />
      </div>
    </>
  );
}
