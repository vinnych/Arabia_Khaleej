import { getQARRates } from "@/lib/currency";
import CurrencyConverter from "@/components/CurrencyConverter";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta, SITE_URL } from "@/lib/seo";

export const metadata = pageMeta({
  title: "QAR Exchange Rate Today — Qatar Riyal to USD, INR, EUR & More | Qatar Portal",
  description: "Live Qatar Riyal (QAR) exchange rates today. Convert QAR to USD, EUR, GBP, INR, PKR, PHP, EGP, BDT and more. Updated hourly.",
  path: "/currency",
  keywords: ["QAR to USD", "Qatar riyal exchange rate", "1 QAR to INR", "QAR to EUR", "Qatar currency rate today", "QAR exchange rate", "Qatari riyal", "QAR to PKR", "QAR to PHP"],
  ogTitle: "QAR Exchange Rate Today — Qatar Riyal Rates",
  ogDescription: "Live Qatar Riyal exchange rates vs USD, EUR, GBP, INR, PKR and more. Updated hourly.",
});

export default async function CurrencyPage() {
  const data = await getQARRates();

  const now = new Date();
  const today = `${now.getDate()} ${now.toLocaleDateString("en-GB", { month: "short" })} ${now.getFullYear()}`;

  const allRates = data?.rates ?? [];

  // Build FAQ entries for top pairs
  const faqEntries = allRates.slice(0, 4).map((r) => ({
    "@type": "Question",
    name: `What is 1 QAR to ${r.code} today?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `1 Qatari Riyal (QAR) = ${r.value < 1 ? r.value.toFixed(4) : r.value.toFixed(2)} ${r.code} (${r.name}) as of today. Rates are updated hourly.`,
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...faqEntries,
      {
        "@type": "Question",
        name: "Is the Qatari Riyal pegged to the US Dollar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The Qatari Riyal (QAR) is pegged to the US Dollar at a fixed rate of 1 USD = 3.64 QAR (or 1 QAR ≈ 0.2747 USD). This peg has been maintained since 1980 and provides currency stability.",
        },
      },
      {
        "@type": "Question",
        name: "What currency is used in Qatar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qatar uses the Qatari Riyal (QAR), issued by the Qatar Central Bank. It is subdivided into 100 dirhams. The Riyal is pegged to the US Dollar at 3.64 QAR per USD.",
        },
      },
    ],
  };

  return (
    <div className="page-sections">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "QAR Exchange Rates", item: "https://qatar-portal.vercel.app/currency" }] }) }} />

      {/* Header */}
      <div>
        <h1 className="font-serif text-xl font-bold text-on-surface mb-1">
          QAR Exchange Rates Today
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{today} · Updated hourly</p>
      </div>

      {!data ? (
        <p className="text-gray-400 dark:text-slate-500">Exchange rate data is currently unavailable. Please try again shortly.</p>
      ) : (
        <>
          {/* USD peg highlight — unified with site palette */}
          <div className="flex items-center gap-4 p-4 sm:p-5 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl">
            <span className="text-4xl shrink-0">🇶🇦</span>
            <div>
              <p className="label-mobile text-primary mb-1 lowercase first-letter:uppercase">Qatari Riyal (QAR) — Fixed Peg</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                The QAR is <strong>pegged to the US Dollar</strong> at a fixed rate of <strong>1 USD = 3.64 QAR</strong>.
              </p>
            </div>
          </div>

          {/* Currency converter */}
          <CurrencyConverter rates={allRates} />

          {/* Info section — unified palette */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">About the Qatari Riyal</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bento-tile !p-5">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Currency Facts</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
                  <li>· Symbol: QAR (﷼)</li>
                  <li>· Subdivisions: 100 dirhams</li>
                  <li>· Issued by: Qatar Central Bank</li>
                  <li>· Peg: Fixed at 3.64 QAR/USD since 1980</li>
                </ul>
              </div>
              <div className="bento-tile !p-5">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Sending Money to Qatar?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Most major remittance services (Western Union, Wise, MoneyGram) support QAR. Compare rates before sending — service fees can vary significantly between providers.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500">Exchange rate source: ExchangeRate-API (open.er-api.com) · Updated hourly · Rates are for informational purposes only.</p>
    </div>
  );
}
