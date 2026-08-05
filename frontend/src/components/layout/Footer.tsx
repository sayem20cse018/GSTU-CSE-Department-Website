import Link from 'next/link';
import { SITE } from '@/constants';

const ABOUT_LINKS = [
  { label: 'Vision & Mission',    href: '/about/vision' },
  { label: 'History',             href: '/about/history' },
  { label: 'Awards',              href: '/about#awards' },
  { label: 'About Department',    href: '/about' },
  { label: 'Contact Us',          href: '/contact' },
];

const ACADEMIC_LINKS = [
  { label: 'Academic Calendar',      href: '/academics/resources?type=calendar' },
  { label: 'Class Routine',          href: '/academics/resources?type=routine' },
  { label: 'Undergraduate Studies',  href: '/academics/bsc' },
  { label: 'Graduate Studies',       href: '/academics/msc' },
  { label: 'Syllabus',               href: '/academics/resources?type=guideline' },
];

const RESEARCH_LINKS = [
  { label: 'Research Areas',  href: '/research' },
  { label: 'Faculty',         href: '/faculty' },
  { label: 'Publications',    href: '/research/publications' },
  { label: 'Year Book',       href: '/research/yearbook' },
];

const ADMISSION_LINKS = [
  { label: 'Undergraduate',     href: '/admissions/undergraduate' },
  { label: 'Postgraduate',      href: '/admissions/graduate' },
  { label: 'Admission Notice',  href: '/notices?cat=admission' },
  { label: 'Tuition & Fees',    href: '/admissions#fees' },
];

export default function Footer() {
  return (
    <footer aria-label="Site footer">

      {/* ── MAIN FOOTER ───────────────────────────────────────────────── */}
      <div style={{ background: '#f8f9fa', borderTop: '4px solid #1a7a3c' }}>
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

            {/* ── Column 1: Dept info + contact + social ─────────────── */}
            <div className="lg:col-span-1">

              {/* Dept name */}
              <p
                className="font-extrabold text-slate-900 leading-snug mb-1"
                style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.88rem' }}
              >
                Computer Science and Engineering
              </p>

              {/* University */}
              <p
                className="text-slate-600 mb-4"
                style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 500, fontSize: '0.75rem' }}
              >
                {SITE.university}
              </p>

              {/* Address */}
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {SITE.address}
              </p>

              {/* Phone */}
              <p className="text-xs text-slate-600 mb-1">
                <span className="font-semibold">Telephone:</span>{' '}
                <a href={`tel:${SITE.phone}`} className="hover:text-green-700 transition">
                  {SITE.phone}
                </a>
              </p>

              {/* Email */}
              <p className="text-xs text-slate-600 mb-5">
                <span className="font-semibold">E-mail:</span>{' '}
                <a href={`mailto:${SITE.email}`} className="hover:text-green-700 transition">
                  {SITE.email}
                </a>
              </p>

              {/* Facebook only */}
              <a
                href={SITE.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600
                           hover:text-blue-700 transition"
              >
                <span
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white
                             text-[#1877f2] border-[#1877f2] hover:bg-[#1877f2] hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </span>
                Facebook
              </a>
            </div>

            {/* ── Column 2: About us ───────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">About us</h3>
              <ul className="space-y-2.5">
                {ABOUT_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 3: Academics ─────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">Academics</h3>
              <ul className="space-y-2.5">
                {ACADEMIC_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 4: Research ──────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">Research</h3>
              <ul className="space-y-2.5">
                {RESEARCH_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 5: Admission ─────────────────────────────────── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-4">Admission</h3>
              <ul className="space-y-2.5">
                {ADMISSION_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-slate-600 hover:text-green-700 transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── COPYRIGHT BAR — centered, dark navy ─────────────────────── */}
      <div style={{ background: '#1e2d3d' }}>
        <div className="container-custom py-3.5 flex items-center justify-center">
          <p className="text-xs text-center text-slate-400">
            Copyright &copy; Department of Computer Science and Engineering, {SITE.universityShort}.
          </p>
        </div>
      </div>

    </footer>
  );
}
