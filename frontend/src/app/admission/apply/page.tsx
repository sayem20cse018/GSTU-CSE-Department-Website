'use client';
import { useState } from 'react';
import Link from 'next/link';

const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface ApplicationResult {
  applicationId: string;
  application: {
    id: string;
    session: string;
    fullName: string;
    email: string;
    status: string;
    paymentAmount: number | null;
  };
}

type Step = 'personal' | 'academic' | 'documents' | 'review';
const STEPS: Step[] = ['personal', 'academic', 'documents', 'review'];

const STEP_LABELS: Record<Step, string> = {
  personal:  'Personal Info',
  academic:  'Academic Info',
  documents: 'Documents',
  review:    'Review & Submit',
};

export default function AdmissionApplyPage() {
  const [step, setStep] = useState<Step>('personal');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<ApplicationResult | null>(null);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    session: '', program: 'BSc',
    fullName: '', dateOfBirth: '', gender: '', email: '', phone: '',
    presentAddress: '', permanentAddress: '',
    fatherName: '', motherName: '', guardianPhone: '',
    sscBoard: '', sscRoll: '', sscRegNo: '', sscYear: '', sscGpa: '',
    hscBoard: '', hscRoll: '', hscRegNo: '', hscYear: '', hscGpa: '',
    photoUrl: '', sscDocUrl: '', hscDocUrl: '', otherDocUrl: '',
    trackingPassword: '', trackingPasswordConfirm: '',
  });

  const F = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const iCls = 'w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition';
  const lCls = 'block text-xs font-semibold text-slate-700 mb-1.5';

  function validateStep(): boolean {
    setErr('');
    if (step === 'personal') {
      if (!form.session)  { setErr('Academic session is required.'); return false; }
      if (!form.fullName) { setErr('Full name is required.'); return false; }
      if (!form.email)    { setErr('Email is required.'); return false; }
      if (!form.phone)    { setErr('Phone number is required.'); return false; }
    }
    if (step === 'academic') {
      if (!form.hscGpa) { setErr('HSC GPA is required.'); return false; }
    }
    if (step === 'review') {
      if (!form.trackingPassword || form.trackingPassword.length < 6) {
        setErr('Tracking password must be at least 6 characters.'); return false;
      }
      if (form.trackingPassword !== form.trackingPasswordConfirm) {
        setErr('Tracking passwords do not match.'); return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function prevStep() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep()) return;
    setSubmitting(true); setErr('');
    try {
      const res = await fetch(`${api}/admission/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: form.session, program: form.program,
          fullName: form.fullName, dateOfBirth: form.dateOfBirth,
          gender: form.gender, email: form.email, phone: form.phone,
          presentAddress: form.presentAddress, permanentAddress: form.permanentAddress,
          fatherName: form.fatherName, motherName: form.motherName, guardianPhone: form.guardianPhone,
          sscBoard: form.sscBoard, sscRoll: form.sscRoll, sscRegNo: form.sscRegNo, sscYear: form.sscYear, sscGpa: form.sscGpa,
          hscBoard: form.hscBoard, hscRoll: form.hscRoll, hscRegNo: form.hscRegNo, hscYear: form.hscYear, hscGpa: form.hscGpa,
          photoUrl: form.photoUrl, sscDocUrl: form.sscDocUrl, hscDocUrl: form.hscDocUrl, otherDocUrl: form.otherDocUrl,
          trackingPassword: form.trackingPassword,
        }),
      });
      const data = await res.json() as ApplicationResult & { message?: string };
      if (!res.ok) throw new Error(data.message ?? 'Submission failed. Please try again.');
      setSubmitted(data);
    } catch (err) {
      setErr(err instanceof Error ? err.message : 'Submission failed.');
    } finally { setSubmitting(false); }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
          <span className="text-5xl block mb-4" aria-hidden="true">🎉</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-500 mb-6">Your application has been received successfully.</p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-left">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-3">Application Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Application ID</span>
                <span className="font-black text-slate-900 text-base font-mono">{submitted.applicationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold text-slate-800">{submitted.application.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Session</span>
                <span className="font-semibold text-slate-800">{submitted.application.session}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-amber-700 capitalize">{submitted.application.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left text-sm text-amber-800">
            <strong>⚠️ Save your Application ID:</strong>{' '}
            <span className="font-mono font-bold">{submitted.applicationId}</span>
            <br/>You will need this ID and your tracking password to check your application status.
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/admission/status"
              className="block py-3 text-sm font-bold text-white rounded-xl text-center transition"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
              Track My Application
            </Link>
            <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="text-white py-10 px-4" style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
        <div className="container mx-auto max-w-2xl">
          <Link href="/student/register" className="text-green-300 hover:text-white text-sm flex items-center gap-1.5 mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back to registration options
          </Link>
          <h1 className="text-2xl font-bold">New Admission Application</h1>
          <p className="text-green-300 text-sm mt-1">GSTU — Department of Computer Science & Engineering</p>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < stepIdx ? 'bg-green-400 border-green-400 text-white' :
                  i === stepIdx ? 'bg-white border-white text-green-800' :
                  'border-white/30 text-white/50'
                }`}>
                  {i < stepIdx ? '✓' : String(i + 1)}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === stepIdx ? 'text-white' : 'text-white/50'}`}>
                  {STEP_LABELS[s]}
                </span>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <form onSubmit={step === 'review' ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-5">
            <h2 className="text-lg font-bold text-slate-900 mb-5">{STEP_LABELS[step]}</h2>

            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">{err}</div>
            )}

            {/* Step: Personal */}
            {step === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lCls}>Academic Session *</label>
                    <input value={form.session} onChange={e => F('session', e.target.value)} placeholder="e.g. 2024-25" required className={iCls}/>
                  </div>
                  <div>
                    <label className={lCls}>Program *</label>
                    <select value={form.program} onChange={e => F('program', e.target.value)} className={iCls}>
                      <option value="BSc">BSc in CSE</option>
                      <option value="MSc">MSc in CSE</option>
                      <option value="PhD">PhD in CSE</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={lCls}>Full Name *</label>
                  <input value={form.fullName} onChange={e => F('fullName', e.target.value)} placeholder="As on SSC certificate" required className={iCls}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lCls}>Date of Birth</label>
                    <input type="date" value={form.dateOfBirth} onChange={e => F('dateOfBirth', e.target.value)} className={iCls}/>
                  </div>
                  <div>
                    <label className={lCls}>Gender</label>
                    <select value={form.gender} onChange={e => F('gender', e.target.value)} className={iCls}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lCls}>Email *</label>
                    <input type="email" value={form.email} onChange={e => F('email', e.target.value)} required placeholder="your@email.com" className={iCls}/>
                  </div>
                  <div>
                    <label className={lCls}>Phone *</label>
                    <input type="tel" value={form.phone} onChange={e => F('phone', e.target.value)} required placeholder="+880-xxx" className={iCls}/>
                  </div>
                </div>
                <div>
                  <label className={lCls}>Present Address</label>
                  <input value={form.presentAddress} onChange={e => F('presentAddress', e.target.value)} placeholder="Current address" className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>{"Father's Name"}</label>
                  <input value={form.fatherName} onChange={e => F('fatherName', e.target.value)} className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>{"Mother's Name"}</label>
                  <input value={form.motherName} onChange={e => F('motherName', e.target.value)} className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>Guardian Phone</label>
                  <input type="tel" value={form.guardianPhone} onChange={e => F('guardianPhone', e.target.value)} className={iCls}/>
                </div>
              </div>
            )}

            {/* Step: Academic */}
            {step === 'academic' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3 pb-2 border-b border-slate-100">SSC Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Board', key: 'sscBoard', ph: 'e.g. Dhaka' },
                      { label: 'Roll Number', key: 'sscRoll', ph: 'Roll No.' },
                      { label: 'Registration No.', key: 'sscRegNo', ph: 'Reg. No.' },
                      { label: 'Passing Year', key: 'sscYear', ph: '2020' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className={lCls}>{f.label}</label>
                        <input value={form[f.key as keyof typeof form]} onChange={e => F(f.key as keyof typeof form, e.target.value)} placeholder={f.ph} className={iCls}/>
                      </div>
                    ))}
                    <div>
                      <label className={lCls}>GPA</label>
                      <input value={form.sscGpa} onChange={e => F('sscGpa', e.target.value)} placeholder="e.g. 5.00" className={iCls}/>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3 pb-2 border-b border-slate-100">HSC Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Board', key: 'hscBoard', ph: 'e.g. Dhaka' },
                      { label: 'Roll Number', key: 'hscRoll', ph: 'Roll No.' },
                      { label: 'Registration No.', key: 'hscRegNo', ph: 'Reg. No.' },
                      { label: 'Passing Year', key: 'hscYear', ph: '2022' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className={lCls}>{f.label}</label>
                        <input value={form[f.key as keyof typeof form]} onChange={e => F(f.key as keyof typeof form, e.target.value)} placeholder={f.ph} className={iCls}/>
                      </div>
                    ))}
                    <div>
                      <label className={lCls}>GPA *</label>
                      <input value={form.hscGpa} onChange={e => F('hscGpa', e.target.value)} placeholder="e.g. 5.00" required className={iCls}/>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Documents */}
            {step === 'documents' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  Upload documents to Cloudinary, Google Drive, or any file hosting and paste the public URL here.
                </p>
                {[
                  { label: 'Recent Photograph URL', key: 'photoUrl' },
                  { label: 'SSC Certificate / Marksheet URL', key: 'sscDocUrl' },
                  { label: 'HSC Certificate / Marksheet URL', key: 'hscDocUrl' },
                  { label: 'Other Document URL (Optional)', key: 'otherDocUrl' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={lCls}>{f.label}</label>
                    <input type="url" value={form[f.key as keyof typeof form]} onChange={e => F(f.key as keyof typeof form, e.target.value)} placeholder="https://…" className={iCls}/>
                  </div>
                ))}
              </div>
            )}

            {/* Step: Review */}
            {step === 'review' && (
              <div className="space-y-5">
                <div className="bg-slate-50 rounded-xl p-5 text-sm space-y-2">
                  <h3 className="font-bold text-slate-800 mb-3">Application Summary</h3>
                  {[
                    ['Session', form.session], ['Program', form.program],
                    ['Name', form.fullName], ['Email', form.email], ['Phone', form.phone],
                    ['SSC GPA', form.sscGpa], ['HSC GPA', form.hscGpa],
                  ].map(([l, v]) => v ? (
                    <div key={l} className="flex justify-between gap-3">
                      <span className="text-slate-500">{l}</span>
                      <span className="font-semibold text-slate-800 text-right">{v}</span>
                    </div>
                  ) : null)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Set Tracking Password</h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Use this with your Application ID to check status at <strong>/admission/status</strong>.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className={lCls}>Password (min 6 characters) *</label>
                      <input type="password" value={form.trackingPassword} onChange={e => F('trackingPassword', e.target.value)} placeholder="••••••" required minLength={6} className={iCls}/>
                    </div>
                    <div>
                      <label className={lCls}>Confirm Password *</label>
                      <input type="password" value={form.trackingPasswordConfirm} onChange={e => F('trackingPasswordConfirm', e.target.value)} placeholder="••••••" required className={iCls}/>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  By submitting, you confirm all information is accurate. False information may result in cancellation of admission.
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {stepIdx > 0 && (
              <button type="button" onClick={prevStep}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
                ← Back
              </button>
            )}
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
              {submitting ? 'Submitting…' : step === 'review' ? 'Submit Application' : 'Continue →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
