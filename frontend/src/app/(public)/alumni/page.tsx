import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Alumni — GSTU CSE' };

const NOTABLE = [
  { name:'Md. Rafiqul Islam',   batch:'2015', role:'Software Engineer, Google',    country:'USA' },
  { name:'Fatema Begum',        batch:'2016', role:'ML Research Scientist, Meta',   country:'Canada' },
  { name:'Tanvir Ahmed',        batch:'2014', role:'Co-founder & CTO, TechBD',      country:'Bangladesh' },
  { name:'Sabrina Khatun',      batch:'2017', role:'Data Scientist, Samsung R&D',   country:'South Korea' },
  { name:'Md. Shahriar Hossain',batch:'2013', role:'Professor, BUET',              country:'Bangladesh' },
  { name:'Nusrat Jahan',        batch:'2018', role:'PhD Researcher, NUS',          country:'Singapore' },
];

export default function AlumniPage() {
  return (
    <>
      <SectionHero tag="Alumni" title="Our Alumni"
        description="Proud graduates of GSTU CSE making their mark across the globe."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Alumni'}]}/>

      <div className="bg-white section-py"><div className="container-custom">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[['500+','Graduates'],['30+','Countries'],['50+','Companies'],['10+','Batches']].map(([v,l]) => (
            <div key={l} className="text-center bg-[#0b3d1f] text-white rounded-xl py-6 px-4">
              <p className="text-3xl font-extrabold">{v}</p>
              <p className="text-xs mt-1" style={{color:'#86efac'}}>{l}</p>
            </div>
          ))}
        </div>

        {/* Notable alumni */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" id="distinguished">Distinguished Alumni</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NOTABLE.map(a => (
              <div key={a.name} className="border border-slate-200 rounded-2xl p-5 hover:border-green-300 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-700 to-green-900
                                flex items-center justify-center text-white font-bold text-lg mb-3">
                  {a.name.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-900">{a.name}</h3>
                <p className="text-sm text-green-700 font-medium mt-0.5">{a.role}</p>
                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                  <span>Batch {a.batch}</span><span>·</span><span>{a.country}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Register CTA */}
        <section id="stories" className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Are You a GSTU CSE Alumni?</h2>
          <p className="text-slate-500 mb-6">Join the alumni network and stay connected with your alma mater.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/alumni/register"
              className="px-6 py-3 text-sm font-bold text-white rounded-xl transition"
              style={{background:'linear-gradient(135deg,#0b3d1f,#166534)'}}>
              Register as Alumni
            </Link>
            <Link href="/contact"
              className="px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:border-green-400 rounded-xl transition">
              Contact Alumni Office
            </Link>
          </div>
        </section>
      </div></div>
    </>
  );
}
