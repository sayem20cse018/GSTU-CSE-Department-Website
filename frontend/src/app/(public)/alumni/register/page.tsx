'use client';
import { useState } from 'react';
import SectionHero from '@/components/academics/SectionHero';

const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function AlumniRegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', batch: '', degree: 'BSc',
    currentRole: '', company: '', country: '', linkedin: '',
    phone: '', studentId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const F = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }

    setSubmitting(true);
    setError('');

    try {
      const batchYear = form.batch ? parseInt(form.batch, 10) : undefined;
      const res = await fetch(`${api}/alumni`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          phone: form.phone || undefined,
          batchYear,
          graduationYear: batchYear,
          degree: form.degree,
          studentId: form.studentId || undefined,
          currentDesignation: form.currentRole || undefined,
          currentOrganization: form.company || undefined,
          currentCountry: form.country || undefined,
          linkedinUrl: form.linkedin || undefined,
          approvalStatus: 'pending',
          isProfilePublic: false,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message ?? 'Registration failed. Please try again.');
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SectionHero tag="Alumni" title="Alumni Registration"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Alumni', href: '/alumni' }, { label: 'Register' }]} />
      <div className="bg-white section-py"><div className="container-custom max-w-2xl">
        {done ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🎉</span>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Submitted!</h2>
            <p className="text-slate-500">Thank you for registering. Our alumni office will review and approve your profile within 3 business days.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Join Our Alumni Network</h2>

            {error && (
              <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</p>
            )}

            {[
              { l: 'Full Name *', k: 'name', t: 'text' },
              { l: 'Email *', k: 'email', t: 'email' },
              { l: 'Student ID', k: 'studentId', t: 'text' },
              { l: 'Graduation Year *', k: 'batch', t: 'number' },
              { l: 'Current Company/Org', k: 'company', t: 'text' },
              { l: 'Job Title / Role', k: 'currentRole', t: 'text' },
              { l: 'Country', k: 'country', t: 'text' },
              { l: 'Phone', k: 'phone', t: 'text' },
              { l: 'LinkedIn URL', k: 'linkedin', t: 'url' },
            ].map(f => (
              <div key={f.k}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{f.l}</label>
                <input required={f.l.includes('*')} type={f.t} value={form[f.k as keyof typeof form]}
                  onChange={e => F(f.k as keyof typeof form, e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
              <select value={form.degree} onChange={e => F('degree', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>BSc</option><option>MSc</option><option>PhD</option>
              </select>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-3 text-sm font-bold text-white rounded-xl transition disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#0b3d1f,#166534)' }}>
              {submitting ? 'Submitting…' : 'Submit Registration'}
            </button>
          </form>
        )}
      </div></div>
    </>
  );
}
