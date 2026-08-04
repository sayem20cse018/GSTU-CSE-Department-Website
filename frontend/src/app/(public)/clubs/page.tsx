import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Student Clubs — GSTU CSE' };

interface Club {
  _id:string; name:string; slug:string; shortDescription:string; logo?:string;
  advisorName?:string; foundedYear:number; memberCount:number; isFeatured:boolean;
}
const MOCK: Club[] = [
  { _id:'1', name:'Programming Club',   slug:'programming-club',  shortDescription:'Competitive programming and problem-solving.',             foundedYear:2013, memberCount:120, isFeatured:true,  advisorName:'Dr. Mohammad Rahman' },
  { _id:'2', name:'Robotics Club',      slug:'robotics-club',     shortDescription:'Automation, robotics and embedded systems projects.',       foundedYear:2015, memberCount:85,  isFeatured:true,  advisorName:'Mr. Arif Ahmed' },
  { _id:'3', name:'AI Research Club',   slug:'ai-research-club',  shortDescription:'Research in AI, ML and data science.',                     foundedYear:2018, memberCount:70,  isFeatured:false, advisorName:'Dr. Karim Hossain' },
  { _id:'4', name:'Cyber Security Club',slug:'cybersecurity-club',shortDescription:'Ethical hacking and network security.',                    foundedYear:2019, memberCount:60,  isFeatured:false, advisorName:'Dr. Fatima Khatun' },
  { _id:'5', name:'App Dev Club',       slug:'app-dev-club',      shortDescription:'Mobile and web application development.',                  foundedYear:2020, memberCount:95,  isFeatured:false, advisorName:'Ms. Nadia Islam' },
  { _id:'6', name:'Open Source Club',   slug:'open-source-club',  shortDescription:'Contributing to open source and collaborative development.',foundedYear:2021, memberCount:50,  isFeatured:false, advisorName:'Mr. Tanvir Hasan' },
];
const ICONS = ['💻','🤖','🧠','🔐','📱','🌐'];
const GRADS = ['from-blue-600 to-indigo-700','from-violet-600 to-purple-700','from-emerald-600 to-teal-700','from-rose-600 to-pink-700','from-amber-600 to-orange-700','from-cyan-600 to-blue-700'];

async function fetchClubs(): Promise<Club[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/clubs`, { next:{revalidate:3600} });
    if (!r.ok) return MOCK;
    const d = await r.json() as { data: Club[] };
    return d.data?.length ? d.data : MOCK;
  } catch { return MOCK; }
}

export default async function ClubsPage() {
  const clubs = await fetchClubs();
  return (
    <>
      <SectionHero tag="Student Life" title="Department Clubs"
        description="Explore our vibrant student clubs and develop skills beyond the classroom."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Clubs'}]}/>
      <div className="bg-white section-py"><div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club,i)=>(
            <article key={club._id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className={`h-32 bg-gradient-to-br flex items-center justify-center ${GRADS[i%GRADS.length]}`}>
                <span className="text-5xl opacity-30" aria-hidden="true">{ICONS[i%ICONS.length]}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-green-700 transition">{club.name}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{club.shortDescription}</p>
                <div className="flex gap-4 text-xs text-slate-400 mb-4">
                  <span>👥 {club.memberCount}</span>
                  <span>📅 Est. {club.foundedYear}</span>
                </div>
                {club.advisorName && <p className="text-xs text-slate-400 mb-4">Advisor: <span className="font-medium text-slate-600">{club.advisorName}</span></p>}
                <Link href={`/clubs/${club.slug}`}
                  className="flex w-full items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{background:'linear-gradient(135deg,#0b3d1f,#166534)'}}>
                  View Club Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div></div>
    </>
  );
}
