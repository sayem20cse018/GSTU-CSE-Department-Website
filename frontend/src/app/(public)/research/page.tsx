import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { RESEARCH_AREAS } from '@/constants';

export const metadata: Metadata = {
  title: 'Research — GSTU CSE',
  description: 'Cutting-edge research spanning AI, cybersecurity, IoT, NLP and more at GSTU CSE.',
};

interface ResearchGroup {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  projects?: { id: string; title: string; status?: string; description?: string }[];
}

async function fetchResearchGroups(): Promise<ResearchGroup[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/research`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json() as { data?: ResearchGroup[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch { return []; }
}

export default async function ResearchPage() {
  const groups = await fetchResearchGroups();

  return (
    <>
      <SectionHero tag="Research & Innovation" title="Research at GSTU CSE"
        description="Cutting-edge research spanning AI, cybersecurity, IoT, NLP and more."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }]} />

      <div className="bg-white section-py">
        <div className="container-custom">

          {/* Research areas */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Research Areas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {RESEARCH_AREAS.map(a => (
                <div key={a.name} className="rounded-xl p-5 text-center transition" style={{ background: '#0b3d1f', color: '#fff' }}>
                  <span className="text-3xl block mb-2" aria-hidden="true">{a.icon}</span>
                  <p className="text-xs font-semibold leading-snug" style={{ color: '#bbf7d0' }}>{a.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Research groups from API */}
          {groups.length > 0 ? (
            <section className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Research Groups</h2>
                <Link href="/research/publications" className="text-sm font-semibold text-green-700 hover:text-green-900">
                  View Publications →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map(g => (
                  <article key={g.id} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition">
                    <h3 className="font-bold text-slate-900 mb-2 leading-snug">{g.name}</h3>
                    {g.description && <p className="text-sm text-slate-500 mb-3">{g.description}</p>}
                    {g.projects && g.projects.length > 0 && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
                        {g.projects.map(p => (
                          <div key={p.id} className="flex items-start gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {p.status ?? '•'}
                            </span>
                            <p className="text-sm text-slate-600">{p.title}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-14 text-center py-10">
              <span className="text-4xl block mb-3" aria-hidden="true">🔬</span>
              <p className="text-slate-500 font-medium">Research groups will appear here once added by the admin.</p>
            </section>
          )}

          {/* CTA */}
          <div className="text-center rounded-2xl p-10" style={{ background: '#0b3d1f', color: '#fff' }}>
            <h2 className="text-2xl font-bold mb-3">Interested in Research Collaboration?</h2>
            <p className="mb-6 max-w-xl mx-auto" style={{ color: '#bbf7d0' }}>We welcome collaborations with industry partners, other universities, and funding agencies.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white font-bold px-6 py-3 rounded-xl transition hover:bg-green-50"
              style={{ color: '#0b3d1f' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
