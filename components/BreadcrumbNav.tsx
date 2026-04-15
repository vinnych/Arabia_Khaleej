interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  crumbs: Crumb[];
}

/**
 * Renders a visible breadcrumb trail at the top of guide pages.
 * Keeps users oriented within the site hierarchy and improves navigation.
 * Usage: <BreadcrumbNav crumbs={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Visa Requirements" }]} />
 */
export default function BreadcrumbNav({ crumbs }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 flex-wrap">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600" style={{ fontSize: "14px" }} aria-hidden="true">
                chevron_right
              </span>
            )}
            {crumb.href && !isLast ? (
              <a
                href={crumb.href}
                className="hover:text-primary transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className={isLast ? "text-slate-900 dark:text-slate-100 font-bold" : ""}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
