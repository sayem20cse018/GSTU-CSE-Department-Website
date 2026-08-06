import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Chairman List — GSTU CSE' };

interface Person { _id:string; name:string; title?:string; designation:string; email:string; photo?:string; shortBio?:string; staffType:string; isActive:boolean; sortOrder:number; joinedAt?:string; }

const MOCK: Person[] = [
  { _id:'1', name:'Dr. Mrinal Kanti Baowaly', title:'Dr.', designation:'Professor & Chairman', email:'baowaly@gstu.edu.bd', staffType:'chairman', isActive:true, sortOrder:1, shortBio:'Current Chairman of the Department of CSE, GSTU. PhD in Computer Science.' },
];

async function fetchChairmen(): Promise<Person[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/faculty?staffType=chairman`, { next: { revalidate: 3600 } });
    if (!r.ok) return MOCK;
    const d = await r.json() as { data: Person[] };
    return d.data?.length ? d.data : MOCK;
  } catch { return MOCK; }
}

export default async function ChairmenPage() {
  const list = await fetchChairmen();

  return (
    <>
      <SectionHero tag="Faculty & Staff" title="Chairman List"
        description="Current and former chairmen of the Department of Computer Science and Engineering, GSTU."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Faculty & Staff',href:'/faculty'},{label:'Chairman List'}]}/>

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">
          <div className="space-y-6">
            {list.map((c, i) => (
              <div key={c._id} className="flex flex-col sm:flex-row gap-6 p-6 border border-slate-200 rounded-2xl hover:border-green-300 hover:shadow-md transition">
                {/* Photo */}
                <div className="shrink-0">
                  {c.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photo} alt={c.name} className="w-28 h-28 rounded-2xl object-cover"/>
                  ) : (
                    <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                      style={{ background:'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                      {c.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Chairman {i === 0 ? '(Current)' : ''}</p>
                      <h2 className="text-xl font-bold text-slate-900">{c.title} {c.name}</h2>
                      <p className="text-sm text-slate-600 mt-0.5">{c.designation}</p>
                    </div>
                  </div>
                  {c.shortBio && <p className="text-sm text-slate-500 leading-relaxed mt-3">{c.shortBio}</p>}
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 text-xs text-green-700 font-semibold mt-3 hover:underline">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    {c.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
