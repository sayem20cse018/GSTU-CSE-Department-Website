import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';

export const metadata: Metadata = { title: "Chairman's Message — GSTU CSE" };

export default async function ChairmanPage() {
  // SSOT: fetch from settings — same source as homepage ChairmanMessage section
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);

  const name    = s.chairmanName    || 'Dr. Mrinal Kanti Baowaly';
  const title   = s.chairmanTitle   || 'Professor & Chairman';
  const photo   = s.chairmanPhoto   || '';
  const email1  = s.chairmanEmail   || 'baowaly@gmail.com';
  const email2  = s.chairmanEmail2  || 'baowaly@gstu.edu.bd';
  const message = s.chairmanMessage || '';
  const univ    = s.universityShortName || 'GSTU';

  const paragraphs = message
    ? message.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
    : [
        `Welcome to the Department of Computer Science and Engineering at ${s.universityName}. It is my privilege and honour to lead this dynamic and talented academic community.`,
        `Our department has been committed since its establishment to providing high-quality education that bridges theoretical knowledge and practical application. We take immense pride in our faculty, who are not only accomplished educators but also active researchers contributing to the global body of knowledge.`,
        `The world of technology is evolving at an unprecedented pace, and we are committed to ensuring our curriculum, laboratories, and research programs remain at the cutting edge. Our students are our greatest achievement — their successes in industry and academia are a testament to the quality of education we provide.`,
        `I invite prospective students, collaborators, and well-wishers to be part of our journey. Together, we will continue to advance computing education and research for the benefit of Bangladesh and the world.`,
      ];

  const initials = name.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <SectionHero tag="About" title="Chairman's Message"
        description="A message from the Head of the Department of Computer Science and Engineering."
        breadcrumbs={[{ label:'Home', href:'/' }, { label:'About', href:'/about' }, { label:"Chairman's Message" }]}/>

      <div className="bg-white section-py">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

            {/* Photo + contact */}
            <div className="text-center">
              <div className="w-44 h-44 rounded-2xl mx-auto overflow-hidden shadow-lg mb-4"
                style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={name} className="w-full h-full object-cover object-top"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black">
                    {initials}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{name}</h3>
              <p className="text-sm font-semibold mt-1" style={{ color: '#166534' }}>{title}</p>
              <p className="text-xs text-slate-500 mt-1">Dept. of CSE, {univ}</p>
              <div className="mt-4 space-y-1.5">
                {[email1, email2].filter(Boolean).map(e => (
                  <a key={e} href={`mailto:${e}`}
                    className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-green-700 transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    {e}
                  </a>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">A Message from the Chairman</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="font-bold text-slate-900">{name}</p>
                <p className="text-sm text-slate-500 mt-0.5">{title}</p>
                <p className="text-sm text-slate-500">{s.universityName}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
