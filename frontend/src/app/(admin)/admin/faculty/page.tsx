'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
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

const DESIG     = ['Professor','Associate Professor','Assistant Professor','Lecturer','Senior Lecturer','Adjunct Faculty','Administrative Officer','Section Officer','Assistant Officer','System Analyst'];
const EMP_STATUS = ['full_time','part_time','on_leave','retired'];
const PUB_TYPES  = ['journal','conference','book','book_chapter','thesis','other'];
const DAYS       = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];

const STAFF_TYPES = [
  { key: 'faculty',   label: 'Faculty Members' },
  { key: 'dean',      label: 'Dean'            },
  { key: 'chairman',  label: 'Chairman / Head' },
  { key: 'staff',     label: 'Staff'           },
  { key: 'officer',   label: 'Officers'        },
] as const;

type StaffType = typeof STAFF_TYPES[number]['key'];

const FACULTY_FILTERS = [
  { key: 'all' as const,     label: 'All Faculty' },
  { key: 'active' as const,  label: 'Active' },
  { key: 'on_leave' as const,label: 'On Leave' },
];
type FacultyFilter = typeof FACULTY_FILTERS[number]['key'];

//  Nested-row shapes 
interface EduRow   { degree: string; institution: string; year: number | string }
interface PubRow   { title: string; authors: string; venue: string; year: number | string; type: string; doi: string; url: string }
interface AwardRow { title: string; awardedBy: string; year: number | string; description: string }
interface OHRow    { day: string; startTime: string; endTime: string }

const EMPTY_EDU   = (): EduRow   => ({ degree: '', institution: '', year: new Date().getFullYear() });
const EMPTY_PUB   = (): PubRow   => ({ title: '', authors: '', venue: '', year: new Date().getFullYear(), type: 'journal', doi: '', url: '' });
const EMPTY_AWARD = (): AwardRow => ({ title: '', awardedBy: '', year: new Date().getFullYear(), description: '' });
const EMPTY_OH    = (): OHRow    => ({ day: 'Saturday', startTime: '10:00', endTime: '12:00' });

const EMPTY = {
  name:'', title:'Dr.', designation:'Lecturer', email:'', phone:'', photo:'',
  shortBio:'', fullBio:'', officeRoom:'', researchInterests:'',
  googleScholarUrl:'', linkedinUrl:'', researchGateUrl:'',
  orcidId:'', websiteUrl:'', isActive:true, sortOrder:0, staffType:'faculty' as StaffType,
  employmentStatus:'full_time', joinedAt:'',
  chairmanFrom:'', chairmanTo:'',
  leadershipRole:'' as string, isCurrentChairman:false,
};

interface FacultyMember {
  id:string; name:string; title?:string; designation:string; email:string;
  phone?:string; photo?:string; shortBio?:string; fullBio?:string; officeRoom?:string;
  researchInterests:string[]; googleScholarUrl?:string; linkedinUrl?:string;
  researchGateUrl?:string; orcidId?:string; websiteUrl?:string;
  isActive:boolean; sortOrder:number;
  staffType:string; employmentStatus:string;
  joinedAt?:string; chairmanFrom?:string; chairmanTo?:string;
  leadershipRole?:string; isCurrentChairman?:boolean;
  education?: EduRow[];
  publications?: PubRow[];
  awards?: AwardRow[];
  officeHours?: OHRow[];
}

//  Modal section tabs 
const MODAL_TABS = [
  { key: 'basic',       label: 'Basic Info' },
  { key: 'education',   label: 'Education' },
  { key: 'publications',label: 'Publications' },
  { key: 'awards',      label: 'Awards' },
  { key: 'hours',       label: 'Office Hours' },
] as const;
type ModalTab = typeof MODAL_TABS[number]['key'];

