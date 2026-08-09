'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader from '@/components/admin/ui/PageHeader';
import Button     from '@/components/admin/ui/Button';
import { cn }     from '@/lib/utils/cn';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';

interface Stat { id: string; key: string; label: string; value: string; icon: string; sortOrder: number; isVisible: boolean; }

const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

export default function StatisticsAdminPage() {
  const [list,    setList]    = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits,   setEdits]   = useState<Record<string, Partial<Stat>>>({});
  const [saving,  setSaving]  = useState<string | null>(null);
  const [saved,   setSaved]   = useState<string | null>(null);
  const [err,     setErr]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Stat[]>('/statistics?admin=true')); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  // Update a field in the local edits map
  function edit(id: string, field: keyof Stat, value: string | boolean) {
    setEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  // Get current value for a stat (edited or original)
  function val<K extends keyof Stat>(s: Stat, key: K): Stat[K] {
    return (edits[s.id]?.[key] ?? s[key]) as Stat[K];
  }

  async function save(s: Stat) {
    const patch = edits[s.id];
    if (!patch) return;
    setSaving(s.id); setErr('');
    try {
      await adminPatch(`/statistics/${s.id}`, patch);
      // Update local list
      setList(prev => prev.map(item => item.id === s.id ? { ...item, ...patch } : item));
      setEdits(prev => { const next = { ...prev }; delete next[s.id]; return next; });
      setSaved(s.id);
      setTimeout(() => setSaved(prev => prev === s.id ? null : prev), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Statistics" />
      <PageHeader title="Statistics" description="Edit the numbers shown on the homepage. Click Save on each row after editing."/>

      {err && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="space-y-3">
          {list.map(s => {
            const isDirty = !!edits[s.id] && Object.keys(edits[s.id]!).length > 0;
            const isSaving = saving === s.id;
            const justSaved = saved === s.id;
            return (
              <div key={s.id}
                className={cn('bg-white border rounded-xl p-5 shadow-sm transition-all',
                  isDirty ? 'border-green-400 shadow-green-100' : 'border-slate-200')}>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  {/* Icon */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Icon</label>
                    <input value={String(val(s, 'icon'))} onChange={e => edit(s.id, 'icon', e.target.value)}
                      placeholder="👨‍🏫" className={iCls}/>
                  </div>
                  {/* Value */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Value</label>
                    <input value={String(val(s, 'value'))} onChange={e => edit(s.id, 'value', e.target.value)}
                      placeholder="14+" className={iCls}/>
                  </div>
                  {/* Label */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Label</label>
                    <input value={String(val(s, 'label'))} onChange={e => edit(s.id, 'label', e.target.value)}
                      className={iCls}/>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer shrink-0">
                      <input type="checkbox" checked={!!val(s, 'isVisible')}
                        onChange={e => edit(s.id, 'isVisible', e.target.checked)}
                        className="accent-green-600 w-4 h-4"/>
                      <span className="text-xs font-medium text-slate-600">Visible</span>
                    </label>
                    <Button size="sm" onClick={() => save(s)} loading={isSaving}
                      className={cn('shrink-0 transition-all', !isDirty && !isSaving ? 'opacity-40 cursor-default' : '')}>
                      {justSaved ? '✓ Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-800">
          💡 Edit any field and click <strong>Save</strong> on that row. Changes appear live on the homepage.
        </p>
      </div>
    </div>
  );
}
