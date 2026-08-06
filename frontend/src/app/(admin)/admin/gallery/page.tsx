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

const CATS = ['event','lab','student_life','faculty','infrastructure','convocation','sports','competition','other'];
const EMPTY = { title:'', slug:'', description:'', category:'event', coverImage:'', albumDate:'', uploadedByName:'Admin', isPublished:false, isFeatured:false };
interface Album { _id:string; title:string; slug:string; category:string; mediaCount:number; albumDate:string; isPublished:boolean; isFeatured:boolean; coverImage?:string }
const toSlug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export default function AdminGalleryPage() {
  const [list,setList]      = useState<Album[]>([]);
  const [loading,setLoading]= useState(true);
  const [form,setForm]      = useState(EMPTY);
  const [editing,setEditing]= useState<Album|null>(null);
  const [open,setOpen]      = useState(false);
  const [saving,setSaving]  = useState(false);
  const [delId,setDelId]    = useState<string|null>(null);
  const [err,setErr]        = useState('');

  const load = useCallback(async()=>{
    setLoading(true);
    try{setList(await adminGet<Album[]>('/gallery?admin=true'));}
    catch{setList([]);}finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const F=(k:keyof typeof EMPTY,v:string|boolean)=>setForm(p=>({...p,[k]:v}));
  function openEdit(a:Album){setEditing(a);setForm({title:a.title,slug:a.slug,description:'',category:a.category,coverImage:a.coverImage??'',albumDate:a.albumDate?.slice(0,10)??'',uploadedByName:'Admin',isPublished:a.isPublished,isFeatured:a.isFeatured});setErr('');setOpen(true);}

  async function save(){
    if(!form.title||!form.slug||!form.albumDate){setErr('Title, slug and album date are required.');return;}
    setSaving(true);setErr('');
    try{if(editing)await adminPatch(`/gallery/${editing._id}`,form);else await adminPost('/gallery',form);setOpen(false);load();}
    catch(e){setErr(e instanceof Error?e.message:'Save failed');}finally{setSaving(false);}
  }

  async function del(id:string){
    if(!confirm('Delete this album?'))return;setDelId(id);
    try{await adminDelete(`/gallery/${id}`);load();}catch(e){alert(e instanceof Error?e.message:'Error');}finally{setDelId(null);}
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="Manage Gallery" />
      <PageHeader title="Photo Gallery" description={`${list.length} album${list.length!==1?'s':''}`}
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY);setErr('');setOpen(true);}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>New Album</Button>}/>

      {open&&(<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-200 rounded-2xl w-full max-w-md p-6">
          <h3 className="text-lg font-bold text-white mb-5">{editing?'Edit':'New'} Album</h3>
          {err&&<p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}
          <div className="space-y-4">
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Album Title *</label>
              <input value={form.title} onChange={e=>{F('title',e.target.value);if(!editing)F('slug',toSlug(e.target.value));}}
                className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Slug *</label>
              <input value={form.slug} onChange={e=>F('slug',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select value={form.category} onChange={e=>F('category',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {CATS.map(c=><option key={c} value={c}>{c.replace('_',' ')}</option>)}</select></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Album Date *</label>
                <input type="date" value={form.albumDate} onChange={e=>F('albumDate',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            </div>
            <div><label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={e=>F('description',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
            <ImageUpload
              label="Cover Image"
              value={form.coverImage}
              onChange={v => F('coverImage', v)}
            />
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
        {loading?<div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"/>)}</div>
        :list.length===0?<EmptyState title="No albums yet" description="Create the first photo album."/>
        :(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {list.map(a=>(
            <div key={a._id} className="bg-white/5 border border-slate-200 rounded-xl overflow-hidden group">
              <div className="h-32 bg-slate-800 relative">
                {a.coverImage?<img src={a.coverImage} alt={a.title} className="w-full h-full object-cover"/>
                  :<div className="w-full h-full flex items-center justify-center text-4xl" aria-hidden="true">🖼️</div>}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant={a.isPublished?'success':'neutral'}>{a.isPublished?'Live':'Draft'}</Badge>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-white text-sm line-clamp-1">{a.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">{a.mediaCount} photos · {formatDate(a.albumDate)}</span>
                  <Badge variant="neutral">{a.category.replace('_',' ')}</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="secondary" onClick={()=>openEdit(a)} className="flex-1">Edit</Button>
                  <Button size="sm" variant="danger" loading={delId===a._id} onClick={()=>del(a._id)}>Del</Button>
                </div>
              </div>
            </div>))}</div>)}
      </div>
    </div>
  );
}
