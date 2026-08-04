'use client';
import { useState, useEffect, useRef } from 'react';
import { AdminPageTitle }   from '@/context/AdminPageContext';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';
import type { SiteSettings } from '@/lib/api/settings';
import { SETTINGS_FALLBACK } from '@/lib/api/settings';

type Tab = 'identity' | 'contact' | 'social' | 'logos';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'identity', label: 'Identity',   icon: '🏛️' },
  { id: 'contact',  label: 'Contact',    icon: '📞' },
  { id: 'social',   label: 'Social',     icon: '🔗' },
  { id: 'logos',    label: 'Logos',      icon: '🖼️' },
];

/** Convert a File to a data URL (base64) so it can be stored as a string */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Mini upload widget — supports file upload OR URL paste */
function LogoUpload({
  label, fieldKey, value, onChange,
}: { label: string; fieldKey: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate: image only, max 2MB
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB.'); return; }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } finally { setUploading(false); }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-2">{label}</label>

      {/* Preview */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0"
          style={{ borderColor: value ? '#4ade80' : 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' }}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="w-full h-full object-contain"
              onError={() => onChange('')}/>
          ) : (
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {/* Upload button */}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
            style={{ background: 'rgba(22,101,52,0.3)', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac' }}>
            {uploading ? (
              <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing…</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Upload Image</>
            )}
          </button>

          <p className="text-[10px] text-slate-500">PNG, JPG, SVG · max 2MB</p>
        </div>
      </div>

      {/* OR: paste URL */}
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 h-px bg-white/10"/>
        <span className="text-[10px] text-slate-600 font-medium">OR paste URL</span>
        <div className="flex-1 h-px bg-white/10"/>
      </div>
      <input
        type="url"
        value={value.startsWith('data:') ? '' : value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://example.com/logo.png"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
                   placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {value && (
        <button onClick={() => onChange('')}
          className="mt-1.5 text-[10px] text-red-400 hover:text-red-300 transition">
          × Remove
        </button>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [form,    setForm]    = useState<SiteSettings>(SETTINGS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [tab,     setTab]     = useState<Tab>('identity');

  useEffect(() => {
    setLoading(true);
    adminGet<SiteSettings>('/settings')
      .then(d => setForm({ ...SETTINGS_FALLBACK, ...d }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const F = (k: keyof SiteSettings, v: string | number) => { setForm(p => ({ ...p, [k]: v })); setSaved(false); };

  async function save() {
    setSaving(true); setError(''); setSaved(false);
    try {
      await adminPatch<SiteSettings>('/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  const iCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Site Settings"/>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <p className="text-slate-400 text-sm mt-1">
            All changes reflect immediately on the public website.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Saved!
            </span>
          )}
          <button onClick={save} disabled={saving || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition"
            style={{ background: 'linear-gradient(135deg,#166534,#15803d)', boxShadow: '0 4px 15px rgba(22,101,52,0.3)' }}>
            {saving
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
              : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>Save Changes</>
            }
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>}

      {/* Live preview */}
      <div className="rounded-2xl px-5 py-4 mb-6 flex items-center gap-4 border"
        style={{ background: 'linear-gradient(135deg,rgba(22,101,52,0.15),rgba(0,0,0,0))', borderColor: 'rgba(22,101,52,0.25)' }}>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border-2"
          style={{ borderColor: '#fbbf24' }}>
          {form.deptLogo
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={form.deptLogo} alt="" className="w-full h-full object-contain"/>
            : <span className="text-lg font-black text-green-800">C</span>
          }
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">{form.deptName || 'Department Name'}</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: '#fde68a' }}>
            {form.universityName || 'University'} · {form.universityShortName}
          </p>
        </div>
        <span className="ml-auto text-[10px] text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          Header Preview
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
            <span aria-hidden="true">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {loading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="rounded-2xl p-6 space-y-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>

          {/* IDENTITY */}
          {tab === 'identity' && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pb-2 border-b border-white/10">Department Identity</p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department Full Name</label>
                <input value={form.deptName} onChange={e => F('deptName', e.target.value)} placeholder="Department of Computer Science & Engineering" className={iCls}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Short Name</label>
                  <input value={form.deptShortName} onChange={e => F('deptShortName', e.target.value)} placeholder="Dept. of CSE" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Founded Year</label>
                  <input type="number" value={form.foundedYear} onChange={e => F('foundedYear', +e.target.value)} placeholder="2011" className={iCls}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">University Full Name</label>
                <input value={form.universityName} onChange={e => F('universityName', e.target.value)} placeholder="Gopalganj Science & Technology University" className={iCls}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">University Short Name</label>
                  <input value={form.universityShortName} onChange={e => F('universityShortName', e.target.value)} placeholder="GSTU" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tagline / Motto</label>
                  <input value={form.tagline} onChange={e => F('tagline', e.target.value)} placeholder="Advancing Computing, Shaping the Future" className={iCls}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Footer Text <span className="text-slate-500">(optional)</span></label>
                <input value={form.footerText} onChange={e => F('footerText', e.target.value)}
                  placeholder={`© ${new Date().getFullYear()} Dept. of CSE, GSTU — leave blank to auto-generate`} className={iCls}/>
              </div>
            </>
          )}

          {/* CONTACT */}
          {tab === 'contact' && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pb-2 border-b border-white/10">Contact Information</p>
              {[
                { label:'Official Email', k:'email',   type:'email', ph:'cse@gstu.edu.bd' },
                { label:'Phone Number',  k:'phone',   type:'tel',   ph:'+880-468-XXXXXX' },
                { label:'Office Address',k:'address', type:'text',  ph:'CSE Building, GSTU Campus, Gopalganj-8100' },
                { label:'Moodle LMS URL',k:'moodleUrl',type:'url', ph:'https://moodle.gstu.edu.bd' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{f.label}</label>
                  <input type={f.type} value={String((form as unknown as Record<string,unknown>)[f.k] ?? '')}
                    onChange={e => F(f.k as keyof SiteSettings, e.target.value)} placeholder={f.ph} className={iCls}/>
                </div>
              ))}
            </>
          )}

          {/* SOCIAL */}
          {tab === 'social' && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pb-2 border-b border-white/10">Social Media</p>
              {[
                { label:'Facebook',  k:'facebookUrl', icon:'📘', ph:'https://facebook.com/gstu.cse' },
                { label:'Twitter/X', k:'twitterUrl',  icon:'🐦', ph:'https://twitter.com/gstu_cse' },
                { label:'LinkedIn',  k:'linkedinUrl', icon:'💼', ph:'https://linkedin.com/...' },
                { label:'YouTube',   k:'youtubeUrl',  icon:'▶️', ph:'https://youtube.com/@gstu_cse' },
              ].map(f => (
                <div key={f.k}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                    <span aria-hidden="true">{f.icon}</span>{f.label} Page URL
                  </label>
                  <input type="url" value={String((form as unknown as Record<string,unknown>)[f.k] ?? '')}
                    onChange={e => F(f.k as keyof SiteSettings, e.target.value)} placeholder={f.ph} className={iCls}/>
                </div>
              ))}
            </>
          )}

          {/* LOGOS */}
          {tab === 'logos' && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pb-2 border-b border-white/10">
                Logos &amp; Images — Upload directly or paste a URL
              </p>
              <LogoUpload label="Department Logo" fieldKey="deptLogo"
                value={form.deptLogo} onChange={v => F('deptLogo', v)}/>
              <div className="border-t border-white/10 pt-5">
                <LogoUpload label="University Logo" fieldKey="universityLogo"
                  value={form.universityLogo} onChange={v => F('universityLogo', v)}/>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-300 space-y-1">
                <p>💡 <strong>Upload:</strong> click &quot;Upload Image&quot; and pick a file from your computer. It will be stored as a data URL.</p>
                <p>🔗 <strong>URL:</strong> paste a link to an image hosted on Cloudinary, S3, or your server.</p>
                <p>📁 <strong>Local:</strong> put the file in <code className="bg-white/10 px-1 rounded">frontend/public/images/</code> and enter <code className="bg-white/10 px-1 rounded">/images/filename.png</code></p>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}
