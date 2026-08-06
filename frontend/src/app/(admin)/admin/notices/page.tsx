'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader from '@/components/admin/ui/PageHeader';
import Button     from '@/components/admin/ui/Button';
import Badge      from '@/components/admin/ui/Badge';
import EmptyState from '@/components/admin/ui/EmptyState';
import { cn }     from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import { formatDate } from '@/lib/utils/format';

const CATS = ['general','academic','admission','scholarship','workshop_seminar','recruitment','result','administrative'];
const EMPTY = { title:'', description:'', category:'general', targetAudience:['all'], isPublished:false, isPinned:false, isUrgent:false, postedByName:'Admin' };

interface Notice { _id:string; title:string; category:string; isPublished:boolean; isPinned:boolean; isUrgent:boolean; publishedAt?:string; createdAt:string; description?:string; postedByName?:string }

export default function NoticesPage() {
  const [list, setList]       = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState<Notice|null>(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string|null>(null);
  const [err, setErr]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Notice[]>('/notices?admin=true')); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  function openEdit(n: Notice) { setEditing(n); setForm({ title:n.title, description:n.description??'', category:n.category, targetAudience:['all'], isPublished:n.isPublished, isPinned:n.isPinned, isUrgent:n.isUrgent, postedByName:n.postedByName??'Admin' }); setErr(''); setOpen(true); }

  async function save() {
    if (!form.title.trim()) { setErr('Title is required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) await adminPatch(`/notices/${editing._id}`, form);
      else await adminPost('/notices', form);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this notice?')) return;
    setDelId(id);
    try { await adminDelete(`/notices/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDelId(null); }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Manage Notices" />
      <PageHeader title="Notices" description={`${list.length} notice${list.length!==1?'s':''}`}
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY);setErr('');setOpen(true)}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Post Notice</Button>}/>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-200 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-5">{editing?'Edit Notice':'Post Notice'}</h3>
            {err && <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e=>F('title',e.target.value)} placeholder="Notice title"
                  className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Description (optional)</label>
                <textarea rows={3} value={form.description} onChange={e=>F('description',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select value={form.category} onChange={e=>F('category',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {CATS.map(c=><option key={c} value={c}>{c.replace('_',' ')}</option>)}
                  </select></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Posted By</label>
                  <input type="text" value={form.postedByName} onChange={e=>F('postedByName',e.target.value)} className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[{k:'isPublished',l:'Published'},{k:'isPinned',l:'Pinned'},{k:'isUrgent',l:'Urgent'}].map(({k,l})=>(
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={e=>F(k as keyof typeof EMPTY,e.target.checked)} className="accent-blue-500"/>
                    <span className="text-sm text-slate-300">{l}</span>
                  </label>))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Post'}</Button>
              <Button variant="secondary" onClick={()=>setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>)}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
        : list.length===0 ? <EmptyState title="No notices yet" description="Post the first notice."/>
        : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-center px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Date</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {list.map((n,i)=>(
                <tr key={n._id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50',i%2?'bg-white':'')}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {n.isUrgent && <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded shrink-0">URGENT</span>}
                      {n.isPinned && !n.isUrgent && <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded shrink-0">PIN</span>}
                      <span className="text-white font-medium line-clamp-1">{n.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell"><Badge variant="neutral">{n.category.replace('_',' ')}</Badge></td>
                  <td className="px-4 py-3 text-center"><Badge variant={n.isPublished?'success':'neutral'}>{n.isPublished?'Live':'Draft'}</Badge></td>
                  <td className="px-4 py-3 text-center text-xs text-slate-400 hidden md:table-cell">{formatDate(n.createdAt)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(n)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId===n._id} onClick={()=>del(n._id)}>Delete</Button>
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
