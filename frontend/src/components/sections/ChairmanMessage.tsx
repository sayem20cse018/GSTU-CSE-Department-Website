'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ChairmanMessage() {
  const [photoError, setPhotoError] = useState(false);
  const [expanded, setExpanded]     = useState(false);

  return (
    <section className="section-py" style={{ background: 'linear-gradient(180deg,#f0faf4 0%,#ffffff 100%)' }}>
      <div className="container-custom">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <h2
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Chairman&apos;s Message
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
        </div>

        {/* Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* ── Left: Profile ─────────────────────────────────────────── */}
            <div className="lg:col-span-2 flex flex-col items-center text-center px-8 py-10 relative"
              style={{ background: 'linear-gradient(160deg,#0b3d1f 0%,#134e2a 60%,#0a2e1a 100%)' }}>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-2xl"
                style={{ background: '#4ade80' }} aria-hidden="true"/>
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                style={{ background: '#fbbf24' }} aria-hidden="true"/>

              {/* Photo */}
              <div className="relative mb-5">
                <div className="absolute -inset-1 rounded-2xl opacity-60 blur-sm"
                  style={{ background: 'linear-gradient(135deg,#fbbf24,#4ade80,#fbbf24)' }} aria-hidden="true"/>
                <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-4"
                  style={{ borderColor: '#fbbf24' }}>
                  {photoError ? (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-black"
                      style={{ background: 'linear-gradient(135deg,#166534,#052e16)', color: '#fbbf24' }}>
                      M
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/images/SIR.jpg"
                      alt="Dr. Mrinal Kanti Baowaly"
                      className="w-full h-full object-cover object-top"
                      onError={() => setPhotoError(true)}
                    />
                  )}
                </div>
              </div>

              {/* Name & title */}
              <h3 className="text-xl font-extrabold text-white leading-tight">Dr. Mrinal Kanti Baowaly</h3>
              <p className="text-sm font-bold mt-1.5" style={{ color: '#fbbf24' }}>Professor &amp; Chairman</p>
              <div className="w-10 h-px my-4 opacity-30" style={{ background: '#fbbf24' }} aria-hidden="true"/>

              <p className="text-xs leading-relaxed" style={{ color: 'rgba(187,247,208,0.8)' }}>
                Department of Computer Science and Engineering
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(187,247,208,0.65)' }}>
                Gopalganj Science and Technology University
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(187,247,208,0.5)' }}>
                Gopalganj-8105, Bangladesh
              </p>

              {/* Emails */}
              <div className="mt-5 space-y-1.5">
                {['baowaly@gmail.com','baowaly@gstu.edu.bd'].map(email => (
                  <a key={email} href={`mailto:${email}`}
                    className="flex items-center justify-center gap-1.5 text-xs transition-colors hover:text-white"
                    style={{ color: '#86efac' }}>
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    {email}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Right: Message ────────────────────────────────────────── */}
            <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-between">

              {/* Quote mark */}
              <div className="text-6xl font-black leading-none select-none mb-2" style={{ color: '#dcfce7' }}>&ldquo;</div>

              <div className="text-[0.9375rem] text-slate-600 leading-[1.8] space-y-3 flex-1">
                <p>
                  Welcome to the Department of Computer Science and Engineering at Gopalganj Science and
                  Technology University. It is my privilege to serve as the Chairman of this dynamic and
                  growing department, and I extend a warm welcome to all our students, faculty, and visitors.
                </p>
                {expanded && (
                  <>
                    <p>
                      Our department is deeply committed to providing high-quality education that combines
                      rigorous theoretical foundations with practical, hands-on experience. We have a team of
                      dedicated and experienced faculty members who are passionate about teaching, research,
                      and mentoring the next generation of computing professionals.
                    </p>
                    <p>
                      We offer comprehensive programs at the BSc, MSc, and PhD levels, equipped with
                      state-of-the-art laboratories and a curriculum that reflects the latest developments
                      in computing and technology. Our students are our greatest achievement, and we are
                      immensely proud of their successes in industry, academia, and research.
                    </p>
                    <p>
                      I invite prospective students, researchers, and industry partners to join our vibrant
                      academic community. Together, we will advance computing education and research for the
                      benefit of Bangladesh and the world.
                    </p>
                  </>
                )}
              </div>

              {/* Closing quote */}
              <div className="text-6xl font-black leading-none select-none text-right mt-2" style={{ color: '#dcfce7' }}>&rdquo;</div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6"
                style={{ borderTop: '1px solid #f0fdf4' }}>
                <div>
                  <p className="font-extrabold text-slate-900">Dr. Mrinal Kanti Baowaly</p>
                  <p className="text-sm font-semibold" style={{ color: '#166534' }}>Chairman, Dept. of CSE — GSTU</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpanded(v => !v)}
                    className="text-xs font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
                    {expanded ? 'Show Less' : 'Read Full Message'}
                  </button>
                  <Link href="/about/chairman"
                    className="text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all hover:bg-green-50"
                    style={{ borderColor: '#166534', color: '#166534' }}>
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
