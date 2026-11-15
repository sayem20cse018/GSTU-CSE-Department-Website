import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import { fetchSettings, SETTINGS_FALLBACK } from '@/lib/api/settings';
import { SITE } from '@/constants';

export const metadata: Metadata = {
  title: 'Contact — GSTU CSE',
  description: 'Get in touch with the Department of Computer Science & Engineering, GSTU.',
};

export default async function ContactPage() {
  const s = await fetchSettings().catch(() => SETTINGS_FALLBACK);

  const INFO = [
    { icon: '📍', label: 'Address',    value: s.address || SITE.address },
    { icon: '✉️', label: 'Email',      value: s.email || SITE.email,    href: `mailto:${s.email || SITE.email}` },
    { icon: '📞', label: 'Phone',      value: s.phone || SITE.phone,    href: `tel:${s.phone || SITE.phone}` },
    { icon: '🌐', label: 'University', value: s.universityName || SITE.university },
  ];

  return (
    <>
      <SectionHero tag="Get in Touch" title="Contact Us"
        description="We'd love to hear from you. Reach out for admissions, academic, or research enquiries."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

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
                    { label: 'Facebook', href: s.facebookUrl || SITE.socialLinks.facebook },
                    { label: 'LinkedIn', href: s.linkedinUrl || SITE.socialLinks.linkedin },
                    { label: 'YouTube',  href: s.youtubeUrl || SITE.socialLinks.youtube },
                  ].map(link => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition"
                      style={{ background: '#166534' }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form — mailto fallback (no backend email endpoint) */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Use the form below to send us an email. Your message will open in your default mail app.
                </p>
                <form
                  action={`mailto:${s.email || SITE.email}`}
                  method="POST"
                  encType="text/plain"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Your full name' },
                      { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'your@email.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                        <input required type={f.type} name={f.key}
                          placeholder={f.placeholder}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                    <input required type="text" name="subject"
                      placeholder="What is your enquiry about?"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                    <textarea required rows={5} name="message"
                      placeholder="Write your message here…"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full py-3 text-sm font-bold text-white rounded-xl transition"
                    style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
