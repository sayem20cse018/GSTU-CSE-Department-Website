'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import Badge       from '@/components/admin/ui/Badge';
import EmptyState  from '@/components/admin/ui/EmptyState';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import SearchInput from '@/components/admin/ui/SearchInput';
import { useToast }   from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { cn }         from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

const EMPTY = {
  name:'', slug:'', description:'', shortDescription:'', logo:'', coverImage:'',
  advisorName:'', presidentName:'', foundedYear:new Date().getFullYear(),
  memberCount:0, facebookUrl:'', email:'', isActive:true, isFeatured:false,
};
interface Club {
  id:string; name:string; slug:string; memberCount:number; foundedYear:number;
  isActive:boolean; isFeatured:boolean; advisorName?:string; logo?:string;
}
const toSlug = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500';

export default function ClubsAdminPage() {
  const [list,    setList]    = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState<Club|null>(null);
  const [saving,  setSaving]  = useState(false);
  const [delId,   setDelId]   = useState<string|null>(null);
  const [err,     setErr]     = useState('');
  const [query,   setQuery]   = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Club[]>('/clubs?admin=true')); }
    catch { toast.error('Failed to load'); setList([]); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: string|boolean|number) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(c: Club) {
    setEditing(c);
    setForm({ name:c.name, slug:c.slug, description:'', shortDescription:'', logo:c.logo??'',
      coverImage:'', advisorName:c.advisorName??'', presidentName:'', foundedYear:c.foundedYear,
      memberCount:c.memberCount, facebookUrl:'', email:'', isActive:c.isActive, isFeatured:c.isFeatured });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name || !form.slug) { setErr('Name and slug are required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) { await adminPatch(`/clubs/${editing.id}`, form); toast.success('Club updated!'); }
      else         { await adminPost('/clubs', form);                 toast.success('Club created!'); }
      setOpen(false); load();
    } catch (e) { const m = e instanceof Error?e.message:'Save failed'; setErr(m); toast.error(m); }
    finally { setSaving(false); }
  }

  async function del(c: Club) {
    const ok = await confirm({ title:`Delete "${c.name}"?`, confirmLabel:'Delete' });
    if (!ok) return;
    setDelId(c.id);
    try { await adminDelete(`/clubs/${c.id}`); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e instanceof Error?e.message:'Delete failed'); }
    finally { setDelId(null); }
  }

  const filtered = query ? list.filter(c => c.name.toLowerCase().includes(query.toLowerCase())) : list;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Manage Clubs" />
      {ConfirmDialog}

      <PageHeader title="Student Clubs" description={`${list.length} club${list.length!==1?'s':''}`}
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Club</Button>}/>

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search clubs…" className="max-w-xs"/>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing?'Edit':'Add'} Club</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Club Name *</label>
                <input value={form.name} onChange={e=>{F('name',e.target.value);if(!editing)F('slug',toSlug(e.target.value));}}
                  placeholder="Programming Club" className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Slug *</label>
                <input value={form.slug} onChange={e=>F('slug',e.target.value)} className={`${iCls} font-mono`}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Short Description</label>
                <input value={form.shortDescription} onChange={e=>F('shortDescription',e.target.value)} placeholder="One-line description" className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Description</label>
                <textarea rows={3} value={form.description} onChange={e=>F('description',e.target.value)} className={`${iCls} resize-none`}/>
              </div>

              {/* Image uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload label="Club Logo" value={form.logo} onChange={v => F('logo', v)} hint="Club badge/logo (square recommended)"/>
                <ImageUpload label="Cover Image" value={form.coverImage} onChange={v => F('coverImage', v)} hint="Banner/cover image"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Faculty Advisor</label>
                  <input value={form.advisorName} onChange={e=>F('advisorName',e.target.value)} placeholder="Dr. Name" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">President</label>
                  <input value={form.presidentName} onChange={e=>F('presidentName',e.target.value)} placeholder="Student Name" className={iCls}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Founded Year</label>
                  <input type="number" value={form.foundedYear} onChange={e=>F('foundedYear',+e.target.value)} className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Members</label>
                  <input type="number" value={form.memberCount} onChange={e=>F('memberCount',+e.target.value)} className={iCls}/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <input value={form.email} onChange={e=>F('email',e.target.value)} placeholder="club@gstu.edu.bd" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facebook URL</label>
                  <input value={form.facebookUrl} onChange={e=>F('facebookUrl',e.target.value)} placeholder="https://facebook.com/…" className={iCls}/>
                </div>
              </div>
              <div className="flex gap-5">
                {[{k:'isActive',l:'Active'},{k:'isFeatured',l:'Featured'}].map(({k,l}) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[k as keyof typeof EMPTY] as boolean}
                      onChange={e=>F(k as keyof typeof EMPTY,e.target.checked)} className="w-4 h-4 accent-green-600"/>
                    <span className="text-sm font-medium text-slate-700">{l}</span>
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

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState title={query?`No clubs matching "${query}"`:'No clubs yet'} description={query?'Try a different search.':'Add the first student club.'}
            action={!query?<Button onClick={openNew}>Add Club</Button>:undefined}/>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="text-left px-5 py-3">Club</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Members</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50', i%2?'bg-white':'')}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {c.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.logo} alt="" className="w-8 h-8 rounded-lg object-contain border border-slate-200 bg-white shrink-0"/>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0 text-green-700 font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{c.name}</p>
                        {c.advisorName && <p className="text-xs text-slate-500">Advisor: {c.advisorName}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 hidden sm:table-cell">{c.memberCount}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      <Badge variant={c.isActive?'success':'neutral'}>{c.isActive?'Active':'Inactive'}</Badge>
                      {c.isFeatured && <Badge variant="info">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId===c.id} onClick={() => del(c)}>Delete</Button>
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
