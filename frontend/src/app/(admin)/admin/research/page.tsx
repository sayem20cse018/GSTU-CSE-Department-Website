'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button   from '@/components/admin/ui/Button';
import EmptyState from '@/components/admin/ui/EmptyState';
import { cn }   from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

interface ResearchArea {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  facultyCount?: number;
  isActive: boolean;
  sortOrder: number;
}

const EMPTY = { name: '', description: '', icon: '🔬', isActive: true, sortOrder: 0 };

const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
const lCls = 'block text-xs font-semibold text-slate-700 mb-1.5';

const DEFAULT_AREAS = [
  { id:'1', name:'Machine Learning & Artificial Intelligence', description:'Deep learning, neural networks, NLP, computer vision.', icon:'🤖', isActive:true, sortOrder:1 },
  { id:'2', name:'Cybersecurity & Network Security', description:'Intrusion detection, cryptography, network protocols.', icon:'🔐', isActive:true, sortOrder:2 },
  { id:'3', name:'Internet of Things (IoT)', description:'Embedded systems, sensor networks, smart devices.', icon:'📡', isActive:true, sortOrder:3 },
  { id:'4', name:'Software Engineering', description:'Agile methods, software quality, testing.', icon:'⚙️', isActive:true, sortOrder:4 },
  { id:'5', name:'Data Science & Big Data', description:'Data mining, analytics, visualization.', icon:'📊', isActive:true, sortOrder:5 },
  { id:'6', name:'Computer Networks', description:'SDN, wireless, QoS, protocol design.', icon:'🌐', isActive:true, sortOrder:6 },
];

export default function ResearchAreasPage() {
  const [list,    setList]    = useState<ResearchArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState<ResearchArea | null>(null);
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [delId,   setDelId]   = useState<string | null>(null);
  const [err,     setErr]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Try API first, use defaults if not available
      const data = await adminGet<ResearchArea[]>('/research/areas').catch(() => null);
      setList(data?.length ? data : DEFAULT_AREAS as ResearchArea[]);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew()  { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(a: ResearchArea) {
    setEditing(a);
    setForm({ name: a.name, description: a.description ?? '', icon: a.icon ?? '🔬', isActive: a.isActive, sortOrder: a.sortOrder });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { setErr('Research area name is required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) await adminPatch(`/research/areas/${editing.id}`, form);
      else await adminPost('/research/areas', form);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this research area?')) return;
    setDelId(id);
    try { await adminDelete(`/research/areas/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
    finally { setDelId(null); }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Research Areas" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Research Areas</h1>
          <p className="text-sm text-slate-500 mt-0.5">{list.length} research area{list.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openNew} icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>}>
          Add Research Area
        </Button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-5">{editing ? 'Edit' : 'Add'} Research Area</h3>
            {err && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm mb-4">{err}</p>}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className={lCls}>Icon</label>
                  <input value={form.icon} onChange={e => F('icon', e.target.value)} placeholder="🔬" className={iCls}/>
                </div>
                <div className="col-span-3">
                  <label className={lCls}>Research Area Name *</label>
                  <input value={form.name} onChange={e => F('name', e.target.value)} placeholder="Machine Learning & AI" className={iCls}/>
                </div>
              </div>
              <div>
                <label className={lCls}>Description</label>
                <textarea rows={3} value={form.description} onChange={e => F('description', e.target.value)}
                  placeholder="Brief description of this research area…"
                  className={`${iCls} resize-none`}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lCls}>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => F('sortOrder', +e.target.value)} className={iCls}/>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => F('isActive', e.target.checked)} className="accent-green-600 w-4 h-4"/>
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing ? 'Update' : 'Add'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"/>)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState title="No research areas yet" description="Add the first research area." action={<Button onClick={openNew}>Add Research Area</Button>}/>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(a => (
            <div key={a.id} className={cn(
              'bg-white border-2 rounded-2xl p-5 hover:shadow-md transition group',
              a.isActive ? 'border-slate-200 hover:border-green-300' : 'border-slate-100 opacity-60',
            )}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{a.icon || '🔬'}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => openEdit(a)}
                    className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-700 transition">
                    Edit
                  </button>
                  <button onClick={() => del(a.id)} disabled={delId === a.id}
                    className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition">
                    Del
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">{a.name}</h3>
              {a.description && <p className="text-xs text-slate-500 line-clamp-2">{a.description}</p>}
              {!a.isActive && <span className="inline-block mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inactive</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
