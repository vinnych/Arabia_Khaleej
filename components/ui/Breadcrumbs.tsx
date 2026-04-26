"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  isRTL?: boolean;
}

/**
 * Visual Breadcrumbs component for SEO and UX.
 * Pairs with BreadcrumbSchema (JSON-LD) in StructuredData.tsx.
 */
export default function Breadcrumbs({ items, isRTL }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex mb-8 text-[10px] font-black uppercase tracking-[0.2em]"
    >
      <ol className="flex items-center gap-2 text-foreground/40">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {idx > 0 && (
              <ChevronRight
                size={10}
                className={isRTL ? "rotate-180" : ""}
                aria-hidden="true"
              />
            )}
            {idx === items.length - 1 ? (
              <span className="text-brand-gold" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
