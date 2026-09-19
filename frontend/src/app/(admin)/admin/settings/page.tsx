'use client';
import { useState, useEffect } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import { adminGet, adminPatch, adminPost } from '@/lib/api/admin-fetch';
import { useAuth } from '@/context/AuthContext';
import type { SiteSettings } from '@/lib/api/settings';
import { SETTINGS_FALLBACK } from '@/lib/api/settings';
import ImageUpload from '@/components/admin/ui/ImageUpload';

type Tab = 'identity' | 'contact' | 'social' | 'account';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'identity', label: 'Identity', icon: '🏛️' },
  { id: 'contact',  label: 'Contact',  icon: '📞' },
  { id: 'social',   label: 'Social',   icon: '🔗' },
  { id: 'account',  label: 'Account',  icon: '🔐' },
];

// ── shared classes (white background) ─────────────────────────────────────────
const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
const lCls = 'block text-xs font-semibold text-slate-700 mb-1.5';

export default function SettingsPage() {
  const [form,    setForm]    = useState<SiteSettings>(SETTINGS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [tab,     setTab]     = useState<Tab>('identity');

  const { admin } = useAuth();

  // Account change state
  const [profForm, setProfForm] = useState({ name: '', email: '' });
  const [profSaving, setProfSave] = useState(false);
  const [profMsg,   setProfMsg]   = useState('');
  const [profErr,   setProfErr]   = useState('');

  const [pwForm,  setPwForm]  = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSave] = useState(false);
  const [pwMsg,   setPwMsg]   = useState('');
  const [pwErr,   setPwErr]   = useState('');

  useEffect(() => {
    setLoading(true);
    adminGet<SiteSettings>('/settings')
      .then(d => setForm({ ...SETTINGS_FALLBACK, ...d }))
      .catch(() => {})
      .finally(() => setLoading(false));
    // Pre-fill profile form with current admin info
    if (admin) setProfForm({ name: admin.name ?? '', email: admin.email ?? '' });
  }, [admin]);

  const F = (k: keyof SiteSettings, v: string | number) => {
    setForm(p => ({ ...p, [k]: v })); setSaved(false);
  };

  async function save() {
    setSaving(true); setError(''); setSaved(false);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, key, __v, createdAt, updatedAt, ...payload } = form as SiteSettings & {
        id?: unknown; key?: unknown; __v?: unknown; createdAt?: unknown; updatedAt?: unknown;
      };
      await adminPatch<SiteSettings>('/settings', payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function changePassword() {
    setPwErr(''); setPwMsg('');
    if (!pwForm.currentPassword || !pwForm.newPassword) { setPwErr('All fields are required.'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwErr('New passwords do not match.'); return; }
    if (pwForm.newPassword.length < 8) { setPwErr('Minimum 8 characters.'); return; }
    setPwSave(true);
    try {
      await adminPost('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { setPwErr(e instanceof Error ? e.message : 'Failed'); }
    finally { setPwSave(false); }
  }

  async function updateProfile() {
    setProfErr(''); setProfMsg('');
    if (!profForm.name.trim()) { setProfErr('Name is required.'); return; }
    setProfSave(true);
    try {
      await adminPatch('/auth/update-profile', { name: profForm.name, email: profForm.email || undefined });
      setProfMsg('Profile updated!');
    } catch (e) { setProfErr(e instanceof Error ? e.message : 'Failed'); }
    finally { setProfSave(false); }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <AdminPageTitle title="Settings" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage department identity, contact info, and account</p>
        </div>
        {tab !== 'account' && (
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-green-600 font-semibold flex items-center gap-1">✓ Saved</span>}
            <button onClick={save} disabled={saving || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition bg-green-700 hover:bg-green-600">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">{error}</div>}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 flex-1 justify-center py-2 px-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">

          {/* ── IDENTITY ── */}
          {tab === 'identity' && (
            <>
              <p className={sectionLabel}>Department Identity</p>

              {/* Logos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-2 border-b border-slate-100">
                <ImageUpload
                  label="Department Logo"
                  value={form.deptLogo ?? ''}
                  onChange={v => F('deptLogo', v === '' ? '__CLEAR__' : v)}
                  hint="Shown in navbar, sidebar, login page and footer"
                />
                <ImageUpload
                  label="University Logo"
                  value={form.universityLogo ?? ''}
                  onChange={v => F('universityLogo', v === '' ? '__CLEAR__' : v)}
                  hint="Shown alongside dept logo where needed"
                />
              </div>

              <div>
                <label className={lCls}>Department Full Name</label>
                <input value={form.deptName} onChange={e => F('deptName', e.target.value)}
                  placeholder="Department of Computer Science & Engineering" className={iCls}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lCls}>Short Name</label>
                  <input value={form.deptShortName} onChange={e => F('deptShortName', e.target.value)} placeholder="Dept. of CSE" className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>Founded Year</label>
                  <input type="number" value={form.foundedYear} onChange={e => F('foundedYear', +e.target.value)} className={iCls}/>
                </div>
              </div>
              <div>
                <label className={lCls}>University Full Name</label>
                <input value={form.universityName} onChange={e => F('universityName', e.target.value)} className={iCls}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lCls}>University Short Name</label>
                  <input value={form.universityShortName} onChange={e => F('universityShortName', e.target.value)} className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>Tagline</label>
                  <input value={form.tagline} onChange={e => F('tagline', e.target.value)} className={iCls}/>
                </div>
              </div>
              <div>
                <label className={lCls}>Footer Text <span className="text-slate-400 font-normal">(optional)</span></label>
                <input value={form.footerText} onChange={e => F('footerText', e.target.value)}
                  placeholder="Leave blank to auto-generate" className={iCls}/>
              </div>

              {/* Header accent colour + prefix toggle */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Header Appearance</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={lCls}>Department Name Colour</label>
                    <div className="flex items-center gap-3">
                      <input type="color"
                        value={(form as unknown as Record<string,string>).headerAccentColor || '#1a7a3c'}
                        onChange={e => F('headerAccentColor' as keyof SiteSettings, e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"/>
                      <input type="text"
                        value={(form as unknown as Record<string,string>).headerAccentColor || '#1a7a3c'}
                        onChange={e => F('headerAccentColor' as keyof SiteSettings, e.target.value)}
                        placeholder="#1a7a3c" maxLength={7}
                        className={`${iCls} font-mono w-28`}/>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Dept. name color in the header (hex)</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className={lCls}>Show "Department of" Label</label>
                    <label className="flex items-center gap-3 cursor-pointer mt-1">
                      <div className="relative">
                        <input type="checkbox"
                          checked={(form as unknown as Record<string,boolean>).showDeptPrefix !== false}
                          onChange={e => F('showDeptPrefix' as keyof SiteSettings, e.target.checked as unknown as string)}
                          className="sr-only peer"/>
                        <div className="w-11 h-6 bg-slate-200 peer-checked:bg-green-600 rounded-full transition-colors"/>
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"/>
                      </div>
                      <span className="text-sm text-slate-700 font-medium">
                        {(form as unknown as Record<string,boolean>).showDeptPrefix !== false ? 'Showing' : 'Hidden'}
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">Toggle the small label above the dept name</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── CONTACT ── */}
          {tab === 'contact' && (
            <>
              <p className={sectionLabel}>Contact Information</p>
              {[
                { label:'Official Email',   k:'email',    type:'email', ph:'cse@gstu.edu.bd' },
                { label:'Phone Number',     k:'phone',    type:'tel',   ph:'+880-468-XXXXXX' },
                { label:'Office Address',   k:'address',  type:'text',  ph:'CSE Building, GSTU Campus, Gopalganj-8100' },
                { label:'Moodle LMS URL',   k:'moodleUrl',type:'url',   ph:'https://moodle.gstu.edu.bd' },
              ].map(f => (
                <div key={f.k}>
                  <label className={lCls}>{f.label}</label>
                  <input type={f.type}
                    value={String((form as unknown as Record<string,unknown>)[f.k] ?? '')}
                    onChange={e => F(f.k as keyof SiteSettings, e.target.value)}
                    placeholder={f.ph} className={iCls}/>
                </div>
              ))}
            </>
          )}

          {/* ── SOCIAL ── */}
          {tab === 'social' && (
            <>
              <p className={sectionLabel}>Social Media Links</p>
              {[
                { label:'Facebook',   k:'facebookUrl', ph:'https://facebook.com/gstu.cse' },
                { label:'Twitter/X',  k:'twitterUrl',  ph:'https://twitter.com/gstu_cse' },
                { label:'LinkedIn',   k:'linkedinUrl', ph:'https://linkedin.com/...' },
                { label:'YouTube',    k:'youtubeUrl',  ph:'https://youtube.com/@gstu_cse' },
              ].map(f => (
                <div key={f.k}>
                  <label className={lCls}>{f.label} Page URL</label>
                  <input type="url"
                    value={String((form as unknown as Record<string,unknown>)[f.k] ?? '')}
                    onChange={e => F(f.k as keyof SiteSettings, e.target.value)}
                    placeholder={f.ph} className={iCls}/>
                </div>
              ))}
            </>
          )}

          {/* ── ACCOUNT ── */}
          {tab === 'account' && (
            <>
              {/* Profile update */}
              <p className={sectionLabel}>Profile Information</p>
              <div>
                <label className={lCls}>Display Name</label>
                <input value={profForm.name} onChange={e => setProfForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Admin Name" className={iCls}/>
              </div>
              <div>
                <label className={lCls}>Email (Login Username)</label>
                <input type="email" value={profForm.email} onChange={e => setProfForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@example.com" className={iCls}/>
                <p className="text-xs text-slate-400 mt-1">⚠️ Changing email will change your login username.</p>
              </div>
              {profErr && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{profErr}</p>}
              {profMsg && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">✓ {profMsg}</p>}
              <button onClick={updateProfile} disabled={profSaving}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition bg-green-700 hover:bg-green-600">
                {profSaving ? 'Saving…' : 'Update Profile'}
              </button>

              {/* Password change */}
              <div className="border-t border-slate-100 pt-5 mt-2">
                <p className={sectionLabel}>Change Password</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                ⚠️ After changing password you will need to log in again.
              </div>
              <div>
                <label className={lCls}>Current Password</label>
                <input type="password" value={pwForm.currentPassword}
                  onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Current password" className={iCls} autoComplete="current-password"/>
              </div>
              <div>
                <label className={lCls}>New Password</label>
                <input type="password" value={pwForm.newPassword}
                  onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min 8 chars, uppercase + lowercase + number" className={iCls} autoComplete="new-password"/>
              </div>
              <div>
                <label className={lCls}>Confirm New Password</label>
                <input type="password" value={pwForm.confirmPassword}
                  onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat new password" className={iCls} autoComplete="new-password"/>
              </div>
              {pwErr && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{pwErr}</p>}
              {pwMsg && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">✓ {pwMsg}</p>}
              <button onClick={changePassword} disabled={pwSaving}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition bg-slate-700 hover:bg-slate-600">
                {pwSaving ? 'Changing…' : 'Change Password'}
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────────
const sectionLabel = 'text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-100';
