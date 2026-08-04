'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader from '@/components/admin/ui/PageHeader';
import Button     from '@/components/admin/ui/Button';
import Badge      from '@/components/admin/ui/Badge';
import EmptyState from '@/components/admin/ui/EmptyState';
import { cn }     from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

const EMPTY = { name:'', slug:'', description:'', shortDescription:'', logo:'', coverImage:'', advisorName:'', presidentName:'', foundedYear:new Date().getFullYear(), memberCount:0, facebookUrl:'', email:'', isActive:true, isFeatured:false };
interface Club { _id:string; name:string; slug:string; memberCount:number; foundedYear:number; isActive:boolean; isFeatured:boolean; advisorName?:string; }
const toSlug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export default function ClubsAdminPage() {
  const [list,setList]      = useState<Club[]>([]);
  const [loading,setLoading]= useState(true);
  const [open,setOpen]      = useState(false);
  const [form,setForm]      = useState(EMPTY);
  const [editing,setEditing]= useState<Club|null>(null);
  const [saving,setSaving]  = useState(false);
  const [delId,setDelId]    = useState<string|null>(null);
  const [err,setErr]        = useState('');

  const load = useCallback(async()=>{
    setLoading(true);
    try{ setList(await adminGet<Club[]>('/clubs?admin=true')); }
    catch{ setList([]); }finally{ setLoading(false); }
  },[]);
  useEffect(()=>{ load(); },[load]);

  const F=(k:keyof typeof EMPTY,v:string|boolean|number)=>setForm(p=>({...p,[k]:v}));
  function openEdit(c:Club){ setEditing(c); setForm({name:c.name,slug:c.slug,description:'',shortDescription:'',logo:'',coverImage:'',advisorName:c.advisorName??'',presidentName:'',foundedYear:c.foundedYear,memberCount:c.memberCount,facebookUrl:'',email:'',isActive:c.isActive,isFeatured:c.isFeatured}); setErr(''); setOpen(true); }

  async function save(){ if(!form.name||!form.slug){setErr('Name and slug required.');return;} setSaving(true);setErr('');
    try{ if(editing) await adminPatch(`/clubs/${editing._id}`,form); else await adminPost('/clubs',form); setOpen(false);load(); }
    catch(e){setErr(e instanceof Error?e.message:'Save failed');}finally{setSaving(false);} }

  async function del(id:string){ if(!confirm('Delete club?'))return; setDelId(id);
    try{await adminDelete(`/clubs/${id}`);load();}catch(e){alert(e instanceof Error?e.message:'Error');}finally{setDelId(null);} }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Manage Clubs"/>
      <PageHeader title="Student Clubs" description={`${list.length} club${list.length!==1?'s':''}`}
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY);setErr('');setOpen(true);}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Club</Button>}/>

      {open&&(<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-4">{editing?'Edit':'Add'} Club</h3>
          {err&&<p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-3">{err}</p>}
          <div className="space-y-3">
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Club Name *</label>
              <input type="text" value={form.name} onChange={e=>{F('name',e.target.value);if(!editing)F('slug',toSlug(e.target.value));}}
                placeholder="Programming Club" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Slug *</label>
              <input type="text" value={form.slug} onChange={e=>F('slug',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            {[{l:'Short Description',k:'shortDescription',ph:'One line description'},{l:'Logo URL',k:'logo',ph:'https://...'},{l:'Cover Image URL',k:'coverImage',ph:'https://...'},{l:'Faculty Advisor',k:'advisorName',ph:'Dr. Name'},{l:'President',k:'presidentName',ph:'Student name'},{l:'Email',k:'email',ph:'club@gstu.edu.bd'},{l:'Facebook URL',k:'facebookUrl',ph:'https://facebook.com/...'}].map(f=>(
              <div key={f.k}><label className="block text-xs font-medium text-slate-400 mb-1">{f.l}</label>
                <input type="text" value={form[f.k as keyof typeof EMPTY] as string} onChange={e=>F(f.k as keyof typeof EMPTY,e.target.value)} placeholder={f.ph}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>))}
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e=>F('description',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Founded Year</label>
                <input type="number" value={form.foundedYear} onChange={e=>F('foundedYear',+e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Members</label>
                <input type="number" value={form.memberCount} onChange={e=>F('memberCount',+e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            </div>
            <div className="flex gap-4">
              {[{k:'isActive',l:'Active'},{k:'isFeatured',l:'Featured'}].map(({k,l})=>(
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[k as keyof typeof EMPTY] as boolean} onChange={e=>F(k as keyof typeof EMPTY,e.target.checked)} className="accent-blue-500"/>
                  <span className="text-sm text-slate-300">{l}</span></label>))}
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
            <Button variant="secondary" onClick={()=>setOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </div>)}

      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {loading?<div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
        :list.length===0?<EmptyState title="No clubs yet" description="Add the first student club."/>
        :(<table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
          <th className="text-left px-5 py-3">Club</th><th className="text-center px-4 py-3">Members</th>
          <th className="text-center px-4 py-3">Status</th><th className="text-right px-5 py-3">Actions</th></tr></thead>
          <tbody>{list.map((c,i)=>(
            <tr key={c._id} className={cn('border-b border-white/5 last:border-0 hover:bg-white/[0.03]',i%2?'bg-white/[0.01]':'')}>
              <td className="px-5 py-3"><p className="font-medium text-white">{c.name}</p>{c.advisorName&&<p className="text-xs text-slate-500">Advisor: {c.advisorName}</p>}</td>
              <td className="px-4 py-3 text-center text-slate-300">{c.memberCount}</td>
              <td className="px-4 py-3 text-center"><div className="flex justify-center gap-1.5">
                <Badge variant={c.isActive?'success':'neutral'}>{c.isActive?'Active':'Inactive'}</Badge>
                {c.isFeatured&&<Badge variant="info">Featured</Badge>}</div></td>
              <td className="px-5 py-3"><div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={()=>openEdit(c)}>Edit</Button>
                <Button size="sm" variant="danger" loading={delId===c._id} onClick={()=>del(c._id)}>Delete</Button>
              </div></td>
            </tr>))}</tbody></table>)}
      </div>
    </div>
  );
}
