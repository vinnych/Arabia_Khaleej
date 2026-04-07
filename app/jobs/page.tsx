import JobSearch from "@/components/JobSearch";
import { getJobs } from "@/lib/jobs";
import { safeJsonLd } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

const year = new Date().getFullYear();

export const metadata = pageMeta({
  title: `Latest Jobs in Qatar ${year} | Qatar Portal`,
  description: "Browse the latest job vacancies in Qatar, updated daily from Google News. Find jobs in Doha and across Qatar.",
  path: "/jobs",
  keywords: ["Qatar jobs", "jobs in Qatar", "Doha jobs", `Qatar vacancies ${year}`, "Gulf jobs", "Qatar hiring", "Qatar careers"],
  ogTitle: `Latest Jobs in Qatar ${year} | Qatar Portal`,
  ogDescription: "Browse the latest job vacancies in Qatar, updated daily. Find jobs in Doha and across the Gulf.",
});

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://qatar-portal.vercel.app" }, { "@type": "ListItem", position: 2, name: "Jobs in Qatar", item: "https://qatar-portal.vercel.app/jobs" }] }) }} />
      <h1 className="font-newsreader text-xl sm:text-2xl font-bold text-on-surface mb-4">
        Jobs in Qatar
      </h1>
      <JobSearch jobs={jobs} />
    </div>
  );
}
