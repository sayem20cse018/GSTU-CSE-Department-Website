'use client';
import { useState, useEffect } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';
import type { SiteSettings } from '@/lib/api/settings';
import { SETTINGS_FALLBACK } from '@/lib/api/settings';
import { NAV_LINKS } from '@/constants';

type NavLink = { label: string; href: string; children?: readonly { label: string; href: string }[] };

export default function NavManagerPage() {
  const [settings, setSettings] = useState<SiteSettings>(SETTINGS_FALLBACK);
  const [hidden,   setHidden]   = useState<string[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [err,      setErr]      = useState('');

  useEffect(() => {
    setLoading(true);
    adminGet<SiteSettings>('/settings')
      .then(d => {
        setSettings(prev => ({ ...prev, ...d }));
        setHidden(d.hiddenNavItems ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggle(href: string) {
    setHidden(prev => prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]);
    setSaved(false);
  }

  async function save() {
    setSaving(true); setErr('');
    try {
      await adminPatch('/settings', { hiddenNavItems: hidden });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  const navLinks = NAV_LINKS as unknown as readonly NavLink[];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Navigation Manager" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Navigation Manager</h1>
          <p className="text-sm text-slate-500 mt-0.5">Control which menu items appear on the public website</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-semibold">✓ Saved</span>}
          <Button onClick={save} loading={saving}>Save Changes</Button>
        </div>
      </div>

      {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{err}</div>}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
        ⚠️ Hiding a nav item only hides it from the menu — the page still exists and is accessible by direct URL.
        Use this to temporarily hide sections under development.
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="space-y-3">
          {navLinks.map(item => {
            const isHidden = hidden.includes(item.href);
            return (
              <div key={item.href} className={`bg-white border rounded-2xl overflow-hidden transition-all ${isHidden ? 'border-red-200 opacity-60' : 'border-slate-200'}`}>
                {/* Parent item */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{item.label}</span>
                      {isHidden && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">HIDDEN</span>}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{item.href}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" checked={!isHidden} onChange={() => toggle(item.href)} className="sr-only peer"/>
                    <div className="w-11 h-6 bg-slate-200 peer-checked:bg-green-600 rounded-full transition peer-focus:ring-2 peer-focus:ring-green-500"/>
                    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-5"/>
                  </label>
                </div>

                {/* Child items */}
                {item.children && item.children.length > 0 && (
                  <div className="border-t border-slate-100 px-5 pb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-3">
                      {item.children.map(child => {
                        const childHidden = hidden.includes(child.href);
                        return (
                          <label key={child.href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer group">
                            <input type="checkbox" checked={!childHidden} onChange={() => toggle(child.href)} className="accent-green-600 w-4 h-4"/>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${childHidden ? 'line-through text-slate-400' : 'text-slate-700'}`}>{child.label}</p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">{child.href}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
