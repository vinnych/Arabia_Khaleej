import { getJobs } from "@/lib/jobs";
import { Briefcase, Building2, MapPin } from "lucide-react";

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
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <a
          key={job.link}
          href={`/jobs/${job.slug}`}
          className="card-base p-4 group block hover:-translate-y-0.5 transition-transform"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-surface-low p-2 rounded-lg text-primary">
              <Briefcase size={16} />
            </div>
            <span className="bg-utility-chip text-[#1a5c38] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {job.source}
            </span>
          </div>

          <h3 className="text-[13px] font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {job.title}
          </h3>

          <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-2">
            {job.company && (
              <div className="flex items-center gap-1">
                <Building2 size={12} />
                <span>{job.company}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{job.location}</span>
              </div>
            )}
          </div>

          {job.pubDate && (
            <div className="text-[10px] text-stone-400 mt-3 pt-2 border-t border-stone-100">
              Posted {new Date(job.pubDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </div>
          )}
        </a>
      ))}
    </div>
  );
}
