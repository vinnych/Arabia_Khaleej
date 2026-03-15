import { getJobs, type Job } from "@/lib/jobs";
import { safeJsonLd, isValidHttpUrl } from "@/lib/utils";
import { redis } from "@/lib/redis";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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
  if (!job) return {};
  return {
    title: `${job.title} at ${job.company} — Qatar Jobs | Qatar Portal`,
    description: `${job.title} position at ${job.company} in ${job.location}. Apply now via Qatar Portal.`,
    alternates: { canonical: `${SITE_URL}/jobs/${slug}` },
    openGraph: {
      title: `${job.title} — ${job.company}`,
      description: `Job opportunity in Qatar: ${job.title} at ${job.company}`,
      url: `${SITE_URL}/jobs/${slug}`,
      siteName: "Qatar Portal",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
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
    let link: string | null = null;
    try {
      const decoded = Buffer.from(slug, "base64url").toString();
      if (isValidHttpUrl(decoded)) link = decoded;
    } catch { /* invalid slug */ }
    if (link) redirect(link);
    notFound();
  }

  const isoDate = (() => { try { return new Date(job.pubDate).toISOString().split("T")[0]; } catch { return new Date().toISOString().split("T")[0]; } })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    url: `${SITE_URL}/jobs/${slug}`,
    description: `${job.title} — job opportunity in Qatar at ${job.company || "Qatar Employer"}.`,
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
    mainEntityOfPage: `${SITE_URL}/jobs/${slug}`,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="mb-6">
        <a href="/jobs" className="text-sm text-emerald-700 hover:underline font-medium">
          ← Back to Jobs
        </a>
      </div>
      <span className="inline-block text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
        {job.source}
      </span>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1 leading-snug">
        {job.title}
      </h1>
      <p className="text-base text-gray-600 mb-1 font-medium">{job.company}</p>
      <p className="text-sm text-gray-400 mb-6">{job.location}</p>
      {job.pubDate && (
        <p className="text-xs text-gray-400 mb-8">Posted: {job.pubDate}</p>
      )}
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-emerald-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-emerald-800 transition-colors"
      >
        View & Apply on {job.source} →
      </a>
    </div>
  );
}
