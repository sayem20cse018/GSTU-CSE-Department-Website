'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge from '@/components/admin/ui/Badge';
import PageHeader from '@/components/admin/ui/PageHeader';
import EmptyState from '@/components/admin/ui/EmptyState';
import type { Laboratory } from '@/lib/api/academics';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api') + '/academics/labs';

const EMPTY_FORM = { name:'', slug:'', description:'', shortDescription:'', location:'', capacity:0, workstations:0, inCharge:'', inChargeEmail:'', labType:'both' as 'teaching'|'research'|'both', facilities:'', softwareInstalled:'', isActive:true, isFeatured:false };

function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

export default function AdminLabsPage() {
  const [labs, setLabs]         = useState<Laboratory[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Laboratory | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm]         = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(API, { credentials:'include' });
      const d = await r.json() as { data: Laboratory[] };
      setLabs(d.data ?? []);
    } catch { setLabs([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openEdit(l: Laboratory) {
    setEditing(l);
    setForm({ name:l.name, slug:l.slug, description:l.description, shortDescription:l.shortDescription??'', location:l.location, capacity:l.capacity??0, workstations:l.workstations??0, inCharge:l.inCharge??'', inChargeEmail:l.inChargeEmail??'', labType:l.labType as typeof form.labType, facilities:l.facilities.join(', '), softwareInstalled:l.softwareInstalled.join(', '), isActive:l.isActive, isFeatured:l.isFeatured });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      const payload = { ...form, facilities:form.facilities.split(',').map(s=>s.trim()).filter(Boolean), softwareInstalled:form.softwareInstalled.split(',').map(s=>s.trim()).filter(Boolean) };
      const url = editing ? `${API}/${editing.id}` : API;
      const r   = await fetch(url, { method:editing?'PATCH':'POST', headers:{ 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) }, body:JSON.stringify(payload), credentials:'include' });
      if (r.ok) { setShowForm(false); load(); }
      else { const e = await r.json() as {message?:string}; alert(e.message??'Save failed'); }
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this lab?')) return;
    setDeleting(id);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      await fetch(`${API}/${id}`, { method:'DELETE', headers:{ ...(token?{Authorization:`Bearer ${token}`}:{}) }, credentials:'include' });
      load();
    } finally { setDeleting(null); }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Manage Laboratories" />
      <PageHeader title="Laboratories" description="Add and manage department labs."
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY_FORM);setShowForm(true)}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Lab</Button>}/>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-5">{editing?'Edit Lab':'New Lab'}</h3>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Lab Name</label>
                <input type="text" value={form.name}
                  onChange={e=>{F('name',e.target.value); if(!editing) F('slug',toSlug(e.target.value));}}
                  placeholder="Artificial Intelligence Lab"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Slug (URL)</label>
                <input type="text" value={form.slug} onChange={e=>F('slug',e.target.value)} placeholder="ai-lab"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
                  <input type="text" value={form.location} onChange={e=>F('location',e.target.value)} placeholder="Room 302, CSE Building"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Lab Type</label>
                  <select value={form.labType} onChange={e=>F('labType',e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="teaching">Teaching</option><option value="research">Research</option><option value="both">Both</option>
                  </select></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[{label:'Capacity',key:'capacity'},{label:'Workstations',key:'workstations'}].map(f=>(
                  <div key={f.key}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                    <input type="number" value={form[f.key as keyof typeof form] as number} onChange={e=>F(f.key as keyof typeof form,+e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>))}
              </div>

              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">In-Charge</label>
                <input type="text" value={form.inCharge} onChange={e=>F('inCharge',e.target.value)} placeholder="Dr. Mohammad Rahman"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e=>F('description',e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/></div>
              {[{label:'Facilities (comma separated)',key:'facilities',placeholder:'AC, Projector, UPS, High-speed Internet'},{label:'Software Installed (comma separated)',key:'softwareInstalled',placeholder:'Python, TensorFlow, PyTorch'}].map(f=>(
                <div key={f.key}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                  <input type="text" value={form[f.key as keyof typeof form] as string} onChange={e=>F(f.key as keyof typeof form,e.target.value)} placeholder={f.placeholder}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>))}

              <div className="flex gap-4">
                {[{k:'isActive',l:'Active'},{k:'isFeatured',l:'Featured'}].map(f=>(
                  <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[f.k as keyof typeof form] as boolean} onChange={e=>F(f.k as keyof typeof form,e.target.checked)} className="accent-green-600"/>
                    <span className="text-sm text-slate-300">{f.l}</span>
                  </label>))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
              <Button variant="secondary" onClick={()=>setShowForm(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>)}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : labs.length === 0 ? (
          <EmptyState title="No labs yet" description="Add your first laboratory."/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Lab</th>
              <th className="text-center px-4 py-3">Type</th>
              <th className="text-center px-4 py-3">Capacity</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {labs.map((l,i)=>(
                <tr key={l.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i%2?'bg-white/[0.02]':''}`}>
                  <td className="px-5 py-4"><p className="font-medium text-white">{l.name}</p><p className="text-xs text-slate-500">{l.location}</p></td>
                  <td className="px-4 py-4 text-center"><Badge variant="neutral">{l.labType}</Badge></td>
                  <td className="px-4 py-4 text-center text-slate-300">{l.capacity??0}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Badge variant={l.isActive?'success':'neutral'}>{l.isActive?'Active':'Inactive'}</Badge>
                      {l.isFeatured && <Badge variant="info">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(l)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={deleting===l.id} onClick={()=>remove(l.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>)}
      </div>
    </div>
  );
}
