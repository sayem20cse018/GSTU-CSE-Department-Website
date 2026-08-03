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

const CATS = ['general','achievement','research','event','announcement','award','collaboration'];
const EMPTY = { title:'', slug:'', excerpt:'', content:'', coverImage:'', category:'general', tags:'', authorName:'Admin', isPublished:false, isFeatured:false };

interface NewsItem { _id:string; title:string; slug:string; excerpt:string; category:string; authorName:string; isPublished:boolean; isFeatured:boolean; publishedAt?:string; createdAt:string; coverImage?:string }

function toSlug(s:string) { return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

export default function AdminNewsPage() {
  const [list, setList]       = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState<NewsItem|null>(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string|null>(null);
  const [err, setErr]         = useState('');
  const [tab, setTab]         = useState<'basic'|'content'>('basic');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await adminGet<{data:NewsItem[];pagination:{total:number}}>('/news?admin=true&limit=50');
      setList((r as {data:NewsItem[]}).data ?? []);
    } catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: string|boolean) => setForm(p => ({ ...p, [k]: v }));
  function openEdit(n: NewsItem) { setEditing(n); setForm({ title:n.title, slug:n.slug, excerpt:n.excerpt, content:'', coverImage:n.coverImage??'', category:n.category, tags:'', authorName:n.authorName, isPublished:n.isPublished, isFeatured:n.isFeatured }); setTab('basic'); setErr(''); setOpen(true); }

  async function save() {
    if (!form.title||!form.slug||!form.excerpt) { setErr('Title, slug and excerpt are required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { ...form, tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean) };
      if (editing) await adminPatch(`/news/${editing._id}`, payload);
      else await adminPost('/news', payload);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id:string) {
    if (!confirm('Delete this article?')) return;
    setDelId(id);
    try { await adminDelete(`/news/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDelId(null); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="Manage News" />
      <PageHeader title="News Articles" description={`${list.length} article${list.length!==1?'s':''}`}
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY);setTab('basic');setErr('');setOpen(true)}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Write Article</Button>}/>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">{editing?'Edit Article':'Write Article'}</h3>
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                {(['basic','content'] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={cn('px-3 py-1.5 text-xs font-semibold transition',tab===t?'bg-blue-600 text-white':'text-slate-400 hover:bg-white/5')}>{t==='basic'?'Basic Info':'Content'}</button>)}
              </div>
            </div>
            {err && <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

            {tab==='basic' && (
              <div className="space-y-4">
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e=>{F('title',e.target.value);if(!editing)F('slug',toSlug(e.target.value));}} placeholder="Article title"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Slug *</label>
                  <input type="text" value={form.slug} onChange={e=>F('slug',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Excerpt * (shown on cards)</label>
                  <textarea rows={3} value={form.excerpt} onChange={e=>F('excerpt',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                    <select value={form.category} onChange={e=>F('category',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select></div>
                  <div><label className="block text-xs font-medium text-slate-400 mb-1">Author</label>
                    <input type="text" value={form.authorName} onChange={e=>F('authorName',e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                </div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Cover Image URL</label>
                  <input type="url" value={form.coverImage} onChange={e=>F('coverImage',e.target.value)} placeholder="https://…" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma separated)</label>
                  <input type="text" value={form.tags} onChange={e=>F('tags',e.target.value)} placeholder="AI, Research, Students" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                <div className="flex gap-4">
                  {[{k:'isPublished',l:'Published'},{k:'isFeatured',l:'Featured (homepage)'}].map(({k,l})=>(
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={e=>F(k as keyof typeof EMPTY,e.target.checked)} className="accent-blue-500"/>
                      <span className="text-sm text-slate-300">{l}</span>
                    </label>))}
                </div>
              </div>
            )}

            {tab==='content' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Article Content (HTML or Markdown)</label>
                <textarea rows={16} value={form.content} onChange={e=>F('content',e.target.value)} placeholder="Write the full article content here…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Publish'}</Button>
              <Button variant="secondary" onClick={()=>setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>)}

      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse"/>)}</div>
        : list.length===0 ? <EmptyState title="No articles yet" description="Write the first news article."/>
        : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
              <th className="text-left px-5 py-3">Article</th>
              <th className="text-center px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-center px-4 py-3 hidden md:table-cell">Date</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {list.map((n,i)=>(
                <tr key={n._id} className={cn('border-b border-white/5 last:border-0 hover:bg-white/[0.03]',i%2?'bg-white/[0.01]':'')}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-white line-clamp-1">{n.title}</p>
                    <p className="text-xs text-slate-500 font-mono">{n.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell"><Badge variant="neutral">{n.category}</Badge></td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      <Badge variant={n.isPublished?'success':'neutral'}>{n.isPublished?'Live':'Draft'}</Badge>
                      {n.isFeatured && <Badge variant="info">Featured</Badge>}
                    </div>
                  </td>
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
