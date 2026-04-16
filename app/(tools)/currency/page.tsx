import { getQARRates } from "@/lib/currency";
import CurrencyConverter from "@/components/CurrencyConverter";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta, SITE_URL } from "@/lib/seo";

export const metadata = pageMeta({
  title: "GCC Exchange Rate Registry | Live Market Data | Arabia Khaleej",
  description: "Live exchange rates for SAR, AED, QAR, KWD, BHD, and OMR. Independent market data registry and GCC currency converter for professional residents.",
  path: "/currency",
  keywords: ["GCC exchange registry", "Gulf currency market data", "SAR to USD peg", "AED exchange rates", "Arabia Khaleej currency"],
});

export default async function CurrencyPage() {
  const data = await getQARRates();

  const now = new Date();
  const today = `${now.getDate()} ${now.toLocaleDateString("en-GB", { month: "short" })} ${now.getFullYear()}`;

  const allRates = data?.rates ?? [];

  // Build FAQ entries for top pairs
  const faqEntries = allRates.slice(0, 4).map((r) => ({
    "@type": "Question",
    name: `What is 1 USD to ${r.code} today?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `Currently ${r.value < 1 ? r.value.toFixed(4) : r.value.toFixed(2)} ${r.code} per US Dollar. Regional rates are updated hourly.`,
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...faqEntries,
      {
        "@type": "Question",
        name: "Are GCC currencies pegged to the US Dollar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most GCC currencies (SAR, AED, QAR, BHD, OMR) are pegged to the US Dollar to ensure economic stability. The Kuwaiti Dinar (KWD) is pegged to an undisclosed weighted basket of international currencies.",
        },
      },
      {
        "@type": "Question",
        name: "What are the common currencies in the GCC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The main currencies are the Saudi Riyal (SAR), UAE Dirham (AED), Qatari Riyal (QAR), Kuwaiti Dinar (KWD), Bahraini Dinar (BHD), and Omani Rial (OMR).",
        },
      },
    ],
  };

  return (
    <div className="page-sections pt-2 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "QAR Exchange Rates", item: `${SITE_URL}/currency` }] }) }} />

      {/* Header */}
      <div>
        <h1 className="font-serif text-xl font-bold text-on-surface mb-1">
          GCC Exchange Rates Today
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">{today} · Regional Market · Updated hourly</p>
      </div>

      {!data ? (
        <p className="text-gray-400 dark:text-slate-500">Exchange rate data is currently unavailable. Please try again shortly.</p>
      ) : (
        <>
          {/* USD peg highlight */}
          <div className="flex items-center gap-4 p-4 sm:p-5 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl">
            <span className="text-4xl shrink-0">🏛️</span>
            <div>
              <p className="label-mobile text-primary mb-1 lowercase first-letter:uppercase">Fixed Peg Registry</p>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                Most GCC currencies are <strong>pegged to the US Dollar</strong> (USD) to maintain regional trade stability.
              </p>
            </div>
          </div>

          {/* Currency converter */}
          <CurrencyConverter rates={allRates} />

          {/* Info section */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">About GCC Currencies</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bento-tile !p-5">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Key Regional Fixed Pegs</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
                  <li>· SAR/USD: 3.7500</li>
                  <li>· AED/USD: 3.6725</li>
                  <li>· QAR/USD: 3.6400</li>
                  <li>· BHD/USD: 0.3760</li>
                  <li>· OMR/USD: 0.3845</li>
                </ul>
              </div>
              <div className="bento-tile !p-5">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-sm">Remittance Protocol</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The GCC is one of the world&apos;s largest remittance corridors. Ensure you compare mid-market rates against provider spreads for optimal value.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      <div className="bento-tile bg-[#020617] !text-white border-none p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 mt-12">
        <div className="flex-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Protocol: Official Verification</h3>
          <p className="text-sm font-medium text-stone-300 leading-relaxed">
            Market rates fluctuate. For the fixed state pegs and official monetary policy, always cross-verify with the respective national central banks (SAMA, CBUAE, QCB, etc.).
          </p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-center mt-6">
        Data Hub: ExchangeRate-API · Independent Aggregation · Protocol v1.4
      </p>
    </div>
  );
}
