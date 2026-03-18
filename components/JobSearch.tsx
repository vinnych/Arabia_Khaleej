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
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">🔍</span>
        <input
          type="search"
          placeholder="Search jobs or companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition"
        />
        {query && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No jobs found for &ldquo;{query}&rdquo;</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((job) => (
            <a
              key={job.link}
              href={`/jobs/${job.slug}`}
              className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">{job.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {job.company}{job.location ? ` · ${job.location}` : ""}
                </p>
              </div>
              <span className="self-start sm:self-center shrink-0 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                {job.source}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
