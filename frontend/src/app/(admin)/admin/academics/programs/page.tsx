'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge from '@/components/admin/ui/Badge';
import PageHeader from '@/components/admin/ui/PageHeader';
import EmptyState from '@/components/admin/ui/EmptyState';
import type { Program } from '@/lib/api/academics';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api') + '/academics/programs';

const DEGREE_COLORS: Record<string, 'info'|'neutral'|'success'> = { BSc:'info', MSc:'neutral', PhD:'success' };

export default function AdminProgramsPage() {
  const [programs, setPrograms]       = useState<Program[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Program | null>(null);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState<string | null>(null);

  const [form, setForm] = useState({
    name:'', degree:'BSc' as 'BSc'|'MSc'|'PhD', duration:'', totalCredits:0,
    description:'', objectives:'', eligibility:'', totalSeats:0, tuitionFee:'', isActive:true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(API, { credentials:'include' });
      const d = await r.json() as { data: Program[] };
      setPrograms(d.data ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(null);
    setForm({ name:'', degree:'BSc', duration:'', totalCredits:0, description:'', objectives:'', eligibility:'', totalSeats:0, tuitionFee:'', isActive:true });
    setShowForm(true);
  }

  function openEdit(p: Program) {
    setEditing(p);
    setForm({ name:p.name, degree:p.degree, duration:p.duration, totalCredits:p.totalCredits, description:p.description, objectives:p.objectives, eligibility:p.eligibility, totalSeats:p.totalSeats??0, tuitionFee:p.tuitionFee??'', isActive:p.isActive });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      const url   = editing ? `${API}/${editing.id}` : API;
      const method= editing ? 'PATCH' : 'POST';
      const r = await fetch(url, { method, headers:{ 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) }, body:JSON.stringify(form), credentials:'include' });
      if (r.ok) { setShowForm(false); load(); }
      else { const e = await r.json() as { message?: string }; alert(e.message ?? 'Save failed'); }
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this program?')) return;
    setDeleting(id);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      await fetch(`${API}/${id}`, { method:'DELETE', headers:{ ...(token?{Authorization:`Bearer ${token}`}:{}) }, credentials:'include' });
      load();
    } finally { setDeleting(null); }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Manage Programs" />
      <PageHeader title="Academic Programs" description="Manage BSc, MSc and PhD program details."
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Program</Button>}/>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">{editing?'Edit Program':'New Program'}</h3>
            <div className="space-y-4">
              {[
                { label:'Program Name', key:'name', type:'text', placeholder:'Bachelor of Science in CSE' },
                { label:'Duration', key:'duration', type:'text', placeholder:'4 Years' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form] as string}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/>
                </div>))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree</label>
                  <select value={form.degree} onChange={e => setForm(p=>({...p,degree:e.target.value as 'BSc'|'MSc'|'PhD'}))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="BSc">BSc</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Total Credits</label>
                  <input type="number" value={form.totalCredits}
                    onChange={e=>setForm(p=>({...p,totalCredits:+e.target.value}))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
                </div>
              </div>

              {[{label:'Description',key:'description'},{label:'Objectives',key:'objectives'},{label:'Eligibility',key:'eligibility'}].map(f=>(
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                  <textarea rows={3} value={form[f.key as keyof typeof form] as string}
                    onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/>
                </div>))}

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Total Seats</label>
                  <input type="number" value={form.totalSeats} onChange={e=>setForm(p=>({...p,totalSeats:+e.target.value}))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Tuition Fee</label>
                  <input type="text" value={form.tuitionFee} onChange={e=>setForm(p=>({...p,tuitionFee:e.target.value}))} placeholder="e.g. 5000 BDT/semester"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>setForm(p=>({...p,isActive:e.target.checked}))} className="accent-green-600"/>
                <span className="text-sm font-medium text-slate-700">Active (visible on website)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
              <Button variant="secondary" onClick={()=>setShowForm(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>)}

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : programs.length === 0 ? (
          <EmptyState title="No programs yet" description="Add your first academic program." action={<Button onClick={openNew}>Add Program</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Program</th>
              <th className="text-center px-4 py-3">Degree</th>
              <th className="text-center px-4 py-3">Credits</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {programs.map((p,i)=>(
                <tr key={p.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i%2?'bg-white/[0.02]':''}`}>
                  <td className="px-5 py-4"><p className="font-medium text-white">{p.name}</p><p className="text-xs text-slate-500 mt-0.5">{p.duration}</p></td>
                  <td className="px-4 py-4 text-center"><Badge variant={DEGREE_COLORS[p.degree]??'neutral'}>{p.degree}</Badge></td>
                  <td className="px-4 py-4 text-center text-slate-300">{p.totalCredits}</td>
                  <td className="px-4 py-4 text-center"><Badge variant={p.isActive?'success':'neutral'}>{p.isActive?'Active':'Inactive'}</Badge></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(p)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={deleting===p.id} onClick={()=>remove(p.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>)}
      </div>
    </div>
  );
}
