import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Service | Qatar Portal",
  description: "Terms of service governing your use of Qatar Portal, including content usage, liability, intellectual property, and user obligations.",
  path: "/terms",
  ogTitle: "Terms of Service | Qatar Portal",
  ogDescription: "Read the terms governing your use of Qatar Portal — content, liability, and intellectual property.",
});

export default function TermsPage() {
  return (
    <div className="page-sections max-w-2xl mx-auto">
      <h1 className="font-newsreader text-3xl font-bold text-on-surface mb-2">Terms of Service</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: 24 March 2026</p>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Qatar Portal (<strong>qatar-portal.vercel.app</strong>), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">2. Description of Service</h2>
          <p>
            Qatar Portal is an information aggregation service providing prayer times, news headlines, job listings,
            weather, currency rates, and general guides for residents and visitors in Qatar and the wider GCC region.
            Content is sourced from third-party RSS feeds and public APIs and is provided for informational purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">3. Intellectual Property</h2>
          <p>
            The Qatar Portal name, logo, design, and original content (excluding aggregated third-party content) are
            owned by Qatar Portal and protected under applicable copyright law. News articles, job listings, and other
            aggregated content remain the intellectual property of their respective publishers and sources.
          </p>
          <p className="mt-2">
            You may not reproduce, distribute, or commercially exploit any part of Qatar Portal without prior written
            permission.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">4. Third-Party Content</h2>
          <p>
            Qatar Portal aggregates content from third-party sources including Al Jazeera, The Peninsula, Gulf Times,
            QNA, and job boards such as Bayt and GulfTalent. We are not responsible for the accuracy, completeness, or
            legality of content published by these sources. Links to external sites are provided for convenience and do
            not constitute endorsement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">5. Disclaimer of Warranties</h2>
          <p>
            Qatar Portal is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do not
            guarantee the accuracy, timeliness, or completeness of prayer times, weather data, currency rates, or any
            other content. Prayer times are calculated estimates — please verify with your local mosque or authority for
            religious purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Qatar Portal and its operators shall not be liable for any direct,
            indirect, incidental, consequential, or punitive damages arising from your use of or inability to use the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">7. AI-Generated Content</h2>
          <p>
            Some article summaries on Qatar Portal are generated using AI (Groq / Llama 3.1). These summaries are
            provided as convenience aids only. They may contain inaccuracies and should not be relied upon as factual
            reporting. Always read the original source article.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">8. Advertising</h2>
          <p>
            Qatar Portal displays advertisements served by Google AdSense. We do not control the content of these ads.
            Ad personalisation is subject to your cookie consent preferences.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">9. Rate Limiting & Fair Use</h2>
          <p>
            Automated access (scraping, bots, crawlers) beyond what is permitted by our <code>robots.txt</code> is
            prohibited. API endpoints are rate-limited to 30 requests per minute per IP address. Abuse may result in
            access being blocked.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">10. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms of Service at any time. Continued use of Qatar Portal after
            changes are posted constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">11. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Qatar. Any disputes shall be subject to the exclusive
            jurisdiction of the courts of Qatar.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-on-surface mb-2">12. Contact</h2>
          <p>
            For questions about these terms, please visit our{" "}
            <a href="/about" className="text-primary hover:underline">About page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
