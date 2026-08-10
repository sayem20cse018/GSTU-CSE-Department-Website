'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '@/context/StudentAuthContext';

export default function StudentRegisterPage() {
  const [form, setForm] = useState({ studentId:'', email:'', password:'', confirmPassword:'', phone:'' });
  const [err,     setErr]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

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
      router.replace('/students');
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg,#052e16 0%,#0b3d1f 50%,#166534 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-green-300 text-sm mt-1">GSTU — Dept. of CSE Student Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Student Registration</h2>
          <p className="text-sm text-slate-500 mb-5">Only students in the CSE database can register. Your ID will be verified.</p>

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label:'Student ID', key:'studentId', type:'text',     ph:'e.g. 20CSE018', req:true,  upper:true },
              { label:'Email',      key:'email',     type:'email',    ph:'your@email.com',req:true,  upper:false},
              { label:'Phone',      key:'phone',     type:'tel',      ph:'Optional',      req:false, upper:false},
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {f.label} {f.req && <span className="text-red-500">*</span>}
                </label>
                <input type={f.type} value={form[f.key as keyof typeof form]} onChange={F(f.key as keyof typeof form)}
                  placeholder={f.ph} required={f.req} autoComplete="off"
                  className={`w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${f.upper ? 'uppercase' : ''}`}/>
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={F('password')}
                  placeholder="Min. 8 characters" required autoComplete="new-password"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
              <input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={F('confirmPassword')}
                placeholder="Re-enter password" required autoComplete="new-password"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
              {loading ? <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Creating account…
              </span> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/student/login" className="font-semibold text-green-700 hover:text-green-800">Sign in</Link>
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">← Back to main website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
