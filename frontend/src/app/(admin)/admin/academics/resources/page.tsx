'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge from '@/components/admin/ui/Badge';
import PageHeader from '@/components/admin/ui/PageHeader';
import EmptyState from '@/components/admin/ui/EmptyState';
import type { AcademicResource } from '@/lib/api/academics';
import { formatDate } from '@/lib/utils/format';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api') + '/academics/resources';

const EMPTY_FORM = { title:'', type:'routine' as AcademicResource['type'], description:'', targetDegree:'all', academicYear:'2024-25', term:'Spring' as 'Spring'|'Summer'|'Fall'|'Annual', fileUrl:'', fileName:'', isPublished:false, isPinned:false };

const TYPE_LABELS: Record<string,string> = { routine:'Class Routine', calendar:'Academic Calendar', exam_schedule:'Exam Schedule', result:'Results', guideline:'Guidelines', other:'Other' };

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<AcademicResource | null>(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
    try {
      const r = await fetch(`${API}?isAdmin=true`, { headers:{ ...(token?{Authorization:`Bearer ${token}`}:{}) }, credentials:'include' });
      const d = await r.json() as { data: AcademicResource[] };
      setResources(d.data ?? []);
    } catch { setResources([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openEdit(r: AcademicResource) {
    setEditing(r);
    setForm({ title:r.title, type:r.type, description:r.description??'', targetDegree:r.targetDegree, academicYear:r.academicYear, term:r.term as typeof form.term, fileUrl:r.files[0]?.fileUrl??'', fileName:r.files[0]?.fileName??'', isPublished:r.isPublished, isPinned:r.isPinned });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      const payload = { ...form, files: form.fileUrl ? [{ fileName:form.fileName||form.fileUrl.split('/').pop()||'file', fileUrl:form.fileUrl }] : [] };
      const url = editing ? `${API}/${editing._id}` : API;
      const r   = await fetch(url, { method:editing?'PATCH':'POST', headers:{ 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) }, body:JSON.stringify(payload), credentials:'include' });
      if (r.ok) { setShowForm(false); load(); }
      else { const e = await r.json() as {message?:string}; alert(e.message??'Save failed'); }
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this resource?')) return;
    setDeleting(id);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      await fetch(`${API}/${id}`, { method:'DELETE', headers:{ ...(token?{Authorization:`Bearer ${token}`}:{}) }, credentials:'include' });
      load();
    } finally { setDeleting(null); }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Manage Resources" />
      <PageHeader title="Academic Resources" description="Manage routines, calendars, schedules and results."
        action={<Button onClick={()=>{setEditing(null);setForm(EMPTY_FORM);setShowForm(true)}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Upload Resource</Button>}/>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-200 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-5">{editing?'Edit Resource':'Upload Resource'}</h3>
            <div className="space-y-4">
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
                <input type="text" value={form.title} onChange={e=>F('title',e.target.value)} placeholder="Spring 2024 Class Routine"
                  className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"/></div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                  <select value={form.type} onChange={e=>F('type',e.target.value)}
                    className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {Object.entries(TYPE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                  </select></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Target Degree</label>
                  <select value={form.targetDegree} onChange={e=>F('targetDegree',e.target.value)}
                    className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Programs</option><option value="BSc">BSc</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
                  </select></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Academic Year</label>
                  <input type="text" value={form.academicYear} onChange={e=>F('academicYear',e.target.value)} placeholder="2024-25"
                    className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"/></div>
                <div><label className="block text-xs font-medium text-slate-400 mb-1">Term</label>
                  <select value={form.term} onChange={e=>F('term',e.target.value)}
                    className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Spring</option><option>Summer</option><option>Fall</option><option>Annual</option>
                  </select></div>
              </div>

              <div><label className="block text-xs font-medium text-slate-400 mb-1">File URL (PDF/DOC)</label>
                <input type="url" value={form.fileUrl} onChange={e=>F('fileUrl',e.target.value)} placeholder="https://drive.google.com/…"
                  className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"/></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">File Name (display)</label>
                <input type="text" value={form.fileName} onChange={e=>F('fileName',e.target.value)} placeholder="routine-spring-2024.pdf"
                  className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"/></div>
              <div><label className="block text-xs font-medium text-slate-400 mb-1">Description (optional)</label>
                <textarea rows={2} value={form.description} onChange={e=>F('description',e.target.value)}
                  className="w-full bg-white/5 border border-slate-200 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>

              <div className="flex gap-4">
                {[{key:'isPublished',label:'Published'},{key:'isPinned',label:'Pinned'}].map(f=>(
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[f.key as keyof typeof form] as boolean} onChange={e=>F(f.key as keyof typeof form,e.target.checked)} className="accent-blue-500"/>
                    <span className="text-sm text-slate-300">{f.label}</span>
                  </label>))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Upload'}</Button>
              <Button variant="secondary" onClick={()=>setShowForm(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>)}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : resources.length === 0 ? (
          <EmptyState title="No resources yet" description="Upload your first academic resource."/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Resource</th>
              <th className="text-center px-4 py-3">Type</th>
              <th className="text-center px-4 py-3">Year/Term</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {resources.map((r,i)=>(
                <tr key={r._id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i%2?'bg-white/[0.02]':''}`}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{r.title}</p>
                    <p className="text-xs text-slate-500">{r.targetDegree} · {r.files.length} file{r.files.length!==1?'s':''}</p>
                  </td>
                  <td className="px-4 py-4 text-center"><Badge variant="neutral">{TYPE_LABELS[r.type]??r.type}</Badge></td>
                  <td className="px-4 py-4 text-center text-slate-400 text-xs">{r.academicYear} · {r.term}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      <Badge variant={r.isPublished?'success':'neutral'}>{r.isPublished?'Live':'Draft'}</Badge>
                      {r.isPinned && <Badge variant="info">Pinned</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(r)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={deleting===r._id} onClick={()=>remove(r._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>)}
      </div>
    </div>
  );
}
