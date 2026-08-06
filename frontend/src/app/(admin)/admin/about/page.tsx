'use client';
import { useState, useEffect } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button      from '@/components/admin/ui/Button';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';
import type { SiteSettings } from '@/lib/api/settings';
import { SETTINGS_FALLBACK } from '@/lib/api/settings';

type Tab = 'intro' | 'history' | 'vision' | 'photos';
const TABS: { id: Tab; label: string }[] = [
  { id: 'intro',   label: '🏛️  Introduction' },
  { id: 'history', label: '📜  History' },
  { id: 'vision',  label: '🎯  Vision & Mission' },
  { id: 'photos',  label: '📸  Section Photos' },
];

// ── shared input classes ──────────────────────────────────────────────────────
const iCls  = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
const taCls = `${iCls} resize-y`;
const lCls  = 'block text-xs font-semibold text-slate-700 mb-1';

export default function AboutAdminPage() {
  const [form,   setForm]   = useState<SiteSettings>(SETTINGS_FALLBACK);
  const [loading, setLoad]  = useState(true);
  const [saving,  setSave]  = useState(false);
  const [saved,   setSaved] = useState(false);
  const [err,     setErr]   = useState('');
  const [tab,     setTab]   = useState<Tab>('intro');

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, key, ...payload } = form as SiteSettings & { _id?: unknown; key?: unknown };
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
          <h1 className="text-xl font-bold text-slate-900">About Department</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage intro text, history, vision/mission and section photos</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-semibold">✓ Saved!</span>}
          <Button onClick={save} loading={saving}>Save Changes</Button>
        </div>
      </div>

      {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-5">{err}</div>}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-sm font-semibold transition ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

          {/* INTRODUCTION */}
          {tab === 'intro' && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100">
                Introduction — shown on homepage About section
              </p>
              <div>
                <label className={lCls}>Department Introduction</label>
                <textarea rows={8} value={form.aboutIntro ?? ''} onChange={e => F('aboutIntro', e.target.value)}
                  placeholder="The Department of Computer Science and Engineering at GSTU…"
                  className={taCls}/>
                <p className="text-xs text-slate-400 mt-1">This text appears on the homepage About tab.</p>
              </div>
            </>
          )}

          {/* HISTORY */}
          {tab === 'history' && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100">
                History — shown on /about/history page
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                📝 The history page at <strong>/about/history</strong> uses milestone data.
                Edit milestone entries directly in the page file, or use the Introduction field for a brief history paragraph below.
              </div>
              <div>
                <label className={lCls}>Brief History Paragraph (optional)</label>
                <textarea rows={6} value={(form as unknown as Record<string,string>)['aboutHistory'] ?? ''} onChange={e => F('aboutHistory' as keyof SiteSettings, e.target.value)}
                  placeholder="The department was founded in 2011…"
                  className={taCls}/>
              </div>
            </>
          )}

          {/* VISION & MISSION */}
          {tab === 'vision' && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100">
                Vision & Mission — shown on /about/vision page
              </p>
              <div>
                <label className={lCls}>Vision Statement</label>
                <textarea rows={5} value={form.aboutVision ?? ''} onChange={e => F('aboutVision', e.target.value)}
                  placeholder="To be a leading center of excellence in Computer Science and Engineering…"
                  className={taCls}/>
              </div>
              <div>
                <label className={lCls}>Mission Statement</label>
                <textarea rows={7} value={form.aboutMission ?? ''} onChange={e => F('aboutMission', e.target.value)}
                  placeholder="Our mission is to provide rigorous, high-quality education…"
                  className={taCls}/>
              </div>
            </>
          )}

          {/* PHOTOS */}
          {tab === 'photos' && (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100">
                About Section Photos — 4 photos shown in the homepage photo grid
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {([
                  ['Photo 1 — Large (top-left)',      'aboutImage1'],
                  ['Photo 2 — Small (top-right)',     'aboutImage2'],
                  ['Photo 3 — Small (bottom-right)',  'aboutImage3'],
                  ['Photo 4 — Wide (bottom)',         'aboutImage4'],
                ] as [string, keyof SiteSettings][]).map(([label, key]) => (
                  <div key={key} className="border border-slate-200 rounded-xl p-4">
                    <ImageUpload
                      label={label}
                      value={(form[key] as string) ?? ''}
                      onChange={v => F(key, v)}
                      dark={false}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">Recommended size: 800×600px or larger. If no photo uploaded, placeholder images are shown.</p>
            </>
          )}

        </div>
      )}
    </div>
  );
}
