import Link from 'next/link';

interface Achievement {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: string;
  achievedAt: string;
  createdAt: string;
  achieverName?: string;
  awardedBy?: string;
  isFeatured: boolean;
}

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  competition: { label: 'Competition', color: '#b45309', bg: '#fef3c7', icon: '🏆' },
  research:    { label: 'Research',    color: '#1d4ed8', bg: '#dbeafe', icon: '🔬' },
  department:  { label: 'Department',  color: '#065f46', bg: '#d1fae5', icon: '🏛️' },
  student:     { label: 'Student',     color: '#6d28d9', bg: '#ede9fe', icon: '🎓' },
  faculty:     { label: 'Faculty',     color: '#0891b2', bg: '#e0f2fe', icon: '👨‍🏫' },
  other:       { label: 'Achievement', color: '#475569', bg: '#f1f5f9', icon: '⭐' },
};

async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/achievements?limit=6&isPublished=true`, {
      next: { revalidate: 1800 },
    });
    if (!r.ok) return [];
    const d = await r.json() as { data?: Achievement[] };
    const arr = Array.isArray(d.data) ? d.data : [];
    return arr.slice(0, 6);
  } catch { return []; }
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AchievementCard({ item, featured = false }: { item: Achievement; featured?: boolean }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.other;
  const hasImage = !!item.image;

  if (featured) {
    return (
      <article className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
        {/* Geometric image frame */}
        <div className="relative overflow-hidden" style={{ height: '220px', background: 'linear-gradient(135deg,#0b3d1f,#1a7a3c,#166534)', clipPath: 'polygon(0 0, 100% 0, 100% 90%, 95% 100%, 0 100%)' }}>
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl opacity-20" aria-hidden="true">{meta.icon}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}
            aria-hidden="true"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.isFeatured && (
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{ background: '#fbbf24', color: '#1a1a1a' }}>
                ⭐ FEATURED
              </span>
            )}
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: meta.bg, color: meta.color }}
            >
              {meta.icon} {meta.label}
            </span>
          </div>
          {/* Date at bottom */}
          <div className="absolute bottom-3 left-3">
            <span
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            >
              📅 {formatShortDate(item.achievedAt ?? item.createdAt)}
            </span>
          </div>
          {/* Geometric corner accent */}
          <div
            className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(225deg, rgba(255,255,255,0.08) 50%, transparent 50%)' }}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <h3
            className="font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug mb-2"
            style={{ fontSize: '1rem' }}
          >
            <Link href={`/achievements/${item.id}`}>{item.title}</Link>
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
            {item.description}
          </p>
          {item.achieverName && (
            <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              {item.achieverName}
            </p>
          )}
          <div className="mt-auto pt-3 border-t border-slate-100">
            <Link
              href={`/achievements/${item.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-green-800"
              style={{ color: '#166534' }}
            >
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Compact horizontal card for the sidebar list
  return (
    <article className="group flex items-stretch gap-0 hover:bg-green-50 transition-colors border-b border-slate-100 last:border-0">
      {/* Accent strip / thumbnail */}
      <div
        className="shrink-0 w-[72px] relative overflow-hidden"
        style={{ background: hasImage ? undefined : 'linear-gradient(135deg,#0b3d1f,#1a7a3c)', minHeight: '80px', clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            aria-hidden="true"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl opacity-50" aria-hidden="true">{meta.icon}</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.label}
          </span>
          <span className="text-[9px] text-slate-400">{formatShortDate(item.achievedAt ?? item.createdAt)}</span>
        </div>
        <h3
          className="font-bold text-slate-900 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug"
          style={{ fontSize: '0.82rem' }}
        >
          <Link href={`/achievements/${item.id}`}>{item.title}</Link>
        </h3>
        {item.achieverName && (
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">👤 {item.achieverName}</p>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}
      >
        <span className="text-4xl" aria-hidden="true">🏆</span>
      </div>
      <p className="text-slate-600 font-semibold text-base mb-1">No achievements yet</p>
      <p className="text-sm text-slate-400">Achievements will appear here once published by the admin.</p>
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

  return (
    <section className="py-10 bg-white" aria-labelledby="achievements-heading">
      <div className="container-custom">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <h2
            id="achievements-heading"
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}
          >
            Recent Achievements
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured card — large, left column */}
            {items[0] && (
              <div className="lg:col-span-1">
                <AchievementCard item={items[0]} featured />
              </div>
            )}

            {/* Right column: up to 2 more featured cards on desktop, compact list fallback */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.slice(1, 3).map(item => (
                <AchievementCard key={item.id} item={item} featured />
              ))}
              {/* Compact list for items 4-6 if present */}
              {items.length > 3 && (
                <div className="sm:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {items.slice(3, 6).map(item => (
                    <AchievementCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-7">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c' }}
          >
            See All Achievements
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
