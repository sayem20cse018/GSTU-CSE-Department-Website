import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { formatDate } from '@/lib/utils/format';

interface Achievement {
  _id: string; title: string; description: string; image?: string;
  type: string; achievedAt: string; achieverName?: string; awardedBy?: string; isFeatured: boolean;
}

const MOCK: Record<string, Achievement> = {
  '1':{ _id:'1', title:'1st Place — ACM ICPC Regional 2024', description:'A team of three undergraduate students from the Department of CSE — Rafi, Sadia, and Tanvir — secured first place at the ACM ICPC Regional Programming Contest held in Dhaka. The team solved 9 out of 12 problems within the 5-hour contest window, outperforming teams from top universities across Bangladesh. This achievement marks the first time GSTU CSE has won the regional title and qualifies the team for the ACM ICPC Asia Pacific Finals.', type:'competition', achievedAt:new Date().toISOString(), achieverName:'Team Epsilon — Rafi, Sadia, Tanvir', awardedBy:'ACM Bangladesh Chapter', isFeatured:true },
  '2':{ _id:'2', title:'Best Research Paper — IEEE International Conference 2024', description:'Dr. Mohammad Rahman received the Best Research Paper Award at the IEEE International Conference on Computer Science and Engineering held in Singapore. His paper titled "Federated Learning for Privacy-Preserving Medical Image Analysis" was selected from over 800 submissions and recognized for its novel contribution to the field of privacy-preserving machine learning.', type:'research', achievedAt:new Date(Date.now()-30*86400000).toISOString(), achieverName:'Dr. Mohammad Rahman', awardedBy:'IEEE Computer Society', isFeatured:true },
  '3':{ _id:'3', title:'National Innovation Award 2024', description:'The Department of Computer Science and Engineering at GSTU received the National Innovation Award for outstanding contributions to technology research and development in Bangladesh. The award was presented by the Ministry of Science and Technology at a ceremony in Dhaka.', type:'department', achievedAt:new Date(Date.now()-60*86400000).toISOString(), awardedBy:'Ministry of Science and Technology, Bangladesh', isFeatured:false },
  '4':{ _id:'4', title:'Google CodeJam Global Top 100', description:'CSE student Nasrin Akter ranked in the global top 100 of Google CodeJam, a prestigious worldwide programming competition. She was the only participant from Bangladesh in the top 100, representing GSTU CSE on an international platform.', type:'student', achievedAt:new Date(Date.now()-90*86400000).toISOString(), achieverName:'Nasrin Akter (4th Year, BSc)', awardedBy:'Google', isFeatured:false },
};

const TYPE_COLORS: Record<string,string> = {
  competition:'bg-amber-100 text-amber-700', research:'bg-blue-100 text-blue-700',
  department:'bg-violet-100 text-violet-700', student:'bg-emerald-100 text-emerald-700',
  faculty:'bg-rose-100 text-rose-700', other:'bg-slate-100 text-slate-600',
};

async function fetchById(id: string): Promise<Achievement | null> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/achievements/${id}`, { next: { revalidate: 1800 } });
    if (!r.ok) return MOCK[id] ?? null;
    const d = await r.json() as { data: Achievement };
    return d.data ?? MOCK[id] ?? null;
  } catch { return MOCK[id] ?? null; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = await fetchById(id);
  return { title: a ? `${a.title} — GSTU CSE` : 'Achievement — GSTU CSE' };
}

export default async function AchievementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await fetchById(id);
  if (!a) notFound();

  return (
    <>
      <SectionHero
        tag="Achievement"
        title={a.title}
        description={formatDate(a.achievedAt)}
        breadcrumbs={[{label:'Home',href:'/'},{label:'Achievements',href:'/achievements'},{label:'Detail'}]}
      />

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              {a.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.image} alt={a.title}
                  className="w-full h-64 object-cover rounded-2xl shadow-sm"/>
              ) : (
                <div className="h-48 bg-gradient-to-br from-green-700 to-emerald-900 rounded-2xl
                                flex items-center justify-center">
                  <span className="text-6xl opacity-25" aria-hidden="true">🏆</span>
                </div>
              )}

              {/* Description */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About this Achievement</h2>
                <p className="text-slate-600 leading-relaxed text-[0.9375rem]">{a.description}</p>
              </div>

              {/* Back */}
              <Link href="/achievements"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Achievements
              </Link>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="rounded-2xl text-white p-6"
                style={{ background: 'linear-gradient(160deg,#0b3d1f,#134e2a)' }}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: '#86efac' }}>Details</h3>
                {[
                  ['Date',      formatDate(a.achievedAt)],
                  ['Category',  a.type.charAt(0).toUpperCase() + a.type.slice(1)],
                  ...(a.achieverName ? [['Achieved by', a.achieverName]] : []),
                  ...(a.awardedBy   ? [['Awarded by',  a.awardedBy]]   : []),
                  ...(a.isFeatured  ? [['Status',      '⭐ Featured']]  : []),
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between gap-2 py-2.5 border-b border-white/10 last:border-0 text-sm">
                    <span className="text-green-200/70">{l}</span>
                    <span className="font-medium text-right break-words max-w-[55%]">{v}</span>
                  </div>
                ))}
              </div>

              {/* Type badge */}
              <div className="border border-slate-200 rounded-2xl p-5 text-center">
                <p className="text-xs text-slate-500 mb-2">Achievement Type</p>
                <span className={`text-sm font-bold px-4 py-2 rounded-xl capitalize ${TYPE_COLORS[a.type] ?? TYPE_COLORS.other}`}>
                  {a.type}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
