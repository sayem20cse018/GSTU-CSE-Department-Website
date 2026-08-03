import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { cn }      from '@/lib/utils/cn';
import { formatDate, truncate } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'News — GSTU CSE' };

interface NewsItem { _id:string; title:string; slug:string; excerpt:string; coverImage?:string; category:string; authorName:string; publishedAt?:string; createdAt:string; isFeatured:boolean }

const CAT_COLORS: Record<string,string> = { achievement:'bg-amber-100 text-amber-700', research:'bg-blue-100 text-blue-700', event:'bg-emerald-100 text-emerald-700', announcement:'bg-violet-100 text-violet-700', award:'bg-rose-100 text-rose-700', collaboration:'bg-teal-100 text-teal-700', general:'bg-slate-100 text-slate-600' };
const GRADIENTS = ['from-blue-600 to-indigo-600','from-violet-600 to-purple-600','from-emerald-600 to-teal-600','from-rose-600 to-pink-600','from-amber-600 to-orange-600'];
const MOCK: NewsItem[] = [
  {_id:'1',title:'CSE Students Win Gold at International Programming Contest',slug:'cse-win-gold-ipc-2024',excerpt:'A team of three undergraduate students from the CSE Department secured first place at the ACM ICPC Regional contest.',category:'achievement',authorName:'Dept. of CSE',createdAt:new Date().toISOString(),isFeatured:true},
  {_id:'2',title:'New AI & Machine Learning Lab Inaugurated',slug:'ai-ml-lab-inauguration',excerpt:'The university inaugurated a state-of-the-art AI/ML research lab equipped with high-performance GPU clusters.',category:'research',authorName:'Admin',createdAt:new Date(Date.now()-3*86400000).toISOString(),isFeatured:false},
  {_id:'3',title:'Industry-Academia MoU Signed with TechBD Ltd.',slug:'techbd-mou-signed',excerpt:'A Memorandum of Understanding was signed to foster internship, research and placement opportunities.',category:'collaboration',authorName:'Admin',createdAt:new Date(Date.now()-7*86400000).toISOString(),isFeatured:false},
  {_id:'4',title:'3-Day Cybersecurity Workshop Successfully Completed',slug:'cybersecurity-workshop',excerpt:'Over 120 students participated in an intensive workshop on ethical hacking and penetration testing.',category:'event',authorName:'CSE Club',createdAt:new Date(Date.now()-10*86400000).toISOString(),isFeatured:false},
  {_id:'5',title:'Dr. Rahman Receives National Research Award 2024',slug:'national-research-award-2024',excerpt:'Dr. Mohammad Rahman of the CSE Department has been honored with the prestigious National Research Award.',category:'award',authorName:'Admin',createdAt:new Date(Date.now()-14*86400000).toISOString(),isFeatured:false},
  {_id:'6',title:'BSc Admission Test Results Published',slug:'bsc-admission-result-2024',excerpt:'The results of the BSc admission test for the session 2024-25 have been published on the university portal.',category:'announcement',authorName:'Admin',createdAt:new Date(Date.now()-18*86400000).toISOString(),isFeatured:false},
];

async function fetchNews(page=1, limit=9): Promise<{data:NewsItem[];total:number}> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/news?page=${page}&limit=${limit}`, { next:{revalidate:600} });
    if (!r.ok) return {data:MOCK,total:MOCK.length};
    const d = await r.json() as {data:{data:NewsItem[];pagination:{total:number}}};
    if (!d.data?.data?.length) return {data:MOCK,total:MOCK.length};
    return {data:d.data.data, total:d.data.pagination.total};
  } catch { return {data:MOCK,total:MOCK.length}; }
}

export default async function NewsPage() {
  const {data:news} = await fetchNews();
  const [featured, ...rest] = news;

  return (
    <>
      <SectionHero tag="Department News" title="News & Updates"
        description="Latest news, achievements, research highlights and announcements from the CSE Department."
        breadcrumbs={[{label:'Home',href:'/'},{label:'News'}]}/>
      <main className="bg-white section-py">
        <div className="container-custom">
          {/* Featured */}
          {featured && (
            <article className="mb-12 group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className={cn('h-64 lg:h-auto relative bg-gradient-to-br', GRADIENTS[0])}>
                {featured.coverImage ? <img src={featured.coverImage} alt="" className="w-full h-full object-cover"/> :
                  <div className="absolute inset-0 flex items-center justify-center opacity-20" aria-hidden="true">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                  </div>}
                <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-md bg-white/90 text-slate-700">Featured</span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded-md', CAT_COLORS[featured.category]??CAT_COLORS.general)}>{featured.category}</span>
                  <span className="text-xs text-slate-400">{formatDate(featured.publishedAt??featured.createdAt)} · {featured.authorName}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition mb-3 leading-snug">{featured.title}</h2>
                <p className="text-slate-500 leading-relaxed mb-5">{featured.excerpt}</p>
                <Link href={`/news/${featured.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 transition">
                  Read full article <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
              </div>
            </article>)}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((n,i)=>(
              <article key={n._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-300 transition-all">
                <div className={cn('h-44 relative bg-gradient-to-br', GRADIENTS[(i+1)%GRADIENTS.length])}>
                  {n.coverImage?<img src={n.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>:
                    <div className="absolute inset-0 flex items-center justify-center opacity-20"><svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/></svg></div>}
                  <span className={cn('absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md', CAT_COLORS[n.category]??CAT_COLORS.general)}>{n.category}</span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-2">{formatDate(n.publishedAt??n.createdAt)} · {n.authorName}</p>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2 line-clamp-2">{n.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-3">{truncate(n.excerpt,120)}</p>
                  <Link href={`/news/${n.slug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition inline-flex items-center gap-1">
                    Read more <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </Link>
                </div>
              </article>))}
          </div>
        </div>
      </main>
    </>
  );
}
