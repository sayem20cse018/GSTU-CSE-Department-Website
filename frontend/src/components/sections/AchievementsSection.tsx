import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';

interface Achievement {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: string;
  achievedAt: string;
  achieverName?: string;
  awardedBy?: string;
  isFeatured: boolean;
}

const MOCK: Achievement[] = [
  { id:'1', title:'1st Place — ACM ICPC Regional 2024', description:'A team of three CSE students secured first place at the ACM ICPC Regional Programming Contest held in Dhaka.', type:'competition', achievedAt:new Date().toISOString(), achieverName:'Team Epsilon — Rafi, Sadia, Tanvir', awardedBy:'ACM Bangladesh', isFeatured:true },
  { id:'2', title:'Best Research Paper Award — IEEE 2024', description:'Dr. Mohammad Rahman received the Best Research Paper Award at the IEEE International Conference on Computer Science and Engineering.', type:'research', achievedAt:new Date(Date.now()-30*86400000).toISOString(), achieverName:'Dr. Mohammad Rahman', awardedBy:'IEEE Bangladesh Section', isFeatured:true },
  { id:'3', title:'National Innovation Award 2024', description:'The CSE Department received the National Innovation Award for outstanding contributions to technology research and development.', type:'department', achievedAt:new Date(Date.now()-60*86400000).toISOString(), awardedBy:'Ministry of Science and Technology, Bangladesh', isFeatured:false },
  { id:'4', title:'Google CodeJam Top 100', description:'CSE student Nasrin Akter ranked in the global top 100 of Google CodeJam programming competition.', type:'student', achievedAt:new Date(Date.now()-90*86400000).toISOString(), achieverName:'Nasrin Akter', awardedBy:'Google', isFeatured:false },
];

const TYPE_COLORS: Record<string,{bg:string;text:string;dot:string}> = {
  competition: { bg:'bg-amber-50',   text:'text-amber-700',   dot:'bg-amber-500' },
  research:    { bg:'bg-blue-50',    text:'text-blue-700',    dot:'bg-blue-500' },
  department:  { bg:'bg-violet-50',  text:'text-violet-700',  dot:'bg-violet-500' },
  student:     { bg:'bg-emerald-50', text:'text-emerald-700', dot:'bg-emerald-500' },
  faculty:     { bg:'bg-rose-50',    text:'text-rose-700',    dot:'bg-rose-500' },
  other:       { bg:'bg-slate-100',  text:'text-slate-600',   dot:'bg-slate-400' },
};
const GRADIENTS = ['from-amber-500 to-orange-600','from-blue-600 to-indigo-700','from-violet-600 to-purple-700','from-emerald-600 to-teal-700'];

async function fetchAchievements(): Promise<Achievement[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/achievements?limit=4`, { next:{revalidate:1800} });
    if (!r.ok) return MOCK;
    const d = await r.json() as { data: Achievement[] };
    return d.data?.length ? d.data : MOCK;
  } catch { return MOCK; }
}

export default async function AchievementsSection() {
  const items = await fetchAchievements();

  return (
    <section className="section-py bg-white" aria-labelledby="achievements-heading">
      <div className="container-custom">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <h2 id="achievements-heading"
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Recent Achievements
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const style = TYPE_COLORS[item.type] ?? TYPE_COLORS.other;
            return (
              <article key={item.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden
                           hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                {/* Image / gradient top */}
                <div className={`h-40 relative bg-gradient-to-br overflow-hidden ${GRADIENTS[i % GRADIENTS.length]}`}>
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  ) : (
                    <div className="flex items-center justify-center h-full opacity-30" aria-hidden="true">
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                      </svg>
                    </div>
                  )}
                  {/* Type badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-slate-700 capitalize">
                    {item.type}
                  </span>
                  {item.isFeatured && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ background:'#fbbf24', color:'#1a1a1a' }}>
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-2">{formatDate(item.achievedAt)}</p>
                  <h3 className="font-bold text-slate-900 leading-snug mb-2 line-clamp-2
                                 group-hover:text-green-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">
                    {item.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-1 pt-3 border-t border-slate-100 text-xs text-slate-400">
                    {item.achieverName && (
                      <p>👤 <span className="font-medium text-slate-600">{item.achieverName}</span></p>
                    )}
                    {item.awardedBy && (
                      <p>🏛️ <span className="font-medium text-slate-600">{item.awardedBy}</span></p>
                    )}
                  </div>

                  <Link href={`/achievements/${item.id}`}
                    className="mt-4 flex items-center gap-1 text-xs font-semibold transition"
                    style={{ color:'#166534' }}>
                    View Details
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <Link href="/achievements"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition"
            style={{ background:'linear-gradient(135deg,#0b3d1f,#166534)', color:'#fff' }}>
            View All Achievements
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
