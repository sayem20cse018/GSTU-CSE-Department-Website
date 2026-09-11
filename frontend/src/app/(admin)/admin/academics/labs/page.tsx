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
import type { Laboratory } from '@/lib/api/academics';

function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

const EMPTY = { name:'', slug:'', description:'', shortDescription:'', location:'', capacity:0,
  workstations:0, inCharge:'', inChargeEmail:'', labType:'both' as 'teaching'|'research'|'both',
  facilities:'', softwareInstalled:'', isActive:true, isFeatured:false };

export default function AdminLabsPage() {
  const [labs,    setLabs]    = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState<Laboratory|null>(null);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [err,     setErr]     = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await adminGet<Laboratory[]>('/academics/labs?admin=true'); setLabs(Array.isArray(d)?d:[]); }
    catch { setLabs([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(l: Laboratory) {
    setEditing(l);
    setForm({ name:l.name, slug:l.slug, description:l.description, shortDescription:l.shortDescription??'',
      location:l.location, capacity:l.capacity??0, workstations:l.workstations??0,
      inCharge:l.inCharge??'', inChargeEmail:l.inChargeEmail??'',
      labType:l.labType as typeof EMPTY.labType,
      facilities:l.facilities.join(', '), softwareInstalled:l.softwareInstalled.join(', '),
      isActive:l.isActive, isFeatured:l.isFeatured });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.slug.trim() || !form.location.trim()) {
      setErr('Name, slug and location are required.'); return;
    }
    setSaving(true); setErr('');
    try {
      const payload = { ...form,
        facilities: form.facilities.split(',').map(s=>s.trim()).filter(Boolean),
        softwareInstalled: form.softwareInstalled.split(',').map(s=>s.trim()).filter(Boolean) };
      if (editing) { await adminPatch(`/academics/labs/${editing.id}`, payload); toast.success('Lab updated!'); }
      else          { await adminPost('/academics/labs', payload);               toast.success('Lab created!'); }
      setOpen(false); load();
    } catch(e) { const m=e instanceof Error?e.message:'Save failed'; setErr(m); toast.error(m); }
    finally { setSaving(false); }
  }

  async function remove(l: Laboratory) {
    const ok = await confirm({ title:`Delete "${l.name}"?`, confirmLabel:'Delete' });
    if (!ok) return;
    try { await adminDelete(`/academics/labs/${l.id}`); toast.success('Deleted'); load(); }
    catch(e) { toast.error(e instanceof Error?e.message:'Delete failed'); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Manage Laboratories" />
      {ConfirmDialog}
      <PageHeader title="Laboratories" description="Add and manage department labs."
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Lab</Button>}/>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing?'Edit Lab':'New Lab'}</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>}
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Lab Name *</label>
                <input value={form.name} onChange={e=>{F('name',e.target.value);if(!editing)F('slug',toSlug(e.target.value));}}
                  placeholder="Artificial Intelligence Lab" className={iCls}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Slug *</label>
                <input value={form.slug} onChange={e=>F('slug',e.target.value)} placeholder="ai-lab" className={iCls}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Location *</label>
                  <input value={form.location} onChange={e=>F('location',e.target.value)} placeholder="Room 302" className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Lab Type</label>
                  <select value={form.labType} onChange={e=>F('labType',e.target.value)} className={iCls}>
                    <option value="teaching">Teaching</option>
                    <option value="research">Research</option>
                    <option value="both">Both</option>
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Capacity</label>
                  <input type="number" value={form.capacity} onChange={e=>F('capacity',+e.target.value)} className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Workstations</label>
                  <input type="number" value={form.workstations} onChange={e=>F('workstations',+e.target.value)} className={iCls}/></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">In-Charge</label>
                <input value={form.inCharge} onChange={e=>F('inCharge',e.target.value)} placeholder="Dr. Rahman" className={iCls}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={e=>F('description',e.target.value)} className={`${iCls} resize-none`}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Facilities (comma separated)</label>
                <input value={form.facilities} onChange={e=>F('facilities',e.target.value)} placeholder="AC, Projector, UPS" className={iCls}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Software Installed (comma separated)</label>
                <input value={form.softwareInstalled} onChange={e=>F('softwareInstalled',e.target.value)} placeholder="Python, TensorFlow" className={iCls}/></div>
              <div className="flex gap-4">
                {[{k:'isActive',l:'Active'},{k:'isFeatured',l:'Featured'}].map(f=>(
                  <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[f.k as keyof typeof form] as boolean}
                      onChange={e=>F(f.k as keyof typeof form,e.target.checked)} className="accent-green-600"/>
                    <span className="text-sm text-slate-700">{f.l}</span>
                  </label>
                ))}
              </div>
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
        ) : labs.length === 0 ? (
          <EmptyState title="No labs yet" description="Add your first laboratory."
            action={<Button onClick={openNew}>Add Lab</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Lab</th>
              <th className="text-center px-4 py-3">Type</th>
              <th className="text-center px-4 py-3">Capacity</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {labs.map((l,i) => (
                <tr key={l.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i%2?'bg-slate-50/30':''}`}>
                  <td className="px-5 py-4"><p className="font-medium text-slate-900">{l.name}</p><p className="text-xs text-slate-500">{l.location}</p></td>
                  <td className="px-4 py-4 text-center"><Badge variant="neutral">{l.labType}</Badge></td>
                  <td className="px-4 py-4 text-center text-slate-500">{l.capacity??0}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Badge variant={l.isActive?'success':'neutral'}>{l.isActive?'Active':'Inactive'}</Badge>
                      {l.isFeatured && <Badge variant="info">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(l)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => remove(l)}>Delete</Button>
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
