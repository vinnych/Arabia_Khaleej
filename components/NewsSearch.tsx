"use client";

import { useState, useMemo } from "react";
import type { NewsItem } from "@/lib/rss";
import CalendarDate from "@/components/CalendarDate";

export default function NewsSearch({ items }: { items: NewsItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.contentSnippet?.toLowerCase().includes(q)
    );
  }, [query, items]);

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <label htmlFor="news-search" className="sr-only">Search news</label>
        <input
          id="news-search"
          type="search"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-surface-low dark:bg-slate-800 border-0 text-sm text-gray-800 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 dark:text-slate-500 text-sm text-center py-8">No articles found for &ldquo;{query}&rdquo;</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <a
              key={item.link}
              href={`/news/${item.slug}`}
              className="bg-white dark:bg-slate-800 rounded-xl ring-1 ring-stone-900/5 dark:ring-slate-700/50 shadow-ambient hover:shadow-ambient-hover transition-shadow duration-200 flex flex-col overflow-hidden group"
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-stone-100 to-stone-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                  <span className="text-3xl opacity-10 text-gray-400">◈</span>
                </div>
              )}
              <div className="p-3.5 flex flex-col flex-1">
                <span className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1.5">{item.source}</span>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 leading-snug line-clamp-2 flex-1">
                  {item.title}
                </h3>
                {item.contentSnippet && (
                  <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-2">{item.contentSnippet}</p>
                )}
                <CalendarDate dateStr={item.pubDate} className="mt-2" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
