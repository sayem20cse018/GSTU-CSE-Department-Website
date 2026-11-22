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
    return Array.isArray(d.data) ? d.data.slice(0, 6) : [];
  } catch { return []; }
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function AchievementCard({ item }: { item: Achievement }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.other;

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">

      {/* ── IMAGE — fixed height, full cover, no clip ── */}
      <Link href={`/achievements/${item.id}`} className="block relative overflow-hidden shrink-0" style={{ height: '200px' }}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#0b3d1f,#1a7a3c)' }}
          >
            <span className="text-6xl opacity-25" aria-hidden="true">{meta.icon}</span>
          </div>
        )}

        {/* gradient overlay — bottom only, doesn't cover the image */}
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }}
          aria-hidden="true"
        />

        {/* type badge — top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {item.isFeatured && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: '#fbbf24', color: '#1a1a1a' }}>
              ⭐ Featured
            </span>
          )}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: meta.bg, color: meta.color }}>
            {meta.icon} {meta.label}
          </span>
        </div>

        {/* date — bottom-left */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] font-semibold text-white/90">
            {formatShortDate(item.achievedAt ?? item.createdAt)}
          </span>
        </div>
      </Link>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-slate-900 group-hover:text-green-700 transition-colors leading-snug mb-1 text-[0.9rem] line-clamp-2">
          <Link href={`/achievements/${item.id}`}>{item.title}</Link>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
          {item.description}
        </p>

        {item.achieverName && (
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 truncate">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            {item.achieverName}
          </p>
        )}

        <Link
          href={`/achievements/${item.id}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:text-green-800"
          style={{ color: '#166534' }}
        >
          View Details
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
        <span className="text-3xl" aria-hidden="true">🏆</span>
      </div>
      <p className="text-slate-600 font-semibold mb-1">No achievements yet</p>
      <p className="text-sm text-slate-400">Achievements will appear here once published.</p>
    </div>
  );
}

export default async function AchievementsSection() {
  const raw = await fetchAchievements();

  const items = [...raw].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return new Date(b.achievedAt ?? b.createdAt).getTime() -
           new Date(a.achievedAt ?? a.createdAt).getTime();
  });

  return (
    <section className="py-10 bg-white" aria-labelledby="achievements-heading">
      <div className="container-custom">

        {/* header */}
        <div className="flex items-center gap-4 mb-8">
          <h2 id="achievements-heading"
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Recent Achievements
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true"/>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          /* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <AchievementCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/achievements"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: '#1a7a3c' }}>
            See All Achievements
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
