'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Club {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  logo?: string;
  coverImage?: string;
  presidentName?: string;
  advisorName?: string;
  foundedYear: number;
  memberCount: number;
  isActive: boolean;
  isFeatured: boolean;
}

const MOCK_CLUBS: Club[] = [];

const CLUB_META = [
  { gradient:'from-blue-600 to-indigo-700',   icon:'💻' },
  { gradient:'from-violet-600 to-purple-700', icon:'🤖' },
  { gradient:'from-emerald-600 to-teal-700',  icon:'🧠' },
  { gradient:'from-rose-600 to-pink-700',     icon:'🔐' },
  { gradient:'from-amber-600 to-orange-700',  icon:'📱' },
  { gradient:'from-cyan-600 to-blue-700',     icon:'🌐' },
];

export default function ClubsSection() {
  const [clubs, setClubs] = useState<Club[]>(MOCK_CLUBS);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    fetch(`${api}/clubs`)
      .then(r => r.json())
      .then((d: { data: Club[] }) => { if (d.data?.length) setClubs(d.data); })
      .catch(() => {/* keep mock */});
  }, []);

  return (
    <section className="section-py bg-slate-50" aria-labelledby="clubs-heading">
      <div className="container-custom">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <h2 id="clubs-heading"
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Department Clubs
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, i) => {
            const meta = CLUB_META[i % CLUB_META.length];
            return (
              <article key={club.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden
                           hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                {/* Cover */}
                <div className={`h-36 relative bg-gradient-to-br overflow-hidden ${meta.gradient}`}>
                  {club.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={club.coverImage} alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl opacity-25" aria-hidden="true">{meta.icon}</span>
                    </div>
                  )}

                  {/* Logo bubble */}
                  <div className="absolute -bottom-6 left-5">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-lg border-2 border-white
                                    flex items-center justify-center text-2xl overflow-hidden">
                      {club.logo
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={club.logo} alt="" className="w-full h-full object-cover"/>
                        : <span aria-hidden="true">{meta.icon}</span>
                      }
                    </div>
                  </div>

                  {club.isFeatured && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-white/90"
                      style={{ color:'#166534' }}>⭐ Featured</span>
                  )}
                </div>

                {/* Body */}
                <div className="pt-9 px-5 pb-5">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-green-700 transition">
                    <Link href={`/clubs/${club.slug}`}>{club.name}</Link>
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{club.shortDescription}</p>

                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                    <span>👥 {club.memberCount} members</span>
                    <span>📅 Est. {club.foundedYear}</span>
                  </div>
                  {club.advisorName && (
                    <p className="mt-1 text-xs text-slate-400">
                      Advisor: <span className="font-medium text-slate-600">{club.advisorName}</span>
                    </p>
                  )}

                  <Link href={`/clubs/${club.slug}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 py-2.5 rounded-xl
                               text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background:'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                    View Club
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/clubs"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm
                       border border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition">
            View All Clubs
          </Link>
        </div>
      </div>
    </section>
  );
}
