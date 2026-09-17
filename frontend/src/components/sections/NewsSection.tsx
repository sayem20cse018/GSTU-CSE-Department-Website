import Link from 'next/link';

interface NewsItem {
  id: string; title: string; slug: string; excerpt: string;
  coverImage?: string; category: string;
  publishedAt: string; createdAt: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/news?isPublished=true&limit=5&sortBy=publishedAt`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json() as { data?: NewsItem[] | { data?: NewsItem[] } };
    const raw = json.data;
    const arr = Array.isArray(raw) ? raw : (raw as { data?: NewsItem[] })?.data;
    return Array.isArray(arr) ? arr.slice(0, 5) : [];
  } catch { return []; }
}

function SplitDate({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day   = d.getDate();
  const year  = d.getFullYear();
  return (
    <div className="shrink-0 w-[72px] flex flex-col items-center justify-center py-3 px-1 text-center"
      style={{ background: '#1b2a4a', color: '#fff', minHeight: '72px' }}>
      <span className="block text-[11px] font-semibold leading-tight">{month}</span>
      <span className="block text-[15px] font-bold leading-tight mt-0.5"
        style={{ fontFamily: 'var(--font-oswald)' }}>{day},</span>
      <span className="block text-[13px] font-semibold leading-tight">{year}</span>
    </div>
  );
}

function ChevronChevron() {
  return (
    <>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
      </svg>
      <svg className="w-4 h-4 -ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
      </svg>
    </>
  );
}

export default async function NewsSection() {
  const items = await fetchNews();

  // Sort newest-to-oldest by publishedAt, then split featured vs rest
  const sorted = [...items].sort((a, b) =>
    new Date(b.publishedAt ?? b.createdAt).getTime() -
    new Date(a.publishedAt ?? a.createdAt).getTime()
  );
  const [featured, ...rest] = sorted;

  if (!featured && rest.length === 0) return null;

  return (
    <section className="py-10 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Latest News
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-slate-200">
          {/* LEFT — Featured article */}
          {featured ? (
            <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
              {featured.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.coverImage} alt={featured.title}
                  className="w-full h-full object-cover absolute inset-0" style={{ minHeight: '280px' }} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#1a7a3c,#0d4423)' }}>
                  <svg className="w-20 h-20 opacity-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                  </svg>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 60%)' }}
                aria-hidden="true" />
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4" style={{ minHeight: '280px', display: 'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                <h3 className="text-white font-bold leading-snug mb-2 uppercase"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '1.05rem', letterSpacing: '0.03em' }}>
                  <Link href={`/news/${featured.slug}`} className="hover:text-green-300 transition-colors">
                    {featured.title}
                  </Link>
                </h3>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-white"
                    style={{ background: 'rgba(26,122,60,0.85)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {new Date(featured.publishedAt ?? featured.createdAt).toLocaleDateString('en-GB')}
                  </span>
                  <Link href={`/news/${featured.slug}`}
                    className="text-sm font-bold text-green-400 hover:text-green-300 transition-colors">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-slate-100 text-slate-400 text-sm"
              style={{ minHeight: '280px' }}>No news available.</div>
          )}

          {/* RIGHT — List newest-to-oldest */}
          <div className="flex flex-col divide-y divide-slate-200 border-l border-slate-200">
            {rest.length > 0 ? rest.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-stretch hover:bg-[#e8f5e9] transition-colors group">
                <SplitDate dateStr={item.publishedAt ?? item.createdAt} />
                <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
                  <h3 className="font-bold uppercase text-slate-900 group-hover:text-[#1a7a3c] transition-colors line-clamp-2 leading-snug"
                    style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.92rem', letterSpacing: '0.02em' }}>
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <Link href={`/news/${item.slug}`}
                    className="mt-1 text-sm font-semibold transition-colors"
                    style={{ color: '#1a7a3c' }}>
                    Read More
                  </Link>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
                No other news available.
              </div>
            )}
          </div>
        </div>

        {/* More News button */}
        <div className="mt-5">
          <Link href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c' }}>
            More News
            <ChevronChevron />
          </Link>
        </div>
      </div>
    </section>
  );
}
