import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Student Registration — GSTU CSE',
  description: 'Register for the GSTU CSE Student Portal or apply for new admission.',
};

export default function StudentRegisterChoicePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#052e16 0%,#0b3d1f 50%,#166534 100%)' }}>
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Student Registration</h1>
          <p className="text-green-300 text-sm mt-2">GSTU — Department of Computer Science & Engineering</p>
        </div>

        {/* Two option cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

          {/* Option A: Running Student */}
          <Link href="/student/register/running"
            className="group bg-white rounded-2xl p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl mb-4">
              🎓
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Running Student</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Already admitted to GSTU CSE? Create your student portal account to access
              results, routines, resources and more.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 mb-6">
              <li>✓ Student ID required (issued by department)</li>
              <li>✓ Verified against official student records</li>
              <li>✓ Instant account activation</li>
            </ul>
            <div className="mt-auto flex items-center gap-2 text-green-700 font-semibold text-sm group-hover:gap-3 transition-all">
              Register Account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
          </Link>

          {/* Option B: New Admission */}
          <Link href="/admission/apply"
            className="group bg-white rounded-2xl p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl mb-4">
              📋
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">New Admission</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Applying to GSTU CSE for the first time? Submit your admission application
              online and track your status.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 mb-6">
              <li>✓ Online application form</li>
              <li>✓ Document upload</li>
              <li>✓ Track application status</li>
            </ul>
            <div className="mt-auto flex items-center gap-2 text-blue-700 font-semibold text-sm group-hover:gap-3 transition-all">
              Apply for Admission
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
          </Link>
        </div>

        {/* Footer links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-green-200">
            Already registered?{' '}
            <Link href="/student/login" className="font-semibold text-white hover:underline">
              Sign In →
            </Link>
          </p>
          <p className="text-sm text-green-200">
            Tracking an application?{' '}
            <Link href="/admission/status" className="font-semibold text-white hover:underline">
              Check Status →
            </Link>
          </p>
          <p className="mt-4">
            <Link href="/" className="text-xs text-green-400 hover:text-green-200 transition">
              ← Back to main website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}