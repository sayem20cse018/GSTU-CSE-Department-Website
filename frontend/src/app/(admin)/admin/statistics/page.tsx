'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader from '@/components/admin/ui/PageHeader';
import Button     from '@/components/admin/ui/Button';
import { cn }     from '@/lib/utils/cn';
import { adminGet, adminPatch } from '@/lib/api/admin-fetch';

interface Stat { _id:string; key:string; label:string; value:string; icon:string; sortOrder:number; isVisible:boolean; }

export default function StatisticsAdminPage() {
  const [list,setList]      = useState<Stat[]>([]);
  const [loading,setLoading]= useState(true);
  const [editing,setEditing]= useState<Stat|null>(null);
  const [form,setForm]      = useState({ label:'', value:'', icon:'', sortOrder:0, isVisible:true });
  const [saving,setSaving]  = useState(false);
  const [err,setErr]        = useState('');

  const load = useCallback(async()=>{
    setLoading(true);
    try{ setList(await adminGet<Stat[]>('/statistics?admin=true')); }
    catch{ setList([]); }finally{ setLoading(false); }
  },[]);
  useEffect(()=>{ load(); },[load]);

  function openEdit(s:Stat){ setEditing(s); setForm({label:s.label,value:s.value,icon:s.icon,sortOrder:s.sortOrder,isVisible:s.isVisible}); setErr(''); }

  async function save(){
    if(!editing||!form.value){setErr('Value required.');return;}
    setSaving(true);setErr('');
    try{ await adminPatch(`/statistics/${editing._id}`,form); setEditing(null); load(); }
    catch(e){setErr(e instanceof Error?e.message:'Save failed');}finally{setSaving(false);}
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminPageTitle title="Department Statistics"/>
      <PageHeader title="Statistics" description="Control the numbers shown on the homepage. Changes are live immediately."/>

      {err&&<p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5,6].map(i=><div key={i} className="h-16 bg-slate-900 border border-slate-200 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="space-y-3">
          {list.map(s=>(
            <div key={s._id}
              className={cn('bg-slate-900 border rounded-xl p-5 transition', editing?._id===s._id?'border-blue-400':'border-slate-200')}>
              {editing?._id===s._id ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Value *</label>
                      <input type="text" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} placeholder="e.g. 14+" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Label</label>
                      <input type="text" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Icon (emoji)</label>
                      <input type="text" value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} placeholder="👨‍🏫" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isVisible} onChange={e=>setForm(p=>({...p,isVisible:e.target.checked}))} className="accent-green-600"/>
                      <span className="text-sm text-slate-300">Visible on homepage</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={save} loading={saving} size="sm">Save</Button>
                    <Button variant="secondary" onClick={()=>setEditing(null)} size="sm">Cancel</Button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl w-10 text-center" aria-hidden="true">{s.icon}</span>
                    <div>
                      <p className="font-bold text-white text-lg leading-none">{s.value}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', s.isVisible?'bg-emerald-500/20 text-emerald-400':'bg-slate-700 text-slate-400')}>
                      {s.isVisible?'Visible':'Hidden'}
                    </span>
                    <Button size="sm" variant="secondary" onClick={()=>openEdit(s)}>Edit</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-blue-300">
          💡 Changes take effect immediately on the public homepage. Statistics are cached for 1 hour.
        </p>
      </div>
    </div>
  );
}
