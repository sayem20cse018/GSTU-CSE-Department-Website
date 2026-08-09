'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import Badge       from '@/components/admin/ui/Badge';
import EmptyState  from '@/components/admin/ui/EmptyState';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import { cn }      from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';

const DESIG     = ['Professor','Associate Professor','Assistant Professor','Lecturer','Senior Lecturer','Adjunct Faculty','Administrative Officer','Section Officer','Assistant Officer','System Analyst'];
const EMP_STATUS = ['full_time','part_time','on_leave','retired'];
const STAFF_TYPES = [
  { key: 'faculty',   label: 'Faculty Members', icon: '👨‍🏫' },
  { key: 'chairman',  label: 'Chairman List',   icon: '🎓' },
  { key: 'staff',     label: 'Staff',           icon: '🏢' },
  { key: 'officer',   label: 'Officers',        icon: '📋' },
] as const;

type StaffType = typeof STAFF_TYPES[number]['key'];

const EMPTY = {
  name:'', title:'Dr.', designation:'Lecturer', email:'', phone:'', photo:'',
  shortBio:'', officeRoom:'', researchInterests:'', googleScholarUrl:'', linkedinUrl:'',
  orcidId:'', websiteUrl:'', isActive:true, sortOrder:0, staffType:'faculty' as StaffType,
  employmentStatus:'full_time',
  chairmanFrom:'', chairmanTo:'',  // Chairman List specific
};

interface FacultyMember {
  id:string; name:string; title?:string; designation:string; email:string;
  phone?:string; photo?:string; shortBio?:string; officeRoom?:string;
  researchInterests:string[]; googleScholarUrl?:string; linkedinUrl?:string;
  orcidId?:string; isActive:boolean; sortOrder:number;
  staffType:string; employmentStatus:string;
  chairmanFrom?:string; chairmanTo?:string;
}

