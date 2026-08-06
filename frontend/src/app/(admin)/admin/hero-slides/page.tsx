'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import Badge       from '@/components/admin/ui/Badge';
import EmptyState  from '@/components/admin/ui/EmptyState';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

interface Slide {
  _id: string; title: string; subtitle: string; tag: string; imageUrl: string;
  overlayOpacity: number; primaryBtnLabel: string; primaryBtnHref: string;
  secondaryBtnLabel: string; secondaryBtnHref: string;
  align: 'left' | 'center'; isActive: boolean; sortOrder: number;
}

const EMPTY: Omit<Slide, '_id'> = {
  title: '', subtitle: '', tag: '', imageUrl: '', overlayOpacity: 60,
  primaryBtnLabel: '', primaryBtnHref: '', secondaryBtnLabel: '', secondaryBtnHref: '',
  align: 'left', isActive: true, sortOrder: 0,
};

export default function AdminHeroSlidesPage() {
  const [list, setList]       = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string | null>(null);
  const [err, setErr]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Slide[]>('/hero-slides?admin=true')); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(s: Slide) {
    setEditing(s);
    setForm({ title: s.title, subtitle: s.subtitle, tag: s.tag, imageUrl: s.imageUrl,
      overlayOpacity: s.overlayOpacity, primaryBtnLabel: s.primaryBtnLabel, primaryBtnHref: s.primaryBtnHref,
      secondaryBtnLabel: s.secondaryBtnLabel, secondaryBtnHref: s.secondaryBtnHref,
      align: s.align, isActive: s.isActive, sortOrder: s.sortOrder });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.subtitle.trim()) { setErr('Title and subtitle are required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) await adminPatch(`/hero-slides/${editing._id}`, form);
      else await adminPost('/hero-slides', form);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this slide?')) return;
    setDelId(id);
    try { await adminDelete(`/hero-slides/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
    finally { setDelId(null); }
  }

  const iCls = 'w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Hero Slides" />
      <PageHeader title="Hero Slider" description={`${list.length} slide${list.length !== 1 ? 's' : ''} — shown on homepage`}
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Slide</Button>}/>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-white mb-5">{editing ? 'Edit Slide' : 'New Slide'}</h3>
            {err && <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

            <div className="space-y-4">
              {/* Image */}
              <ImageUpload label="Background Image" value={form.imageUrl} onChange={v => F('imageUrl', v)} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tag (small label)</label>
                  <input value={form.tag} onChange={e => F('tag', e.target.value)} placeholder="Welcome to" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Overlay Opacity (0–100)</label>
                  <input type="number" min={0} max={100} value={form.overlayOpacity} onChange={e => F('overlayOpacity', +e.target.value)} className={iCls}/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Title *</label>
                <input value={form.title} onChange={e => F('title', e.target.value)} placeholder="Slide headline" className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Subtitle *</label>
                <textarea rows={3} value={form.subtitle} onChange={e => F('subtitle', e.target.value)} placeholder="Supporting text below the title" className={`${iCls} resize-none`}/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Primary Button Label</label>
                  <input value={form.primaryBtnLabel} onChange={e => F('primaryBtnLabel', e.target.value)} placeholder="Explore Programs" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Primary Button URL</label>
                  <input value={form.primaryBtnHref} onChange={e => F('primaryBtnHref', e.target.value)} placeholder="/academics" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Secondary Button Label</label>
                  <input value={form.secondaryBtnLabel} onChange={e => F('secondaryBtnLabel', e.target.value)} placeholder="Our Research" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Secondary Button URL</label>
                  <input value={form.secondaryBtnHref} onChange={e => F('secondaryBtnHref', e.target.value)} placeholder="/research" className={iCls}/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Text Alignment</label>
                  <select value={form.align} onChange={e => F('align', e.target.value as 'left' | 'center')}
                    className={iCls}>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => F('sortOrder', +e.target.value)} className={iCls}/>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => F('isActive', e.target.checked)} className="accent-blue-500"/>
                <span className="text-sm text-slate-300">Active (visible on homepage)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Slide cards */}
      <div className="space-y-3 mt-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"/>)
        ) : list.length === 0 ? (
          <EmptyState title="No slides yet" description="Add the first hero slide." action={<Button onClick={openNew}>Add Slide</Button>}/>
        ) : list.map((s, i) => (
          <div key={s._id} className="flex items-center gap-4 bg-slate-900 border border-slate-200 rounded-xl p-4">
            {/* Thumbnail */}
            <div className="w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-800 flex items-center justify-center">
              {s.imageUrl && !s.imageUrl.startsWith('data:')
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={s.imageUrl} alt="" className="w-full h-full object-cover"/>
                : <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
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
              <Button size="sm" variant="danger" loading={delId === s._id} onClick={() => del(s._id)}>Del</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
