import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = {
  title: 'Publications — GSTU CSE',
  description: 'Research publications from CSE faculty members — journals, conferences, and book chapters.',
};

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: string;
  doi: string | null;
  url: string | null;
  facultyName: string;
}

async function fetchPublications(): Promise<Publication[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/faculty/publications/recent?limit=50`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json() as { data?: Publication[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch { return []; }
}

const TYPE_COLOR: Record<string, string> = {
  journal: 'bg-blue-100 text-blue-700',
  conference: 'bg-violet-100 text-violet-700',
  book: 'bg-amber-100 text-amber-700',
  thesis: 'bg-slate-100 text-slate-600',
};

export default async function PublicationsPage() {
  const pubs = await fetchPublications();

  return (
    <>
      <SectionHero tag="Research" title="Publications"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research', href: '/research' }, { label: 'Publications' }]} />
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">
        {pubs.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3" aria-hidden="true">📚</span>
            <p className="text-slate-500 font-medium">No publications available yet.</p>
            <p className="text-sm text-slate-400 mt-1">Publications are added through faculty profiles.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pubs.map((p) => {
              const link = p.url ?? (p.doi ? `https://doi.org/${p.doi}` : null);
              return (
                <article key={p.id} className="border border-slate-200 rounded-xl p-5 hover:border-green-300 transition">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${TYPE_COLOR[p.type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {p.type}
                    </span>
                    <span className="text-xs text-slate-400">{p.year}</span>
                    {p.facultyName && (
                      <span className="text-xs text-slate-400">· {p.facultyName}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-500">{p.authors} · <em>{p.venue}</em></p>
                  {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-green-700 hover:underline mt-1 inline-block">
                      {p.doi ? `DOI: ${p.doi}` : 'View →'}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div></div>
    </>
  );
}
