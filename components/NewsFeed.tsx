import { getNews } from "@/lib/rss";

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

  const [featured, ...rest] = news;

  return (
    <div className="space-y-3">
      {/* Featured first article */}
      <a
        href={`/news/${featured.slug}`}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group block"
      >
        {featured.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featured.imageUrl}
            alt={featured.title}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-rose-50 to-stone-100 flex items-center justify-center">
            <span className="text-3xl opacity-10 text-gray-400">◈</span>
          </div>
        )}
        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">{featured.source}</span>
          <h2 className="text-base font-bold text-gray-900 leading-snug mt-1.5 line-clamp-2 group-hover:text-rose-800 transition-colors">
            {featured.title}
          </h2>
          <span className="text-xs text-gray-400 mt-2 block tabular-nums">{featured.pubDate}</span>
        </div>
      </a>

      {/* Grid of remaining articles */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {rest.map((item) => (
          <a
            key={item.link}
            href={`/news/${item.slug}`}
            className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group"
          >
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-36 bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
                <span className="text-xl opacity-10 text-gray-400">◈</span>
              </div>
            )}
            <div className="p-3.5 flex flex-col flex-1">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mb-1.5">{item.source}</span>
              <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 flex-1">
                {item.title}
              </h3>
              <span className="text-[11px] text-gray-400 mt-2 tabular-nums">{item.pubDate}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
