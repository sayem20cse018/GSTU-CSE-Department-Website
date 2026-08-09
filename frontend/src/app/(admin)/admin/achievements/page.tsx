'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader from '@/components/admin/ui/PageHeader';
import Button     from '@/components/admin/ui/Button';
import Badge      from '@/components/admin/ui/Badge';
import EmptyState from '@/components/admin/ui/EmptyState';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { cn }     from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import { formatDate } from '@/lib/utils/format';

const TYPES = ['student','faculty','department','research','competition','other'];
const EMPTY = { title:'', description:'', image:'', type:'student', achievedAt:'', achieverName:'', awardedBy:'', isPublished:false, isFeatured:false };
interface Ach { id:string; title:string; type:string; achievedAt:string; achieverName?:string; isPublished:boolean; isFeatured:boolean; }

export default function AchievementsAdminPage() {
  const [list,setList]      = useState<Ach[]>([]);
  const [loading,setLoading]= useState(true);
  const [open,setOpen]      = useState(false);
  const [form,setForm]      = useState(EMPTY);
  const [editing,setEditing]= useState<Ach|null>(null);
  const [saving,setSaving]  = useState(false);
  const [delId,setDelId]    = useState<string|null>(null);
  const [err,setErr]        = useState('');

  const load = useCallback(async()=>{
    setLoading(true);
    try{ setList(await adminGet<Ach[]>('/achievements?admin=true')); }
    catch{ setList([]); }finally{ setLoading(false); }
  },[]);
  useEffect(()=>{ load(); },[load]);

  const F=(k:keyof typeof EMPTY,v:string|boolean)=>setForm(p=>({...p,[k]:v}));
  function openEdit(a:Ach){ setEditing(a); setForm({title:a.title,description:'',image:'',type:a.type,achievedAt:a.achievedAt?.slice(0,10)??'',achieverName:a.achieverName??'',awardedBy:'',isPublished:a.isPublished,isFeatured:a.isFeatured}); setErr(''); setOpen(true); }

  async function save(){ if(!form.title||!form.achievedAt){setErr('Title and date required.');return;} setSaving(true);setErr('');
    try{ if(editing) await adminPatch(`/achievements/${editing.id}`,form); else await adminPost('/achievements',form); setOpen(false);load(); }
    catch(e){setErr(e instanceof Error?e.message:'Save failed');}finally{setSaving(false);} }

  async function del(id:string){ if(!confirm('Delete?'))return; setDelId(id);
    try{await adminDelete(`/achievements/${id}`);load();}catch(e){alert(e instanceof Error?e.message:'Error');}finally{setDelId(null);} }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Manage Achievements"/>
      <PageHeader title="Achievements" description={`${list.length} achievement${list.length!==1?'s':''}`}
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY);setErr('');setOpen(true);}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Achievement</Button>}/>

      {open&&(<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{editing?'Edit':'Add'} Achievement</h3>
          {err&&<p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-3">{err}</p>}
          <div className="space-y-3">
            {[{l:'Title *',k:'title',ph:'1st Place — ACM ICPC 2024'},{l:'Achiever Name',k:'achieverName',ph:'Student/Faculty name'},{l:'Awarded By',k:'awardedBy',ph:'Organisation name'}].map(f=>(
              <div key={f.k}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.l}</label>
                <input type="text" value={form[f.k as keyof typeof EMPTY] as string} onChange={e=>F(f.k as keyof typeof EMPTY,e.target.value)} placeholder={f.ph}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"/></div>))}
            <ImageUpload
              label="Achievement Image"
              value={form.image}
              onChange={v => F('image', v)}
            />            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Type</label>
                <select value={form.type} onChange={e=>F('type',e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Date *</label>
                <input type="date" value={form.achievedAt} onChange={e=>F('achievedAt',e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
            </div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea rows={3} value={form.description} onChange={e=>F('description',e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/></div>
            <div className="flex gap-4">
              {[{k:'isPublished',l:'Published'},{k:'isFeatured',l:'Featured'}].map(({k,l})=>(
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[k as keyof typeof EMPTY] as boolean} onChange={e=>F(k as keyof typeof EMPTY,e.target.checked)} className="accent-green-600"/>
                  <span className="text-sm font-medium text-slate-700">{l}</span></label>))}
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Add'}</Button>
            <Button variant="secondary" onClick={()=>setOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </div>)}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading?<div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        :list.length===0?<EmptyState title="No achievements yet" description="Add the first achievement."/>
        :(<table className="w-full text-sm"><thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <th className="text-left px-5 py-3">Title</th><th className="text-center px-4 py-3">Type</th>
          <th className="text-center px-4 py-3">Date</th><th className="text-center px-4 py-3">Status</th>
          <th className="text-right px-5 py-3">Actions</th></tr></thead>
          <tbody>{list.map((a,i)=>(
            <tr key={a.id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50',i%2?'bg-white':'')}>
              <td className="px-5 py-3 font-medium text-white line-clamp-1">{a.title}</td>
              <td className="px-4 py-3 text-center"><Badge variant="neutral">{a.type}</Badge></td>
              <td className="px-4 py-3 text-center text-xs text-slate-400">{formatDate(a.achievedAt)}</td>
              <td className="px-4 py-3 text-center"><div className="flex justify-center gap-1.5 flex-wrap">
                <Badge variant={a.isPublished?'success':'neutral'}>{a.isPublished?'Live':'Draft'}</Badge>
                {a.isFeatured&&<Badge variant="info">Featured</Badge>}</div></td>
              <td className="px-5 py-3"><div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={()=>openEdit(a)}>Edit</Button>
                <Button size="sm" variant="danger" loading={delId===a.id} onClick={()=>del(a.id)}>Delete</Button>
              </div></td>
            </tr>))}</tbody></table>)}
      </div>
    </div>
  );
}
