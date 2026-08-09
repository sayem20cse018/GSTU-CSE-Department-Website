'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader    from '@/components/admin/ui/PageHeader';
import Button        from '@/components/admin/ui/Button';
import Badge         from '@/components/admin/ui/Badge';
import EmptyState    from '@/components/admin/ui/EmptyState';
import ImageUpload   from '@/components/admin/ui/ImageUpload';
import SearchInput   from '@/components/admin/ui/SearchInput';
import { useToast }  from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { Input, Select, Checkbox, FormField } from '@/components/admin/ui/FormFields';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

interface Slide {
  id: string; title: string; subtitle: string; tag: string; imageUrl: string;
  overlayOpacity: number; primaryBtnLabel: string; primaryBtnHref: string;
  secondaryBtnLabel: string; secondaryBtnHref: string;
  align: 'left' | 'center'; isActive: boolean; sortOrder: number;
}

const EMPTY: Omit<Slide, 'id'> = {
  title: '', subtitle: '', tag: '', imageUrl: '', overlayOpacity: 60,
  primaryBtnLabel: '', primaryBtnHref: '', secondaryBtnLabel: '', secondaryBtnHref: '',
  align: 'left', isActive: true, sortOrder: 0,
};

export default function AdminHeroSlidesPage() {
  const [list,    setList]    = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [open,    setOpen]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [delId,   setDelId]   = useState<string | null>(null);
  const [err,     setErr]     = useState('');
  const [query,   setQuery]   = useState('');

  const toast               = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Slide[]>('/hero-slides?admin=true')); }
    catch { toast.error('Failed to load slides'); setList([]); }
    finally { setLoading(false); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() =>
    query ? list.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.subtitle.toLowerCase().includes(query.toLowerCase()))
    : list
  , [list, query]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew()    { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(s: Slide) {
    setEditing(s);
    const { id: _id, ...rest } = s; void _id;
    setForm(rest);
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.subtitle.trim()) { setErr('Title and subtitle are required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) { await adminPatch(`/hero-slides/${editing.id}`, form); toast.success('Slide updated!'); }
      else          { await adminPost('/hero-slides', form);               toast.success('Slide created!'); }
      setOpen(false); load();
    } catch (e) { const msg = e instanceof Error ? e.message : 'Save failed'; setErr(msg); toast.error(msg); }
    finally { setSaving(false); }
  }

  async function del(slide: Slide) {
    const ok = await confirm({ title: `Delete "${slide.title}"?`, description: 'This slide will be permanently removed.', confirmLabel: 'Delete' });
    if (!ok) return;
    setDelId(slide.id);
    try { await adminDelete(`/hero-slides/${slide.id}`); toast.success('Slide deleted'); load(); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDelId(null); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Hero Slides" />
      {ConfirmDialog}

      <PageHeader
        title="Hero Slider"
        description={`${list.length} slide${list.length !== 1 ? 's' : ''} — shown on homepage`}
        action={
          <Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>
            Add Slide
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Search slides…" className="max-w-xs"/>
        {query && <p className="text-xs text-slate-500">{filtered.length} of {list.length}</p>}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Slide' : 'New Slide'}</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 transition p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {err && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

            <div className="space-y-4">
              <ImageUpload label="Background Image" value={form.imageUrl} onChange={v => F('imageUrl', v)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Tag (small label)" value={form.tag} onChange={e => F('tag', e.target.value)} placeholder="Welcome to"/>
                <Input label="Overlay Opacity (0–100)" type="number" value={form.overlayOpacity} onChange={e => F('overlayOpacity', +e.target.value)} min={0} max={100}/>
              </div>
              <Input label="Title" required value={form.title} onChange={e => F('title', e.target.value)} placeholder="Slide headline"/>
              <FormField label="Subtitle" required>
                <textarea rows={3} value={form.subtitle} onChange={e => F('subtitle', e.target.value)} placeholder="Supporting text…" className={`${iCls} resize-none`}/>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Primary Button Label" value={form.primaryBtnLabel} onChange={e => F('primaryBtnLabel', e.target.value)} placeholder="Explore Programs"/>
                <Input label="Primary Button URL" value={form.primaryBtnHref} onChange={e => F('primaryBtnHref', e.target.value)} placeholder="/academics"/>
                <Input label="Secondary Button Label" value={form.secondaryBtnLabel} onChange={e => F('secondaryBtnLabel', e.target.value)} placeholder="Our Research"/>
                <Input label="Secondary Button URL" value={form.secondaryBtnHref} onChange={e => F('secondaryBtnHref', e.target.value)} placeholder="/research"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select label="Text Alignment" value={form.align} onChange={e => F('align', e.target.value)} options={[{value:'left',label:'Left'},{value:'center',label:'Center'}]}/>
                <Input label="Sort Order" type="number" value={form.sortOrder} onChange={e => F('sortOrder', +e.target.value)}/>
              </div>
              <Checkbox label="Active (visible on homepage)" checked={form.isActive} onChange={e => F('isActive', e.target.checked)}/>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing ? 'Update Slide' : 'Create Slide'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Slide list */}
      <div className="space-y-3">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"/>)
        ) : filtered.length === 0 ? (
          <EmptyState
            title={query ? `No slides matching "${query}"` : 'No slides yet'}
            description={query ? 'Try a different search term.' : 'Add the first hero slide.'}
            action={!query ? <Button onClick={openNew}>Add Slide</Button> : undefined}
          />
        ) : filtered.map(s => (
          <div key={s.id} className="flex items-center gap-4 bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-green-700/50 transition">
            <div className="w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-800 flex items-center justify-center">
              {s.imageUrl && !s.imageUrl.startsWith('data:')
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.imageUrl} alt="" className="w-full h-full object-cover"/>
                : <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{s.title}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{s.subtitle}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-600">Order: {s.sortOrder}</span>
                <span className="text-[10px] text-slate-600">·</span>
                <span className="text-[10px] text-slate-600 capitalize">{s.align}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={s.isActive ? 'success' : 'neutral'}>{s.isActive ? 'Active' : 'Hidden'}</Badge>
              <Button size="sm" variant="secondary" onClick={() => openEdit(s)}>Edit</Button>
              <Button size="sm" variant="danger" loading={delId === s.id} onClick={() => del(s)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
