// SERVER COMPONENT — fresh data every render, no stale logo/name
import Link from 'next/link';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';
import HeaderSearch from './HeaderSearch';

export default async function SiteHeader() {
  const s        = await fetchSettings().catch(() => SETTINGS_FALLBACK);
  const deptCore = s.deptName.replace(/^Department\s+of\s*/i, '');

  return (
    <>
      {/* ═══════════════════════ DESKTOP (lg+) ════════════════════════ */}
      <header className="hidden lg:flex w-full overflow-hidden" style={{ height: '88px', background: '#fff', boxShadow: '0 1px 0 rgba(0,0,0,0.07)' }}>

        {/* ── LEFT: white, logo + identity ─────────────────────────── */}
        <Link href="/" className="flex items-center gap-5 px-8 shrink-0 bg-white group" style={{ minWidth: '440px' }} aria-label="Homepage">
          {/* Logo */}
          <div className="relative shrink-0" style={{ width: '68px', height: '68px' }}>
            {s.deptLogo ? (
              /* Uploaded logo — show as-is, no forced round crop */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.deptLogo}
                alt={s.deptShortName}
                className="w-full h-full object-contain"
                style={{ maxWidth: '68px', maxHeight: '68px' }}
              />
            ) : (
              /* SVG fallback — round green circle */
              <>
                <div className="absolute inset-0 rounded-full opacity-20 blur-md" style={{ background: '#1a7a3c' }} aria-hidden="true"/>
                <div className="relative w-full h-full rounded-full overflow-hidden border-[2.5px] bg-white flex items-center justify-center shadow-md" style={{ borderColor: '#1a7a3c' }}>
                  <svg viewBox="0 0 80 80" className="w-11 h-11" fill="none">
                    <path d="M40 8 L16 20 L16 42 C16 58 28 68 40 72 C52 68 64 58 64 42 L64 20 Z" fill="#dc2626"/>
                    <rect x="26" y="27" width="28" height="22" rx="2" fill="white" opacity="0.9"/>
                    {[31,36,41,46].map(x => <g key={x}>
                      <line x1={x} y1="23" x2={x} y2="27" stroke="white" strokeWidth="2.2"/>
                      <line x1={x} y1="49" x2={x} y2="53" stroke="white" strokeWidth="2.2"/>
                    </g>)}
                    {[31,36,41].map(y => <g key={y}>
                      <line x1="22" y1={y} x2="26" y2={y} stroke="white" strokeWidth="2.2"/>
                      <line x1="54" y1={y} x2="58" y2={y} stroke="white" strokeWidth="2.2"/>
                    </g>)}
                    <text x="40" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="900" fill="#dc2626" style={{fontFamily:'Arial,sans-serif',letterSpacing:'0.5px'}}>CSE</text>
                    <text x="40" y="61" textAnchor="middle" dominantBaseline="middle" fontSize="5" fontWeight="bold" fill="white" opacity="0.85" style={{fontFamily:'Arial,sans-serif',letterSpacing:'1.5px'}}>GSTU</text>
                  </svg>
                </div>
              </>
            )}
          </div>

          {/* Text */}
          <div>
            <p className="leading-none mb-1" style={{ fontFamily:'var(--font-montserrat)', fontWeight:800, fontSize:'0.62rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'#111827' }}>
              {s.showDeptPrefix !== false ? 'Department of' : ''}
            </p>
            <p className="leading-tight group-hover:opacity-80 transition-opacity" style={{ fontFamily:'var(--font-montserrat)', fontWeight:900, fontSize:'1.55rem', letterSpacing:'-0.01em', color: s.headerAccentColor || '#1a7a3c', textTransform:'uppercase' }}>
              {deptCore}
            </p>
            <p className="mt-1" style={{ fontFamily:'var(--font-montserrat)', fontWeight:700, fontSize:'0.6rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'#111827' }}>
              {s.universityName}
            </p>
          </div>
        </Link>

        {/* ── DIAGONAL STRIPES ────────────────────────────────────────── */}
        <div className="relative shrink-0 self-stretch" style={{ width: '60px', overflow: 'hidden' }} aria-hidden="true">
          <div className="absolute inset-0 bg-white"/>
          {/* Main diagonal */}
          <div className="absolute inset-0" style={{ background: '#1a7a3c', clipPath: 'polygon(45% 0%, 100% 0%, 55% 100%, 0% 100%)' }}/>
          {/* White accent gap */}
          <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(68% 0%, 77% 0%, 32% 100%, 23% 100%)' }}/>
          {/* Thin second stripe */}
          <div className="absolute inset-0" style={{ background: '#1a7a3c', clipPath: 'polygon(79% 0%, 100% 0%, 100% 100%, 55% 100%)' }}/>
        </div>

        {/* ── RIGHT: dark green ────────────────────────────────────────── */}
        <div className="relative flex-1 flex items-center justify-between pl-5 pr-8 overflow-hidden"
          style={{ background: 'linear-gradient(115deg, #0f4a20 0%, #1a7a3c 55%, #124d26 100%)' }}>

          {/* Dot pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.1] pointer-events-none" aria-hidden="true">
            <defs><pattern id="hdr-p" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="white"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#hdr-p)"/>
          </svg>

          {/* Building silhouette */}
          <div className="absolute left-3 top-0 bottom-0 flex items-end pointer-events-none opacity-[0.10]" aria-hidden="true">
            <svg viewBox="0 0 420 88" className="h-full w-auto" fill="white">
              <rect x="0"   y="55" width="50" height="33"/>
              <rect x="55"  y="35" width="70" height="53"/>
              <rect x="130" y="45" width="50" height="43"/>
              <rect x="185" y="22" width="85" height="66"/>
              <rect x="275" y="40" width="55" height="48"/>
              <rect x="335" y="52" width="45" height="36"/>
              {[8,20,32].map(x => [60,72].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="7" height="6" fill="#0f4a20"/>))}
              {[63,76,89,102,116].map(x => [41,53,65,77].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="9" height="7" fill="#0f4a20"/>))}
              {[193,208,224,241,256,270].map(x => [28,42,56,70].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="11" height="8" fill="#0f4a20"/>))}
            </svg>
          </div>

          {/* Utility links */}
          <div className="relative flex items-center gap-0.5 ml-auto shrink-0">
            <Link href="/contact" className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/75 hover:text-white hover:bg-white/10">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Contact
            </Link>
            <div className="w-px h-4 mx-0.5 bg-white/20"/>
            <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition text-white/75 hover:text-white hover:bg-white/10">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Moodle
            </a>
            <div className="w-px h-4 mx-0.5 bg-white/20"/>
            <HeaderSearch dark />
            <div className="w-px h-4 mx-0.5 bg-white/20"/>
            <Link href="/student/login"
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg text-white transition hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.35)' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Student Login
            </Link>
            <Link href="/admissions"
              className="flex items-center gap-1.5 text-[11px] font-extrabold ml-1.5 px-4 py-1.5 rounded-lg text-green-900 transition hover:opacity-90"
              style={{ background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════ TABLET (md–lg) ═══════════════════════ */}
      <header className="hidden md:flex lg:hidden overflow-hidden" style={{ height: '68px', background: '#fff', borderBottom: '3px solid #1a7a3c' }}>
        <Link href="/" className="flex items-center gap-3 px-4 shrink-0">
          <div className="w-11 h-11 rounded-full border-[2px] overflow-hidden bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt="" className="w-full h-full object-contain"/>
              : <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                  <path d="M40 8 L16 20 L16 42 C16 58 28 68 40 72 C52 68 64 58 64 42 L64 20 Z" fill="#dc2626"/>
                  <text x="40" y="44" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="900" fill="white" style={{fontFamily:'Arial,sans-serif'}}>CSE</text>
                </svg>
            }
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: 'var(--font-montserrat)' }}>Dept. of</p>
            <p className="font-black leading-tight uppercase text-sm" style={{ fontFamily: 'var(--font-montserrat)', color: '#1a7a3c' }}>{deptCore}</p>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-montserrat)' }}>{s.universityShortName}</p>
          </div>
        </Link>
        <div className="flex-1 flex items-center justify-end px-4 gap-2" style={{ background: 'linear-gradient(90deg, #0f4a20, #1a7a3c)' }}>
          <HeaderSearch dark />
          <Link href="/contact" className="text-xs text-white/75 hover:text-white transition">Contact</Link>
          <span className="text-white/30">|</span>
          <a href={s.moodleUrl || 'https://moodle.gstu.edu.bd'} target="_blank" rel="noopener noreferrer" className="text-xs text-white/75 hover:text-white transition">Moodle</a>
          <span className="text-white/30">|</span>
          <Link href="/student/login" className="text-xs font-semibold px-2.5 py-1 rounded text-white transition hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.35)' }}>Login</Link>
          <Link href="/admissions" className="text-xs font-extrabold px-2.5 py-1 rounded text-green-900 hover:opacity-90 transition" style={{ background: 'white' }}>Register</Link>
        </div>
      </header>

      {/* ═══════════════════════ MOBILE ═══════════════════════════════ */}
      <header className="flex md:hidden items-center justify-between px-4 bg-white" style={{ height: '64px', borderBottom: '3px solid #1a7a3c' }}>
        <Link href="/" className="flex items-center gap-3">
          {/* Bigger logo on mobile */}
          <div className="w-12 h-12 rounded-full border-[2.5px] overflow-hidden bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#1a7a3c' }}>
            {s.deptLogo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={s.deptLogo} alt={s.deptShortName} className="w-full h-full object-contain"/>
              : <svg viewBox="0 0 80 80" className="w-9 h-9" fill="none">
                  <path d="M40 8 L16 20 L16 42 C16 58 28 68 40 72 C52 68 64 58 64 42 L64 20 Z" fill="#dc2626"/>
                  <text x="40" y="40" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="900" fill="white" style={{fontFamily:'Arial,sans-serif'}}>CSE</text>
                  <text x="40" y="57" textAnchor="middle" dominantBaseline="middle" fontSize="5" fill="white" opacity="0.8" style={{fontFamily:'Arial,sans-serif',letterSpacing:'1px'}}>GSTU</text>
                </svg>
            }
          </div>
          {/* Dept name only — clean, no duplicate label */}
          <div>
            <p className="font-black leading-tight uppercase text-sm" style={{ fontFamily: 'var(--font-montserrat)', color: '#1a7a3c' }}>
              {deptCore}
            </p>
            <p className="text-[9px] text-slate-400 leading-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {s.universityShortName}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/student/login" className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border text-green-800" style={{ borderColor: '#1a7a3c' }}>Login</Link>
          <Link href="/admissions" className="text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg text-white" style={{ background: '#1a7a3c' }}>Register</Link>
        </div>
      </header>
    </>
  );
}
