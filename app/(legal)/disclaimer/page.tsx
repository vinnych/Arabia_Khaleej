import { pageMeta } from "@/lib/seo";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export const metadata = pageMeta({
  title: "Legal Disclaimer | Arabia Khaleej",
  description: "Official legal and operational disclaimers for the Arabia Khaleej community guide.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12">
      <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: "Disclaimer" }]} />
      
      <header className="space-y-4">
        <h1 className="text-4xl sm:text-6xl font-serif italic font-black tracking-tight text-primary">
          Protocol: Legal Disclaimer
        </h1>
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">
          Last Updated: April 2026
        </p>
      </header>

      <section className="bento-tile bg-slate-900 !text-white border-none p-10 sm:p-12">
        <p className="text-sm leading-relaxed font-medium opacity-80 mb-0">
          Arabia Khaleej is an independent, unofficial hobbyist project. It is not affiliated with, endorsed by, or sponsored by the State of Qatar or any of its ministries, including but not limited to the Ministry of Interior, Ministry of Culture, or the Ministry of Labour.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bento-tile space-y-4">
          <h2 className="text-lg font-bold tracking-tight">General Information Only</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            The information provided on Arabia Khaleej is for general informational purposes only. While we strive to maintain accurate and up-to-date data, we make no warranties of any kind regarding the completeness, accuracy, or availability of any data on this site.
          </p>
        </div>

        <div className="bento-tile space-y-4">
          <h2 className="text-lg font-bold tracking-tight">"As-Is" Mandate</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Any reliance you place on such information is strictly at your own risk. We strongly recommend verifying any critical information (Visa, Services, Prayer Times) directly at official government portals.
          </p>
        </div>

        <div className="bento-tile space-y-4">
          <h2 className="text-lg font-bold tracking-tight">No Professional Advice</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Content regarding residency, recruitment, or legal frameworks does not constitute professional legal or financial advice. We provide community insights, not administrative directions.
          </p>
        </div>

        <div className="bento-tile space-y-4">
          <h2 className="text-lg font-bold tracking-tight">Limitation of Liability</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            In no event will Arabia Khaleej or its operator be liable for any loss or damage (including indirect or consequential loss) arising from the use of this website or reliance on its content.
          </p>
        </div>
      </div>

      <section className="bento-tile bg-slate-50 dark:bg-slate-900 border-none p-10 flex flex-col md:flex-row items-center gap-8">
         <div className="flex-1">
            <h3 className="font-bold mb-2">Notice of Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We abide by the State of Qatar&apos;s digital norms and cybercrime frameworks. We do not store PII (Personally Identifiable Information) and operate a structure of zero-tracking.
            </p>
         </div>
      </section>
    </div>
  );
}
