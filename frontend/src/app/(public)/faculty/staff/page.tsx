import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Officers & Staff — GSTU CSE' };

interface Person { _id:string; name:string; title?:string; designation:string; email:string; photo?:string; shortBio?:string; officeRoom?:string; staffType:string; phone?:string; isActive:boolean; }

const MOCK: Person[] = [
  { _id:'1', name:'Md. Rafiqul Islam', title:'Mr.', designation:'Section Officer', email:'rafiq@gstu.edu.bd', staffType:'staff', isActive:true, officeRoom:'Room 101, Admin Block' },
  { _id:'2', name:'Nasrin Akter', title:'Ms.', designation:'Administrative Officer', email:'nasrin@gstu.edu.bd', staffType:'officer', isActive:true, officeRoom:'Room 102, Admin Block' },
  { _id:'3', name:'Md. Jahangir Alam', title:'Mr.', designation:'System Analyst', email:'jahangir@gstu.edu.bd', staffType:'officer', isActive:true, officeRoom:'Computer Lab, 2nd Floor' },
];

async function fetchStaff(): Promise<Person[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    // Fetch both staff and officers
    const [r1, r2] = await Promise.all([
      fetch(`${api}/faculty?staffType=staff`, { next: { revalidate: 3600 } }),
      fetch(`${api}/faculty?staffType=officer`, { next: { revalidate: 3600 } }),
    ]);
    const [d1, d2] = await Promise.all([
      r1.ok ? (r1.json() as Promise<{ data: Person[] }>) : Promise.resolve({ data: [] as Person[] }),
      r2.ok ? (r2.json() as Promise<{ data: Person[] }>) : Promise.resolve({ data: [] as Person[] }),
    ]);
    const combined = [...(d1.data ?? []), ...(d2.data ?? [])];
    return combined.length ? combined : MOCK;
  } catch { return MOCK; }
}

export default async function StaffPage() {
  const list = await fetchStaff();

  return (
    <>
      <SectionHero tag="Faculty & Staff" title="Officers & Staff"
        description="Administrative officers and staff members of the Department of CSE, GSTU."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Faculty & Staff',href:'/faculty'},{label:'Officers & Staff'}]}/>

      <div className="bg-white section-py">
        <div className="container-custom">
          {list.length === 0 ? (
            <p className="text-center text-slate-400 py-20">No staff records found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {list.map(m => (
                <div key={m._id} className="flex flex-col items-center text-center p-6 border border-slate-200 rounded-2xl hover:border-green-300 hover:shadow-md transition">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md mb-3"/>
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3"
                      style={{ background:'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-bold text-slate-900 text-sm">{m.title} {m.name}</p>
                  <p className="text-xs text-green-700 font-semibold mt-1">{m.designation}</p>
                  {m.officeRoom && <p className="text-xs text-slate-400 mt-1">{m.officeRoom}</p>}
                  <a href={`mailto:${m.email}`} className="text-xs text-slate-500 hover:text-green-700 transition mt-2 truncate max-w-full">{m.email}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
