import { getJobs } from "@/lib/jobs";

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
          className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-3.5 flex items-start justify-between gap-3 group"
        >
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-gray-900">{job.title}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {job.company}{job.location ? ` · ${job.location}` : ""}
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-bold text-emerald-700 uppercase tracking-wide mt-0.5">
            {job.source}
          </span>
        </a>
      ))}
    </div>
  );
}