export default function PeoplePage() {
  const [list, setList]       = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<StaffType>('faculty');
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState<FacultyMember|null>(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string|null>(null);
  const [err, setErr]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<FacultyMember[]>('/faculty')); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = list.filter(m => (m.staffType || 'faculty') === activeType);
  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, staffType: activeType });
    setErr(''); setOpen(true);
  }
  function openEdit(m: FacultyMember) {
    setEditing(m);
    setForm({
      name: m.name, title: m.title ?? 'Dr.', designation: m.designation,
      email: m.email, phone: m.phone ?? '', photo: m.photo ?? '',
      shortBio: m.shortBio ?? '', officeRoom: m.officeRoom ?? '',
      researchInterests: (m.researchInterests ?? []).join(', '),
      googleScholarUrl: m.googleScholarUrl ?? '', linkedinUrl: m.linkedinUrl ?? '',
      orcidId: m.orcidId ?? '', websiteUrl: '',
      isActive: m.isActive, sortOrder: m.sortOrder,
      staffType: (m.staffType || 'faculty') as StaffType,
      employmentStatus: m.employmentStatus || 'full_time',
      chairmanFrom: m.chairmanFrom ? m.chairmanFrom.slice(0,10) : '',
      chairmanTo:   m.chairmanTo   ? m.chairmanTo.slice(0,10)   : '',
    });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim()) { setErr('Name and email are required.'); return; }
    setSaving(true); setErr('');
    try {
      // Strip UI-only fields not in backend DTO
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { chairmanFrom, chairmanTo, ...rest } = form;
      const payload = { ...rest, researchInterests: form.researchInterests.split(',').map(s=>s.trim()).filter(Boolean) };
      if (editing) await adminPatch(`/faculty/${editing.id}`, payload);
      else await adminPost('/faculty', payload);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this record?')) return;
    setDelId(id);
    try { await adminDelete(`/faculty/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDelId(null); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500';
  const current = STAFF_TYPES.find(t => t.key === activeType)!;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="People" />
      <PageHeader title="People Management" description="Manage faculty, staff, officers and chairman list"/>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STAFF_TYPES.map(t => {
          const count = list.filter(m => (m.staffType || 'faculty') === t.key).length;
          return (
            <button key={t.key} onClick={() => setActiveType(t.key)}
              className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                activeType === t.key
                  ? 'bg-green-700 text-white border-green-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700'
              )}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold',
                activeType === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-4">
        <Button onClick={openNew} icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>}>
          Add {current.label.replace(/s$/, '')}
        </Button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editing ? 'Edit' : 'Add'} {current.icon} {current.label.replace(/s$/, '')}
            </h3>
            <p className="text-xs text-slate-500 mb-5">Fields marked * are required</p>
            {err && <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

            <div className="space-y-4">
              {/* Photo */}
              <ImageUpload label="Photo" value={form.photo} onChange={v => F('photo', v)} previewRounded dark />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Common fields */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={e=>F('name',e.target.value)} placeholder="Dr. Mohammad Rahman" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e=>F('email',e.target.value)} placeholder="name@gstu.edu.bd" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e=>F('phone',e.target.value)} placeholder="+880-XXX" className={iCls}/>
                </div>

                {/* Title — only for faculty/chairman */}
                {(activeType === 'faculty') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
                    <select value={form.title} onChange={e=>F('title',e.target.value)} className={iCls}>
                      {['Dr.','Prof.','Mr.','Ms.','Engr.'].map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Designation</label>
                  <select value={form.designation} onChange={e=>F('designation',e.target.value)} className={iCls}>
                    {DESIG.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employment Status</label>
                  <select value={form.employmentStatus} onChange={e=>F('employmentStatus',e.target.value)} className={iCls}>
                    {EMP_STATUS.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                  </select>
                </div>

                {/* Staff type picker (hidden but set from activeType) */}
                <input type="hidden" value={form.staffType}/>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Office Room</label>
                  <input value={form.officeRoom} onChange={e=>F('officeRoom',e.target.value)} placeholder="Room 302, CSE Building" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e=>F('sortOrder',+e.target.value)} className={iCls}/>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Short Bio</label>
                <textarea rows={2} value={form.shortBio} onChange={e=>F('shortBio',e.target.value)}
                  className={`${iCls} resize-none`}/>
              </div>

              {/* Research interests — faculty/chairman only */}
              {(activeType === 'faculty') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Research Interests (comma-separated)</label>
                  <input value={form.researchInterests} onChange={e=>F('researchInterests',e.target.value)}
                    placeholder="Machine Learning, Computer Vision, NLP" className={iCls}/>
                </div>
              )}

              {/* Online links — faculty/chairman only */}
              {(activeType === 'faculty') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Google Scholar URL</label>
                    <input type="url" value={form.googleScholarUrl} onChange={e=>F('googleScholarUrl',e.target.value)} placeholder="https://scholar.google.com/…" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">LinkedIn URL</label>
                    <input type="url" value={form.linkedinUrl} onChange={e=>F('linkedinUrl',e.target.value)} placeholder="https://linkedin.com/in/…" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">ORCID ID</label>
                    <input value={form.orcidId} onChange={e=>F('orcidId',e.target.value)} placeholder="0000-0000-0000-0000" className={iCls}/></div>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>F('isActive',e.target.checked)} className="accent-green-500"/>
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>

              {/* Chairman-specific: service period */}
              {activeType === 'chairman' && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chairman Service Period</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">From Date</label>
                      <input type="date" value={form.chairmanFrom} onChange={e=>F('chairmanFrom',e.target.value)} className={iCls}/>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">To Date <span className="text-slate-400 font-normal">(leave blank if current)</span></label>
                      <input type="date" value={form.chairmanTo} onChange={e=>F('chairmanTo',e.target.value)} className={iCls}/>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">Leave "To Date" empty if this person is the current chairman.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing?'Update':'Add'}</Button>
              <Button variant="secondary" onClick={()=>setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState title={`No ${current.label} yet`} description={`Add the first ${current.label.replace(/s$/, '').toLowerCase()}.`}
            action={<Button onClick={openNew}>Add {current.label.replace(/s$/, '')}</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="text-left px-5 py-3">Person</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Designation</th>
                {activeType === 'chairman' && (
                  <th className="text-center px-4 py-3 hidden md:table-cell">Service Period</th>
                )}
                <th className="text-center px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50', i%2?'bg-white':'bg-slate-50/30')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt={m.name} className="w-9 h-9 rounded-full object-cover shrink-0"/>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0 text-xs font-bold text-green-700">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{m.title} {m.name}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600 text-xs">{m.designation}</td>
                  {activeType === 'chairman' && (
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="text-xs text-slate-600">
                        {m.chairmanFrom ? new Date(m.chairmanFrom).toLocaleDateString('en-GB') : '—'}
                        {' → '}
                        {m.chairmanTo ? new Date(m.chairmanTo).toLocaleDateString('en-GB') : <span className="text-green-600 font-semibold">Present</span>}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <Badge variant={m.isActive ? 'success' : 'neutral'}>
                      {m.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(m)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId===m.id} onClick={()=>del(m.id)}>Del</Button>
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
