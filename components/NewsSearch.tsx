"use client";

import { useState, useMemo } from "react";
import type { NewsItem } from "@/lib/rss";

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
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">🔍</span>
        <input
          type="search"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition"
        />
        {query && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No articles found for &ldquo;{query}&rdquo;</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <a
              key={item.link}
              href={`/news/${item.slug}`}
              className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group"
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                  <span className="text-3xl opacity-10 text-gray-400">◈</span>
                </div>
              )}
              <div className="p-3.5 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mb-1.5">{item.source}</span>
                <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 flex-1">
                  {item.title}
                </h3>
                {item.contentSnippet && (
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">{item.contentSnippet}</p>
                )}
                <span className="text-[11px] text-gray-400 mt-2 tabular-nums">{item.pubDate}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
