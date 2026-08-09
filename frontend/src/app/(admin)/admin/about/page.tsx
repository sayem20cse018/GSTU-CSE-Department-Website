'use client';
import { useRef, useState, useEffect } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';
import type { SiteSettings } from '@/lib/api/settings';
import { SETTINGS_FALLBACK } from '@/lib/api/settings';

type Tab = 'department' | 'vision' | 'history' | 'photos' | 'chairman';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'department', label: 'About Dept',     icon: '🏛️' },
  { id: 'vision',     label: 'Vision/Mission', icon: '🎯' },
  { id: 'history',    label: 'History',        icon: '📜' },
  { id: 'photos',     label: 'Photos',         icon: '📸' },
  { id: 'chairman',   label: "Chairman",       icon: '👤' },
];

const iCls  = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
const taCls = `${iCls} resize-y`;
const lCls  = 'block text-xs font-semibold text-slate-700 mb-1.5';
const sec   = 'text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100';

function PhotoUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const isData = value.startsWith('data:');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file || !file.type.startsWith('image/')) { alert('Select an image.'); return; }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => { onChange(reader.result as string); setBusy(false); };
    reader.onerror = () => { setBusy(false); };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className={lCls}>{label}</label>
      <div className="flex items-start gap-3">
        {value && (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover"/>
          </div>
        )}
        <div className="flex-1">
          <input type="url" value={isData ? '' : value} onChange={e => onChange(e.target.value)}
            placeholder="https://…" className={`${iCls} mb-2`}/>
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          <button type="button" onClick={() => ref.current?.click()} disabled={busy}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition disabled:opacity-50">
            {busy ? 'Processing…' : '📷 Upload Image'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')}
              className="ml-2 text-xs text-red-500 hover:text-red-700">× Remove</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── NO useSearchParams — pure internal state, works without Suspense ──────────
export default function AboutAdminPage() {
  const [tab,    setTab]    = useState<Tab>('department');
  const [form,   setForm]   = useState<SiteSettings>(SETTINGS_FALLBACK);
  const [loading, setLoad]  = useState(true);
  const [saving,  setSave]  = useState(false);
  const [saved,   setSaved] = useState(false);
  const [err,     setErr]   = useState('');

  useEffect(() => {
    setLoad(true);
    adminGet<SiteSettings>('/settings')
      .then(d => setForm(p => ({ ...p, ...d })))
      .catch(() => {})
      .finally(() => setLoad(false));
  }, []);

  const F = (k: keyof SiteSettings, v: string) => { setForm(p => ({ ...p, [k]: v })); setSaved(false); };

  async function save() {
    setSave(true); setErr(''); setSaved(false);
    try {
      const { id, key, __v, createdAt, updatedAt, ...payload } =
        form as SiteSettings & { id?: unknown; key?: unknown; __v?: unknown; createdAt?: unknown; updatedAt?: unknown };
      await adminPatch('/settings', payload);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSave(false); }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="About Management" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">About Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Edit department info, photos, and chairman message</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-semibold">✓ Saved</span>}
          <button onClick={save} disabled={saving || loading}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50 bg-green-700 hover:bg-green-600 transition">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{err}</div>}

      {/* Tabs — pure state, no URL params */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

          {tab === 'department' && (<>
            <p className={sec}>Introduction shown on homepage About section</p>
            <div><label className={lCls}>Introduction Paragraph</label>
              <textarea rows={7} value={form.aboutIntro ?? ''} onChange={e => F('aboutIntro', e.target.value)}
                placeholder="The Department of CSE at GSTU was established in 2011…" className={taCls}/></div>
          </>)}

          {tab === 'vision' && (<>
            <p className={sec}>Vision & Mission — shown on /about/vision page</p>
            <div><label className={lCls}>Vision Statement</label>
              <textarea rows={5} value={form.aboutVision ?? ''} onChange={e => F('aboutVision', e.target.value)}
                placeholder="To be a leading center of excellence…" className={taCls}/></div>
            <div><label className={lCls}>Mission Statement</label>
              <textarea rows={7} value={form.aboutMission ?? ''} onChange={e => F('aboutMission', e.target.value)}
                placeholder="Our mission is to provide rigorous, high-quality education…" className={taCls}/></div>
          </>)}

          {tab === 'history' && (<>
            <p className={sec}>History — shown on /about/history page</p>
            <div><label className={lCls}>Department History</label>
              <textarea rows={10} value={form.aboutHistory ?? ''} onChange={e => F('aboutHistory', e.target.value)}
                placeholder="The department was founded in 2011…" className={taCls}/></div>
          </>)}

          {tab === 'photos' && (<>
            <p className={sec}>About Section Photos — shown in homepage grid (top-left is largest)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['Photo 1', 'Large top-left', 'aboutImage1'],
                ['Photo 2', 'Small top-right', 'aboutImage2'],
                ['Photo 3', 'Small bottom-right', 'aboutImage3'],
                ['Photo 4', 'Wide bottom', 'aboutImage4'],
              ] as [string, string, keyof SiteSettings][]).map(([num, pos, key]) => (
                <div key={key} className="border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{num}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{pos}</span>
                  </div>
                  <PhotoUpload label="" value={(form[key] as string) ?? ''} onChange={v => F(key, v)}/>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">Recommended: 800×600px or larger. Leave empty to use placeholder.</p>
          </>)}

          {tab === 'chairman' && (<>
            <p className={sec}>Chairman&apos;s Message — homepage + /about/chairman</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={lCls}>Full Name</label>
                <input value={form.chairmanName ?? ''} onChange={e => F('chairmanName', e.target.value)} placeholder="Dr. Mrinal Kanti Baowaly" className={iCls}/></div>
              <div><label className={lCls}>Title / Designation</label>
                <input value={form.chairmanTitle ?? ''} onChange={e => F('chairmanTitle', e.target.value)} placeholder="Professor & Chairman" className={iCls}/></div>
              <div><label className={lCls}>Email 1</label>
                <input type="email" value={form.chairmanEmail ?? ''} onChange={e => F('chairmanEmail', e.target.value)} placeholder="baowaly@gmail.com" className={iCls}/></div>
              <div><label className={lCls}>Email 2 (official)</label>
                <input type="email" value={form.chairmanEmail2 ?? ''} onChange={e => F('chairmanEmail2', e.target.value)} placeholder="baowaly@gstu.edu.bd" className={iCls}/></div>
            </div>
            <PhotoUpload label="Chairman Photo" value={form.chairmanPhoto ?? ''} onChange={v => F('chairmanPhoto', v)}/>
            <div><label className={lCls}>Message <span className="text-slate-400 font-normal">(blank line = new paragraph)</span></label>
              <textarea rows={10} value={form.chairmanMessage ?? ''} onChange={e => F('chairmanMessage', e.target.value)}
                placeholder="Welcome to the Department…" className={taCls}/></div>
          </>)}

        </div>
      )}
    </div>
  );
}
