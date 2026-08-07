// SERVER COMPONENT — fetches settings at request time, no flicker, no stale data
import Link from 'next/link';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';
import HeaderSearch from './HeaderSearch';

export default async function SiteHeader() {
  // Fetch fresh from backend — revalidated every 60s, no client-side flicker
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);
  const deptCore = s.deptName.replace(/^Department\s+of\s*/i, '');

  return (
    <>
      {/* ═══════════════════════ DESKTOP (lg+) ════════════════════════ */}
      <header
        className="hidden lg:flex overflow-hidden w-full"
        style={{ height: '96px', background: '#fff' }}
      >
        {/* ── LEFT: white panel ─────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-5 px-6 shrink-0 bg-white group"
          style={{ minWidth: '460px' }}
          aria-label="Homepage"
        >
          {/* Logo */}
          <div className="shrink-0 rounded-full overflow-hidden border-2 bg-white shadow-md flex items-center justify-center"
            style={{ width: '70px', height: '70px', borderColor: '#1a7a3c' }}>
            {s.deptLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.deptLogo} alt={s.deptShortName} className="w-full h-full object-contain p-1"/>
            ) : (
              <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none">
                <circle cx="40" cy="40" r="38" fill="none" stroke="#1a7a3c" strokeWidth="1.2" strokeDasharray="2 3"/>
                <path d="M40 8 L16 20 L16 42 C16 58 28 68 40 72 C52 68 64 58 64 42 L64 20 Z" fill="#dc2626"/>
                <rect x="26" y="28" width="28" height="22" rx="2" fill="white" opacity="0.9"/>
                {[31,36,41,46].map(x => <g key={x}>
                  <line x1={x} y1="24" x2={x} y2="28" stroke="white" strokeWidth="2.2"/>
                  <line x1={x} y1="50" x2={x} y2="54" stroke="white" strokeWidth="2.2"/>
                </g>)}
                {[32,37,42].map(y => <g key={y}>
                  <line x1="22" y1={y} x2="26" y2={y} stroke="white" strokeWidth="2.2"/>
                  <line x1="54" y1={y} x2="58" y2={y} stroke="white" strokeWidth="2.2"/>
                </g>)}
                <text x="40" y="40" textAnchor="middle" dominantBaseline="middle"
                  fontSize="8" fontWeight="900" fill="#dc2626"
                  style={{ fontFamily:'Arial,sans-serif', letterSpacing:'0.5px' }}>CSE</text>
                <text x="40" y="62" textAnchor="middle" dominantBaseline="middle"
                  fontSize="5" fontWeight="bold" fill="white" opacity="0.85"
                  style={{ fontFamily:'Arial,sans-serif', letterSpacing:'1.5px' }}>GSTU</text>
              </svg>
            )}
          </div>

          {/* Text */}
          <div>
            <p style={{ fontFamily:'var(--font-montserrat),sans-serif', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#374151' }}>
              Department of
            </p>
            <p className="leading-tight transition-colors group-hover:opacity-80"
              style={{ fontFamily:'var(--font-montserrat),sans-serif', fontWeight:900, fontSize:'1.6rem', letterSpacing:'-0.01em', color:'#1a7a3c', textTransform:'uppercase' }}>
              {deptCore}
            </p>
            <p style={{ fontFamily:'var(--font-montserrat),sans-serif', fontWeight:600, fontSize:'0.65rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'#374151' }}>
              {s.universityName}
            </p>
          </div>
        </Link>

        {/* ── DIAGONAL STRIPES ── */}
        <div className="relative shrink-0 self-stretch" style={{ width:'64px', overflow:'hidden' }} aria-hidden="true">
          <div className="absolute inset-0 bg-white"/>
          <div className="absolute inset-0" style={{ background:'#1a7a3c', clipPath:'polygon(50% 0%, 100% 0%, 50% 100%, 0% 100%)' }}/>
          <div className="absolute inset-0 bg-white" style={{ clipPath:'polygon(72% 0%, 83% 0%, 33% 100%, 22% 100%)' }}/>
          <div className="absolute inset-0" style={{ background:'#1a7a3c', clipPath:'polygon(83% 0%, 100% 0%, 100% 100%, 50% 100%)' }}/>
        </div>

        {/* ── RIGHT: dark green ── */}
        <div className="relative flex-1 flex items-center justify-between pl-6 pr-8 overflow-hidden"
          style={{ background:'linear-gradient(110deg,#165c2a 0%,#1a7a3c 50%,#134d22 100%)' }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg className="absolute inset-0 w-full h-full opacity-[0.13]">
              <defs><pattern id="hdr-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" fill="white"/>
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#hdr-dots)"/>
            </svg>
          </div>

          <div className="relative flex items-center gap-0.5 ml-auto shrink-0">
            <Link href="/contact"
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/75 hover:text-white hover:bg-white/10">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contact
            </Link>
            <div className="w-px h-4 mx-0.5 bg-white/20"/>
            <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/75 hover:text-white hover:bg-white/10">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Moodle
            </a>
            <div className="w-px h-4 mx-0.5 bg-white/20"/>
            <HeaderSearch dark />
            <div className="w-px h-4 mx-0.5 bg-white/20"/>
            <Link href="/student/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white transition hover:bg-white/10"
              style={{ border:'1px solid rgba(255,255,255,0.35)' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Student Login
            </Link>
            <Link href="/admissions"
              className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1.5 px-4 py-1.5 rounded-lg text-green-900 transition hover:bg-green-50"
              style={{ background:'#ffffff', boxShadow:'0 2px 8px rgba(0,0,0,0.18)' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════ TABLET ═══════════════════════════════ */}
      <header className="hidden md:flex lg:hidden overflow-hidden" style={{ height:'68px', background:'#fff', borderBottom:'3px solid #1a7a3c' }}>
        <Link href="/" className="flex items-center gap-3 px-4 shrink-0">
          <div className="w-11 h-11 rounded-full border-2 overflow-hidden bg-white flex items-center justify-center shadow" style={{ borderColor:'#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                  <path d="M40 8 L16 20 L16 42 C16 58 28 68 40 72 C52 68 64 58 64 42 L64 20 Z" fill="#dc2626"/>
                  <text x="40" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="900" fill="white" style={{fontFamily:'Arial,sans-serif'}}>CSE</text>
                </svg>
            }
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500" style={{ fontFamily:'var(--font-montserrat)' }}>Dept. of</p>
            <p className="font-black leading-tight uppercase" style={{ fontFamily:'var(--font-montserrat)', fontSize:'0.9rem', color:'#1a7a3c' }}>{deptCore}</p>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider" style={{ fontFamily:'var(--font-montserrat)' }}>{s.universityShortName}</p>
          </div>
        </Link>
        <div className="flex-1 flex items-center justify-end px-4 gap-2" style={{ background:'linear-gradient(90deg,#165c2a,#1a7a3c)' }}>
          <HeaderSearch dark />
          <Link href="/contact" className="text-xs text-white/75 hover:text-white transition">Contact</Link>
          <span className="text-white/30">|</span>
          <a href={s.moodleUrl||'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer" className="text-xs text-white/75 hover:text-white transition">Moodle</a>
          <span className="text-white/30">|</span>
          <Link href="/student/login" className="text-xs font-semibold px-2.5 py-1 rounded text-white transition hover:bg-white/10" style={{ border:'1px solid rgba(255,255,255,0.35)' }}>Login</Link>
          <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded text-green-900 hover:bg-green-50 transition" style={{ background:'white' }}>Register</Link>
        </div>
      </header>

      {/* ═══════════════════════ MOBILE ═══════════════════════════════ */}
      <header className="flex md:hidden items-center justify-between px-4 bg-white" style={{ height:'60px', borderBottom:'3px solid #1a7a3c' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full border-2 overflow-hidden bg-white flex items-center justify-center shadow" style={{ borderColor:'#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain p-0.5"/>
              : <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none">
                  <path d="M40 8 L16 20 L16 42 C16 58 28 68 40 72 C52 68 64 58 64 42 L64 20 Z" fill="#dc2626"/>
                  <text x="40" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="900" fill="white" style={{fontFamily:'Arial,sans-serif'}}>CSE</text>
                </svg>
            }
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500" style={{ fontFamily:'var(--font-montserrat)' }}>Dept. of</p>
            <p className="font-black leading-tight uppercase text-sm" style={{ fontFamily:'var(--font-montserrat)', color:'#1a7a3c' }}>{deptCore}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1.5">
          <Link href="/student/login" className="text-[11px] font-semibold px-2.5 py-1.5 rounded border text-green-800" style={{ borderColor:'#1a7a3c' }}>Login</Link>
          <Link href="/admissions" className="text-[11px] font-extrabold px-2.5 py-1.5 rounded text-white" style={{ background:'#1a7a3c' }}>Register</Link>
        </div>
      </header>
    </>
  );
}
