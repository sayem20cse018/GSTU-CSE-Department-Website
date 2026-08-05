import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';

interface NewsItem {
  _id: string; title: string; slug: string; excerpt: string;
  coverImage?: string; category: string;
  publishedAt: string; authorName: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/news?limit=4`, { next: { revalidate: 600 } });
    if (!res.ok) return MOCK;
    const json = await res.json() as { data: NewsItem[] | { data: NewsItem[] } };
    const arr = Array.isArray(json.data) ? json.data : (json.data as { data: NewsItem[] }).data;
    return arr?.length ? arr : MOCK;
  } catch { return MOCK; }
}

const MOCK: NewsItem[] = [
  { _id:'1', title:'CSE Students Win Gold at International Programming Contest', slug:'programming-contest-2024', excerpt:'A team of three students secured first place at the ACM ICPC Regional contest held in Dhaka.', category:'achievement', publishedAt:new Date().toISOString(), authorName:'CSE Department' },
  { _id:'2', title:'New AI & Machine Learning Lab Inaugurated at Campus', slug:'ai-ml-lab', excerpt:'The university inaugurated a state-of-the-art AI/ML research lab equipped with high-performance GPU clusters.', category:'research', publishedAt:new Date(Date.now()-3*86400000).toISOString(), authorName:'Admin' },
  { _id:'3', title:'Industry-Academia MoU Signed with TechBD Ltd.', slug:'techbd-mou', excerpt:'A Memorandum of Understanding signed to foster internship and collaborative research opportunities.', category:'announcement', publishedAt:new Date(Date.now()-7*86400000).toISOString(), authorName:'Admin' },
];

/** Format date like the image: "July\n28, 2026" */
function SplitDate({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day   = d.getDate();
  const year  = d.getFullYear();
  return (
    <div className="shrink-0 w-[72px] flex flex-col items-center justify-center py-3 px-1 text-center"
      style={{ background: '#1b2a4a', color: '#fff', minHeight: '72px' }}>
      <span className="block text-[11px] font-semibold leading-tight" style={{ fontFamily: 'var(--font-inter)' }}>{month}</span>
      <span className="block text-[15px] font-bold leading-tight mt-0.5" style={{ fontFamily: 'var(--font-oswald)' }}>{day},</span>
      <span className="block text-[13px] font-semibold leading-tight" style={{ fontFamily: 'var(--font-inter)' }}>{year}</span>
    </div>
  );
}

export default async function NewsSection() {
  const items = await fetchNews();
  const [featured, ...rest] = items;

  return (
    <section className="py-10 bg-white">
      <div className="container-custom">

        {/* ── Section header — AUST style ──────────────────────────────── */}
        <div className="flex items-center gap-4 mb-6">
          <h2
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}
          >
            Latest News
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        {/* ── Main grid: featured left, list right ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-slate-200">

          {/* LEFT — Featured article with image */}
          {featured && (
            <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
              {/* Cover image */}
              <div className="w-full h-full" style={{ minHeight: '280px', position: 'relative' }}>
                {featured.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                    style={{ minHeight: '280px', display: 'block' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ minHeight: '280px', background: 'linear-gradient(135deg,#1a7a3c,#0d4423)' }}>
                    <svg className="w-20 h-20 opacity-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                  </div>
                )}
                {/* Dark gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0"
                  style={{ height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}
                  aria-hidden="true" />
              </div>

              {/* Title + date overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-white font-bold leading-snug mb-1.5 uppercase"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '1.05rem', letterSpacing: '0.03em' }}>
                  <Link href={`/news/${featured.slug}`} className="hover:text-green-300 transition-colors">
                    {featured.title}
                  </Link>
                </h3>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-white"
                  style={{ background: 'rgba(26,122,60,0.85)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Date: {new Date(featured.publishedAt).toLocaleDateString('en-GB').replace(/\//g,'/')}
                </div>
              </div>
            </div>
          )}

          {/* RIGHT — News list with date boxes */}
          <div className="flex flex-col divide-y divide-slate-200 border-l border-slate-200">
            {rest.map((item) => (
              <div key={item._id} className="flex items-stretch hover:bg-[#e8f5e9] transition-colors group">
                {/* Date box */}
                <SplitDate dateStr={item.publishedAt} />

                {/* Text */}
                <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
                  <h3
                    className="font-bold uppercase text-slate-900 group-hover:text-[#1a7a3c] transition-colors line-clamp-2 leading-snug"
                    style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.92rem', letterSpacing: '0.02em' }}
                  >
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <Link
                    href={`/news/${item.slug}`}
                    className="mt-1 text-sm font-semibold transition-colors"
                    style={{ color: '#1a7a3c', fontFamily: 'var(--font-inter)' }}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}

            {/* Filler if < 3 side items */}
            {rest.length === 0 && (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
                No news available.
              </div>
            )}
          </div>
        </div>

        {/* More button */}
        <div className="mt-5">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c', fontFamily: 'var(--font-inter)' }}
          >
            More News
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
            <svg className="w-4 h-4 -ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
