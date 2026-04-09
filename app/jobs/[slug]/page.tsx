import { getJobs, getJobTombstone, type Job } from "@/lib/jobs";
import { safeJsonLd, isValidHttpUrl } from "@/lib/utils";
import CalendarDate from "@/components/CalendarDate";
import ShareButton from "@/components/ShareButton";
import { redis } from "@/lib/redis";
import { cache } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const getCachedJobs = cache(() => getJobs(48));

const SITE_URL = "https://qatar-portal.vercel.app";

async function getJobItem(slug: string): Promise<Job | null> {
  // 1. Try Redis (persisted up to 7 days)
  if (redis) {
    try {
      const cached = await redis.get<Job>(`job:${slug}`);
      if (cached) return cached;
    } catch { /* fall through */ }
  }
  // 2. Fall back to live feed
  const jobs = await getCachedJobs();
  return jobs.find((j) => j.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobItem(slug);
  if (!job) {
    // Expired job — tell crawlers not to index this URL
    return {
      title: "Job No Longer Available | Qatar Portal",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${job.title} at ${job.company} — Qatar Jobs | Qatar Portal`,
    description: `${job.title} position at ${job.company} in ${job.location}. Apply now via Qatar Portal.`,
    keywords: [job.title, job.company, "Qatar jobs", `${job.location} jobs`, "jobs in Qatar", "Doha hiring"],
    alternates: { canonical: `${SITE_URL}/jobs/${slug}` },
    openGraph: {
      title: `${job.title} — ${job.company}`,
      description: `Job opportunity in Qatar: ${job.title} at ${job.company}`,
      url: `${SITE_URL}/jobs/${slug}`,
      siteName: "Qatar Portal",
      type: "article",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.company} — Qatar Jobs`,
      description: `${job.title} position at ${job.company} in ${job.location}. Apply now via Qatar Portal.`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobItem(slug);
  if (!job) {
    // Legacy: some old slugs were base64url-encoded external links
    try {
      const decoded = Buffer.from(slug, "base64url").toString();
      if (isValidHttpUrl(decoded)) redirect(decoded);
    } catch { /* not a legacy slug */ }

    // Check tombstone — job existed but has expired from the feed
    const tombstone = await getJobTombstone(slug);

    // Whether we have a tombstone or not, always show an expired page (never 404).
    // Returning 404 on old job URLs harms SEO — Google keeps recrawling them.
    // noindex tells Google to deindex without a 404 signal.
    return (
      <div className="w-full">
          <div className="mb-3">
          <a href="/jobs" className="inline-block text-xs text-gray-400 hover:text-primary py-2">
            ← Back to Jobs
          </a>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold text-amber-800 mb-1">This job listing has expired</p>
          <p className="text-sm text-amber-700">
            {tombstone ? (
              <>
                <span className="font-medium">{tombstone.title}</span>
                {tombstone.company ? ` at ${tombstone.company}` : ""} is no longer active.
              </>
            ) : (
              "This job listing is no longer available. It may have been filled or removed."
            )}
          </p>
        </div>
        <a
          href="/jobs"
          className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:scale-[1.02] transition-transform"
        >
          Browse current jobs in Qatar →
        </a>
      </div>
    );
  }

  const isoDate = (() => { try { return new Date(job.pubDate).toISOString().split("T")[0]; } catch { return new Date().toISOString().split("T")[0]; } })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description
      ? job.description
      : `${job.title} position available at ${job.company || "Qatar Employer"} in ${job.location || "Qatar"}. This is a job opportunity based in Qatar. Apply via the link below.`,
    hiringOrganization: { "@type": "Organization", name: job.company || "Qatar Employer" },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Doha",
        addressCountry: "QA",
      },
    },
    datePosted: isoDate,
    // employmentType omitted — not reliably available from RSS feed data
    validThrough: (() => { try { const d = new Date(job.pubDate); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; } catch { return new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]; } })(),
    mainEntityOfPage: `${SITE_URL}/jobs/${slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Jobs in Qatar", item: `${SITE_URL}/jobs` },
      { "@type": "ListItem", position: 3, name: job.title, item: `${SITE_URL}/jobs/${slug}` },
    ],
  };

  return (
    <div className="w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }} />
      <div className="mb-3">
        <a href="/jobs" className="inline-block text-xs text-gray-400 hover:text-primary py-2">
          ← Back to Jobs
        </a>
      </div>
      <span className="inline-block text-[10px] text-[#1a5c38] font-semibold bg-utility-chip px-2 py-0.5 rounded-full mb-3">
        {job.source}
      </span>
      <h1 className="font-newsreader text-xl font-bold text-on-surface mt-2 mb-1 leading-snug">
        {job.title}
      </h1>
      <p className="text-sm text-gray-600 mb-1 font-medium">{job.company}</p>
      <p className="text-xs text-gray-400 mb-4">{job.location}</p>
      {job.pubDate && (
        <div className="flex items-center gap-2 mb-5">
          <CalendarDate dateStr={job.pubDate} />
          <span className="text-[11px] text-gray-400">Posted</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-block bg-primary text-white px-4 py-2.5 sm:px-6 rounded-xl text-sm font-medium hover:scale-[1.02] transition-transform w-full sm:w-auto text-center"
        >
          View & Apply on {job.source} →
        </a>
        <ShareButton title={job.title} url={`${SITE_URL}/jobs/${slug}`} />
      </div>

      {/* Related resources */}
      <div className="mt-6 pt-6 border-t border-stone-200">
        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Useful Resources</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { href: "/qatar-salary-guide", icon: "💰", title: "Qatar Salary Guide", desc: "Average salaries by role and experience" },
            { href: "/qatar-labour-law", icon: "⚖️", title: "Qatar Labour Law", desc: "Working hours, leave, and end of service" },
            { href: "/qatar-visa-requirements", icon: "🛂", title: "Qatar Visa Guide", desc: "Work visa and residency requirements" },
          ].map(({ href, icon, title, desc }) => (
            <a key={href} href={href}
              className="bg-white ring-1 ring-stone-900/5 shadow-ambient rounded-lg p-3 hover:shadow-ambient-hover transition-shadow">
              <span className="text-lg">{icon}</span>
              <p className="text-xs font-semibold text-gray-800 mt-1.5">{title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
