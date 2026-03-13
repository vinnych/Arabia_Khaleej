import type { Metadata } from "next";

const SITE_URL = "https://qatar-portal.vercel.app";

export const metadata: Metadata = {
  title: "Privacy Policy | Qatar Portal",
  description: "Privacy Policy for Qatar Portal. Learn how we handle data, use analytics, and display advertising on qatar-portal.vercel.app.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const LAST_UPDATED = "March 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
      </div>

      <p className="text-gray-600 leading-relaxed">
        This Privacy Policy describes how Qatar Portal (&quot;we&quot;, &quot;our&quot;, or &quot;the Site&quot;), accessible at{" "}
        <a href={SITE_URL} className="text-rose-700 hover:underline">{SITE_URL}</a>, collects, uses, and protects information when you visit our website.
      </p>

      {[
        {
          title: "1. Information We Collect",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong className="text-gray-800">We do not collect personal information</strong> such as names, email addresses, or account details. Qatar Portal does not require registration or login.</p>
              <p>The following non-personal, aggregated data may be collected automatically:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pages visited and navigation patterns (via Vercel Speed Insights)</li>
                <li>Core Web Vitals performance metrics (load time, interactivity, visual stability)</li>
                <li>Approximate geographic region and device type (browser, OS)</li>
                <li>Referrer URL (which site linked to us)</li>
              </ul>
              <p>This data is anonymous and cannot be used to identify you personally.</p>
            </div>
          ),
        },
        {
          title: "2. Analytics — Vercel Speed Insights",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              We use <strong className="text-gray-800">Vercel Speed Insights</strong> to monitor website performance. This tool collects anonymized Core Web Vitals data (page load speed, interactivity, layout stability) to help us improve the user experience. No personally identifiable information is collected. You can learn more at{" "}
              <a href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">vercel.com/docs/speed-insights</a>.
            </p>
          ),
        },
        {
          title: "3. Advertising — Google AdSense",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Qatar Portal may display advertisements served by <strong className="text-gray-800">Google AdSense</strong>. Google AdSense uses cookies and similar tracking technologies to serve ads based on your prior visits to this and other websites.
              </p>
              <p>Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to Qatar Portal and/or other websites on the internet.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Google Ad Settings</a>.</li>
                <li>You may also opt out via the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Network Advertising Initiative opt-out page</a>.</li>
              </ul>
              <p>For more information on how Google uses data, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Google&apos;s Privacy &amp; Terms</a>.</p>
            </div>
          ),
        },
        {
          title: "4. Cookies",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>Qatar Portal itself does not set first-party cookies for tracking purposes. However, third-party services embedded in the site may use cookies:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-gray-800">Google AdSense</strong> — uses cookies for ad personalization (see Section 3)</li>
                <li><strong className="text-gray-800">Vercel Speed Insights</strong> — may use session identifiers for performance measurement</li>
              </ul>
              <p>You can control cookie settings through your browser. Disabling cookies may affect ad personalization but will not affect access to Qatar Portal content.</p>
            </div>
          ),
        },
        {
          title: "5. Third-Party Data Sources",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>Qatar Portal displays data aggregated from third-party APIs and RSS feeds. When you click links to external articles or job listings, you leave Qatar Portal and are subject to the privacy policies of those external websites. We have no control over, and assume no responsibility for, the content or privacy practices of third-party sites.</p>
              <p>Third-party sources used include: Aladhan API, Open-Meteo, Al Jazeera, BBC, Google News, and ExchangeRate-API.</p>
            </div>
          ),
        },
        {
          title: "6. Data Retention",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              News article and job listing metadata is temporarily stored in our Redis cache (Upstash) for up to <strong className="text-gray-800">7 days</strong> to enable individual article pages. This data consists solely of publicly available article titles, links, and publication dates — no personal information. After 7 days, it is automatically deleted.
            </p>
          ),
        },
        {
          title: "7. Children's Privacy",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              Qatar Portal does not knowingly collect any information from children under the age of 13. Our site is intended for general audiences. If you believe a child has provided personal information through our site, please contact us so we can remove it.
            </p>
          ),
        },
        {
          title: "8. Your Rights (GDPR / Privacy Laws)",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>If you are located in the European Economic Area (EEA) or United Kingdom, you have rights under GDPR including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The right to access data held about you</li>
                <li>The right to request deletion of your data</li>
                <li>The right to object to data processing</li>
                <li>The right to opt out of personalized advertising</li>
              </ul>
              <p>Since we do not collect personal data ourselves, most requests will relate to third-party services (Google AdSense, Vercel). Please contact those services directly for data requests.</p>
            </div>
          ),
        },
        {
          title: "9. Changes to This Policy",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be reflected by updating the &quot;Last updated&quot; date at the top of this page. Continued use of Qatar Portal after changes constitutes acceptance of the revised policy.
            </p>
          ),
        },
        {
          title: "10. Contact Us",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us via our GitHub repository:{" "}
              <a
                href="https://github.com/vinnych/Qatar-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-700 hover:underline"
              >
                github.com/vinnych/Qatar-portal
              </a>
            </p>
          ),
        },
      ].map(({ title, content }) => (
        <section key={title} className="border-t border-stone-200 pt-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
          {content}
        </section>
      ))}
    </div>
  );
}
