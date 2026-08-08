'use client';
import { useState, useEffect } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge  from '@/components/admin/ui/Badge';
import { cn } from '@/lib/utils/cn';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';
import type { SiteSettings } from '@/lib/api/settings';
import { SETTINGS_FALLBACK } from '@/lib/api/settings';
import { NAV_LINKS } from '@/constants';

// ── Types ─────────────────────────────────────────────────────────────────────
interface CustomNavItem { id: string; label: string; href: string; parentLabel?: string; position: 'top' | 'child'; }
type NavLink = { label: string; href: string; children?: readonly { label: string; href: string }[] };

const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
const lCls = 'block text-xs font-semibold text-slate-700 mb-1';

// ── Toggle switch component ────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer"/>
      <div className="w-10 h-5 bg-slate-200 peer-checked:bg-green-600 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-green-500"/>
      <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-all peer-checked:translate-x-5"/>
    </label>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NavManagerPage() {
  const [hidden,  setHidden]  = useState<string[]>([]);
  const [custom,  setCustom]  = useState<CustomNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [err,     setErr]     = useState('');

  // Add-new form
  const [showAdd,  setShowAdd]  = useState(false);
  const [newItem,  setNewItem]  = useState({ label: '', href: '', position: 'top' as 'top'|'child', parentLabel: '' });
  const [addErr,   setAddErr]   = useState('');

  useEffect(() => {
    setLoading(true);
    adminGet<SiteSettings>('/settings')
      .then(d => {
        setHidden(d.hiddenNavItems ?? []);
        // Custom items stored as JSON in a settings field
        try {
          const raw = (d as unknown as Record<string,string>).customNavItems;
          if (raw) setCustom(JSON.parse(raw));
        } catch { /* ignore */ }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleHide(href: string) {
    setHidden(p => p.includes(href) ? p.filter(h => h !== href) : [...p, href]);
    setSaved(false);
  }

  async function save() {
    setSaving(true); setErr('');
    try {
      await adminPatch('/settings', {
        hiddenNavItems: hidden,
        customNavItems: JSON.stringify(custom),
      });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  function addCustom() {
    setAddErr('');
    if (!newItem.label.trim()) { setAddErr('Label is required.'); return; }
    if (!newItem.href.trim()) { setAddErr('URL/path is required.'); return; }
    const item: CustomNavItem = {
      id: Date.now().toString(),
      label: newItem.label.trim(),
      href: newItem.href.startsWith('/') || newItem.href.startsWith('http') ? newItem.href.trim() : `/${newItem.href.trim()}`,
      position: newItem.position,
      parentLabel: newItem.position === 'child' ? newItem.parentLabel : undefined,
    };
    setCustom(p => [...p, item]);
    setNewItem({ label: '', href: '', position: 'top', parentLabel: '' });
    setShowAdd(false);
    setSaved(false);
  }

  function removeCustom(id: string) {
    setCustom(p => p.filter(i => i.id !== id));
    setSaved(false);
  }

  const navLinks = NAV_LINKS as unknown as readonly NavLink[];
  const topParents = navLinks.map(l => l.label);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Navigation Manager" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Navigation Manager</h1>
          <p className="text-sm text-slate-500 mt-0.5">Control public website navigation — hide, show, or add menu items</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-semibold flex items-center gap-1">✓ Saved</span>}
          <Button onClick={save} loading={saving}>Save All Changes</Button>
        </div>
      </div>

      {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{err}</div>}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <div className="w-4 h-4 rounded bg-green-600"/>
          <span>Visible in menu</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <div className="w-4 h-4 rounded bg-slate-200"/>
          <span>Hidden from menu (page still accessible)</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"/>)}
        </div>
      ) : (
        <>
          {/* ── Default nav items — card grid ── */}
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Default Navigation Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {navLinks.map(item => {
              const isHidden = hidden.includes(item.href);
              const visibleChildren = item.children?.filter(c => !hidden.includes(c.href));
              const hiddenChildCount = (item.children?.length ?? 0) - (visibleChildren?.length ?? 0);

              return (
                <div key={item.href}
                  className={cn('bg-white border-2 rounded-2xl overflow-hidden transition-all hover:shadow-sm',
                    isHidden ? 'border-red-200 bg-red-50/30' : 'border-slate-200')}>

                  {/* Card header */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('font-bold text-sm', isHidden ? 'line-through text-slate-400' : 'text-slate-900')}>
                          {item.label}
                        </span>
                        {isHidden && <Badge variant="danger">Hidden</Badge>}
                        {!isHidden && hiddenChildCount > 0 && (
                          <Badge variant="warning">{hiddenChildCount} sub-item{hiddenChildCount>1?'s':''} hidden</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{item.href}</p>
                    </div>
                    <Toggle checked={!isHidden} onChange={() => toggleHide(item.href)}/>
                  </div>

                  {/* Sub-items */}
                  {item.children && item.children.length > 0 && !isHidden && (
                    <div className="border-t border-slate-100 px-4 pb-3 pt-2.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        {item.children.map(child => {
                          const childHidden = hidden.includes(child.href);
                          return (
                            <label key={child.href}
                              className={cn('flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors',
                                childHidden ? 'bg-red-50' : 'hover:bg-slate-50')}>
                              <input type="checkbox" checked={!childHidden} onChange={() => toggleHide(child.href)} className="accent-green-600 w-3.5 h-3.5 shrink-0"/>
                              <span className={cn('text-xs truncate', childHidden ? 'line-through text-slate-400' : 'text-slate-700')}>
                                {child.label}
                              </span>
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

          {/* ── Custom nav items ── */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom Navigation Items</h3>
            <button onClick={() => setShowAdd(v => !v)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white bg-green-700 hover:bg-green-600 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              Add Nav Item
            </button>
          </div>

          {/* Add form */}
          {showAdd && (
            <div className="bg-white border-2 border-green-200 rounded-2xl p-5 mb-4 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4">New Navigation Item</h4>
              {addErr && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 mb-3">{addErr}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lCls}>Label *</label>
                  <input value={newItem.label} onChange={e => setNewItem(p=>({...p,label:e.target.value}))} placeholder="e.g. Alumni" className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>URL / Path *</label>
                  <input value={newItem.href} onChange={e => setNewItem(p=>({...p,href:e.target.value}))} placeholder="/alumni or https://…" className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>Position</label>
                  <select value={newItem.position} onChange={e => setNewItem(p=>({...p,position:e.target.value as 'top'|'child'}))} className={iCls}>
                    <option value="top">Top-level menu item</option>
                    <option value="child">Sub-item (dropdown)</option>
                  </select>
                </div>
                {newItem.position === 'child' && (
                  <div>
                    <label className={lCls}>Parent Menu</label>
                    <select value={newItem.parentLabel} onChange={e => setNewItem(p=>({...p,parentLabel:e.target.value}))} className={iCls}>
                      <option value="">Select parent…</option>
                      {topParents.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addCustom} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-green-700 hover:bg-green-600 transition">Add Item</button>
                <button onClick={() => { setShowAdd(false); setAddErr(''); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition">Cancel</button>
              </div>
            </div>
          )}

          {/* Custom items list */}
          {custom.length === 0 ? (
            <div className="text-center py-8 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
              <p className="text-sm">No custom navigation items yet.</p>
              <p className="text-xs mt-1">Click &ldquo;Add Nav Item&rdquo; to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {custom.map(item => (
                <div key={item.id} className="bg-white border-2 border-green-100 rounded-2xl px-4 py-3 flex items-center gap-3 hover:shadow-sm transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.label}</span>
                      <Badge variant="success">{item.position === 'child' ? `Under ${item.parentLabel}` : 'Top-level'}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{item.href}</p>
                  </div>
                  <button onClick={() => removeCustom(item.id)}
                    className="shrink-0 text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2.5 py-1 rounded-lg transition">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-bold mb-1">ℹ️ How custom nav items work</p>
            <ul className="space-y-0.5 text-xs">
              <li>• <strong>Top-level</strong> items appear as main menu entries</li>
              <li>• <strong>Sub-items</strong> appear in the dropdown of the selected parent</li>
              <li>• Custom items link to any URL — internal pages or external sites</li>
              <li>• Click <strong>Save All Changes</strong> to apply to the live website</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
