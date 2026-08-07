'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge from '@/components/admin/ui/Badge';
import PageHeader from '@/components/admin/ui/PageHeader';
import EmptyState from '@/components/admin/ui/EmptyState';
import { cn } from '@/lib/utils/cn';
import type { Course } from '@/lib/api/academics';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api') + '/academics/courses';
const TYPE_COLORS: Record<string, string> = { core:'info', elective:'neutral', lab:'success', sessional:'warning' };

const EMPTY_FORM = { code:'', title:'', credits:3, semester:1, degree:'BSc' as 'BSc'|'MSc'|'PhD', type:'core' as 'core'|'elective'|'lab'|'sessional', description:'', teacherName:'', syllabusUrl:'', theoryHours:3, labHours:0, isActive:true };

export default function AdminCoursesPage() {
  const [courses, setCourses]   = useState<Course[]>([]);
  const [degree, setDegree]     = useState<'BSc'|'MSc'|'PhD'>('BSc');
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Course | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm]         = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}?degree=${degree}`, { credentials:'include' });
      const d = await r.json() as { data: Course[] };
      setCourses(d.data ?? []);
    } finally { setLoading(false); }
  }, [degree]);

  useEffect(() => { load(); }, [load]);

  const F = (key: keyof typeof form, val: unknown) => setForm(p => ({ ...p, [key]: val }));

  function openEdit(c: Course) {
    setEditing(c);
    setForm({ code:c.code, title:c.title, credits:c.credits, semester:c.semester, degree:c.degree, type:c.type, description:c.description??'', teacherName:c.teacherName??'', syllabusUrl:c.syllabusUrl??'', theoryHours:c.theoryHours, labHours:c.labHours, isActive:c.isActive });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      const url   = editing ? `${API}/${editing._id}` : API;
      const r = await fetch(url, { method:editing?'PATCH':'POST', headers:{ 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) }, body:JSON.stringify(form), credentials:'include' });
      if (r.ok) { setShowForm(false); load(); }
      else { const e = await r.json() as {message?:string}; alert(e.message??'Save failed'); }
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this course?')) return;
    setDeleting(id);
    try {
      const token = document.cookie.match(/cse_access=([^;]+)/)?.[1];
      await fetch(`${API}/${id}`, { method:'DELETE', headers:{ ...(token?{Authorization:`Bearer ${token}`}:{}) }, credentials:'include' });
      load();
    } finally { setDeleting(null); }
  }

  const grouped: Record<number, Course[]> = {};
  for (const c of courses) { if (!grouped[c.semester]) grouped[c.semester] = []; grouped[c.semester].push(c); }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Manage Courses" />
      <PageHeader title="Course Catalog" description="Add and manage courses for all programs."
        action={<Button onClick={()=>{setEditing(null);setForm({...EMPTY_FORM,degree});setShowForm(true)}} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Course</Button>}/>

      {/* Degree tabs */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden w-fit mb-6">
        {(['BSc','MSc','PhD'] as const).map(d=>(
          <button key={d} onClick={()=>setDegree(d)}
            className={cn('px-5 py-2 text-sm font-semibold transition', degree===d?'bg-blue-600 text-white':'text-slate-400 hover:bg-white/5')}>
            {d}
          </button>))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">{editing?'Edit Course':'New Course'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{label:'Course Code',key:'code',placeholder:'CSE-301'},{label:'Teacher Name',key:'teacherName',placeholder:'Dr. John Doe'}].map(f=>(
                  <div key={f.key}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                    <input type="text" value={form[f.key as keyof typeof form] as string} onChange={e=>F(f.key as keyof typeof form,e.target.value)} placeholder={f.placeholder}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>))}
              </div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Course Title</label>
                <input type="text" value={form.title} onChange={e=>F('title',e.target.value)} placeholder="Data Structures & Algorithms"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>

              <div className="grid grid-cols-4 gap-3">
                {[{label:'Credits',key:'credits',type:'number'},{label:'Semester',key:'semester',type:'number'},{label:'Theory Hrs',key:'theoryHours',type:'number'},{label:'Lab Hrs',key:'labHours',type:'number'}].map(f=>(
                  <div key={f.key}><label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                    <input type="number" value={form[f.key as keyof typeof form] as number} onChange={e=>F(f.key as keyof typeof form,+e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"/></div>))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree</label>
                  <select value={form.degree} onChange={e=>F('degree',e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="BSc">BSc</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
                  </select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Type</label>
                  <select value={form.type} onChange={e=>F('type',e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="core">Core</option><option value="elective">Elective</option><option value="lab">Lab</option><option value="sessional">Sessional</option>
                  </select></div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e=>F('isActive',e.target.checked)} className="accent-green-600"/>
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label></div>
              </div>

              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={e=>F('description',e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Syllabus PDF URL</label>
                <input type="url" value={form.syllabusUrl} onChange={e=>F('syllabusUrl',e.target.value)} placeholder="https://…"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-slate-400"/></div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Create'}</Button>
              <Button variant="secondary" onClick={()=>setShowForm(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>)}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : courses.length === 0 ? (
          <EmptyState title={`No ${degree} courses yet`} description="Add the first course."/>
        ) : Object.keys(grouped).map(Number).sort((a,b)=>a-b).map(sem => (
          <div key={sem}>
            <div className="px-5 py-2.5 bg-white/5 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semester {sem}</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {grouped[sem].map((c,i)=>(
                  <tr key={c._id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${i%2?'bg-white':''}`}>
                    <td className="px-5 py-3 font-mono text-xs text-blue-400 font-bold w-24">{c.code}</td>
                    <td className="px-4 py-3 text-white">{c.title}</td>
                    <td className="px-4 py-3 text-center text-slate-400 w-16">{c.credits}cr</td>
                    <td className="px-4 py-3 w-24"><Badge variant={TYPE_COLORS[c.type] as 'info'|'neutral'|'success'|'warning'??'neutral'}>{c.type}</Badge></td>
                    <td className="px-4 py-3 w-20"><Badge variant={c.isActive?'success':'neutral'}>{c.isActive?'Active':'Off'}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={()=>openEdit(c)}>Edit</Button>
                        <Button size="sm" variant="danger" loading={deleting===c._id} onClick={()=>remove(c._id)}>Del</Button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>))}
      </div>
    </div>
  );
}
