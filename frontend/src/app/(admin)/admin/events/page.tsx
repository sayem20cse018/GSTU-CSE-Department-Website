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

const TYPES = ['seminar','workshop','conference','hackathon','competition','cultural','webinar','orientation','other'];
const EMPTY = { title:'', slug:'', shortDescription:'', venue:'', startDate:'', endDate:'', type:'seminar', mode:'in_person', coverImage:'', organizerName:'Admin', isPublished:false, isFeatured:false };
interface Ev { _id:string; title:string; slug:string; venue:string; startDate:string; type:string; isPublished:boolean; isFeatured:boolean; status:string }
const toSlug = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export default function AdminEventsPage() {
  const [list, setList]     = useState<Ev[]>([]);
  const [loading,setLoading]= useState(true);
  const [form, setForm]     = useState(EMPTY);
  const [editing,setEditing]= useState<Ev|null>(null);
  const [open, setOpen]     = useState(false);
  const [saving, setSaving] = useState(false);
  const [delId, setDelId]   = useState<string|null>(null);
  const [err, setErr]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await adminGet<{data:Ev[]}>('/events?admin=true&limit=50'); setList((r as {data:Ev[]}).data??[]); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(()=>{ load(); },[load]);

  const F = (k:keyof typeof EMPTY, v:string|boolean) => setForm(p=>({...p,[k]:v}));
  function openEdit(e:Ev){ setEditing(e); setForm({title:e.title,slug:e.slug,shortDescription:'',venue:e.venue,startDate:e.startDate?.slice(0,10)??'',endDate:'',type:e.type,mode:'in_person',coverImage:'',organizerName:'Admin',isPublished:e.isPublished,isFeatured:e.isFeatured}); setErr(''); setOpen(true); }

  async function save() {
    if (!form.title||!form.slug||!form.venue||!form.startDate){setErr('Title, slug, venue and start date are required.');return;}
    setSaving(true); setErr('');
    try { if(editing) await adminPatch(`/events/${editing._id}`,form); else await adminPost('/events',form); setOpen(false); load(); }
    catch(e){setErr(e instanceof Error?e.message:'Save failed');} finally{setSaving(false);}
  }

  async function del(id:string) {
    if(!confirm('Delete this event?'))return; setDelId(id);
    try{await adminDelete(`/events/${id}`);load();} catch(e){alert(e instanceof Error?e.message:'Error');} finally{setDelId(null);}
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="Manage Events" />
      <PageHeader title="Events" description={`${list.length} event${list.length!==1?'s':''}`}
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY);setErr('');setOpen(true);}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Event</Button>}/>

      {open&&(<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-200 rounded-2xl w-full max-w-xl p-6 max-h-[92vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-5">{editing?'Edit':'Add'} Event</h3>
          {err&&<p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}
          <div className="space-y-4">
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Title *</label>
              <input value={form.title} onChange={e=>{F('title',e.target.value);if(!editing)F('slug',toSlug(e.target.value));}}
                className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Slug *</label>
              <input value={form.slug} onChange={e=>F('slug',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Short Description</label>
              <textarea rows={2} value={form.shortDescription} onChange={e=>F('shortDescription',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                <select value={form.type} onChange={e=>F('type',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Mode</label>
                <select value={form.mode} onChange={e=>F('mode',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['in_person','online','hybrid'].map(m=><option key={m} value={m}>{m.replace('_',' ')}</option>)}</select></div>
            </div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Venue *</label>
              <input value={form.venue} onChange={e=>F('venue',e.target.value)} placeholder="Seminar Hall, CSE Building"
                className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Start Date *</label>
                <input type="date" value={form.startDate} onChange={e=>F('startDate',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                <input type="date" value={form.endDate} onChange={e=>F('endDate',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            </div>
            <ImageUpload
              label="Cover Image"
              value={form.coverImage}
              onChange={v => F('coverImage', v)}
            />
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Organizer</label>
              <input value={form.organizerName} onChange={e=>F('organizerName',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div className="flex gap-4">
              {[{k:'isPublished',l:'Published'},{k:'isFeatured',l:'Featured'}].map(({k,l})=>(
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={e=>F(k as keyof typeof EMPTY,e.target.checked)} className="accent-blue-500"/>
                  <span className="text-sm text-slate-300">{l}</span></label>))}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
            <Button variant="secondary" onClick={()=>setOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      </div>)}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading?<div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
        :list.length===0?<EmptyState title="No events yet" description="Schedule the first event."/>
        :(<table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <th className="text-left px-5 py-3">Event</th>
            <th className="text-center px-4 py-3 hidden sm:table-cell">Type</th>
            <th className="text-center px-4 py-3">Status</th>
            <th className="text-center px-4 py-3 hidden md:table-cell">Date</th>
            <th className="text-right px-5 py-3">Actions</th>
          </tr></thead>
          <tbody>{list.map((e,i)=>(
            <tr key={e._id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50',i%2?'bg-white':'')}>
              <td className="px-5 py-3"><p className="font-medium text-white line-clamp-1">{e.title}</p><p className="text-xs text-slate-500">{e.venue}</p></td>
              <td className="px-4 py-3 text-center hidden sm:table-cell"><Badge variant="neutral">{e.type}</Badge></td>
              <td className="px-4 py-3 text-center"><div className="flex justify-center gap-1.5 flex-wrap"><Badge variant={e.isPublished?'success':'neutral'}>{e.isPublished?'Live':'Draft'}</Badge>{e.isFeatured&&<Badge variant="info">Featured</Badge>}</div></td>
              <td className="px-4 py-3 text-center text-xs text-slate-400 hidden md:table-cell">{formatDate(e.startDate)}</td>
              <td className="px-5 py-3"><div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={()=>openEdit(e)}>Edit</Button>
                <Button size="sm" variant="danger" loading={delId===e._id} onClick={()=>del(e._id)}>Delete</Button>
              </div></td>
            </tr>))}</tbody>
        </table>)}
      </div>
    </div>
  );
}
