import Link from 'next/link';
import { SITE, STATS } from '@/constants';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0d1b2e]"
      aria-label="Hero"
    >
      {/* ── Background grid pattern ────────────────────────────────────── */}
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Gradient orbs ─────────────────────────────────────────────── */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-700/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />

      <div className="container-custom relative z-10 py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: text ────────────────────────────────────────────── */}
          <div>
            {/* University badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
              <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
                {SITE.university}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Department of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Computer Science
              </span>{' '}
              &amp; Engineering
            </h1>

            <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-lg">
              {SITE.tagline}. Cultivating the next generation of innovators,
              researchers, and technology leaders since {SITE.founded}.
            </p>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/academics"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/30"
              >
                Explore Programs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                Our Research
              </Link>
            </div>

            {/* Quick facts */}
            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { icon: '🎓', text: 'BSc · MSc · PhD' },
                { icon: '🔬', text: '12+ Research Groups' },
                { icon: '🏆', text: 'National Award Winners' },
              ].map((fact) => (
                <span
                  key={fact.text}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
                >
                  <span aria-hidden="true">{fact.icon}</span>
                  {fact.text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: stats card ─────────────────────────────────────── */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Mini nav */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                Department at a Glance
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-slate-500 mb-3">Latest highlight</p>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 animate-pulse" aria-hidden="true" />
                  <p className="text-sm text-slate-300 leading-snug">
                    CSE students won 1st place at the National Programming Contest 2024.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/admissions"
                className="mt-5 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition"
              >
                Apply for Admission
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Scroll indicator ──────────────────────────────────────────── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 text-xs">
          <span>Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
