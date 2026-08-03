'use client';
import { useState } from 'react';
import SectionHero from '@/components/academics/SectionHero';

export default function AlumniRegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', batch:'', degree:'BSc', currentRole:'', company:'', country:'', linkedin:'' });
  const [done, setDone] = useState(false);
  const F = (k: keyof typeof form, v: string) => setForm(p => ({...p,[k]:v}));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <>
      <SectionHero tag="Alumni" title="Alumni Registration"
        breadcrumbs={[{label:'Home',href:'/'},{label:'Alumni',href:'/alumni'},{label:'Register'}]}/>
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
            {[{l:'Full Name *',k:'name',t:'text'},{l:'Email *',k:'email',t:'email'},{l:'Graduation Year *',k:'batch',t:'text'},{l:'Current Company/Org',k:'company',t:'text'},{l:'Job Title / Role',k:'currentRole',t:'text'},{l:'Country',k:'country',t:'text'},{l:'LinkedIn URL',k:'linkedin',t:'url'}].map(f=>(
              <div key={f.k}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{f.l}</label>
                <input required={f.l.includes('*')} type={f.t} value={form[f.k as keyof typeof form]}
                  onChange={e=>F(f.k as keyof typeof form,e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
              <select value={form.degree} onChange={e=>F('degree',e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>BSc</option><option>MSc</option><option>PhD</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 text-sm font-bold text-white rounded-xl transition"
              style={{background:'linear-gradient(135deg,#0b3d1f,#166534)'}}>
              Submit Registration
            </button>
          </form>
        )}
      </div></div>
    </>
  );
}
