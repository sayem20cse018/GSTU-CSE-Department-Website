import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = {
  title: 'Alumni — GSTU CSE',
  description: 'Proud graduates of GSTU CSE making their mark across the globe.',
};

interface Alumnus {
  id: string;
  name: string;
  photo?: string;
  currentDesignation?: string;
  currentOrganization?: string;
  batchYear?: number;
  graduationYear?: number;
  degree?: string;
  currentCountry?: string;
  isFeatured?: boolean;
  testimonial?: string;
  linkedinUrl?: string;
}

async function fetchAlumni(): Promise<Alumnus[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/alumni`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const json = await res.json() as { data?: Alumnus[] };
    return Array.isArray(json.data) ? json.data : [];
  } catch { return []; }
}

export default async function AlumniPage() {
  const alumni = await fetchAlumni();
  const featured = alumni.filter(a => a.isFeatured);
  const display = featured.length > 0 ? featured : alumni;
  const totalBatches = new Set(alumni.map(a => a.batchYear).filter(Boolean)).size;
  const totalCountries = new Set(alumni.map(a => a.currentCountry).filter(Boolean)).size;

  return (
    <>
      <SectionHero tag="Alumni" title="Our Alumni"
        description="Proud graduates of GSTU CSE making their mark across the globe."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Alumni' }]} />

      <div className="bg-white section-py"><div className="container-custom">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            [alumni.length.toString(), 'Graduates'],
            [totalCountries.toString() || '—', 'Countries'],
            [totalBatches.toString() || '—', 'Batches'],
            [featured.length.toString(), 'Featured'],
          ].map(([v, l]) => (
            <div key={l} className="text-center rounded-xl py-6 px-4" style={{ background: '#0b3d1f' }}>
              <p className="text-3xl font-extrabold text-white">{v}</p>
              <p className="text-xs mt-1" style={{ color: '#86efac' }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Notable alumni */}
        {display.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-6" id="distinguished">Distinguished Alumni</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {display.map(a => (
                <div key={a.id} className="border border-slate-200 rounded-2xl p-5 hover:border-green-300 hover:shadow-md transition">
                  {a.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.photo} alt={a.name} className="w-12 h-12 rounded-full object-cover mb-3" />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3"
                      style={{ background: 'linear-gradient(to bottom right, #15803d, #14532d)' }}>
                      {a.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900">{a.name}</h3>
                  {(a.currentDesignation || a.currentOrganization) && (
                    <p className="text-sm text-green-700 font-medium mt-0.5">
                      {a.currentDesignation}{a.currentOrganization ? `, ${a.currentOrganization}` : ''}
                    </p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs text-slate-400">
                    {a.batchYear && <span>Batch {a.batchYear}</span>}
                    {a.batchYear && a.currentCountry && <span>·</span>}
                    {a.currentCountry && <span>{a.currentCountry}</span>}
                  </div>
                  {a.linkedinUrl && (
                    <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                      LinkedIn →
                    </a>
                  )}
                  {a.testimonial && (
                    <p className="text-sm text-slate-500 italic mt-3 border-l-2 border-green-200 pl-3">
                      &ldquo;{a.testimonial}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {alumni.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3" aria-hidden="true">🎓</span>
            <p className="text-slate-500 font-medium">No alumni profiles yet.</p>
          </div>
        )}

        {/* Register CTA */}
        <section id="stories" className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Are You a GSTU CSE Alumni?</h2>
          <p className="text-slate-500 mb-6">Join the alumni network and stay connected with your alma mater.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/alumni/register"
              className="px-6 py-3 text-sm font-bold text-white rounded-xl transition"
              style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
              Register as Alumni
            </Link>
            <Link href="/contact"
              className="px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:border-green-400 rounded-xl transition">
              Contact Alumni Office
            </Link>
          </div>
        </section>
      </div></div>
    </>
  );
}
