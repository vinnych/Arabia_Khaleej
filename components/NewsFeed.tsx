import { getNews } from "@/lib/rss";
import { ExternalLink } from "lucide-react";

export default async function NewsFeed({ limit = 6 }: { limit?: number }) {
  let news;
  try {
    news = await getNews(limit);
  } catch {
    return <p className="text-red-400 text-sm">Could not load news.</p>;
  }

  if (news.length === 0) {
    return <p className="text-gray-400 text-sm">No news available right now.</p>;
  }

  return (
    <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
      {news.map((item) => (
        <a
          key={item.link}
          href={`/news/${item.slug}`}
          className="card-base overflow-hidden group block min-w-[280px] sm:min-w-0 snap-center transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
        >
          <div className="h-28 overflow-hidden relative">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-stone-100" />
            )}
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded-full font-medium">
              {item.source}
            </div>
          </div>
          <div className="p-3">
            <h3 className="text-[13px] font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center justify-between text-[10px] text-stone-500">
              <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}</span>
              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
