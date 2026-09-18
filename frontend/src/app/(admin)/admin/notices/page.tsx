'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import Badge       from '@/components/admin/ui/Badge';
import EmptyState  from '@/components/admin/ui/EmptyState';
import SearchInput from '@/components/admin/ui/SearchInput';
import Pagination  from '@/components/admin/ui/Pagination';
import { useToast }   from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { Select }  from '@/components/admin/ui/FormFields';
import { cn }      from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import { formatDate } from '@/lib/utils/format';

const CATS = ['general','academic','admission','scholarship','workshop_seminar','recruitment','result','administrative'];
const CATS_OPTIONS = CATS.map(c => ({ value: c, label: c.replace(/_/g,' ') }));
const PAGE_SIZE = 12;

interface Attachment { fileName: string; fileUrl: string; fileType: string; fileSizeBytes?: number }
interface Notice {
  id: string; title: string; category: string; isPublished: boolean;
  isPinned: boolean; isUrgent: boolean; publishedAt?: string; createdAt: string;
  description?: string; postedByName?: string; attachments?: Attachment[];
}
interface FormState {
  title: string; description: string; category: string; postedByName: string;
  isPublished: boolean; isPinned: boolean; isUrgent: boolean;
  attachments: Attachment[];
}

const EMPTY: FormState = {
  title:'', description:'', category:'general', postedByName:'Admin',
  isPublished:false, isPinned:false, isUrgent:false, attachments:[],
};

