import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import Navbar     from '@/components/layout/Navbar';
import Footer     from '@/components/layout/Footer';
import { cn }     from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

interface NewsItem { _id:string; title:string; slug:string; excerpt:string; content:string; coverImage?:string; category:string; authorName:string; tags?:string[]; publishedAt?:string; createdAt:string; viewCount?:number }
const CAT_COLORS: Record<string,string> = { achievement:'bg-amber-100 text-amber-700', research:'bg-blue-100 text-blue-700', event:'bg-emerald-100 text-emerald-700', announcement:'bg-violet-100 text-violet-700', award:'bg-rose-100 text-rose-700', collaboration:'bg-teal-100 text-teal-700', general:'bg-slate-100 text-slate-600' };

async function fetchBySlug(slug:string): Promise<NewsItem|null> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/news/${slug}`, { next:{revalidate:600} });
    if (!r.ok) return null;
    const d = await r.json() as {data:NewsItem};
    return d.data ?? null;
  } catch { return null; }
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const {slug} = await params;
  const n = await fetchBySlug(slug);
  return { title: n ? `${n.title} — GSTU CSE News` : 'News — GSTU CSE', description: n?.excerpt };
}

export default async function NewsDetailPage({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const n = await fetchBySlug(slug);
  if (!n) notFound();

  return (
    <>
      <SiteHeader/>
      <Navbar/>
      <main className="bg-slate-50 min-h-screen">
        {/* Hero */}
        <div className="bg-[#0d1b2e] pt-24 pb-12">
          <div className="container-custom max-w-4xl">
            <Link href="/news" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm mb-6 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              All News
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg', CAT_COLORS[n.category]??CAT_COLORS.general)}>{n.category}</span>
              <span className="text-slate-400 text-xs">{formatDate(n.publishedAt??n.createdAt)}</span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-slate-400 text-xs">{n.authorName}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{n.title}</h1>
            <p className="text-slate-300 mt-4 text-lg leading-relaxed">{n.excerpt}</p>
          </div>
        </div>
        {/* Cover */}
        {n.coverImage && (
          <div className="container-custom max-w-4xl -mt-6">
            <img src={n.coverImage} alt={n.title} className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-xl"/>
          </div>)}
        {/* Content */}
        <div className="container-custom max-w-4xl py-10">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-700">
              {n.content ? (
                <div dangerouslySetInnerHTML={{__html: n.content.replace(/\n/g,'<br/>')}}/>
              ) : (
                <p className="text-slate-500 italic">Content not available.</p>
              )}
            </div>
            {n.tags?.length ? (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">Tags:</span>
                {n.tags.map(t=><span key={t} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">#{t}</span>)}
              </div>) : null}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Back to News
            </Link>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