export default function PeoplePage() {
  const [list, setList]       = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<StaffType>('faculty');
  const [facultyFilter, setFacultyFilter] = useState<FacultyFilter>('all');
  const [form, setForm]       = useState(EMPTY);
  const [modalTab, setModalTab] = useState<ModalTab>('basic');
  const [eduRows,   setEduRows]   = useState<EduRow[]>([]);
  const [pubRows,   setPubRows]   = useState<PubRow[]>([]);
  const [awardRows, setAwardRows] = useState<AwardRow[]>([]);
  const [ohRows,    setOhRows]    = useState<OHRow[]>([]);
  const [editing, setEditing] = useState<FacultyMember|null>(null);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string|null>(null);
  const [err, setErr]         = useState('');
  const [query, setQuery]     = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<FacultyMember[]>('/faculty?admin=true')); }
    catch { toast.error('Failed to load people'); setList([]); } finally { setLoading(false); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [load]);

  const byType = useMemo(() => list.filter(m => (m.staffType || 'faculty') === activeType), [list, activeType]);
  const filteredByStatus = useMemo(() => {
    if (activeType !== 'faculty' || facultyFilter === 'all') return byType;
    if (facultyFilter === 'active') return byType.filter(m => m.employmentStatus !== 'on_leave');
    if (facultyFilter === 'on_leave') return byType.filter(m => m.employmentStatus === 'on_leave');
    return byType;
  }, [byType, activeType, facultyFilter]);
  const filtered = useMemo(() => query
    ? filteredByStatus.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.designation.toLowerCase().includes(query.toLowerCase()))
    : filteredByStatus, [filteredByStatus, query]);

  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY, staffType: activeType });
    setEduRows([]); setPubRows([]); setAwardRows([]); setOhRows([]);
    setModalTab('basic'); setErr(''); setOpen(true);
  }
  function openEdit(m: FacultyMember) {
    setEditing(m);
    setForm({
      name: m.name, title: m.title ?? 'Dr.', designation: m.designation,
      email: m.email, phone: m.phone ?? '', photo: m.photo ?? '',
      shortBio: m.shortBio ?? '', fullBio: m.fullBio ?? '', officeRoom: m.officeRoom ?? '',
      researchInterests: (m.researchInterests ?? []).join(', '),
      googleScholarUrl: m.googleScholarUrl ?? '', linkedinUrl: m.linkedinUrl ?? '',
      researchGateUrl: m.researchGateUrl ?? '', orcidId: m.orcidId ?? '',
      websiteUrl: m.websiteUrl ?? '', isActive: m.isActive, sortOrder: m.sortOrder,
      staffType: (m.staffType || 'faculty') as StaffType,
      employmentStatus: m.employmentStatus || 'full_time',
      joinedAt: m.joinedAt ? m.joinedAt.slice(0,10) : '',
      chairmanFrom: m.chairmanFrom ? m.chairmanFrom.slice(0,10) : '',
      chairmanTo: m.chairmanTo ? m.chairmanTo.slice(0,10) : '',
      leadershipRole: m.leadershipRole ?? '',
      isCurrentChairman: m.isCurrentChairman ?? false,
    });
    setEduRows((m.education ?? []).map(e => ({ ...e, year: e.year ?? new Date().getFullYear() })));
    setPubRows((m.publications ?? []).map(p => ({
      title: p.title ?? '', authors: p.authors ?? '', venue: p.venue ?? '',
      year: p.year ?? new Date().getFullYear(), type: p.type ?? 'journal',
      doi: p.doi ?? '', url: p.url ?? '',
    })));
    setAwardRows((m.awards ?? []).map(a => ({
      title: a.title ?? '', awardedBy: a.awardedBy ?? '',
      year: a.year ?? new Date().getFullYear(), description: a.description ?? '',
    })));
    setOhRows((m.officeHours ?? []).map(h => ({
      day: h.day ?? 'Saturday', startTime: h.startTime ?? '10:00', endTime: h.endTime ?? '12:00',
    })));
    setModalTab('basic'); setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { setErr('Name is required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(form)) {
        if (k === 'name') { payload.name = String(v).trim(); continue; }
        if (k === 'email') { payload.email = String(v).trim(); continue; }
        if (['leadershipRole','isCurrentChairman','chairmanFrom','chairmanTo'].includes(k)) continue;
        if (v === '' || v === null) continue;
        if (k === 'researchInterests') {
          payload[k] = String(v).split(',').map(s => s.trim()).filter(Boolean);
        } else { payload[k] = v; }
      }
      if (!payload.name) payload.name = form.name.trim();
      if (!payload.email) payload.email = form.email.trim();
      if (payload.isActive === undefined) payload.isActive = true;
      if (payload.sortOrder === undefined) payload.sortOrder = 0;

      // Nested relations  always send so backend replaces them
      payload.education    = eduRows.filter(e => e.degree.trim()).map(e => ({ degree: e.degree.trim(), institution: e.institution.trim(), year: Number(e.year) }));
      payload.publications = pubRows.filter(p => p.title.trim()).map(p => ({ title: p.title.trim(), authors: p.authors.trim(), venue: p.venue.trim(), year: Number(p.year), type: p.type, ...(p.doi.trim() ? { doi: p.doi.trim() } : {}), ...(p.url.trim() ? { url: p.url.trim() } : {}) }));
      payload.awards       = awardRows.filter(a => a.title.trim()).map(a => ({ title: a.title.trim(), awardedBy: a.awardedBy.trim(), year: Number(a.year), ...(a.description.trim() ? { description: a.description.trim() } : {}) }));
      payload.officeHours  = ohRows.filter(h => h.day).map(h => ({ day: h.day, startTime: h.startTime, endTime: h.endTime }));
      // Leadership fields
      if (form.leadershipRole) payload.leadershipRole = form.leadershipRole; else payload.leadershipRole = null;
      payload.isCurrentChairman = form.isCurrentChairman;
      if (form.chairmanFrom) payload.chairmanFrom = form.chairmanFrom;
      if (form.chairmanTo)   payload.chairmanTo   = form.chairmanTo;

      if (editing) { await adminPatch(`/faculty/${editing.id}`, payload); toast.success('Record updated!'); }
      else          { await adminPost('/faculty', payload);                toast.success('Record created!'); }
      setOpen(false); load();
    } catch (e) { const msg = e instanceof Error ? e.message : 'Save failed'; setErr(msg); toast.error(msg); }
    finally { setSaving(false); }
  }

  async function del(member: FacultyMember) {
    const ok = await confirm({ title: `Delete "${member.name}"?`, description: 'This record will be permanently removed.', confirmLabel: 'Delete' });
    if (!ok) return;
    setDelId(member.id);
    try { await adminDelete(`/faculty/${member.id}`); toast.success('Record deleted'); load(); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDelId(null); }
  }

  async function cleanupAnonymous() {
    const ok = await confirm({ title: 'Delete anonymous records?', description: 'This will permanently delete all faculty records with empty names or auto-generated fake emails.', confirmLabel: 'Delete All' });
    if (!ok) return;
    try {
      await adminDelete<{ deleted?: number; message?: string }>('/faculty/cleanup');
      toast.success('Anonymous records cleaned up'); load();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Cleanup failed'); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition';
  const current = STAFF_TYPES.find(t => t.key === activeType)!;
  const isFaculty = activeType === 'faculty' || activeType === 'chairman' || activeType === 'dean';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {ConfirmDialog}
      <AdminPageTitle title="People" />
      <PageHeader title="People Management" description="Manage faculty, staff, officers and chairman list"/>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {STAFF_TYPES.map(t => {
          const count = list.filter(m => (m.staffType || 'faculty') === t.key).length;
          return (
            <button key={t.key} onClick={() => { setActiveType(t.key); setFacultyFilter('all'); }}
              className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border',
                activeType === t.key
                  ? 'bg-green-700 text-white border-green-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700')}>
              <span>{t.label}</span>
              <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold',
                activeType === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Faculty sub-filters */}
      {activeType === 'faculty' && (
        <div className="flex flex-wrap items-center gap-2 mb-4 pl-1">
          {FACULTY_FILTERS.map(f => {
            const count = f.key === 'all'
              ? list.filter(m => (m.staffType || 'faculty') === 'faculty').length
              : f.key === 'active'
              ? list.filter(m => (m.staffType || 'faculty') === 'faculty' && m.employmentStatus !== 'on_leave').length
              : list.filter(m => (m.staffType || 'faculty') === 'faculty' && m.employmentStatus === 'on_leave').length;
            return (
              <button key={f.key} onClick={() => setFacultyFilter(f.key)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border',
                  facultyFilter === f.key
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400')}>
                {f.label}
                <span className={cn('text-[10px] px-1 py-0.5 rounded-full font-bold',
                  facultyFilter === f.key ? 'bg-white/20' : 'bg-slate-100')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Add + Cleanup */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <SearchInput value={query} onChange={v => setQuery(v)} placeholder={`Search ${current.label.toLowerCase()}`} className="sm:max-w-xs"/>
        <div className="flex gap-2">
          <button onClick={cleanupAnonymous}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/></svg>
            Clean Anonymous
          </button>
          <Button onClick={openNew} icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>}>
            Add {current.label.replace(/s$/, '')}
          </Button>
        </div>
      </div>

      {/*  Modal  */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl my-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editing ? 'Edit' : 'Add'} {current.label.replace(/s$/, '')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Fields marked * are required</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Sub-tabs  only show extras for faculty/chairman/dean */}
            {isFaculty && (
              <div className="flex gap-1 px-6 pt-4 pb-0 overflow-x-auto">
                {MODAL_TABS.map(t => (
                  <button key={t.key} onClick={() => setModalTab(t.key)}
                    className={cn('px-4 py-2 rounded-t-lg text-xs font-bold whitespace-nowrap transition border-b-2',
                      modalTab === t.key
                        ? 'border-green-600 text-green-700 bg-green-50/60'
                        : 'border-transparent text-slate-500 hover:text-slate-700')}>
                    {t.label}
                    {t.key === 'education'    && eduRows.length    > 0 && <span className="ml-1.5 bg-green-100 text-green-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">{eduRows.length}</span>}
                    {t.key === 'publications' && pubRows.length    > 0 && <span className="ml-1.5 bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">{pubRows.length}</span>}
                    {t.key === 'awards'       && awardRows.length  > 0 && <span className="ml-1.5 bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">{awardRows.length}</span>}
                    {t.key === 'hours'        && ohRows.length     > 0 && <span className="ml-1.5 bg-slate-100 text-slate-600 text-[9px] font-black px-1.5 py-0.5 rounded-full">{ohRows.length}</span>}
                  </button>
                ))}
              </div>
            )}

            {err && <p className="mx-6 mt-3 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2 text-sm">{err}</p>}

            {/*  Tab: Basic Info  */}
            <div className={cn('px-6 py-5 space-y-4', (isFaculty && modalTab !== 'basic') ? 'hidden' : '')}>
              <ImageUpload label="Photo" value={form.photo} onChange={v => F('photo', v)} previewRounded dark />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={e=>F('name',e.target.value)} placeholder="Dr. Mohammad Rahman" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e=>F('email',e.target.value)} placeholder="name@gstu.edu.bd" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e=>F('phone',e.target.value)} placeholder="+880-XXX" className={iCls}/>
                </div>
                {isFaculty && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
                    <select value={form.title} onChange={e=>F('title',e.target.value)} className={iCls}>
                      {['Dr.','Prof.','Mr.','Ms.','Engr.'].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Designation</label>
                  <select value={form.designation} onChange={e=>F('designation',e.target.value)} className={iCls}>
                    {DESIG.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employment Status</label>
                  <select value={form.employmentStatus} onChange={e=>F('employmentStatus',e.target.value)} className={iCls}>
                    {EMP_STATUS.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Office Room</label>
                  <input value={form.officeRoom} onChange={e=>F('officeRoom',e.target.value)} placeholder="Room 302, CSE Building" className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e=>F('sortOrder',+e.target.value)} className={iCls}/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Short Bio</label>
                <textarea rows={2} value={form.shortBio} onChange={e=>F('shortBio',e.target.value)} className={`${iCls} resize-none`}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Biography</label>
                <textarea rows={4} value={form.fullBio} onChange={e=>F('fullBio',e.target.value)} placeholder="Detailed biography" className={`${iCls} resize-none`}/>
              </div>

              {isFaculty && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Research Interests <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                    <input value={form.researchInterests} onChange={e=>F('researchInterests',e.target.value)}
                      placeholder="Machine Learning, Computer Vision, NLP" className={iCls}/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Google Scholar URL</label>
                      <input type="url" value={form.googleScholarUrl} onChange={e=>F('googleScholarUrl',e.target.value)} placeholder="https://scholar.google.com/" className={iCls}/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">LinkedIn URL</label>
                      <input type="url" value={form.linkedinUrl} onChange={e=>F('linkedinUrl',e.target.value)} placeholder="https://linkedin.com/in/" className={iCls}/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">ResearchGate URL</label>
                      <input type="url" value={form.researchGateUrl} onChange={e=>F('researchGateUrl',e.target.value)} placeholder="https://researchgate.net/" className={iCls}/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">ORCID ID</label>
                      <input value={form.orcidId} onChange={e=>F('orcidId',e.target.value)} placeholder="0000-0000-0000-0000" className={iCls}/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Personal Website</label>
                      <input type="url" value={form.websiteUrl} onChange={e=>F('websiteUrl',e.target.value)} placeholder="https://" className={iCls}/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Joining Date</label>
                      <input type="date" value={form.joinedAt} onChange={e=>F('joinedAt',e.target.value)} className={iCls}/></div>
                  </div>
                </>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e=>F('isActive',e.target.checked)} className="accent-green-500"/>
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>

              {activeType === 'chairman' && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leadership Role & Service Period</p>

                  {/* Leadership role selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Leadership Role</label>
                    <select value={form.leadershipRole} onChange={e=>F('leadershipRole',e.target.value)} className={iCls}>
                      <option value="">— Select Role —</option>
                      <option value="running_chairman">Running Chairman</option>
                      <option value="former_chairman">Former Chairman</option>
                      <option value="former_head">Former Head of the Department</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      &quot;Former Head&quot; appears on the Honorable Heads page. These are independent roles — do not confuse them.
                    </p>
                  </div>

                  {/* Running chairman toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isCurrentChairman}
                      onChange={e=>{F('isCurrentChairman',e.target.checked); if(e.target.checked) F('leadershipRole','running_chairman');}}
                      className="accent-green-500"/>
                    <span className="text-sm font-medium text-slate-700">Currently Serving Chairman</span>
                  </label>

                  {/* Service period */}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Service Start Date</label>
                      <input type="date" value={form.chairmanFrom} onChange={e=>F('chairmanFrom',e.target.value)} className={iCls}/></div>
                    <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Service End Date <span className="text-slate-400 font-normal">(blank = Present)</span></label>
                      <input type="date" value={form.chairmanTo} onChange={e=>F('chairmanTo',e.target.value)} className={iCls}/></div>
                  </div>
                </div>
              )}
            </div>

            {/*  Tab: Education  */}
            {isFaculty && modalTab === 'education' && (
              <div className="px-6 py-5 space-y-3">
                <p className="text-xs text-slate-500">Add degrees in reverse chronological order (newest first).</p>
                {eduRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="col-span-5">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Degree *</label>
                      <input value={row.degree} onChange={e=>setEduRows(r=>r.map((x,j)=>j===i?{...x,degree:e.target.value}:x))}
                        placeholder="PhD in Computer Science" className={iCls}/>
                    </div>
                    <div className="col-span-5">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Institution *</label>
                      <input value={row.institution} onChange={e=>setEduRows(r=>r.map((x,j)=>j===i?{...x,institution:e.target.value}:x))}
                        placeholder="University of Melbourne" className={iCls}/>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Year</label>
                      <input type="number" min={1950} max={2099} value={row.year}
                        onChange={e=>setEduRows(r=>r.map((x,j)=>j===i?{...x,year:e.target.value}:x))} className={iCls}/>
                    </div>
                    <div className="col-span-1 pt-6">
                      <button onClick={()=>setEduRows(r=>r.filter((_,j)=>j!==i))}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition" title="Remove">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setEduRows(r=>[...r, EMPTY_EDU()])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-green-400 text-green-700 text-xs font-bold hover:bg-green-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Education Entry
                </button>
              </div>
            )}

            {/*  Tab: Publications  */}
            {isFaculty && modalTab === 'publications' && (
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs text-slate-500">Add research publications. Title is required; others are optional.</p>
                {pubRows.map((row, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Publication {i + 1}</span>
                      <button onClick={()=>setPubRows(r=>r.filter((_,j)=>j!==i))}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Title *</label>
                      <input value={row.title} onChange={e=>setPubRows(r=>r.map((x,j)=>j===i?{...x,title:e.target.value}:x))}
                        placeholder="Deep Learning for Medical Image Segmentation" className={iCls}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Authors</label>
                      <input value={row.authors} onChange={e=>setPubRows(r=>r.map((x,j)=>j===i?{...x,authors:e.target.value}:x))}
                        placeholder="Rahman, M., Islam, S., et al." className={iCls}/>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Venue / Journal</label>
                        <input value={row.venue} onChange={e=>setPubRows(r=>r.map((x,j)=>j===i?{...x,venue:e.target.value}:x))}
                          placeholder="IEEE Transactions on" className={iCls}/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Year</label>
                        <input type="number" min={1950} max={2099} value={row.year}
                          onChange={e=>setPubRows(r=>r.map((x,j)=>j===i?{...x,year:e.target.value}:x))} className={iCls}/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Type</label>
                        <select value={row.type} onChange={e=>setPubRows(r=>r.map((x,j)=>j===i?{...x,type:e.target.value}:x))} className={iCls}>
                          {PUB_TYPES.map(t=><option key={t} value={t}>{t.replace('_',' ')}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">DOI</label>
                        <input value={row.doi} onChange={e=>setPubRows(r=>r.map((x,j)=>j===i?{...x,doi:e.target.value}:x))}
                          placeholder="10.1109/" className={iCls}/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">URL</label>
                        <input type="url" value={row.url} onChange={e=>setPubRows(r=>r.map((x,j)=>j===i?{...x,url:e.target.value}:x))}
                          placeholder="https://" className={iCls}/>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setPubRows(r=>[...r, EMPTY_PUB()])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-blue-400 text-blue-700 text-xs font-bold hover:bg-blue-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Publication
                </button>
              </div>
            )}

            {/*  Tab: Awards  */}
            {isFaculty && modalTab === 'awards' && (
              <div className="px-6 py-5 space-y-3">
                <p className="text-xs text-slate-500">Add honors, awards and recognitions.</p>
                {awardRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Award Title *</label>
                      <input value={row.title} onChange={e=>setAwardRows(r=>r.map((x,j)=>j===i?{...x,title:e.target.value}:x))}
                        placeholder="Best Paper Award" className={iCls}/>
                    </div>
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Awarded By</label>
                      <input value={row.awardedBy} onChange={e=>setAwardRows(r=>r.map((x,j)=>j===i?{...x,awardedBy:e.target.value}:x))}
                        placeholder="IEEE, NeurIPS" className={iCls}/>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Year</label>
                      <input type="number" min={1950} max={2099} value={row.year}
                        onChange={e=>setAwardRows(r=>r.map((x,j)=>j===i?{...x,year:e.target.value}:x))} className={iCls}/>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Description</label>
                      <input value={row.description} onChange={e=>setAwardRows(r=>r.map((x,j)=>j===i?{...x,description:e.target.value}:x))}
                        placeholder="Optional note" className={iCls}/>
                    </div>
                    <div className="col-span-1 pt-6">
                      <button onClick={()=>setAwardRows(r=>r.filter((_,j)=>j!==i))}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setAwardRows(r=>[...r, EMPTY_AWARD()])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-amber-400 text-amber-700 text-xs font-bold hover:bg-amber-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Award
                </button>
              </div>
            )}

            {/*  Tab: Office Hours  */}
            {isFaculty && modalTab === 'hours' && (
              <div className="px-6 py-5 space-y-3">
                <p className="text-xs text-slate-500">Set weekly office hours that students can see on the profile page.</p>
                {ohRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Day</label>
                      <select value={row.day} onChange={e=>setOhRows(r=>r.map((x,j)=>j===i?{...x,day:e.target.value}:x))} className={iCls}>
                        {DAYS.map(d=><option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Start</label>
                      <input type="time" value={row.startTime} onChange={e=>setOhRows(r=>r.map((x,j)=>j===i?{...x,startTime:e.target.value}:x))} className={iCls}/>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">End</label>
                      <input type="time" value={row.endTime} onChange={e=>setOhRows(r=>r.map((x,j)=>j===i?{...x,endTime:e.target.value}:x))} className={iCls}/>
                    </div>
                    <div className="col-span-2 flex justify-end pt-5">
                      <button onClick={()=>setOhRows(r=>r.filter((_,j)=>j!==i))}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setOhRows(r=>[...r, EMPTY_OH()])}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-400 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Time Slot
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
              <Button onClick={save} loading={saving} className="flex-1">{editing ? 'Update' : 'Add'}</Button>
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
          <EmptyState title={query ? `No results for "${query}"` : `No ${current.label} yet`}
            description={query ? 'Try a different search.' : `Add the first ${current.label.replace(/s$/, '').toLowerCase()}.`}
            action={!query ? <Button onClick={openNew}>Add {current.label.replace(/s$/, '')}</Button> : undefined}/>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="text-left px-5 py-3">Person</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Designation</th>
                {activeType === 'chairman' && <th className="text-center px-4 py-3 hidden md:table-cell">Service Period</th>}
                <th className="text-center px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50', i%2?'bg-white':'bg-slate-50/30',
                  (!m.name || m.name.trim() === '' || m.name.toLowerCase() === 'anonymous') ? 'bg-red-50' : '')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {m.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.photo} alt={m.name} className="w-9 h-9 rounded-full object-cover shrink-0"/>
                      ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          (!m.name || m.name.toLowerCase() === 'anonymous') ? 'bg-red-200 text-red-700' : 'bg-green-100 border border-green-200 text-green-700'
                        }`}>
                          {m.name ? m.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <div>
                        {(!m.name || m.name.toLowerCase() === 'anonymous') ? (
                          <p className="font-semibold text-red-500 text-xs"> No name  please Edit or Delete</p>
                        ) : (
                          <p className="font-semibold text-slate-900">{m.title} {m.name}</p>
                        )}
                        {m.email && !m.email.match(/^faculty-\d+@/) && <p className="text-xs text-slate-500">{m.email}</p>}
                        {m.email && m.email.match(/^faculty-\d+@/) && <p className="text-xs text-red-400 italic"> Invalid email</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600 text-xs">{m.designation}</td>
                  {activeType === 'chairman' && (
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="text-xs text-slate-600">
                        {m.chairmanFrom ? new Date(m.chairmanFrom).toLocaleDateString('en-GB') : ''}
                        {'  '}
                        {m.chairmanTo ? new Date(m.chairmanTo).toLocaleDateString('en-GB') : <span className="text-green-600 font-semibold">Present</span>}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <div className="flex flex-col gap-1 items-center">
                      <Badge variant={m.isActive ? 'success' : 'neutral'}>{m.isActive ? 'Active' : 'Inactive'}</Badge>
                      {m.employmentStatus === 'on_leave' && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">On Leave</span>}
                      {m.employmentStatus === 'retired'  && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Retired</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={()=>openEdit(m)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId===m.id} onClick={()=>del(m)}>Del</Button>
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
