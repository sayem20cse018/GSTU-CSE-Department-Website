import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = { title: 'Faculty Members — GSTU CSE' };

interface Faculty {
  _id: string; name: string; title?: string; designation: string;
  email: string; phone?: string; photo?: string; shortBio?: string;
  researchInterests: string[]; officeRoom?: string; slug?: string;
  googleScholarUrl?: string; linkedinUrl?: string; isActive: boolean;
}

const DESIGNATION_ORDER = [
  'Professor','Associate Professor','Assistant Professor',
  'Senior Lecturer','Lecturer','Adjunct Faculty',
];
const BADGE: Record<string, string> = {
  'Professor':           'bg-blue-100 text-blue-700',
  'Associate Professor': 'bg-violet-100 text-violet-700',
  'Assistant Professor': 'bg-emerald-100 text-emerald-700',
  'Senior Lecturer':     'bg-teal-100 text-teal-700',
  'Lecturer':            'bg-amber-100 text-amber-700',
  'Adjunct Faculty':     'bg-slate-100 text-slate-600',
};
const AVATAR_COLORS = ['bg-blue-600','bg-violet-600','bg-emerald-600','bg-rose-600','bg-amber-600','bg-teal-600'];
const MOCK: Faculty[] = [
  {_id:'1',name:'Mohammad Rahman',title:'Dr.',designation:'Professor',email:'mrahman@gstu.edu.bd',researchInterests:['Machine Learning','Computer Vision'],isActive:true,slug:'dr-mohammad-rahman'},
  {_id:'2',name:'Fatima Khatun',title:'Dr.',designation:'Associate Professor',email:'fkhatun@gstu.edu.bd',researchInterests:['Cybersecurity','Networking'],isActive:true,slug:'dr-fatima-khatun'},
  {_id:'3',name:'Karim Hossain',title:'Dr.',designation:'Associate Professor',email:'khossain@gstu.edu.bd',researchInterests:['NLP','Deep Learning'],isActive:true,slug:'dr-karim-hossain'},
  {_id:'4',name:'Arif Ahmed',title:'Mr.',designation:'Assistant Professor',email:'aahmed@gstu.edu.bd',researchInterests:['IoT','Embedded Systems'],isActive:true,slug:'mr-arif-ahmed'},
  {_id:'5',name:'Nadia Islam',title:'Ms.',designation:'Assistant Professor',email:'nislam@gstu.edu.bd',researchInterests:['Software Engineering'],isActive:true,slug:'ms-nadia-islam'},
  {_id:'6',name:'Tanvir Hasan',title:'Mr.',designation:'Lecturer',email:'thasan@gstu.edu.bd',researchInterests:['Algorithms'],isActive:true,slug:'mr-tanvir-hasan'},
];

async function fetchFaculty(): Promise<Faculty[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/faculty`, { next: { revalidate: 3600 } });
    if (!r.ok) return MOCK;
    const d = await r.json() as { data: Faculty[] };
    return d.data?.length ? d.data : MOCK;
  } catch { return MOCK; }
}

export default async function FacultyPage() {
  const all = await fetchFaculty();
  // Group by designation order
  const groups: Record<string, Faculty[]> = {};
  for (const desig of DESIGNATION_ORDER) {
    const members = all.filter(f => f.designation === desig);
    if (members.length) groups[desig] = members;
  }

  return (
    <>
      <SectionHero tag="Our People" title="Faculty Members"
        description="Meet our team of experienced educators and researchers dedicated to excellence in computing education."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Faculty'}]}/>
      <main className="bg-white section-py">
        <div className="container-custom">
          {Object.entries(groups).map(([desig, members]) => (
            <div key={desig} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-slate-900">{desig}</h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{members.length}</span>
                <div className="flex-1 h-px bg-slate-200"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {members.map((f, idx) => (
                  <article key={f._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                    {/* Photo */}
                    <div className="h-36 relative bg-slate-100 overflow-hidden">
                      {f.photo
                        ? <img src={f.photo} alt={f.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"/>
                        : <div className={cn('w-full h-full flex items-center justify-center text-4xl font-bold text-white', AVATAR_COLORS[idx % AVATAR_COLORS.length])}>
                            {f.name.charAt(0)}
                          </div>}
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent"/>
                    </div>
                    <div className="p-4">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', BADGE[f.designation] ?? 'bg-slate-100 text-slate-600')}>
                        {f.designation}
                      </span>
                      <h3 className="mt-2 font-bold text-slate-900 group-hover:text-blue-700 transition leading-tight">
                        <Link href={`/faculty/${f.slug ?? f._id}`}>{f.title} {f.name}</Link>
                      </h3>
                      {f.shortBio && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{f.shortBio}</p>}
                      {f.researchInterests?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {f.researchInterests.slice(0,2).map(r => (
                            <span key={r} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{r}</span>
                          ))}
                        </div>
                      )}
                      <a href={`mailto:${f.email}`} className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition truncate">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span className="truncate">{f.email}</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