// Upload file to Cloudinary (raw preset for PDFs/docs)
async function uploadToCloudinary(file: File): Promise<Attachment | null> {
  const cloud  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (cloud && preset) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', preset);
    fd.append('folder', 'cse-notices');
    const resource = file.type.startsWith('image/') ? 'image' : 'raw';
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${resource}/upload`, {
      method: 'POST', body: fd,
    });
    if (res.ok) {
      const d = await res.json() as { secure_url: string; bytes: number; format: string };
      return { fileName: file.name, fileUrl: d.secure_url,
        fileType: d.format || file.name.split('.').pop() || 'file',
        fileSizeBytes: d.bytes };
    }
  }
  // Fallback: base64 data URL (for dev without Cloudinary)
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      fileName: file.name, fileUrl: reader.result as string,
      fileType: file.name.split('.').pop() || 'file', fileSizeBytes: file.size,
    });
    reader.readAsDataURL(file);
  });
}

export default function NoticesPage() {
  const [list,     setList]     = useState<Notice[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState<FormState>(EMPTY);
  const [editing,  setEditing]  = useState<Notice | null>(null);
  const [open,     setOpen]     = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [delId,    setDelId]    = useState<string | null>(null);
  const [err,      setErr]      = useState('');
  const [query,    setQuery]    = useState('');
  const [catFilter,setCatFilter]= useState('');
  const [page,     setPage]     = useState(1);
  const [uploading,setUploading]= useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Notice[]>('/notices?admin=true')); }
    catch { toast.error('Failed to load'); setList([]); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let items = list;
    if (query)     items = items.filter(n => n.title.toLowerCase().includes(query.toLowerCase()));
    if (catFilter) items = items.filter(n => n.category === catFilter);
    return items;
  }, [list, query, catFilter]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const F = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  function openNew() {
    setEditing(null); setForm(EMPTY); setErr(''); setOpen(true);
  }
  function openEdit(n: Notice) {
    setEditing(n);
    setForm({
      title: n.title, description: n.description ?? '',
      category: n.category, postedByName: n.postedByName ?? 'Admin',
      isPublished: n.isPublished, isPinned: n.isPinned, isUrgent: n.isUrgent,
      attachments: n.attachments ?? [],
    });
    setErr(''); setOpen(true);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const att = await uploadToCloudinary(file);
      if (att) {
        setForm(p => ({ ...p, attachments: [...p.attachments, att] }));
        toast.success(`File attached: ${att.fileName}`);
      }
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  }

  function removeAttachment(idx: number) {
    setForm(p => ({ ...p, attachments: p.attachments.filter((_, i) => i !== idx) }));
  }

  async function save() {
    if (!form.title.trim()) { setErr('Title is required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { ...form };
      if (editing) {
        await adminPatch(`/notices/${editing.id}`, payload);
        toast.success('Notice updated!');
      } else {
        await adminPost('/notices', payload);
        toast.success('Notice posted!');
      }
      setOpen(false); load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      setErr(msg); toast.error(msg);
    } finally { setSaving(false); }
  }

  async function del(notice: Notice) {
    const ok = await confirm({
      title: 'Delete notice?',
      description: `"${notice.title}" will be permanently removed.`,
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    setDelId(notice.id);
    try { await adminDelete(`/notices/${notice.id}`); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDelId(null); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Manage Notices" />
      {ConfirmDialog}

      <PageHeader title="Notices" description={`${list.length} notice${list.length!==1?'s':''}`}
        action={
          <Button onClick={openNew} icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
          }>Post Notice</Button>
        }/>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <SearchInput value={query} onChange={v=>{setQuery(v);setPage(1);}}
          placeholder="Search notices…" className="sm:max-w-xs"/>
        <Select value={catFilter} onChange={e=>{setCatFilter(e.target.value);setPage(1);}}
          options={[{value:'',label:'All categories'},...CATS_OPTIONS]}
          className="sm:w-48"/>
        {(query||catFilter) && (
          <p className="text-xs text-slate-500">{filtered.length} result{filtered.length!==1?'s':''}</p>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? 'Edit Notice' : 'Post Notice'}
              </h3>
              <button onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>
            )}

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title *</label>
                <input value={form.title} onChange={e=>F('title',e.target.value)}
                  placeholder="Notice title" className={iCls}/>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea rows={3} value={form.description}
                  onChange={e=>F('description',e.target.value)}
                  className={`${iCls} resize-none`}/>
              </div>

              {/* Category + Posted By */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                  <select value={form.category} onChange={e=>F('category',e.target.value)} className={iCls}>
                    {CATS.map(c=><option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Posted By</label>
                  <input value={form.postedByName} onChange={e=>F('postedByName',e.target.value)} className={iCls}/>
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-5">
                {[
                  {k:'isPublished' as const, l:'Published'},
                  {k:'isPinned'    as const, l:'Pinned'},
                  {k:'isUrgent'   as const, l:'Urgent'},
                ].map(({k, l}) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[k]} onChange={e=>F(k,e.target.checked)}
                      className="w-4 h-4 accent-green-600"/>
                    <span className="text-sm font-medium text-slate-700">{l}</span>
                  </label>
                ))}
              </div>

              {/* File attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Attachment <span className="text-slate-400 font-normal">(PDF, DOC, image…)</span>
                </label>

                {/* Uploaded files list */}
                {form.attachments.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {form.attachments.map((att, idx) => (
                      <div key={idx}
                        className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                        <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{att.fileName}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{att.fileType}</p>
                        </div>
                        <a href={att.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                          Preview
                        </a>
                        <button onClick={() => removeAttachment(idx)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium ml-1">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <input ref={fileRef} type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                  className="hidden" onChange={handleFileSelect}/>
                <button type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm font-semibold text-slate-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center">
                  {uploading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Uploading…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                      </svg>
                      Click to attach file (PDF, DOC, Image…)
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                  Files are uploaded to Cloudinary · max 10 MB
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">
                {editing ? 'Update Notice' : 'Post Notice'}
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i=><div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}
          </div>
        ) : paged.length === 0 ? (
          <EmptyState
            title={query||catFilter ? 'No results' : 'No notices yet'}
            description={query||catFilter ? 'Try different filters.' : 'Post the first notice.'}
            action={!query&&!catFilter
              ? <Button onClick={openNew}>Post Notice</Button>
              : undefined}/>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">File</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-center px-4 py-3 hidden md:table-cell">Date</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((n, i) => (
                <tr key={n.id}
                  className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50', i%2?'bg-white':'')}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {n.isUrgent && (
                        <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded shrink-0">URGENT</span>
                      )}
                      {n.isPinned && !n.isUrgent && (
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded shrink-0">PIN</span>
                      )}
                      <span className="text-slate-900 font-medium line-clamp-1">{n.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <Badge variant="neutral">{n.category.replace(/_/g,' ')}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {n.attachments && n.attachments.length > 0 ? (
                      <a href={n.attachments[0].fileUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded"
                        style={{ background: '#00bcd4', color: '#fff' }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        FILE
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={n.isPublished?'success':'neutral'}>
                      {n.isPublished ? 'Live' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-400 hidden md:table-cell">
                    {formatDate(n.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(n)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId===n.id} onClick={() => del(n)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} total={filtered.length}
              limit={PAGE_SIZE} onPageChange={setPage}/>
          </div>
        )}
      </div>
    </div>
  );
}
