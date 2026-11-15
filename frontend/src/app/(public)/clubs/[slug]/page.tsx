import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

interface Club {
  id: string; name: string; slug: string; description: string;
  shortDescription?: string; logo?: string; coverImage?: string;
  presidentName?: string; advisorName?: string; foundedYear: number;
  memberCount: number; activities?: string[]; email?: string;
  facebookUrl?: string; isActive: boolean;
}

async function fetchClub(slug: string): Promise<Club | null> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/clubs/${slug}`, { next: { revalidate: 3600 } });
    if (!r.ok) return null;
    const d = await r.json() as { data: Club };
    return d.data ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const club = await fetchClub(slug);
  return { title: club ? `${club.name} — GSTU CSE Clubs` : 'Club — GSTU CSE' };
}

export default async function ClubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await fetchClub(slug);
  if (!club) notFound();

  return (
    <>
      <SectionHero
        tag="Student Life"
        title={club.name}
        description={club.shortDescription ?? `Est. ${club.foundedYear} · ${club.memberCount} Members`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Clubs', href: '/clubs' }, { label: club.name }]}
      />

      <div className="bg-white section-py">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cover */}
              <div className="h-56 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                {club.coverImage
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover" />
                  : <span className="text-8xl opacity-20" aria-hidden="true">🏫</span>
                }
              </div>

              {/* About */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">About the Club</h2>
                <p className="text-slate-600 leading-relaxed">{club.description}</p>
              </section>

              {/* Activities */}
              {club.activities && club.activities.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Activities & Programs</h2>
                  <ul className="space-y-2">
                    {club.activities.map((activity) => (
                      <li key={activity} className="flex items-center gap-3 text-slate-600">
                        <svg className="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="rounded-2xl text-white p-6"
                style={{ background: 'linear-gradient(160deg,#0b3d1f,#134e2a)' }}>
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl mb-4">
                  {club.logo
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={club.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                    : <span aria-hidden="true">🏫</span>
                  }
                </div>
                <h3 className="font-bold text-lg text-white">{club.name}</h3>
                <div className="mt-4 space-y-2.5 text-sm">
                  {[
                    ['📅 Founded', String(club.foundedYear)],
                    ['👥 Members', String(club.memberCount)],
                    ...(club.presidentName ? [['👤 President', club.presidentName]] : []),
                    ...(club.advisorName   ? [['🎓 Advisor',   club.advisorName]]   : []),
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between gap-2 py-2 border-b border-white/10 last:border-0">
                      <span className="text-green-200/70">{l}</span>
                      <span className="font-medium text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">Get in Touch</h3>
                <div className="space-y-3">
                  {club.email && (
                    <a href={`mailto:${club.email}`}
                      className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 transition">
                      <span>✉️</span>{club.email}
                    </a>
                  )}
                  {club.facebookUrl && (
                    <a href={club.facebookUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition">
                      <span>📘</span>Facebook Page
                    </a>
                  )}
                </div>
                {!club.email && !club.facebookUrl && (
                  <Link href="/contact" className="text-sm text-green-700 hover:underline">
                    Contact the department →
                  </Link>
                )}
              </div>

              <Link href="/clubs"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition">
                ← All Clubs
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
