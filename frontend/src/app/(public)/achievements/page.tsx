import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { formatDate } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'Achievements — GSTU CSE' };

interface Achievement {
  id: string; title: string; description: string; image?: string;
  type: string; achievedAt: string; achieverName?: string;
  awardedBy?: string; isFeatured: boolean;
}
const MOCK: Achievement[] = [
  { id:'1', title:'1st Place — ACM ICPC Regional 2024', description:'A team of three CSE students secured first place at the ACM ICPC Regional Programming Contest held in Dhaka.', type:'competition', achievedAt:new Date().toISOString(), achieverName:'Team Epsilon', awardedBy:'ACM Bangladesh', isFeatured:true },
  { id:'2', title:'Best Research Paper — IEEE 2024',    description:'Dr. Mohammad Rahman received the Best Research Paper Award at IEEE International Conference.', type:'research', achievedAt:new Date(Date.now()-30*86400000).toISOString(), achieverName:'Dr. Mohammad Rahman', awardedBy:'IEEE Bangladesh', isFeatured:true },
  { id:'3', title:'National Innovation Award 2024',      description:'The CSE Department received the National Innovation Award for outstanding technology research.', type:'department', achievedAt:new Date(Date.now()-60*86400000).toISOString(), awardedBy:'Ministry of Science and Technology', isFeatured:false },
  { id:'4', title:'Google CodeJam Top 100',             description:'CSE student ranked in the global top 100 of Google CodeJam programming competition.', type:'student', achievedAt:new Date(Date.now()-90*86400000).toISOString(), achieverName:'Nasrin Akter', awardedBy:'Google', isFeatured:false },
];
const TYPE_COLORS: Record<string,string> = { competition:'bg-amber-100 text-amber-700', research:'bg-blue-100 text-blue-700', department:'bg-violet-100 text-violet-700', student:'bg-emerald-100 text-emerald-700', faculty:'bg-rose-100 text-rose-700', other:'bg-slate-100 text-slate-600' };

async function fetchAll(): Promise<Achievement[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/achievements?limit=50`, { next:{revalidate:1800} });
    if (!r.ok) return MOCK;
    const d = await r.json() as { data: Achievement[] };
    return d.data?.length ? d.data : MOCK;
  } catch { return MOCK; }
}

export default async function AchievementsPage() {
  const items = await fetchAll();
  return (
    <>
      <SectionHero tag="Pride & Excellence" title="Achievements"
        description="Celebrating the outstanding accomplishments of our students, faculty and department."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Achievements'}]}/>
      <div className="bg-white section-py"><div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item=>(
            <article key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.title} className="w-full h-40 object-cover"/>
              ) : (
                <div className="h-40 bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center">
                  <span className="text-5xl opacity-30" aria-hidden="true">🏆</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md capitalize ${TYPE_COLORS[item.type]??TYPE_COLORS.other}`}>{item.type}</span>
                  <span className="text-xs text-slate-400">{formatDate(item.achievedAt)}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-3">{item.description}</p>
                {item.achieverName && <p className="text-xs text-slate-500">👤 {item.achieverName}</p>}
                {item.awardedBy    && <p className="text-xs text-slate-500">🏛️ {item.awardedBy}</p>}
              </div>
            </article>
          ))}
        </div>
      </div></div>
    </>
  );
}
