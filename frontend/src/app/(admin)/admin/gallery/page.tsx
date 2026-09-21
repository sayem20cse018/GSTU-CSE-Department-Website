'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import Badge       from '@/components/admin/ui/Badge';
import EmptyState  from '@/components/admin/ui/EmptyState';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import SearchInput from '@/components/admin/ui/SearchInput';
import { useToast }   from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import { formatDate } from '@/lib/utils/format';

const CATS = ['event','lab','student_life','faculty','infrastructure','convocation','sports','competition','other'];
const EMPTY_ALBUM = { title:'', slug:'', description:'', category:'event', coverImage:'', albumDate:'', uploadedByName:'Admin', isPublished:false, isFeatured:false };

interface MediaItem { id?:string; url:string; thumbnailUrl:string; caption?:string; altText?:string; mediaType?:string; sortOrder?:number }
interface Album { id:string; title:string; slug:string; category:string; mediaCount:number; albumDate:string; isPublished:boolean; isFeatured:boolean; coverImage?:string; media?:MediaItem[] }

const toSlug = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

// Upload to Cloudinary or return base64
async function uploadImage(file: File): Promise<string> {
  const cloud  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (cloud && preset) {
    const fd = new FormData();
    fd.append('file', file); fd.append('upload_preset', preset); fd.append('folder', 'cse-gallery');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: fd });
    if (res.ok) { const d = await res.json() as { secure_url: string }; return d.secure_url; }
  }
  // Canvas resize fallback
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const maxPx = 1200;
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round(height * maxPx / width); width = maxPx; }
        else { width = Math.round(width * maxPx / height); height = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No canvas')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Load failed')); };
    img.src = url;
  });
}

