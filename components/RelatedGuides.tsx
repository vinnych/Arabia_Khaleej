interface GuideLink {
  href: string;
  icon: string;
  title: string;
  description: string;
}

interface RelatedGuidesProps {
  guides: GuideLink[];
}

/**
 * Cross-linking footer shown at the bottom of every guide page.
 * Helps users discover related content rather than hitting back and bouncing.
 */
export default function RelatedGuides({ guides }: RelatedGuidesProps) {
  return (
    <section className="border-t border-slate-100 dark:border-slate-800 pt-16 space-y-8">
      <div>
        <p className="label-xs text-slate-400 mb-1">Keep Exploring</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Related Guides</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((g) => (
          <a
            key={g.href}
            href={g.href}
            className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30 hover:shadow-md transition-all duration-200"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <span
                className="material-symbols-outlined text-primary group-hover:text-white transition-colors"
                style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
              >
                {g.icon}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-snug mb-1">
                {g.title}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{g.description}</p>
            </div>
            <span
              className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
              style={{ fontSize: "16px" }}
            >
              arrow_forward
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
