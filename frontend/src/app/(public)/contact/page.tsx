'use client';
import { useState } from 'react';
import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import { SITE } from '@/constants';

const INFO = [
  { icon: '📍', label: 'Address',   value: SITE.address },
  { icon: '✉️', label: 'Email',     value: SITE.email,   href: `mailto:${SITE.email}` },
  { icon: '📞', label: 'Phone',     value: SITE.phone,   href: `tel:${SITE.phone}` },
  { icon: '🌐', label: 'University',value: SITE.university },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent]     = useState(false);
  const [sending, setSending] = useState(false);

  const F = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // Simulate send (no backend email endpoint yet)
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  }

  return (
    <>
      <SectionHero tag="Get in Touch" title="Contact Us"
        description="We'd love to hear from you. Reach out for admissions, academic, or research enquiries."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Contact'}]}/>

      <div className="bg-white section-py">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-xl font-bold text-slate-900">Department Information</h2>
              {INFO.map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-green-300 transition">
                  <span className="text-2xl shrink-0" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-sm text-green-700 font-medium hover:underline">{item.value}</a>
                      : <p className="text-sm text-slate-800 font-medium">{item.value}</p>}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { label:'Facebook', href: SITE.socialLinks.facebook },
                    { label:'LinkedIn', href: SITE.socialLinks.linkedin },
                    { label:'YouTube',  href: SITE.socialLinks.youtube },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition"
                      style={{ background: '#166534' }}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h2>

                {sent ? (
                  <div className="text-center py-10">
                    <span className="text-5xl block mb-4" aria-hidden="true">✅</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Message Sent!</h3>
                    <p className="text-slate-500">Thank you for contacting us. We'll get back to you within 2 business days.</p>
                    <button onClick={() => { setSent(false); setForm({name:'',email:'',subject:'',message:''}); }}
                      className="mt-5 text-sm font-semibold text-green-700 hover:text-green-900 transition">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[{label:'Full Name *',key:'name',type:'text',placeholder:'Your full name'},
                        {label:'Email Address *',key:'email',type:'email',placeholder:'your@email.com'}].map(f => (
                        <div key={f.key}>
                          <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                          <input required type={f.type} value={form[f.key as keyof typeof form]}
                            onChange={e => F(f.key as keyof typeof form, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"/>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                      <input required type="text" value={form.subject} onChange={e => F('subject', e.target.value)}
                        placeholder="What is your enquiry about?"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                      <textarea required rows={5} value={form.message} onChange={e => F('message', e.target.value)}
                        placeholder="Write your message here…"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"/>
                    </div>
                    <button type="submit" disabled={sending}
                      className="w-full py-3 text-sm font-bold text-white rounded-xl transition disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
                      {sending ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
