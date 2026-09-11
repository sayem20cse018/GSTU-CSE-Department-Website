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
import { cn } from '@/lib/utils/cn';
import type { Course } from '@/lib/api/academics';

const TYPE_COLORS: Record<string, 'info'|'neutral'|'success'|'warning'> = {
  core:'info', elective:'neutral', lab:'success', sessional:'warning', theory:'info', practical:'success',
};
const TYPES = ['core','elective','lab','sessional','theory','practical'] as const;
const DEGREES = ['BSc','MSc','PhD'] as const;

const EMPTY: {
  code:string; title:string; credits:number; semester:number;
  degree:typeof DEGREES[number]; type:typeof TYPES[number];
  description:string; teacherName:string; syllabusUrl:string;
  theoryHours:number; labHours:number; isActive:boolean;
} = { code:'', title:'', credits:3, semester:1, degree:'BSc', type:'core', description:'', teacherName:'', syllabusUrl:'', theoryHours:3, labHours:0, isActive:true };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [degree,  setDegree]  = useState<typeof DEGREES[number]>('BSc');
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState<Course|null>(null);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [err,     setErr]     = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminGet<Course[]>(`/academics/courses?degree=${degree}&admin=true`);
      setCourses(Array.isArray(d) ? d : []);
    } catch { setCourses([]); }
    finally { setLoading(false); }
  }, [degree]);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm({ ...EMPTY, degree }); setErr(''); setOpen(true); }
  function openEdit(c: Course) {
    setEditing(c);
    setForm({ code:c.code, title:c.title, credits:c.credits, semester:c.semester,
      degree:c.degree as typeof DEGREES[number], type:c.type as typeof TYPES[number],
      description:c.description??'', teacherName:c.teacherName??'', syllabusUrl:c.syllabusUrl??'',
      theoryHours:c.theoryHours??0, labHours:c.labHours??0, isActive:c.isActive });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.code.trim() || !form.title.trim()) { setErr('Code and title are required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) { await adminPatch(`/academics/courses/${editing.id}`, form); toast.success('Course updated!'); }
      else          { await adminPost('/academics/courses', form);               toast.success('Course created!'); }
      setOpen(false); load();
    } catch(e) { const m=e instanceof Error?e.message:'Save failed'; setErr(m); toast.error(m); }
    finally { setSaving(false); }
  }

  async function remove(c: Course) {
    const ok = await confirm({ title:`Delete "${c.title}"?`, confirmLabel:'Delete' });
    if (!ok) return;
    try { await adminDelete(`/academics/courses/${c.id}`); toast.success('Deleted'); load(); }
    catch(e) { toast.error(e instanceof Error?e.message:'Delete failed'); }
  }

  const grouped: Record<number, Course[]> = {};
  for (const c of courses) { if (!grouped[c.semester]) grouped[c.semester]=[]; grouped[c.semester].push(c); }
  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Manage Courses" />
      {ConfirmDialog}
      <PageHeader title="Course Catalog" description="Add and manage courses for all programs."
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Course</Button>}/>

      {/* Degree tabs */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden w-fit mb-6">
        {DEGREES.map(d => (
          <button key={d} onClick={() => setDegree(d)}
            className={cn('px-5 py-2 text-sm font-semibold transition', degree===d?'bg-green-700 text-white':'text-slate-500 hover:bg-slate-50')}>
            {d}
          </button>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing?'Edit Course':'New Course'}</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{err}</div>}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Code *</label>
                  <input value={form.code} onChange={e=>F('code',e.target.value)} placeholder="CSE-301" className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Teacher</label>
                  <input value={form.teacherName} onChange={e=>F('teacherName',e.target.value)} placeholder="Dr. Name" className={iCls}/></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Title *</label>
                <input value={form.title} onChange={e=>F('title',e.target.value)} placeholder="Data Structures & Algorithms" className={iCls}/></div>
              <div className="grid grid-cols-4 gap-3">
                {[{l:'Credits',k:'credits'},{l:'Semester',k:'semester'},{l:'Theory Hrs',k:'theoryHours'},{l:'Lab Hrs',k:'labHours'}].map(f=>(
                  <div key={f.k}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.l}</label>
                    <input type="number" value={form[f.k as keyof typeof form] as number} onChange={e=>F(f.k as keyof typeof form,+e.target.value)} className={iCls}/></div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree</label>
                  <select value={form.degree} onChange={e=>F('degree',e.target.value)} className={iCls}>
                    {DEGREES.map(d=><option key={d} value={d}>{d}</option>)}
                  </select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Type</label>
                  <select value={form.type} onChange={e=>F('type',e.target.value)} className={iCls}>
                    {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select></div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e=>F('isActive',e.target.checked)} className="accent-green-600"/>
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={e=>F('description',e.target.value)} className={`${iCls} resize-none`}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Syllabus URL</label>
                <input type="url" value={form.syllabusUrl} onChange={e=>F('syllabusUrl',e.target.value)} placeholder="https://…" className={iCls}/></div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : courses.length === 0 ? (
          <EmptyState title={`No ${degree} courses yet`} description="Add the first course."
            action={<Button onClick={openNew}>Add Course</Button>}/>
        ) : Object.keys(grouped).map(Number).sort((a,b)=>a-b).map(sem => (
          <div key={sem}>
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester {sem}</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {grouped[sem].map(c => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-blue-600 font-bold w-24">{c.code}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-center text-slate-500 text-xs w-16">{c.credits}cr</td>
                    <td className="px-4 py-3 w-24"><Badge variant={TYPE_COLORS[c.type]??'neutral'}>{c.type}</Badge></td>
                    <td className="px-4 py-3 w-20"><Badge variant={c.isActive?'success':'neutral'}>{c.isActive?'Active':'Off'}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => remove(c)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
