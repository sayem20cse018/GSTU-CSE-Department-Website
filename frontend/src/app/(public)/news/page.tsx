import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'All News — GSTU CSE' };
export const dynamic = 'force-dynamic';

interface NewsItem {
  id: string; title: string; slug: string; excerpt: string;
  coverImage?: string; category: string;
  authorName: string; publishedAt?: string; createdAt: string;
  isFeatured: boolean;
}

async function fetchAllNews(): Promise<NewsItem[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/news?limit=50`, { cache: 'no-store' });
    if (!r.ok) return [];
    const d = await r.json() as { data?: { data?: NewsItem[] } | NewsItem[] };
    const raw = d.data;
    const arr = Array.isArray(raw) ? raw : (raw as { data?: NewsItem[] })?.data;
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

const CAT: Record<string, string> = {
  achievement: 'bg-amber-100 text-amber-700', research: 'bg-blue-100 text-blue-700',
  event: 'bg-emerald-100 text-emerald-700', announcement: 'bg-violet-100 text-violet-700',
  award: 'bg-rose-100 text-rose-700', collaboration: 'bg-teal-100 text-teal-700',
  general: 'bg-slate-100 text-slate-600',
};

function SplitDate({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr);
  return (
    <div className="shrink-0 w-[72px] flex flex-col items-center justify-center py-3 px-1 text-center"
      style={{ background: '#1b2a4a', color: '#fff', minHeight: '72px' }}>
      <span className="block text-[11px] font-semibold leading-tight">
        {d.toLocaleDateString('en-US', { month: 'long' })}
      </span>
      <span className="block text-[15px] font-bold leading-tight mt-0.5"
        style={{ fontFamily: 'var(--font-oswald)' }}>{d.getDate()},</span>
      <span className="block text-[13px] font-semibold leading-tight">{d.getFullYear()}</span>
    </div>
  );
}

export default async function NewsPage() {
  const all = await fetchAllNews();
  const sorted = [...all].sort((a, b) =>
    new Date(b.publishedAt ?? b.createdAt).getTime() -
    new Date(a.publishedAt ?? a.createdAt).getTime()
  );
  const [featured, ...rest] = sorted;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container-custom py-2.5">
          <nav className="text-sm text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <span>›</span>
            <span className="text-slate-800 font-medium">News</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-1"
          style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.04em' }}>
          ALL NEWS
        </h1>
        <div className="h-[2px] bg-slate-200 mb-8" aria-hidden="true" />

        {all.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📰</div>
            <p className="text-slate-600 font-semibold">No news published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-slate-200 mb-10">
            {/* LEFT — featured */}
            {featured && (
              <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>
                {featured.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featured.coverImage} alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#1a7a3c,#0d4423)' }}>
                    <svg className="w-24 h-24 opacity-15 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)' }}
                  aria-hidden="true" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                    Latest
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 ${CAT[featured.category] ?? CAT.general}`}>
                    {featured.category}
                  </span>
                  <h2 className="text-white font-bold leading-snug mb-2 uppercase"
                    style={{ fontFamily: 'var(--font-oswald)', fontSize: '1.15rem', letterSpacing: '0.03em' }}>
                    <Link href={`/news/${featured.slug}`} className="hover:text-green-300 transition-colors">
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-3">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300/80">
                      {formatDate(featured.publishedAt ?? featured.createdAt)} · {featured.authorName}
                    </span>
                    <Link href={`/news/${featured.slug}`}
                      className="text-sm font-bold text-green-400 hover:text-green-300 transition-colors">
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT — list */}
            <div className="flex flex-col divide-y divide-slate-200 border-l border-slate-200">
              {rest.slice(0, 6).map(item => (
                <div key={item.id} className="flex items-stretch hover:bg-[#e8f5e9] transition-colors group">
                  <SplitDate dateStr={item.publishedAt ?? item.createdAt} />
                  <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
                    <span className={`inline-block self-start text-[9px] font-bold px-1.5 py-0.5 rounded mb-1 ${CAT[item.category] ?? CAT.general}`}>
                      {item.category}
                    </span>
                    <h3 className="font-bold uppercase text-slate-900 group-hover:text-[#1a7a3c] transition-colors line-clamp-2 leading-snug"
                      style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.88rem', letterSpacing: '0.02em' }}>
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <Link href={`/news/${item.slug}`}
                      className="mt-1 text-xs font-semibold transition-colors"
                      style={{ color: '#1a7a3c' }}>
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL older news below */}
        {rest.length > 6 && (
          <>
            <h2 className="text-lg font-bold text-slate-700 mb-4 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-oswald)' }}>More News</h2>
            <div className="border border-slate-200 divide-y divide-slate-200 rounded">
              {rest.slice(6).map(item => (
                <div key={item.id} className="flex items-stretch hover:bg-slate-50 transition-colors group">
                  <SplitDate dateStr={item.publishedAt ?? item.createdAt} />
                  <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${CAT[item.category] ?? CAT.general}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.authorName}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#1a7a3c] transition-colors line-clamp-2 leading-snug"
                      style={{ fontSize: '0.88rem' }}>
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                  </div>
                  <div className="flex items-center pr-5">
                    <Link href={`/news/${item.slug}`}
                      className="text-xs font-semibold shrink-0 hover:underline"
                      style={{ color: '#1a7a3c' }}>
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
