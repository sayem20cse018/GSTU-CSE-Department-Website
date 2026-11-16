'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '@/context/StudentAuthContext';

export default function RunningStudentRegisterPage() {
  const [form, setForm] = useState({ studentId: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [err,  setErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const { register, isAuthenticated, isLoading } = useStudentAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/students');
  }, [isAuthenticated, isLoading, router]);

  const F = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { studentId, email, password, confirmPassword, phone } = form;
    if (!studentId || !email || !password) { setErr('All required fields must be filled.'); return; }
    if (password.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setErr('Passwords do not match.'); return; }
    setLoading(true); setErr('');
    try {
      await register(studentId.trim().toUpperCase(), email, password, phone || undefined);
      setDone(true);
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  }

  const iCls = 'w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#052e16 0%,#0b3d1f 50%,#166534 100%)' }}>
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/student/register" className="text-green-300 hover:text-white text-sm flex items-center gap-1.5 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to registration options
          </Link>
        </div>
        {done ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <span className="text-5xl block mb-4" aria-hidden="true">✅</span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
            <p className="text-slate-500 mb-5">Your account has been created. Please log in to access the student portal.</p>
            <Link href="/student/login"
              className="inline-block px-6 py-3 text-sm font-bold text-white rounded-xl transition"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Running Student Registration</h2>
            <p className="text-sm text-slate-500 mb-5">Your Student ID must already be in the department database. Contact admin if your ID is not recognised.</p>
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Student ID <span className="text-red-500">*</span></label>
                <input type="text" value={form.studentId} onChange={F('studentId')} placeholder="e.g. 20CSE018" required autoComplete="off" className={`${iCls} uppercase`}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={F('email')} placeholder="your@email.com" required autoComplete="email" className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone (optional)</label>
                <input type="tel" value={form.phone} onChange={F('phone')} placeholder="Optional" autoComplete="tel" className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={F('password')} placeholder="Min. 8 characters" required autoComplete="new-password" className={`${iCls} pr-11`}/>
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={F('confirmPassword')} placeholder="Re-enter password" required autoComplete="new-password" className={iCls}/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
                {loading ? 'Creating account\u2026' : 'Create Account'}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">Already have an account?{' '}<Link href="/student/login" className="font-semibold text-green-700">Sign in</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
