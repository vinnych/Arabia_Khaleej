import JobSearch from "@/components/JobSearch";
import { getJobs } from "@/lib/jobs";
import { safeJsonLd } from "@/lib/utils";
import type { Metadata } from "next";

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Latest Jobs in Qatar ${year} — Bayt.com & GulfTalent Listings | Qatar Portal`,
  description: "Browse the latest job vacancies in Qatar, updated daily from Bayt.com and GulfTalent. Find jobs in Doha and across Qatar.",
  alternates: { canonical: "https://qatar-portal.vercel.app/jobs" },
  keywords: ["Qatar jobs", "jobs in Qatar", "Doha jobs", `Qatar vacancies ${year}`, "Gulf jobs", "Bayt Qatar", "GulfTalent Qatar"],
};

export default async function JobsPage() {
  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  let jsonLd = null;

  try {
    jobs = await getJobs(48);
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Jobs in Qatar",
      "itemListElement": jobs.slice(0, 10).map((job, i) => {
        const isoDate = (() => { try { return new Date(job.pubDate).toISOString().split("T")[0]; } catch { return new Date().toISOString().split("T")[0]; } })();
        return {
          "@type": "ListItem",
          "position": i + 1,
          "url": `https://qatar-portal.vercel.app/jobs/${job.slug}`,
          "item": {
            "@type": "JobPosting",
            "title": job.title,
            "url": `https://qatar-portal.vercel.app/jobs/${job.slug}`,
            "description": `${job.title} — job opportunity in Qatar at ${job.company || "Qatar Employer"}.`,
            "hiringOrganization": { "@type": "Organization", "name": job.company || "Qatar Employer" },
            "jobLocation": {
              "@type": "Place",
              "address": { "@type": "PostalAddress", "addressLocality": "Doha", "addressCountry": "QA" }
            },
            "datePosted": isoDate,
          }
        };
      })
    };
  } catch { /* ignore */ }

  return (
    <div>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: safeJsonLd(jsonLd)}} />
      )}
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">
        <span aria-hidden="true">💼</span> Jobs in Qatar
      </h1>
      <JobSearch jobs={jobs} />
    </div>
  );
}
