import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { cn } from '@/lib/utils/cn';
import type { Laboratory } from '@/lib/api/academics';

export const metadata: Metadata = { title: 'Laboratories — GSTU CSE Academics' };

const FALLBACK_LABS: Laboratory[] = [
  { id:'1', name:'Artificial Intelligence Lab', slug:'ai-lab', description:'State-of-the-art lab equipped with high-performance GPU workstations for deep learning and AI research projects.', shortDescription:'High-performance GPU workstations for AI/ML research.', location:'Room 302, CSE Building', capacity:30, workstations:15, inCharge:'Dr. Mohammad Rahman', inChargeEmail:'mrahman@gstu.edu.bd', labType:'research', equipment:[{name:'GPU Workstation',quantity:15,specification:'NVIDIA RTX 3090'}], softwareInstalled:['Python','TensorFlow','PyTorch','CUDA'], facilities:['24/7 Access','AC','High-speed Internet','UPS'], images:[], isActive:true, isFeatured:true },
  { id:'2', name:'Computer Networks Lab',       slug:'networks-lab', description:'Fully equipped Cisco lab with routers, switches and firewalls for hands-on networking experiments and research.', shortDescription:'Cisco-certified networking lab with routers and switches.', location:'Room 201, CSE Building', capacity:40, workstations:20, inCharge:'Dr. Fatima Khatun', inChargeEmail:'fkhatun@gstu.edu.bd', labType:'teaching', equipment:[{name:'Cisco Router',quantity:10},{name:'Managed Switch',quantity:10}], softwareInstalled:['Cisco IOS','Packet Tracer','Wireshark'], facilities:['AC','Projector','UPS'], images:[], isActive:true, isFeatured:false },
  { id:'3', name:'Software Engineering Lab',    slug:'se-lab', description:'Modern software development lab with individual workstations for programming, database and software engineering courses.', shortDescription:'Modern development workstations for programming courses.', location:'Room 105, CSE Building', capacity:50, workstations:25, inCharge:'Ms. Nadia Islam', inChargeEmail:'nislam@gstu.edu.bd', labType:'teaching', equipment:[{name:'PC Workstation',quantity:25}], softwareInstalled:['Visual Studio Code','IntelliJ','MySQL','Git'], facilities:['AC','Projector','High-speed Internet'], images:[], isActive:true, isFeatured:false },
  { id:'4', name:'Cybersecurity Lab',           slug:'cybersecurity-lab', description:'Isolated lab environment for ethical hacking, penetration testing, and cybersecurity research experiments.', shortDescription:'Isolated environment for ethical hacking and security research.', location:'Room 401, CSE Building', capacity:20, workstations:10, inCharge:'Dr. Fatima Khatun', inChargeEmail:'fkhatun@gstu.edu.bd', labType:'research', equipment:[{name:'Workstation',quantity:10}], softwareInstalled:['Kali Linux','Metasploit','Wireshark','Nmap'], facilities:['24/7 Access','AC','Isolated Network'], images:[], isActive:true, isFeatured:false },
];

const LAB_TYPE_COLORS: Record<string,string> = {
  teaching:'bg-blue-100 text-blue-700',
  research:'bg-violet-100 text-violet-700',
  both:'bg-emerald-100 text-emerald-700',
};

async function fetchLabs(): Promise<Laboratory[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/academics/labs`, { next: { revalidate: 3600 } });
    if (!res.ok) return FALLBACK_LABS;
    const d = await res.json() as { data: Laboratory[] };
    return d.data?.length ? d.data : FALLBACK_LABS;
  } catch { return FALLBACK_LABS; }
}

export default async function LabsPage() {
  const labs = await fetchLabs();
  const featured  = labs.filter(l => l.isFeatured);
  const remaining = labs.filter(l => !l.isFeatured);

  return (
    <>
      <SectionHero tag="Facilities" title="Laboratories"
        description="World-class labs supporting teaching, learning and cutting-edge research."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Academics',href:'/academics'},{label:'Labs'}]}/>

      <main className="bg-white section-py">
        <div className="container-custom">
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { value: labs.length, label: 'Labs' },
              { value: labs.reduce((a,l) => a + (l.workstations??0), 0), label: 'Workstations' },
              { value: labs.reduce((a,l) => a + (l.capacity??0), 0),    label: 'Student Capacity' },
            ].map(s=>(
              <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-slate-900">{s.value}+</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>))}
          </div>

          {/* Featured lab */}
          {featured.map(lab => (
            <article key={lab.id} className="mb-10 bg-[#0d1b2e] text-white rounded-2xl overflow-hidden border border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image placeholder */}
                <div className="h-64 lg:h-auto bg-gradient-to-br from-blue-600/30 to-violet-600/20 flex items-center justify-center">
                  {lab.images[0]?.url
                    ? <img src={lab.images[0].url} alt={lab.name} className="w-full h-full object-cover"/>
                    : <span className="text-5xl" aria-hidden="true">🔬</span>}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold bg-blue-600/30 text-blue-300 border border-blue-600/30 px-2 py-1 rounded-lg">Featured Lab</span>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', LAB_TYPE_COLORS[lab.labType]??'bg-slate-100 text-slate-600')}>{lab.labType}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{lab.name}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{lab.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[['Location',lab.location],['Capacity',`${lab.capacity??0} students`],['Workstations',String(lab.workstations??0)],['In-Charge',lab.inCharge??'—']].map(([l,v])=>(
                      <div key={l}><p className="text-[10px] text-slate-500 uppercase tracking-wider">{l}</p>
                      <p className="text-sm font-medium">{v}</p></div>))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lab.facilities.slice(0,4).map(f=>(
                      <span key={f} className="text-xs bg-white/10 border border-white/10 px-3 py-1 rounded-full">{f}</span>))}
                  </div>
                </div>
              </div>
            </article>))}

          {/* All labs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...remaining, ...(featured.length?[]:[])].map(lab => (
              <article key={lab.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md transition group">
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                  {lab.images[0]?.url
                    ? <img src={lab.images[0].url} alt={lab.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                    : <span className="text-4xl" aria-hidden="true">🔬</span>}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', LAB_TYPE_COLORS[lab.labType]??'bg-slate-100 text-slate-600')}>{lab.labType}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition mb-2">{lab.name}</h3>
                  <p className="text-sm text-slate-500 leading-snug mb-3 line-clamp-2">{lab.shortDescription ?? lab.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>📍 {lab.location}</span>
                    <span>🖥️ {lab.workstations??0} stations</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {lab.softwareInstalled.slice(0,3).map(s=>(
                      <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>))}
                  </div>
                  <Link href={`/academics/labs/${lab.slug}`}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </article>))}
          </div>
        </div>
      </main>
    </>
  );
}
