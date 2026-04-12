"use client";

import { useState, useMemo } from "react";
import type { Job } from "@/lib/jobs";

export default function JobSearch({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return jobs;
    const q = query.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.source.toLowerCase().includes(q)
    );
  }, [query, jobs]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <label htmlFor="job-search" className="sr-only">Search jobs or companies</label>
        <input
          id="job-search"
          type="search"
          placeholder="Search jobs or companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-surface-low dark:bg-slate-800 border-0 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 dark:text-slate-500 text-sm text-center py-8">No jobs found for &ldquo;{query}&rdquo;</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((job) => (
            <a
              key={job.link}
              href={`/jobs/${job.slug}`}
              className="bg-white dark:bg-slate-800 rounded-xl ring-1 ring-stone-900/5 dark:ring-slate-700/50 shadow-ambient hover:shadow-ambient-hover transition-shadow duration-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-white">{job.title}</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                  {job.company}{job.location ? ` · ${job.location}` : ""}
                </p>
              </div>
              <span className="self-start sm:self-center shrink-0 bg-utility-chip dark:bg-emerald-900/30 text-[#1a5c38] dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                {job.source}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
