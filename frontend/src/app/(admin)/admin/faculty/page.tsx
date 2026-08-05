'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import Badge       from '@/components/admin/ui/Badge';
import EmptyState  from '@/components/admin/ui/EmptyState';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { cn }      from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

const DESIG = ['Professor','Associate Professor','Assistant Professor','Lecturer','Senior Lecturer','Adjunct Faculty'];
const EMPTY = { name:'', title:'Dr.', designation:'Lecturer', email:'', phone:'', photo:'', shortBio:'', officeRoom:'', researchInterests:'', googleScholarUrl:'', linkedinUrl:'', orcidId:'', isActive:true, sortOrder:0 };

interface Faculty { _id:string; name:string; title?:string; designation:string; email:string; phone?:string; photo?:string; shortBio?:string; officeRoom?:string; researchInterests:string[]; googleScholarUrl?:string; linkedinUrl?:string; orcidId?:string; isActive:boolean; sortOrder:number }

export default function FacultyPage() {
  const [list, setList]       = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState<Faculty|null>(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string|null>(null);
  const [err, setErr]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Faculty[]>('/faculty')); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(f: Faculty) {
    setEditing(f);
    setForm({ name:f.name, title:f.title??'Dr.', designation:f.designation, email:f.email, phone:f.phone??'', photo:f.photo??'', shortBio:f.shortBio??'', officeRoom:f.officeRoom??'', researchInterests:(f.researchInterests??[]).join(', '), googleScholarUrl:f.googleScholarUrl??'', linkedinUrl:f.linkedinUrl??'', orcidId:f.orcidId??'', isActive:f.isActive, sortOrder:f.sortOrder });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim()) { setErr('Name and email are required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { ...form, researchInterests: form.researchInterests.split(',').map(s=>s.trim()).filter(Boolean) };
      if (editing) await adminPatch(`/faculty/${editing._id}`, payload);
      else await adminPost('/faculty', payload);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this faculty member?')) return;
    setDelId(id);
    try { await adminDelete(`/faculty/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDelId(null); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="Manage Faculty" />
      <PageHeader title="Faculty Members" description={`${list.length} member${list.length!==1?'s':''}`}
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Faculty</Button>}/>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-white mb-5">{editing?'Edit Faculty':'Add Faculty Member'}</h3>
            {err && <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([['Full Name','name','text','Dr. Mohammad Rahman'],['Email','email','email','name@gstu.edu.bd'],['Phone','phone','text','+880-XXX'],['Office Room','officeRoom','text','Room 302, CSE Building'],['Google Scholar URL','googleScholarUrl','url','https://scholar.google.com/…'],['LinkedIn URL','linkedinUrl','url','https://linkedin.com/in/…'],['ORCID ID','orcidId','text','0000-0000-0000-0000']] as [string,keyof typeof EMPTY,string,string][]).map(([label,key,type,ph])=>(
                <div key={key}><label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
                  <input type={type} value={form[key] as string} onChange={e=>F(key,e.target.value)} placeholder={ph}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>))}

              {/* Photo upload */}
              <div className="sm:col-span-2">
                <ImageUpload
                  label="Photo"
                  value={form.photo}
                  onChange={v => F('photo', v)}
                  previewRounded
                />
              </div>              <div><label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <select value={form.title} onChange={e=>F('title',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['Dr.','Prof.','Mr.','Ms.','Engr.'].map(t=><option key={t} value={t}>{t}</option>)}
                </select></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Designation</label>
                <select value={form.designation} onChange={e=>F('designation',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {DESIG.map(d=><option key={d} value={d}>{d}</option>)}
                </select></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-400 mb-1">Short Bio</label>
                <textarea rows={2} value={form.shortBio} onChange={e=>F('shortBio',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
              <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-400 mb-1">Research Interests (comma separated)</label>
                <input type="text" value={form.researchInterests} onChange={e=>F('researchInterests',e.target.value)} placeholder="Machine Learning, Computer Vision, NLP"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>F('isActive',e.target.checked)} className="accent-blue-500"/><span className="text-sm text-slate-300">Active</span></label>
                <div><label className="text-xs text-slate-400 mr-2">Sort Order</label><input type="number" value={form.sortOrder} onChange={e=>F('sortOrder',+e.target.value)} className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Add Member'}</Button>
              <Button variant="secondary" onClick={()=>setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>)}

      {/* Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
        ) : list.length===0 ? (
          <EmptyState title="No faculty members yet" description="Add the first faculty member to get started." action={<Button onClick={openNew}>Add Faculty</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
              <th className="text-left px-5 py-3">Member</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Designation</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Research Interests</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {list.map((f,i)=>(
                <tr key={f._id} className={cn('border-b border-white/5 last:border-0 hover:bg-white/[0.03]',i%2?'bg-white/[0.01]':'')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {f.photo ? <img src={f.photo} alt={f.name} className="w-9 h-9 rounded-full object-cover shrink-0"/> :
                        <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0 text-xs font-bold text-blue-400">{f.name.charAt(0)}</div>}
                      <div><p className="font-medium text-white">{f.title} {f.name}</p><p className="text-xs text-slate-500">{f.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-slate-300 text-sm">{f.designation}</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">{(f.researchInterests??[]).slice(0,2).map(r=><span key={r} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{r}</span>)}</div>
                  </td>
                  <td className="px-4 py-4 text-center"><Badge variant={f.isActive?'success':'neutral'}>{f.isActive?'Active':'Inactive'}</Badge></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(f)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId===f._id} onClick={()=>del(f._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
