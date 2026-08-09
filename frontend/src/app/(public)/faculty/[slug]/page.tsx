import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface Faculty {
  id: string; name: string; title?: string; designation: string;
  email: string; phone?: string; photo?: string; shortBio?: string; fullBio?: string;
  researchInterests: string[]; officeRoom?: string; slug?: string;
  googleScholarUrl?: string; linkedinUrl?: string; orcidId?: string; researchGateUrl?: string;
  education?: { degree:string; institution:string; year:number }[];
  courses?: string[];
  officeHours?: { day:string; startTime:string; endTime:string }[];
  joinedAt?: string;
}

async function fetchFacultyBySlug(slug: string): Promise<Faculty | null> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    // Try by ID if looks like ObjectId, else search by slug from list
    const r = await fetch(`${api}/faculty`, { next: { revalidate: 3600 } });
    if (!r.ok) return null;
    const d = await r.json() as { data: Faculty[] };
    return d.data?.find(f => f.slug === slug || f.id === slug) ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = await fetchFacultyBySlug(slug);
  return { title: f ? `${f.title ?? ''} ${f.name} — GSTU CSE Faculty` : 'Faculty — GSTU CSE' };
}

const BADGE: Record<string,string> = { 'Professor':'bg-blue-100 text-blue-700','Associate Professor':'bg-violet-100 text-violet-700','Assistant Professor':'bg-emerald-100 text-emerald-700','Lecturer':'bg-amber-100 text-amber-700' };

export default async function FacultyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = await fetchFacultyBySlug(slug);
  if (!f) notFound();

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-[#0d1b2e] pt-24 pb-12">
        <div className="container-custom">
          <Link href="/faculty" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            All Faculty
          </Link>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {f.photo
              ? <img src={f.photo} alt={f.name} className="w-28 h-28 rounded-2xl object-cover object-top border-2 border-white/20 shrink-0"/>
              : <div className="w-28 h-28 rounded-2xl bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shrink-0">{f.name.charAt(0)}</div>}
            <div>
              <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg', BADGE[f.designation] ?? 'bg-slate-100 text-slate-700')}>{f.designation}</span>
              <h1 className="text-3xl font-extrabold text-white mt-2">{f.title} {f.name}</h1>
              {f.shortBio && <p className="text-slate-400 mt-2 max-w-2xl">{f.shortBio}</p>}
              <div className="flex flex-wrap gap-3 mt-4">
                <a href={`mailto:${f.email}`} className="flex items-center gap-1.5 text-sm text-blue-300 hover:text-white transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  {f.email}
                </a>
                {f.phone && <a href={`tel:${f.phone}`} className="flex items-center gap-1.5 text-sm text-blue-300 hover:text-white transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {f.phone}</a>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {f.fullBio && <section className="bg-white rounded-2xl border border-slate-200 p-6"><h2 className="text-lg font-bold text-slate-900 mb-3">Biography</h2><p className="text-slate-600 leading-relaxed whitespace-pre-line">{f.fullBio}</p></section>}
            {f.researchInterests?.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Research Interests</h2>
                <div className="flex flex-wrap gap-2">{f.researchInterests.map(r=><span key={r} className="bg-blue-50 text-blue-700 border border-blue-200 text-sm px-3 py-1 rounded-full">{r}</span>)}</div>
              </section>)}
            {f.education?.length ? (
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Education</h2>
                <div className="space-y-4">{f.education.map((e,i)=>(
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-sm">{e.year.toString().slice(-2)}</div>
                    <div><p className="font-semibold text-slate-900">{e.degree}</p><p className="text-sm text-slate-500">{e.institution} · {e.year}</p></div>
                  </div>))}</div>
              </section>) : null}
            {f.courses?.length ? (
              <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Courses Teaching</h2>
                <div className="flex flex-wrap gap-2">{f.courses.map(c=><span key={c} className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">{c}</span>)}</div>
              </section>) : null}
          </div>

          <aside className="space-y-5">
            {/* Quick info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Info</h3>
              {[['Designation',f.designation],['Office',f.officeRoom??'—'],].map(([l,v])=>(
                <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                  <span className="text-slate-500">{l}</span><span className="text-slate-900 font-medium text-right">{v}</span>
                </div>))}
            </div>
            {/* Office hours */}
            {f.officeHours?.length ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Office Hours</h3>
                {f.officeHours.map((oh,i)=>(
                  <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                    <span className="text-slate-500">{oh.day}</span>
                    <span className="text-slate-900 font-medium">{oh.startTime} – {oh.endTime}</span>
                  </div>))}</div>) : null}
            {/* Online profiles */}
            {(f.googleScholarUrl || f.linkedinUrl || f.orcidId || f.researchGateUrl) && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Online Profiles</h3>
                <div className="space-y-2">
                  {f.googleScholarUrl && <a href={f.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition"><span className="w-5 h-5 text-center">🎓</span>Google Scholar</a>}
                  {f.linkedinUrl && <a href={f.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition"><span className="w-5 h-5 text-center">💼</span>LinkedIn</a>}
                  {f.orcidId && <a href={`https://orcid.org/${f.orcidId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition"><span className="w-5 h-5 text-center">🔬</span>ORCID: {f.orcidId}</a>}
                  {f.researchGateUrl && <a href={f.researchGateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition"><span className="w-5 h-5 text-center">📄</span>ResearchGate</a>}
                </div>
              </div>)}
          </aside>
        </div>
      </div>
    </main>
  );
}
