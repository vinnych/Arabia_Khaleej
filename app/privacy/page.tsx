import type { Metadata } from "next";

const SITE_URL = "https://qatar-portal.vercel.app";

export const metadata: Metadata = {
  title: "Privacy Policy | Qatar Portal",
  description: "Privacy Policy for Qatar Portal — how we collect data, use analytics (Vercel), display ads (AdSense), and protect your privacy.",
  keywords: ["Qatar Portal privacy policy", "data privacy Qatar Portal", "cookies Qatar Portal"],
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: "Privacy Policy | Qatar Portal",
    description: "Privacy Policy for Qatar Portal — how we handle data, analytics, and advertising.",
    url: `${SITE_URL}/privacy`,
    siteName: "Qatar Portal",
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Privacy Policy | Qatar Portal", description: "Privacy Policy for Qatar Portal." },
};

const LAST_UPDATED = "18 March 2026";

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
              <p>The following non-personal data may be collected automatically:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pages visited and navigation patterns (via Google Analytics 4)</li>
                <li>Core Web Vitals performance metrics — load time, interactivity, visual stability</li>
                <li>Approximate geographic region, device type, browser, and OS</li>
                <li>Referrer URL (which site linked to us)</li>
                <li>Approximate city-level location (±1 km) if you use the &quot;Use my location&quot; prayer times feature — this is only used to fetch prayer times and is never stored or logged</li>
              </ul>
              <p>This data is aggregated and anonymous and cannot be used to identify you personally.</p>
            </div>
          ),
        },
        {
          title: "2. Analytics — Google Analytics 4",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                We use <strong className="text-gray-800">Google Analytics 4</strong> (GA4) to understand how visitors use Qatar Portal. GA4 collects anonymized data including pages viewed, session duration, traffic sources, and device type. IP addresses are anonymized by Google before storage.
              </p>
              <p>
                You can opt out of Google Analytics tracking by installing the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Google Analytics Opt-out Browser Add-on</a>.
                For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Google&apos;s Privacy Policy</a>.
              </p>
            </div>
          ),
        },
        {
          title: "3. Advertising — Google AdSense",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Qatar Portal may display advertisements served by <strong className="text-gray-800">Google AdSense</strong> (publisher ID: ca-pub-7212871157824722). Google AdSense uses cookies and similar tracking technologies to serve ads based on your prior visits to this and other websites.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Google Ad Settings</a>.</li>
                <li>You may also opt out via the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Network Advertising Initiative opt-out page</a>.</li>
              </ul>
              <p>For more information, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Google&apos;s Privacy &amp; Terms</a>.</p>
            </div>
          ),
        },
        {
          title: "4. AI-Generated Summaries — Groq",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              News article headlines and snippets (publicly available text from RSS feeds) may be sent to <strong className="text-gray-800">Groq&apos;s API</strong> to generate short AI summaries using the Llama 3 model. No personal information is included in these requests. Generated summaries are cached in our Redis store for up to 7 days. Groq&apos;s data handling is governed by the <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-rose-700 hover:underline">Groq Privacy Policy</a>.
            </p>
          ),
        },
        {
          title: "5. Geolocation",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              The prayer times feature offers an optional &quot;Use my location&quot; button. If you grant permission, your browser provides GPS coordinates which are rounded to approximately 1 km precision before being sent to the Aladhan prayer times API. Your coordinates are <strong className="text-gray-800">not stored, logged, or shared</strong> beyond the single API request needed to retrieve prayer times. Geolocation access requires your explicit consent and can be revoked at any time through your browser settings.
            </p>
          ),
        },
        {
          title: "6. Cookies",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>Qatar Portal does not set first-party cookies for tracking. Third-party services may use cookies:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-gray-800">Google Analytics 4</strong> — uses cookies to measure traffic (e.g. <code className="bg-stone-100 px-1 rounded">_ga</code>, <code className="bg-stone-100 px-1 rounded">_ga_*</code>)</li>
                <li><strong className="text-gray-800">Google AdSense</strong> — uses cookies for ad personalization</li>
              </ul>
              <p>You can control or delete cookies through your browser settings. Disabling cookies may affect ad personalization but will not affect access to Qatar Portal content.</p>
            </div>
          ),
        },
        {
          title: "7. Third-Party Data Sources",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>Qatar Portal aggregates publicly available data from the following third-party services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-gray-800">News:</strong> Al Jazeera, The Peninsula Qatar, Gulf Times, Qatar News Agency (QNA)</li>
                <li><strong className="text-gray-800">Jobs:</strong> Bayt.com, GulfTalent</li>
                <li><strong className="text-gray-800">Prayer times:</strong> Aladhan API (aladhan.com)</li>
                <li><strong className="text-gray-800">Weather:</strong> Open-Meteo</li>
                <li><strong className="text-gray-800">Currency rates:</strong> ExchangeRate-API</li>
                <li><strong className="text-gray-800">Article images:</strong> Pexels</li>
              </ul>
              <p>When you click external links, you leave Qatar Portal and are subject to those sites&apos; privacy policies. We have no control over third-party content or data practices.</p>
            </div>
          ),
        },
        {
          title: "8. Data Retention",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>Qatar Portal uses Upstash Redis to cache the following data:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>News and job metadata (titles, links, dates) — <strong className="text-gray-800">7 days</strong></li>
                <li>AI-generated article summaries — <strong className="text-gray-800">7 days</strong></li>
                <li>Article images from Pexels — <strong className="text-gray-800">7 days</strong></li>
                <li>Prayer times (today) — <strong className="text-gray-800">1 hour</strong></li>
                <li>Monthly prayer calendar — <strong className="text-gray-800">24 hours</strong></li>
                <li>Rate-limiting counters (IP address per minute) — <strong className="text-gray-800">90 seconds</strong></li>
              </ul>
              <p>All cached data consists of publicly available content or anonymized counters. No personal information is stored.</p>
            </div>
          ),
        },
        {
          title: "9. Rate Limiting",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              To protect our APIs from abuse, we enforce a limit of <strong className="text-gray-800">30 requests per minute per IP address</strong>. IP addresses are used solely for this purpose and are stored for 90 seconds as an anonymous counter before being automatically deleted.
            </p>
          ),
        },
        {
          title: "10. Children's Privacy",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              Qatar Portal does not knowingly collect any information from children under the age of 13. Our site is intended for general audiences. If you believe a child has provided personal information through our site, please contact us so we can remove it.
            </p>
          ),
        },
        {
          title: "11. Your Rights (GDPR / Privacy Laws)",
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <p>If you are located in the European Economic Area (EEA), United Kingdom, or another jurisdiction with privacy rights, you may have rights including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The right to access data held about you</li>
                <li>The right to request deletion of your data</li>
                <li>The right to object to data processing</li>
                <li>The right to opt out of personalized advertising</li>
              </ul>
              <p>Since Qatar Portal does not collect personal data, most requests will relate to third-party services (Google Analytics, Google AdSense, Groq). Please contact those services directly for data requests.</p>
            </div>
          ),
        },
        {
          title: "12. Changes to This Policy",
          content: (
            <p className="text-sm text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be reflected by updating the &quot;Last updated&quot; date at the top of this page. Continued use of Qatar Portal after changes constitutes acceptance of the revised policy.
            </p>
          ),
        },
        {
          title: "13. Contact Us",
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
