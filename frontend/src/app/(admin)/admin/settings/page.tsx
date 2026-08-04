'use client';
import { useState, useEffect } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';
import type { SiteSettings } from '@/lib/api/settings';
import { SETTINGS_FALLBACK } from '@/lib/api/settings';

type Tab = 'identity' | 'contact' | 'social' | 'media';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'identity', label: 'Identity',     icon: '🏛️' },
  { id: 'contact',  label: 'Contact',      icon: '📞' },
  { id: 'social',   label: 'Social Links', icon: '🔗' },
  { id: 'media',    label: 'Logos & Media',icon: '🖼️' },
];

export default function SettingsPage() {
  const [form, setForm]     = useState<SiteSettings>(SETTINGS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState<Tab>('identity');

  useEffect(() => {
    setLoading(true);
    adminGet<SiteSettings>('/settings')
      .then(d => setForm({ ...SETTINGS_FALLBACK, ...d }))
      .catch(() => {/* keep fallback */})
      .finally(() => setLoading(false));
  }, []);

  const F = (k: keyof SiteSettings, v: string | number) => {
    setForm(p => ({ ...p, [k]: v }));
    setSaved(false);
  };

  async function save() {
    setSaving(true); setError(''); setSaved(false);
    try {
      await adminPatch<SiteSettings>('/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition";

  function Field({ label, k, type = 'text', placeholder = '' }: { label: string; k: keyof SiteSettings; type?: string; placeholder?: string }) {
    return (
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
        <input type={type} value={String(form[k] ?? '')}
          onChange={e => F(k, type === 'number' ? +e.target.value : e.target.value)}
          placeholder={placeholder} className={inputCls}/>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Site Settings"/>

      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <p className="text-slate-400 text-sm mt-1">
            Changes here reflect instantly on the public website header, footer and all sections.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400 animate-pulse">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Saved!
            </span>
          )}
          <button onClick={save} disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                       transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#166534,#15803d)', boxShadow: '0 4px 15px rgba(22,101,52,0.3)' }}>
            {saving ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>Save Changes</>
            )}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>}

      {/* Live preview strip */}
      <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0"
          style={{ border: '2px solid #fbbf24' }}>
          {form.deptLogo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={form.deptLogo} alt="" className="w-full h-full object-cover"/>
            : <span className="text-xl font-bold text-green-800">C</span>
          }
        </div>
        <div>
          <p className="font-bold text-white text-base leading-tight">{form.deptName || 'Department Name'}</p>
          <p className="text-xs mt-0.5" style={{ color: '#fde68a' }}>
            {form.universityName || 'University Name'} · {form.universityShortName}
          </p>
        </div>
        <span className="ml-auto text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">Live Preview</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 flex-1 justify-center px-3 py-2 rounded-lg text-sm font-semibold transition-all
              ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-5">

          {/* Identity */}
          {tab === 'identity' && (
            <>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/10">
                Department Identity
              </h3>
              <Field label="Department Full Name" k="deptName" placeholder="Department of Computer Science & Engineering"/>
              <Field label="Department Short Name" k="deptShortName" placeholder="Dept. of CSE"/>
              <div className="grid grid-cols-2 gap-4">
                <Field label="University Full Name" k="universityName" placeholder="Gopalganj Science & Technology University"/>
                <Field label="University Short Name" k="universityShortName" placeholder="GSTU"/>
              </div>
              <Field label="Tagline / Motto" k="tagline" placeholder="Advancing Computing, Shaping the Future"/>
              <Field label="Founded Year" k="foundedYear" type="number" placeholder="2011"/>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Footer Copyright Text (optional)</label>
                <input type="text" value={form.footerText} onChange={e => F('footerText', e.target.value)}
                  placeholder={`© ${new Date().getFullYear()} Department of CSE, GSTU`} className={inputCls}/>
                <p className="text-xs text-slate-600 mt-1">Leave blank to auto-generate from dept name and year.</p>
              </div>
            </>
          )}

          {/* Contact */}
          {tab === 'contact' && (
            <>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/10">
                Contact Information
              </h3>
              <Field label="Official Email" k="email" type="email" placeholder="cse@gstu.edu.bd"/>
              <Field label="Phone Number" k="phone" placeholder="+880-468-XXXXXX"/>
              <Field label="Office Address" k="address" placeholder="CSE Building, GSTU Campus, Gopalganj-8100"/>
              <Field label="Moodle LMS URL" k="moodleUrl" placeholder="https://moodle.gstu.edu.bd"/>
            </>
          )}

          {/* Social */}
          {tab === 'social' && (
            <>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/10">
                Social Media Links
              </h3>
              {[
                { label:'Facebook Page URL', k:'facebookUrl' as keyof SiteSettings, placeholder:'https://facebook.com/gstu.cse', icon:'📘' },
                { label:'Twitter / X URL',   k:'twitterUrl'  as keyof SiteSettings, placeholder:'https://twitter.com/gstu_cse',   icon:'🐦' },
                { label:'LinkedIn Page URL', k:'linkedinUrl' as keyof SiteSettings, placeholder:'https://linkedin.com/...',        icon:'💼' },
                { label:'YouTube Channel',   k:'youtubeUrl'  as keyof SiteSettings, placeholder:'https://youtube.com/@gstu_cse', icon:'▶️' },
              ].map(({ label, k, placeholder, icon }) => (
                <div key={String(k)}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5">
                    <span>{icon}</span>{label}
                  </label>
                  <input type="url" value={String(form[k] ?? '')}
                    onChange={e => F(k, e.target.value)} placeholder={placeholder} className={inputCls}/>
                </div>
              ))}
            </>
          )}

          {/* Media */}
          {tab === 'media' && (
            <>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/10">
                Logos &amp; Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dept logo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Department Logo URL</label>
                  <input type="url" value={form.deptLogo} onChange={e => F('deptLogo', e.target.value)}
                    placeholder="https://your-cdn.com/cse-logo.png" className={inputCls}/>
                  {form.deptLogo && (
                    <div className="mt-3 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.deptLogo} alt="Dept Logo Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                        onError={e => { e.currentTarget.style.display = 'none'; }}/>
                      <p className="text-xs text-slate-400">Preview</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 mt-2">
                    Shown in header crest. Recommended: square PNG/SVG, 200×200px.
                  </p>
                </div>
                {/* University logo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">University Logo URL</label>
                  <input type="url" value={form.universityLogo} onChange={e => F('universityLogo', e.target.value)}
                    placeholder="https://your-cdn.com/gstu-logo.png" className={inputCls}/>
                  {form.universityLogo && (
                    <div className="mt-3 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.universityLogo} alt="University Logo Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                        onError={e => { e.currentTarget.style.display = 'none'; }}/>
                      <p className="text-xs text-slate-400">Preview</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-sm text-amber-300">
                  💡 Upload images to Cloudinary/S3 and paste the URL here.
                  Or place images in <code className="bg-white/10 px-1 rounded">frontend/public/images/</code> and use a path like <code className="bg-white/10 px-1 rounded">/images/logo.png</code>
                </p>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}
