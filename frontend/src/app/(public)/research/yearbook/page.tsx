import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = {
  title: 'Year Book — GSTU CSE',
  description: 'Annual records of graduating batches, academic highlights, and departmental milestones.',
};

async function fetchResources() {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/academics/resources?type=yearbook`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json() as { data?: Array<{ id: string; title: string; fileUrl?: string; description?: string; degree?: string }> };
    return Array.isArray(json.data) ? json.data : [];
  } catch { return []; }
}

export default async function YearbookPage() {
  const resources = await fetchResources();

  return (
    <>
      <SectionHero tag="Research & Publications" title="Year Book"
        description="Annual records of graduating batches, academic highlights, and departmental milestones."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }, { label: 'Year Book' }]} />

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">

          {resources.length > 0 ? (
            <div className="space-y-4 mb-10">
              {resources.map(r => (
                <div key={r.id} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>🎓</span>
                    <div>
                      <h2 className="font-bold text-slate-900">{r.title}</h2>
                      {r.description && <p className="text-sm text-slate-500 mt-0.5">{r.description}</p>}
                    </div>
                  </div>
                  {r.fileUrl && (
                    <a href={r.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-green-700 border border-green-300 hover:bg-green-50 px-3 py-1.5 rounded-lg transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 mb-10">
              <span className="text-5xl block mb-3" aria-hidden="true">📚</span>
              <p className="text-slate-500 font-medium">Year book PDFs will appear here once uploaded by the admin.</p>
            </div>
          )}

          <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <p className="text-slate-500 text-sm">Full year book PDFs are available at the department office.</p>
            <Link href="/contact"
              className="inline-block mt-3 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
              Contact Department
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
