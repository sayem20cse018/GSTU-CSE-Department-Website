'use client';
import { useState } from 'react';
import Link from 'next/link';

const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface ApplicationStatus {
  applicationId: string; session: string; program: string; fullName: string;
  email: string; status: string; paymentStatus: string; paymentAmount: number | null;
  adminRemarks: string | null; assignedStudentId: string | null;
  createdAt: string; updatedAt: string;
}

const STATUS_META: Record<string, { label: string; color: string; desc: string }> = {
  submitted:        { label: 'Submitted',         color: 'bg-blue-100 text-blue-700',     desc: 'Your application has been received and is awaiting review.' },
  under_review:     { label: 'Under Review',       color: 'bg-amber-100 text-amber-700',   desc: 'Admin is reviewing your application and documents.' },
  payment_pending:  { label: 'Payment Pending',    color: 'bg-orange-100 text-orange-700', desc: 'Please complete the admission fee payment.' },
  payment_verified: { label: 'Payment Verified',   color: 'bg-cyan-100 text-cyan-700',     desc: 'Payment confirmed. Waiting for final approval.' },
  approved:         { label: 'Approved ✓',         color: 'bg-green-100 text-green-700',   desc: 'Congratulations! Your admission has been approved.' },
  rejected:         { label: 'Rejected',           color: 'bg-red-100 text-red-700',       desc: 'Your application was not approved. See admin remarks.' },
};

const PAYMENT_META: Record<string, { label: string; color: string }> = {
  pending:  { label: 'Payment Pending',  color: 'bg-orange-100 text-orange-700' },
  paid:     { label: 'Payment Received', color: 'bg-blue-100 text-blue-700'    },
  verified: { label: 'Payment Verified', color: 'bg-green-100 text-green-700'  },
  refunded: { label: 'Refunded',         color: 'bg-slate-100 text-slate-600'  },
};

export default function AdmissionStatusPage() {
  const [appId,    setAppId]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');
  const [status,   setStatus]   = useState<ApplicationStatus | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!appId || !password) { setErr('Application ID and password are required.'); return; }
    setLoading(true); setErr(''); setStatus(null);
    try {
      const res = await fetch(`${api}/admission/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId.toUpperCase().trim(), password }),
      });
      const data = await res.json() as ApplicationStatus & { message?: string };
      if (!res.ok) throw new Error(data.message ?? 'Could not retrieve application status.');
      setStatus(data);
    } catch (err) {
      setErr(err instanceof Error ? err.message : 'Request failed.');
    } finally { setLoading(false); }
  }

  const sMeta = status ? (STATUS_META[status.status] ?? { label: status.status, color: 'bg-slate-100 text-slate-700', desc: '' }) : null;
  const pMeta = status ? (PAYMENT_META[status.paymentStatus] ?? { label: status.paymentStatus, color: 'bg-slate-100 text-slate-600' }) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="text-white py-10 px-4" style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
        <div className="container mx-auto max-w-xl">
          <Link href="/student/register" className="text-green-300 hover:text-white text-sm flex items-center gap-1.5 mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Registration options
          </Link>
          <h1 className="text-2xl font-bold">Track Application Status</h1>
          <p className="text-green-300 text-sm mt-1">Enter your Application ID and tracking password.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-xl px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Application ID *</label>
              <input value={appId} onChange={e => setAppId(e.target.value)} placeholder="e.g. APP-2024-00001" required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tracking Password *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password set during application" required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="mt-5 w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#166634,#15803d)' }}>
            {loading ? 'Checking…' : 'Check Status'}
          </button>
        </form>

        {status && sMeta && pMeta && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Application ID</p>
                <p className="text-xl font-black text-slate-900 font-mono">{status.applicationId}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${sMeta.color}`}>{sMeta.label}</span>
            </div>

            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3">{sMeta.desc}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Applicant', status.fullName],
                ['Email', status.email],
                ['Session', status.session],
                ['Program', status.program],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs text-slate-400 mb-0.5">{l}</p>
                  <p className="font-semibold text-slate-800">{v}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Status</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${pMeta.color}`}>{pMeta.label}</span>
                {status.paymentAmount && (
                  <span className="text-sm font-bold text-slate-700">BDT {status.paymentAmount}</span>
                )}
              </div>
              {status.paymentStatus === 'pending' && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  <strong>Payment Required:</strong> Please contact the department office to complete your admission fee payment. Keep your Application ID ready.
                </div>
              )}
            </div>

            {status.adminRemarks && (
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Remarks</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3">{status.adminRemarks}</p>
              </div>
            )}

            {status.status === 'approved' && status.assignedStudentId && (
              <div className="border-t border-slate-100 pt-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Your Student ID</p>
                  <p className="text-3xl font-black text-green-800 font-mono">{status.assignedStudentId}</p>
                  <p className="text-sm text-green-600 mt-2">Use this ID to register your student portal account.</p>
                  <Link href="/student/register/running"
                    className="inline-block mt-4 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition"
                    style={{ background: 'linear-gradient(135deg,#166634,#15803d)' }}>
                    Register Student Account →
                  </Link>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 text-center pt-2">
              Applied: {new Date(status.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}
              Last updated: {new Date(status.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