export default function AdminGalleryPage() {
  const [list,     setList]     = useState<Album[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY_ALBUM);
  const [editing,  setEditing]  = useState<Album|null>(null);
  const [albumOpen,setAlbumOpen]= useState(false);
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState('');
  const [query,    setQuery]    = useState('');

  // Photo management state
  const [photoAlbum, setPhotoAlbum]  = useState<Album|null>(null);
  const [uploading,  setUploading]   = useState(false);
  const [uploadErr,  setUploadErr]   = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Album[]>('/gallery?admin=true')); }
    catch { toast.error('Failed to load albums'); setList([]); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY_ALBUM, v: string|boolean) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY_ALBUM); setErr(''); setAlbumOpen(true); }
  function openEdit(a: Album) {
    setEditing(a);
    setForm({ title:a.title, slug:a.slug, description:'', category:a.category,
      coverImage:a.coverImage??'', albumDate:a.albumDate?.slice(0,10)??'',
      uploadedByName:'Admin', isPublished:a.isPublished, isFeatured:a.isFeatured });
    setErr(''); setAlbumOpen(true);
  }

  async function openPhotos(a: Album) {
    // Fetch album with media
    try {
      const full = await adminGet<Album>(`/gallery/${a.id}`);
      setPhotoAlbum(full);
    } catch { setPhotoAlbum(a); }
  }

  async function saveAlbum() {
    if (!form.title || !form.slug || !form.albumDate) { setErr('Title, slug and date are required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) { await adminPatch(`/gallery/${editing.id}`, form); toast.success('Album updated!'); }
      else         { await adminPost('/gallery', form);                 toast.success('Album created!'); }
      setAlbumOpen(false); load();
    } catch (e) { const m = e instanceof Error?e.message:'Save failed'; setErr(m); toast.error(m); }
    finally { setSaving(false); }
  }

  async function delAlbum(a: Album) {
    const ok = await confirm({ title:`Delete "${a.title}"?`, description:'All photos in this album will be lost.', confirmLabel:'Delete Album' });
    if (!ok) return;
    try { await adminDelete(`/gallery/${a.id}`); toast.success('Album deleted'); load(); }
    catch (e) { toast.error(e instanceof Error?e.message:'Delete failed'); }
  }

  // ── Photo upload ──────────────────────────────────────────────────────────
  async function handlePhotoFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!photoAlbum) return;
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setUploading(true); setUploadErr('');
    try {
      const newMedia: MediaItem[] = [];
      for (const file of files) {
        const url = await uploadImage(file);
        newMedia.push({ url, thumbnailUrl: url, mediaType: 'image', caption: '', altText: file.name });
      }
      // Merge with existing media
      const existing = (photoAlbum.media ?? []).map(m => ({ url:m.url, thumbnailUrl:m.thumbnailUrl, caption:m.caption??'', altText:m.altText??'', mediaType:m.mediaType??'image' }));
      const allMedia = [...existing, ...newMedia];
      const updated = await adminPatch<Album>(`/gallery/${photoAlbum.id}`, { media: allMedia });
      setPhotoAlbum(updated);
      load(); // refresh counts
      toast.success(`${files.length} photo${files.length>1?'s':''} uploaded!`);
    } catch (e) { setUploadErr(e instanceof Error?e.message:'Upload failed'); }
    finally { setUploading(false); }
  }

  async function deletePhoto(idx: number) {
    if (!photoAlbum) return;
    const ok = await confirm({ title:'Remove photo?', description:'This photo will be removed from the album.', confirmLabel:'Remove' });
    if (!ok) return;
    const media = (photoAlbum.media ?? [])
      .filter((_, i) => i !== idx)
      .map(m => ({ url:m.url, thumbnailUrl:m.thumbnailUrl, caption:m.caption??'', altText:m.altText??'', mediaType:m.mediaType??'image' }));
    try {
      const updated = await adminPatch<Album>(`/gallery/${photoAlbum.id}`, { media });
      setPhotoAlbum(updated); load(); toast.success('Photo removed');
    } catch (e) { toast.error(e instanceof Error?e.message:'Failed'); }
  }

  async function updateCaption(idx: number, caption: string) {
    if (!photoAlbum) return;
    const media = (photoAlbum.media ?? []).map((m, i) => ({
      url:m.url, thumbnailUrl:m.thumbnailUrl,
      caption: i === idx ? caption : (m.caption??''),
      altText:m.altText??'', mediaType:m.mediaType??'image'
    }));
    try {
      const updated = await adminPatch<Album>(`/gallery/${photoAlbum.id}`, { media });
      setPhotoAlbum(updated);
    } catch { /* silently fail on caption update */ }
  }

  const filtered = query ? list.filter(a => a.title.toLowerCase().includes(query.toLowerCase())) : list;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="Photo Gallery" />
      {ConfirmDialog}

      <PageHeader title="Photo Gallery" description={`${list.length} album${list.length!==1?'s':''}`}
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>New Album</Button>}/>

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search albums…" className="max-w-xs"/>
      </div>

      {/* ── Album form modal ──────────────────────────────────────────── */}
      {albumOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing?'Edit Album':'New Album'}</h3>
              <button onClick={() => setAlbumOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Album Title *</label>
                <input value={form.title} onChange={e=>{F('title',e.target.value);if(!editing)F('slug',toSlug(e.target.value));}} className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Slug *</label>
                <input value={form.slug} onChange={e=>F('slug',e.target.value)} className={`${iCls} font-mono`}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                  <select value={form.category} onChange={e=>F('category',e.target.value)} className={iCls}>
                    {CATS.map(c=><option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date *</label>
                  <input type="date" value={form.albumDate} onChange={e=>F('albumDate',e.target.value)} className={iCls}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={e=>F('description',e.target.value)} className={`${iCls} resize-none`}/>
              </div>
              <ImageUpload label="Cover Image" value={form.coverImage} onChange={v=>F('coverImage',v)}/>
              <div className="flex gap-5">
                {[{k:'isPublished',l:'Published'},{k:'isFeatured',l:'Featured'}].map(({k,l})=>(
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[k as keyof typeof EMPTY_ALBUM] as boolean}
                      onChange={e=>F(k as keyof typeof EMPTY_ALBUM,e.target.checked)} className="accent-green-600"/>
                    <span className="text-sm font-medium text-slate-700">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={saveAlbum} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
              <Button variant="secondary" onClick={() => setAlbumOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Photo management modal ────────────────────────────────────── */}
      {photoAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{photoAlbum.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{photoAlbum.media?.length ?? 0} photo{(photoAlbum.media?.length??0)!==1?'s':''}</p>
              </div>
              <div className="flex items-center gap-3">
                <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoFiles}/>
                <Button onClick={() => photoInputRef.current?.click()} loading={uploading}
                  icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>}>
                  {uploading ? 'Uploading…' : 'Add Photos'}
                </Button>
                <button onClick={() => setPhotoAlbum(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            {uploadErr && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{uploadErr}</div>
            )}

            {/* Upload drop zone hint */}
            {(photoAlbum.media?.length ?? 0) === 0 && !uploading && (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center">
                  <button onClick={() => photoInputRef.current?.click()}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-300 hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </button>
                  <p className="font-semibold text-slate-700">No photos yet</p>
                  <p className="text-sm text-slate-400 mt-1">Click "Add Photos" to upload multiple images at once</p>
                </div>
              </div>
            )}

            {/* Photo grid */}
            {(photoAlbum.media?.length ?? 0) > 0 && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(photoAlbum.media ?? []).map((photo, idx) => (
                    <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={photo.altText ?? ''} className="w-full aspect-square object-cover"/>
                      {/* Delete button */}
                      <button onClick={() => deletePhoto(idx)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                      {/* Caption input */}
                      <div className="p-2">
                        <input
                          defaultValue={photo.caption ?? ''}
                          onBlur={e => updateCaption(idx, e.target.value)}
                          placeholder="Caption (optional)…"
                          className="w-full text-[10px] border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-600 placeholder-slate-300"
                        />
                      </div>
                    </div>
                  ))}
                  {/* Add more button */}
                  <button onClick={() => photoInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-green-400 hover:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-green-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
                    </svg>
                    <span className="text-xs font-medium">Add More</span>
                  </button>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setPhotoAlbum(null)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Albums grid ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"/>)}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title={query ? `No albums matching "${query}"` : 'No albums yet'}
            description={query ? 'Try a different search.' : 'Create the first photo album.'}
            action={!query ? <Button onClick={openNew}>New Album</Button> : undefined}/>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filtered.map(a => (
              <div key={a.id} className="border border-slate-200 rounded-xl overflow-hidden hover:border-green-300 hover:shadow-sm transition-all group">
                {/* Thumbnail */}
                <div className="h-36 bg-slate-100 relative overflow-hidden">
                  {a.coverImage
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: 'linear-gradient(135deg,#0b3d1f,#1a7a3c)' }}>🖼️</div>
                  }
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant={a.isPublished?'success':'neutral'}>{a.isPublished?'Live':'Draft'}</Badge>
                  </div>
                  {/* Photo count */}
                  <div className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-lg text-white"
                    style={{ background: 'rgba(0,0,0,0.6)' }}>
                    📷 {a.mediaCount} photos
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="font-semibold text-slate-900 text-sm line-clamp-1 mb-0.5">{a.title}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-slate-500">{formatDate(a.albumDate)}</span>
                    <Badge variant="neutral">{a.category.replace(/_/g,' ')}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openPhotos(a)} className="flex-1"
                      icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>}>
                      Photos
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openEdit(a)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => delAlbum(a)}>Del</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
