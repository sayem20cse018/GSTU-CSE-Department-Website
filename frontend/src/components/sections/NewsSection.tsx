import Link from 'next/link';
import { formatDate, truncate } from '@/lib/utils/format';

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
  { _id:'1', title:'CSE Students Win Gold at International Programming Contest', slug:'programming-contest-2024', excerpt:'A team of three students secured first place at the ACM ICPC Regional contest held in Dhaka, qualifying for the Asia Pacific Finals.', category:'achievement', publishedAt:new Date().toISOString(), authorName:'CSE Department' },
  { _id:'2', title:'New AI & Machine Learning Lab Inaugurated', slug:'ai-ml-lab', excerpt:'The university inaugurated a state-of-the-art AI/ML research lab equipped with high-performance GPU clusters for advanced research.', category:'research', publishedAt:new Date(Date.now()-3*86400000).toISOString(), authorName:'Admin' },
  { _id:'3', title:'Industry-Academia MoU Signed with TechBD Ltd.', slug:'techbd-mou', excerpt:'A Memorandum of Understanding signed to foster internship, placement and collaborative research opportunities for students.', category:'announcement', publishedAt:new Date(Date.now()-7*86400000).toISOString(), authorName:'Admin' },
  { _id:'4', title:'3-Day Cybersecurity Workshop Completed Successfully', slug:'cybersecurity-workshop', excerpt:'Over 120 students participated in the intensive workshop on ethical hacking, penetration testing and network security fundamentals.', category:'event', publishedAt:new Date(Date.now()-10*86400000).toISOString(), authorName:'CSE Club' },
];

const CAT_COLOR: Record<string,{bg:string;text:string}> = {
  achievement: { bg:'#fef3c7', text:'#b45309' },
  research:    { bg:'#dbeafe', text:'#1d4ed8' },
  announcement:{ bg:'#ede9fe', text:'#6d28d9' },
  event:       { bg:'#d1fae5', text:'#065f46' },
  general:     { bg:'#f1f5f9', text:'#475569' },
};
const GRADS = ['from-blue-600 to-indigo-700','from-violet-600 to-purple-700','from-emerald-600 to-teal-700','from-amber-600 to-orange-700'];

export default async function NewsSection() {
  const items = await fetchNews();
  const [featured, ...rest] = items;

  return (
    <section className="section-py bg-slate-50">
      <div className="container-custom">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ color:'#1d4ed8', background:'rgba(29,78,216,0.08)', border:'1px solid rgba(29,78,216,0.15)' }}>
              News &amp; Updates
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Latest News</h2>
          </div>
          <Link href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-700 hover:text-white transition shrink-0">
            All News
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Featured — large */}
          {featured && (
            <article className="lg:col-span-3 group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className={`h-52 relative bg-gradient-to-br overflow-hidden ${GRADS[0]}`}>
                {featured.coverImage
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={featured.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  : <div className="absolute inset-0 flex items-center justify-center opacity-15">
                      <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                      </svg>
                    </div>
                }
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-slate-700">Featured</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                    style={{ background: (CAT_COLOR[featured.category] ?? CAT_COLOR.general).bg, color: (CAT_COLOR[featured.category] ?? CAT_COLOR.general).text }}>
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(featured.publishedAt)}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2">
                  <Link href={`/news/${featured.slug}`}>{featured.title}</Link>
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{truncate(featured.excerpt, 160)}</p>
                <Link href={`/news/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900 transition">
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </div>
            </article>
          )}

          {/* Side cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {rest.map((item, i) => {
              const c = CAT_COLOR[item.category] ?? CAT_COLOR.general;
              return (
                <article key={item._id}
                  className="group flex gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className={`w-16 h-16 rounded-xl shrink-0 overflow-hidden bg-gradient-to-br flex items-center justify-center ${GRADS[(i+1)%GRADS.length]}`}>
                    {item.coverImage
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={item.coverImage} alt="" className="w-full h-full object-cover"/>
                      : <svg className="w-7 h-7 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
                        </svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: c.bg, color: c.text }}>
                      {item.category}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">{formatDate(item.publishedAt)}</p>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
