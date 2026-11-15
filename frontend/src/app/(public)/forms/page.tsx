import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = {
  title: 'Forms & Downloads — GSTU CSE',
  description: 'Access official forms, templates, and academic resources.',
};

async function fetchResources() {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/academics/resources`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json() as { data?: Array<{ id: string; title: string; type: string; description?: string; fileUrl?: string; degree?: string }> };
    return Array.isArray(json.data) ? json.data : [];
  } catch { return []; }
}

export default async function FormsPage() {
  const resources = await fetchResources();

  return (
    <>
      <SectionHero tag="Resources" title="Forms & Downloads"
        description="Download official forms, templates and documents."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Forms' }]} />
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">

        {resources.length > 0 ? (
          <>
            {/* Group by type */}
            {Object.entries(
              resources.reduce<Record<string, typeof resources>>((acc, r) => {
                const key = r.type || 'general';
                (acc[key] ??= []).push(r);
                return acc;
              }, {})
            ).map(([type, items]) => (
              <section key={type} className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 capitalize">
                  {type.replace(/_/g, ' ')}
                </h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id}
                      className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl px-5 py-4 hover:border-green-300 transition">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded uppercase bg-green-100 text-green-700">
                          {item.degree || 'all'}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                        </div>
                      </div>
                      {item.fileUrl ? (
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-green-700 border border-green-300 hover:bg-green-50 px-3 py-1.5 rounded-lg transition shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No file</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3" aria-hidden="true">📄</span>
            <p className="text-slate-500 font-medium">No forms available yet.</p>
            <p className="text-sm text-slate-400 mt-1">Forms are managed by the admin via Academic Resources.</p>
            <Link href="/academics/resources"
              className="inline-block mt-4 text-sm font-semibold text-green-700 hover:text-green-900 transition">
              Browse Academic Resources →
            </Link>
          </div>
        )}
      </div></div>
    </>
  );
}
