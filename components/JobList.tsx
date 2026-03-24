import { getJobs } from "@/lib/jobs";
import { MapPin } from "lucide-react";

export default async function JobList({ limit = 6 }: { limit?: number }) {
  let jobs;
  try {
    jobs = await getJobs(limit);
  } catch {
    return <p className="text-red-400 text-xs">Could not load jobs.</p>;
  }

  if (jobs.length === 0) {
    return <p className="text-gray-400 text-xs">No job listings available right now.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {jobs.map((job) => (
        <a
          key={job.link}
          href={`/jobs/${job.slug}`}
          className="card-base px-4 py-3 group flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
          style={{ borderLeft: "3px solid rgba(138,21,56,0.18)" }}
        >
          {/* Company initial badge */}
          <div
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-primary bg-primary/8 border border-primary/10 group-hover:bg-primary/12 transition-colors"
            aria-hidden="true"
          >
            {(job.company ?? job.title).charAt(0).toUpperCase()}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400">
              {job.company && <span className="font-medium text-stone-500 truncate">{job.company}</span>}
              {job.location && (
                <span className="flex items-center gap-0.5 shrink-0">
                  <MapPin size={9} />
                  {job.location}
                </span>
              )}
            </div>
          </div>

          {/* Date + source */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="bg-utility-chip text-[#1a5c38] text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              {job.source}
            </span>
            {job.pubDate && (
              <span className="text-[9px] text-stone-400">
                {new Date(job.pubDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
