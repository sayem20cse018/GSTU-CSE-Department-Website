'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge from '@/components/admin/ui/Badge';
import PageHeader from '@/components/admin/ui/PageHeader';
import EmptyState from '@/components/admin/ui/EmptyState';
import { useToast } from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import type { AcademicResource } from '@/lib/api/academics';
import { formatDate } from '@/lib/utils/format';

const TYPE_LABELS: Record<string,string> = {
  routine:'Class Routine', calendar:'Academic Calendar', exam_schedule:'Exam Schedule',
  result:'Results', guideline:'Syllabus/Guidelines', other:'Other' };

const EMPTY = { title:'', type:'routine' as AcademicResource['type'], description:'',
  targetDegree:'all', academicYear:'2024-25', term:'Spring' as 'Spring'|'Summer'|'Fall'|'Annual',
  fileUrl:'', fileName:'', isPublished:false, isPinned:false };

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [open,      setOpen]      = useState(false);
  const [editing,   setEditing]   = useState<AcademicResource|null>(null);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [err,       setErr]       = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await adminGet<AcademicResource[]>('/academics/resources?isAdmin=true'); setResources(Array.isArray(d)?d:[]); }
    catch { setResources([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY); setErr(''); setOpen(true); }
  function openEdit(r: AcademicResource) {
    setEditing(r);
    setForm({ title:r.title, type:r.type, description:r.description??'', targetDegree:r.targetDegree,
      academicYear:r.academicYear, term:r.term as typeof EMPTY.term,
      fileUrl:r.files[0]?.fileUrl??'', fileName:r.files[0]?.fileName??'',
      isPublished:r.isPublished, isPinned:r.isPinned });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) { setErr('Title is required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { ...form, files: form.fileUrl
        ? [{ fileName: form.fileName || form.fileUrl.split('/').pop() || 'file', fileUrl: form.fileUrl }]
        : [] };
      if (editing) { await adminPatch(`/academics/resources/${editing.id}`, payload); toast.success('Updated!'); }
      else          { await adminPost('/academics/resources', payload);               toast.success('Created!'); }
      setOpen(false); load();
    } catch(e) { const m=e instanceof Error?e.message:'Save failed'; setErr(m); toast.error(m); }
    finally { setSaving(false); }
  }

  async function remove(r: AcademicResource) {
    const ok = await confirm({ title:`Delete "${r.title}"?`, confirmLabel:'Delete' });
    if (!ok) return;
    try { await adminDelete(`/academics/resources/${r.id}`); toast.success('Deleted'); load(); }
    catch(e) { toast.error(e instanceof Error?e.message:'Delete failed'); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Manage Resources" />
      {ConfirmDialog}
      <PageHeader title="Academic Resources" description="Manage routines, calendars, schedules and results."
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Upload Resource</Button>}/>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing?'Edit Resource':'Upload Resource'}</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>}
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Title *</label>
                <input value={form.title} onChange={e=>F('title',e.target.value)} placeholder="Spring 2024 Class Routine" className={iCls}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Type</label>
                  <select value={form.type} onChange={e=>F('type',e.target.value)} className={iCls}>
                    {Object.entries(TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                  </select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Degree</label>
                  <select value={form.targetDegree} onChange={e=>F('targetDegree',e.target.value)} className={iCls}>
                    <option value="all">All</option>
                    <option value="BSc">BSc</option>
                    <option value="MSc">MSc</option>
                    <option value="PhD">PhD</option>
                  </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Academic Year</label>
                  <input value={form.academicYear} onChange={e=>F('academicYear',e.target.value)} placeholder="2024-25" className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Term</label>
                  <select value={form.term} onChange={e=>F('term',e.target.value)} className={iCls}>
                    <option>Spring</option><option>Summer</option><option>Fall</option><option>Annual</option>
                  </select></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">File URL</label>
                <input type="url" value={form.fileUrl} onChange={e=>F('fileUrl',e.target.value)} placeholder="https://…" className={iCls}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Display File Name</label>
                <input value={form.fileName} onChange={e=>F('fileName',e.target.value)} placeholder="routine-spring-2024.pdf" className={iCls}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={e=>F('description',e.target.value)} className={`${iCls} resize-none`}/></div>
              <div className="flex gap-4">
                {[{k:'isPublished',l:'Published'},{k:'isPinned',l:'Pinned'}].map(f=>(
                  <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[f.k as keyof typeof form] as boolean}
                      onChange={e=>F(f.k as keyof typeof form,e.target.checked)} className="accent-green-600"/>
                    <span className="text-sm text-slate-700">{f.l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Upload'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : resources.length === 0 ? (
          <EmptyState title="No resources yet" description="Upload your first academic resource."
            action={<Button onClick={openNew}>Upload Resource</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Resource</th>
              <th className="text-center px-4 py-3">Type</th>
              <th className="text-center px-4 py-3">Year/Term</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {resources.map((r,i) => (
                <tr key={r.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i%2?'bg-slate-50/30':''}`}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <p className="text-xs text-slate-500">{r.targetDegree} · {r.files.length} file{r.files.length!==1?'s':''}</p>
                  </td>
                  <td className="px-4 py-4 text-center"><Badge variant="neutral">{TYPE_LABELS[r.type]??r.type}</Badge></td>
                  <td className="px-4 py-4 text-center text-slate-400 text-xs">{r.academicYear} · {r.term}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Badge variant={r.isPublished?'success':'neutral'}>{r.isPublished?'Live':'Draft'}</Badge>
                      {r.isPinned && <Badge variant="info">Pinned</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => remove(r)}>Delete</Button>
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
