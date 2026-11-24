import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';

export const metadata: Metadata = {
  title: 'Administration — GSTU CSE',
  description: 'Administrative structure and coordinators of the Department of CSE, GSTU.',
};

export default async function AdministrationPage() {
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);

  const chairman   = s.chairmanName  || 'Dr. Mrinal Kanti Baowaly';
  const chairTitle = s.chairmanTitle || 'Professor & Chairman';
  const email      = s.email         || 'cse@gstu.edu.bd';
  const phone      = s.phone         || '+880-01739515598';
  const address    = s.address       || 'CSE Building, GSTU Campus, Gopalganj-8100';
  const univ       = s.universityName || 'Gopalganj Science & Technology University';

  return (
    <>
      <SectionHero
        tag="About"
        title="Administration"
        description="Administrative structure and key roles in the Department of Computer Science and Engineering."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Administration' },
        ]}
      />

      <div className="bg-white section-py">
        <div className="container-custom max-w-5xl space-y-14">

          {/* ── Head of Department ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-green-700 shrink-0" />
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Head of Department</h2>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5 hover:border-green-300 hover:shadow-md transition">
              <div className="w-14 h-14 rounded-xl bg-green-700 flex items-center justify-center text-2xl shrink-0">🏛️</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{chairman}</h3>
                <p className="text-sm font-semibold text-green-700 mt-0.5">{chairTitle}</p>
                <p className="text-xs text-slate-500 mt-1">Dept. of CSE, {univ}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <a href={`mailto:${s.chairmanEmail || email}`}
                    className="text-xs text-slate-500 hover:text-green-700 transition flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    {s.chairmanEmail || email}
                  </a>
                </div>
              </div>
              <div className="sm:ml-auto">
                <Link href="/about/chairman"
                  className="text-xs font-semibold text-green-700 hover:text-green-900 border border-green-200 hover:border-green-400 px-3 py-1.5 rounded-lg transition">
                  View Message →
                </Link>
              </div>
            </div>
          </section>

          {/* ── Coordinators ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-green-700 shrink-0" />
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Academic Coordinators</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { role: 'Undergraduate Coordinator',  desc: 'Oversees BSc program curriculum, advising and examinations.' },
                { role: 'Graduate Coordinator',        desc: 'Manages MSc, MPhil and PhD programs and research supervision.' },
                { role: 'Research Coordinator',        desc: 'Coordinates research activities, grants and publications.' },
                { role: 'Examination Coordinator',     desc: 'Manages examination schedules, results and appeals.' },
                { role: 'Lab Coordinator',             desc: 'Oversees all computer and research laboratory operations.' },
                { role: 'Admission Coordinator',       desc: 'Handles new student admission, verification and orientation.' },
              ].map(({ role, desc }) => (
                <div key={role} className="border border-slate-200 rounded-xl p-4 hover:border-green-200 transition">
                  <p className="font-semibold text-slate-900 text-sm">{role}</p>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                  <p className="text-xs text-slate-400 mt-2 italic">Contact the department office for the current coordinator.</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Contact ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-green-700 shrink-0" />
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Department Office</h2>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon:'✉️', label:'Email', value: email, href:`mailto:${email}` },
                { icon:'📞', label:'Phone', value: phone, href:`tel:${phone}` },
                { icon:'📍', label:'Address', value: address, href: '/contact' },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="text-center">
                  <span className="text-3xl block mb-2" aria-hidden="true">{icon}</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                  <a href={href} className="text-sm text-slate-700 hover:text-green-700 transition font-medium break-all">{value}</a>
                </div>
              ))}
            </div>
          </section>

          {/* ── Committees note ── */}
          <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Department Committees</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The department operates several standing committees including the Academic Committee,
              Research Committee, Curriculum Review Committee, and Student Affairs Committee.
              Committee compositions are updated each academic year. For current committee membership
              and schedules, please contact the department office at{' '}
              <a href={`mailto:${email}`} className="text-green-700 hover:underline">{email}</a>.
            </p>
          </section>

        </div>
      </div>
    </>
  );
}
