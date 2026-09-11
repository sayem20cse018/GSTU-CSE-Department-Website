'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge from '@/components/admin/ui/Badge';
import PageHeader from '@/components/admin/ui/PageHeader';
import EmptyState from '@/components/admin/ui/EmptyState';
import { useToast } from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import type { Program } from '@/lib/api/academics';

const DEGREES = ['BSc','MSc','PhD'] as const;
const EMPTY = { name:'', degree:'BSc' as typeof DEGREES[number], duration:'', totalCredits:0, description:'', objectives:'', eligibility:'', totalSeats:0, tuitionFee:'', isActive:true };

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [open,     setOpen]     = useState(false);
  const [editing,  setEditing]  = useState<Program|null>(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [err,      setErr]      = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await adminGet<Program[]>('/academics/programs?admin=true'); setPrograms(Array.isArray(d)?d:[]); }
    catch { setPrograms([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  function openNew() { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(p: Program) {
    setEditing(p);
    setForm({ name:p.name, degree:p.degree as typeof DEGREES[number], duration:p.duration,
      totalCredits:p.totalCredits, description:p.description, objectives:p.objectives,
      eligibility:p.eligibility, totalSeats:p.totalSeats??0, tuitionFee:p.tuitionFee??'', isActive:p.isActive });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { setErr('Program name is required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) { await adminPatch(`/academics/programs/${editing.id}`, form); toast.success('Program updated!'); }
      else          { await adminPost('/academics/programs', form);               toast.success('Program created!'); }
      setOpen(false); load();
    } catch(e) { const m=e instanceof Error?e.message:'Save failed'; setErr(m); toast.error(m); }
    finally { setSaving(false); }
  }

  async function remove(p: Program) {
    const ok = await confirm({ title:`Delete "${p.name}"?`, confirmLabel:'Delete' });
    if (!ok) return;
    try { await adminDelete(`/academics/programs/${p.id}`); toast.success('Deleted'); load(); }
    catch(e) { toast.error(e instanceof Error?e.message:'Delete failed'); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';
  const DEG_COLOR: Record<string,'info'|'neutral'|'success'> = { BSc:'info', MSc:'neutral', PhD:'success' };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Manage Programs" />
      {ConfirmDialog}
      <PageHeader title="Academic Programs" description="Manage BSc, MSc and PhD programs."
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Program</Button>}/>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing?'Edit Program':'New Program'}</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>}
            <div className="space-y-4">
              {[{l:'Program Name *',k:'name',p:'Bachelor of Science in CSE'},{l:'Duration',k:'duration',p:'4 Years'}].map(f=>(
                <div key={f.k}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.l}</label>
                  <input value={form[f.k as keyof typeof form] as string} onChange={e=>F(f.k as keyof typeof form,e.target.value)} placeholder={f.p} className={iCls}/></div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree</label>
                  <select value={form.degree} onChange={e=>F('degree',e.target.value)} className={iCls}>
                    {DEGREES.map(d=><option key={d} value={d}>{d}</option>)}
                  </select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Total Credits</label>
                  <input type="number" value={form.totalCredits} onChange={e=>F('totalCredits',+e.target.value)} className={iCls}/></div>
              </div>
              {[{l:'Description',k:'description'},{l:'Objectives',k:'objectives'},{l:'Eligibility',k:'eligibility'}].map(f=>(
                <div key={f.k}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.l}</label>
                  <textarea rows={3} value={form[f.k as keyof typeof form] as string} onChange={e=>F(f.k as keyof typeof form,e.target.value)} className={`${iCls} resize-none`}/></div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Total Seats</label>
                  <input type="number" value={form.totalSeats} onChange={e=>F('totalSeats',+e.target.value)} className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Tuition Fee</label>
                  <input value={form.tuitionFee} onChange={e=>F('tuitionFee',e.target.value)} placeholder="5000 BDT/sem" className={iCls}/></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>F('isActive',e.target.checked)} className="accent-green-600"/>
                <span className="text-sm font-medium text-slate-700">Active (visible on website)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : programs.length === 0 ? (
          <EmptyState title="No programs yet" description="Add your first academic program."
            action={<Button onClick={openNew}>Add Program</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Program</th>
              <th className="text-center px-4 py-3">Degree</th>
              <th className="text-center px-4 py-3">Credits</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {programs.map((p,i) => (
                <tr key={p.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i%2?'bg-slate-50/30':''}`}>
                  <td className="px-5 py-4"><p className="font-medium text-slate-900">{p.name}</p><p className="text-xs text-slate-500 mt-0.5">{p.duration}</p></td>
                  <td className="px-4 py-4 text-center"><Badge variant={DEG_COLOR[p.degree]??'neutral'}>{p.degree}</Badge></td>
                  <td className="px-4 py-4 text-center text-slate-500">{p.totalCredits}</td>
                  <td className="px-4 py-4 text-center"><Badge variant={p.isActive?'success':'neutral'}>{p.isActive?'Active':'Inactive'}</Badge></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => remove(p)}>Delete</Button>
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
