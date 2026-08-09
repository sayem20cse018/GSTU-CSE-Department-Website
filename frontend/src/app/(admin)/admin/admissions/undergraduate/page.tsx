'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button    from '@/components/admin/ui/Button';
import EmptyState from '@/components/admin/ui/EmptyState';
import Badge     from '@/components/admin/ui/Badge';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { cn }    from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

interface Program {
  id: string; name: string; degree: string; duration: string;
  totalCredits: number; description: string; highlights: string[];
  totalSeats?: number; isActive: boolean;
}

const DEGREES = ['BSc','MSc','MPhil','PhD'];
const EMPTY = { name:'', degree:'BSc', duration:'4 Years', totalCredits:160,
  description:'', highlights:'', totalSeats:60, isActive:true };

const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
const lCls = 'block text-xs font-semibold text-slate-700 mb-1.5';

export default function AdmissionsUGPage() {
  const [list,    setList]    = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState<Program|null>(null);
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [delId,   setDelId]   = useState<string|null>(null);
  const [err,     setErr]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Program[]>('/academics/programs')); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(p: Program) {
    setEditing(p);
    setForm({ name:p.name, degree:p.degree, duration:p.duration, totalCredits:p.totalCredits,
      description:p.description, highlights:(p.highlights??[]).join('\n'), totalSeats:p.totalSeats??60, isActive:p.isActive });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { setErr('Program name required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { ...form, highlights: form.highlights.split('\n').map(s=>s.trim()).filter(Boolean) };
      if (editing) await adminPatch(`/academics/programs/${editing.id}`, payload);
      else await adminPost('/academics/programs', payload);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this program?')) return;
    setDelId(id);
    try { await adminDelete(`/academics/programs/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
    finally { setDelId(null); }
  }

  const DEGREE_COLOR: Record<string, string> = {
    BSc:'bg-blue-100 text-blue-700', MSc:'bg-violet-100 text-violet-700',
    MPhil:'bg-amber-100 text-amber-700', PhD:'bg-emerald-100 text-emerald-700'
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Academic Programs" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Academic Programs</h1>
          <p className="text-sm text-slate-500 mt-0.5">BSc, MSc, MPhil and PhD programs — edit admission info directly</p>
        </div>
        <Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>
          Add Program
        </Button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-5">{editing ? 'Edit' : 'Add'} Program</h3>
            {err && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm mb-4">{err}</p>}
            <div className="space-y-4">
              <div><label className={lCls}>Program Name *</label>
                <input value={form.name} onChange={e=>F('name',e.target.value)} placeholder="Bachelor of Science in CSE" className={iCls}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lCls}>Degree</label>
                  <select value={form.degree} onChange={e=>F('degree',e.target.value)} className={iCls}>
                    {DEGREES.map(d=><option key={d} value={d}>{d}</option>)}
                  </select></div>
                <div><label className={lCls}>Duration</label>
                  <input value={form.duration} onChange={e=>F('duration',e.target.value)} placeholder="4 Years" className={iCls}/></div>
                <div><label className={lCls}>Total Credits</label>
                  <input type="number" value={form.totalCredits} onChange={e=>F('totalCredits',+e.target.value)} className={iCls}/></div>
                <div><label className={lCls}>Total Seats</label>
                  <input type="number" value={form.totalSeats} onChange={e=>F('totalSeats',+e.target.value)} className={iCls}/></div>
              </div>
              <div><label className={lCls}>Description</label>
                <textarea rows={4} value={form.description} onChange={e=>F('description',e.target.value)}
                  placeholder="Program overview…" className={`${iCls} resize-none`}/></div>
              <div><label className={lCls}>Highlights <span className="text-slate-400 font-normal">(one per line)</span></label>
                <textarea rows={5} value={form.highlights} onChange={e=>F('highlights',e.target.value)}
                  placeholder="Algorithm & Data Structures&#10;Software Engineering&#10;AI & Machine Learning" className={`${iCls} resize-none font-mono text-xs`}/></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>F('isActive',e.target.checked)} className="accent-green-600 w-4 h-4"/>
                <span className="text-sm font-medium text-slate-700">Active (visible on website)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing ? 'Update' : 'Add'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : list.length === 0 ? (
          <EmptyState title="No programs yet" description="Add the first academic program." action={<Button onClick={openNew}>Add Program</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Program</th>
              <th className="text-center px-4 py-3">Degree</th>
              <th className="text-center px-4 py-3 hidden sm:table-cell">Duration</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Credits</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {list.map((p,i) => (
                <tr key={p.id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50',i%2?'bg-white':'')}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${DEGREE_COLOR[p.degree]??'bg-slate-100 text-slate-600'}`}>{p.degree}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 hidden sm:table-cell">{p.duration}</td>
                  <td className="px-4 py-3 text-center text-slate-600 hidden md:table-cell">{p.totalCredits}</td>
                  <td className="px-4 py-3 text-center"><Badge variant={p.isActive?'success':'neutral'}>{p.isActive?'Active':'Draft'}</Badge></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(p)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId===p.id} onClick={()=>del(p.id)}>Del</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
