'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import { useToast }   from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { cn } from '@/lib/utils/cn';
import { adminGet, adminPatch, adminPost, adminDelete } from '@/lib/api/admin-fetch';

interface Stat {
  id: string; key: string; label: string; value: string;
  icon: string; sortOrder: number; isVisible: boolean;
}

const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

export default function StatisticsAdminPage() {
  const [list,      setList]      = useState<Stat[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [edits,     setEdits]     = useState<Record<string, Partial<Stat>>>({});
  const [saving,    setSaving]    = useState<string | null>(null);
  const [saved,     setSaved]     = useState<string | null>(null);
  const [err,       setErr]       = useState('');
  // Add new stat
  const [addOpen,   setAddOpen]   = useState(false);
  const [addForm,   setAddForm]   = useState({ key:'', label:'', value:'', icon:'📊', sortOrder:10 });
  const [addSaving, setAddSaving] = useState(false);
  const [addErr,    setAddErr]    = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Stat[]>('/statistics?admin=true')); }
    catch { toast.error('Failed to load'); setList([]); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { load(); }, [load]);

  function edit(id: string, field: keyof Stat, value: string | boolean) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  }

  function val<K extends keyof Stat>(s: Stat, key: K): Stat[K] {
    return (edits[s.id]?.[key] ?? s[key]) as Stat[K];
  }

  async function save(s: Stat) {
    const patch = edits[s.id];
    if (!patch || Object.keys(patch).length === 0) return;
    setSaving(s.id); setErr('');
    try {
      await adminPatch(`/statistics/${s.id}`, patch);
      setList(prev => prev.map(item => item.id === s.id ? { ...item, ...patch } : item));
      setEdits(prev => { const next = { ...prev }; delete next[s.id]; return next; });
      setSaved(s.id);
      toast.success('Saved!');
      setTimeout(() => setSaved(prev => prev === s.id ? null : prev), 2500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(null);
    }
  }

  async function addStat() {
    if (!addForm.key || !addForm.label || !addForm.value) {
      setAddErr('Key, label and value are required.'); return;
    }
    setAddSaving(true); setAddErr('');
    try {
      await adminPost('/statistics', addForm);
      toast.success('Stat added!');
      setAddOpen(false);
      setAddForm({ key:'', label:'', value:'', icon:'📊', sortOrder:10 });
      load();
    } catch (e) { setAddErr(e instanceof Error?e.message:'Failed'); }
    finally { setAddSaving(false); }
  }

  async function delStat(s: Stat) {
    const ok = await confirm({ title:`Delete "${s.label}"?`, confirmLabel:'Delete' });
    if (!ok) return;
    try { await adminDelete(`/statistics/${s.id}`); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e instanceof Error?e.message:'Delete failed'); }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Statistics" />
      {ConfirmDialog}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Homepage Statistics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Edit counters shown on the homepage. Multiple stats supported.</p>
        </div>
        <Button onClick={() => { setAddOpen(true); setAddErr(''); }}
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>
          Add Stat
        </Button>
      </div>

      {err && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

      {/* Add stat modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Add New Statistic</h3>
              <button onClick={() => setAddOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {addErr && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{addErr}</div>}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Icon (emoji)</label>
                  <input value={addForm.icon} onChange={e=>setAddForm(p=>({...p,icon:e.target.value}))} placeholder="📊" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Value</label>
                  <input value={addForm.value} onChange={e=>setAddForm(p=>({...p,value:e.target.value}))} placeholder="500+" className={iCls}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Label *</label>
                <input value={addForm.label} onChange={e=>setAddForm(p=>({...p,label:e.target.value}))} placeholder="Total Students" className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Key (unique identifier) *</label>
                <input value={addForm.key} onChange={e=>setAddForm(p=>({...p,key:e.target.value.toLowerCase().replace(/\s+/g,'_')}))} placeholder="total_students" className={`${iCls} font-mono`}/>
                <p className="text-[11px] text-slate-400 mt-1">Lowercase, underscores only</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sort Order</label>
                <input type="number" value={addForm.sortOrder} onChange={e=>setAddForm(p=>({...p,sortOrder:+e.target.value}))} className={iCls}/>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={addStat} loading={addSaving} className="flex-1">Add Stat</Button>
              <Button variant="secondary" onClick={() => setAddOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5,6].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
      ) : list.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-semibold text-slate-600">No statistics yet</p>
          <p className="text-sm mt-1">Click "Add Stat" to create the first counter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(s => {
            const isDirty   = !!edits[s.id] && Object.keys(edits[s.id]!).length > 0;
            const isSaving  = saving === s.id;
            const justSaved = saved === s.id;
            return (
              <div key={s.id} className={cn(
                'bg-white border rounded-xl p-5 shadow-sm transition-all',
                isDirty ? 'border-green-400 shadow-green-100' : 'border-slate-200',
              )}>
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="w-14 h-14 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl">{String(val(s,'icon'))}</span>
                    <span className="text-[10px] font-black text-green-700 leading-none mt-0.5">{String(val(s,'value'))}</span>
                  </div>

                  {/* Fields */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Icon</label>
                      <input value={String(val(s,'icon'))} onChange={e=>edit(s.id,'icon',e.target.value)} className={iCls}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Value</label>
                      <input value={String(val(s,'value'))} onChange={e=>edit(s.id,'value',e.target.value)} placeholder="14+" className={iCls}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-1">Label</label>
                      <input value={String(val(s,'label'))} onChange={e=>edit(s.id,'label',e.target.value)} className={iCls}/>
                    </div>
                    <div className="flex items-end gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0 mb-2">
                        <input type="checkbox" checked={!!val(s,'isVisible')}
                          onChange={e=>edit(s.id,'isVisible',e.target.checked)}
                          className="accent-green-600 w-4 h-4"/>
                        <span className="text-xs font-medium text-slate-600">Visible</span>
                      </label>
                      <Button size="sm" onClick={() => save(s)} loading={isSaving}
                        className={cn('shrink-0', !isDirty&&!isSaving?'opacity-40':'')}>
                        {justSaved ? '✓' : 'Save'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => delStat(s)}>Del</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 Edit any field and click <strong>Save</strong>. Use <strong>Add Stat</strong> to add unlimited new counters. All changes appear live on the homepage.
        </p>
      </div>
    </div>
  );
}
