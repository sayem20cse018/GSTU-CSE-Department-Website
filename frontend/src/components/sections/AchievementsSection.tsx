import Link from 'next/link';

interface Achievement {
  id: string; title: string; description: string;
  image?: string; type: string; achievedAt: string; createdAt: string;
  achieverName?: string; awardedBy?: string; isFeatured: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  competition: 'Competition', research: 'Research', department: 'Department',
  student: 'Student', faculty: 'Faculty', other: 'Achievement',
};

async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/achievements?isPublished=true&limit=5`, {
      next: { revalidate: 1800 },
    });
    if (!r.ok) return [];
    const d = await r.json() as { data?: Achievement[] };
    return Array.isArray(d.data) ? d.data.slice(0, 5) : [];
  } catch { return []; }
}

function SplitDate({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const day   = d.getDate();
  const year  = d.getFullYear();
  return (
    <div className="shrink-0 w-[72px] flex flex-col items-center justify-center py-3 px-1 text-center"
      style={{ background: '#1b2a4a', color: '#fff', minHeight: '72px' }}>
      <span className="block text-[11px] font-semibold leading-tight">{month}</span>
      <span className="block text-[15px] font-bold leading-tight mt-0.5"
        style={{ fontFamily: 'var(--font-oswald)' }}>{day},</span>
      <span className="block text-[13px] font-semibold leading-tight">{year}</span>
    </div>
  );
}

export default async function AchievementsSection() {
  const raw = await fetchAchievements();

  // Sort: featured first, then newest-to-oldest
  const items = [...raw].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return new Date(b.achievedAt ?? b.createdAt).getTime() -
           new Date(a.achievedAt ?? a.createdAt).getTime();
  });

  const [featured, ...rest] = items;

  if (!featured && rest.length === 0) return null;

  const GRADIENTS = [
    'linear-gradient(135deg,#d97706,#ea580c)',
    'linear-gradient(135deg,#2563eb,#4338ca)',
    'linear-gradient(135deg,#7c3aed,#a21caf)',
    'linear-gradient(135deg,#059669,#0d9488)',
  ];

  return (
    <section className="py-10 bg-white" aria-labelledby="achievements-heading">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 id="achievements-heading"
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Recent Achievements
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-slate-200">
          {/* LEFT — Featured achievement */}
          {featured ? (
            <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
              {/* Background — image or gradient */}
              {featured.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.image} alt={featured.title}
                  className="w-full h-full object-cover absolute inset-0"
                  style={{ minHeight: '280px' }} />
              ) : (
                <div className="absolute inset-0"
                  style={{ background: GRADIENTS[0] }}>
                  <div className="flex items-center justify-center h-full opacity-20" aria-hidden="true">
                    <svg className="w-28 h-28 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    </svg>
                  </div>
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }}
                aria-hidden="true" />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {featured.isFeatured && (
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{ background: '#fbbf24', color: '#1a1a1a' }}>⭐ FEATURED</span>
                )}
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}>
                  {TYPE_LABEL[featured.type] ?? featured.type}
                </span>
              </div>
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-white font-bold leading-snug mb-2 uppercase"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '1.05rem', letterSpacing: '0.03em' }}>
                  <Link href="/achievements" className="hover:text-yellow-300 transition-colors">
                    {featured.title}
                  </Link>
                </h3>
                {featured.achieverName && (
                  <p className="text-green-300 text-xs mb-2 truncate">👤 {featured.achieverName}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded"
                    style={{ background: 'rgba(26,122,60,0.8)', color: '#fff' }}>
                    {new Date(featured.achievedAt ?? featured.createdAt).toLocaleDateString('en-GB')}
                  </span>
                  <Link href="/achievements"
                    className="text-sm font-bold text-green-400 hover:text-green-300 transition-colors">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-slate-400 text-sm"
              style={{ minHeight: '280px', background: 'linear-gradient(135deg,#d97706,#ea580c)' }}>
              No achievements yet.
            </div>
          )}

          {/* RIGHT — Achievements list newest-to-oldest */}
          <div className="flex flex-col divide-y divide-slate-200 border-l border-slate-200">
            {rest.length > 0 ? rest.slice(0, 4).map((item, i) => (
              <div key={item.id}
                className="flex items-stretch hover:bg-[#e8f5e9] transition-colors group">
                {/* Date box with accent gradient */}
                <div className="shrink-0 w-[72px] flex flex-col items-center justify-center py-3 px-1 text-center"
                  style={{ background: GRADIENTS[i % GRADIENTS.length], minHeight: '72px' }}>
                  {(() => {
                    const d = new Date(item.achievedAt ?? item.createdAt);
                    return (
                      <>
                        <span className="block text-[11px] font-semibold leading-tight text-white">
                          {d.toLocaleDateString('en-US', { month: 'long' })}
                        </span>
                        <span className="block text-[15px] font-bold leading-tight mt-0.5 text-white"
                          style={{ fontFamily: 'var(--font-oswald)' }}>{d.getDate()},</span>
                        <span className="block text-[13px] font-semibold leading-tight text-white">{d.getFullYear()}</span>
                      </>
                    );
                  })()}
                </div>
                <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 capitalize">
                      {TYPE_LABEL[item.type] ?? item.type}
                    </span>
                    {item.isFeatured && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-white">⭐</span>
                    )}
                  </div>
                  <h3 className="font-bold uppercase text-slate-900 group-hover:text-[#1a7a3c] transition-colors line-clamp-2 leading-snug"
                    style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.88rem', letterSpacing: '0.02em' }}>
                    <Link href="/achievements">{item.title}</Link>
                  </h3>
                  <Link href="/achievements"
                    className="mt-1 text-sm font-semibold transition-colors"
                    style={{ color: '#1a7a3c' }}>
                    Read More
                  </Link>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
                No other achievements.
              </div>
            )}
          </div>
        </div>

        {/* See All button */}
        <div className="mt-5">
          <Link href="/achievements"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c' }}>
            See All Achievements
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
            <svg className="w-4 h-4 -ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
