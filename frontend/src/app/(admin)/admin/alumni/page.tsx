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
import { formatDate } from '@/lib/utils/format';

const DEGREES    = ['BSc', 'MSc', 'PhD'];
const INDUSTRIES = ['software_engineering','data_science_ml','research_academia','entrepreneurship','government','finance_fintech','cybersecurity','product_management','consulting','higher_education','other'];
const STATUSES   = ['pending', 'approved', 'rejected'];
const ALUMNI_ROLES = ['member','executive','president','vice_president','secretary','treasurer','committee'];

const EMPTY = {
  name:'', email:'', photo:'', phone:'', currentCity:'', currentCountry:'Bangladesh',
  batchYear: new Date().getFullYear() - 4, graduationYear: new Date().getFullYear(),
  degree:'BSc', studentId:'', cgpa:'',
  currentDesignation:'', currentOrganization:'', industry:'software_engineering',
  testimonial:'', linkedinUrl:'', githubUrl:'', websiteUrl:'',
  isProfilePublic:true, isFeatured:false, isVerified:false, approvalStatus:'approved',
  willingToMentor:false, willingToSpeak:false, mentorshipTopics:'',
  associationRole:'member', isDistinguished:false,
};

interface Alumnus {
  id:string; name:string; email:string; photo?:string; currentDesignation?:string;
  currentOrganization?:string; batchYear:number; graduationYear:number; degree:string;
  isProfilePublic:boolean; isFeatured:boolean; isVerified:boolean; approvalStatus:string;
  currentCity?:string; currentCountry?:string; createdAt:string;
}

type FormType = typeof EMPTY;

export default function AlumniAdminPage() {
  const [list, setList]       = useState<Alumnus[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<FormType>(EMPTY);
  const [editing, setEditing] = useState<Alumnus | null>(null);
  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState<'basic'|'career'|'social'>('basic');
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<string | null>(null);
  const [err, setErr]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<Alumnus[]>('/alumni?admin=true')); }
    catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const F = (k: keyof FormType, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm(EMPTY); setTab('basic'); setErr(''); setOpen(true); }
  function openEdit(a: Alumnus) {
    setEditing(a);
    setForm({ ...EMPTY,
      name: a.name, email: a.email, photo: a.photo ?? '',
      currentCity: a.currentCity ?? '', currentCountry: a.currentCountry ?? 'Bangladesh',
      batchYear: a.batchYear, graduationYear: a.graduationYear, degree: a.degree,
      currentDesignation: a.currentDesignation ?? '', currentOrganization: a.currentOrganization ?? '',
      isProfilePublic: a.isProfilePublic, isFeatured: a.isFeatured, isVerified: a.isVerified,
      approvalStatus: a.approvalStatus,
    });
    setTab('basic'); setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim()) { setErr('Name and email are required.'); return; }
    setSaving(true); setErr('');
    try {
      // Strip fields not in the backend schema
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { associationRole, isDistinguished, ...payload } = form;
      if (editing) await adminPatch(`/alumni/${editing.id}`, payload);
      else await adminPost('/alumni', payload);
      setOpen(false); load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(id: string) {
    if (!confirm('Delete this alumni record?')) return;
    setDelId(id);
    try { await adminDelete(`/alumni/${id}`); load(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
    finally { setDelId(null); }
  }

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500';
  const statusColor: Record<string, 'success' | 'danger' | 'neutral'> = { approved:'success', rejected:'danger', pending:'neutral' };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="Alumni" />
      <PageHeader title="Alumni Directory" description={`${list.length} alumni record${list.length !== 1 ? 's' : ''}`}
        action={<Button onClick={openNew} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>Add Alumni</Button>}/>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">{editing ? 'Edit Alumni' : 'Add Alumni'}</h3>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
                {(['basic','career','social'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={cn('px-3 py-1.5 font-semibold capitalize transition', tab === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {err && <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm mb-4">{err}</p>}

            {tab === 'basic' && (
              <div className="space-y-4">
                <ImageUpload label="Photo" value={form.photo} onChange={v => F('photo', v)} previewRounded />
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={e => F('name', e.target.value)} placeholder="Mohammad Rahman" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e => F('email', e.target.value)} placeholder="name@email.com" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input value={form.phone} onChange={e => F('phone', e.target.value)} placeholder="+880-xxx" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree</label>
                    <select value={form.degree} onChange={e => F('degree', e.target.value)} className={iCls}>
                      {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Batch Year</label>
                    <input type="number" value={form.batchYear} onChange={e => F('batchYear', +e.target.value)} className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                    <input type="number" value={form.graduationYear} onChange={e => F('graduationYear', +e.target.value)} className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Student ID</label>
                    <input value={form.studentId} onChange={e => F('studentId', e.target.value)} placeholder="20CSE018" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                    <input value={form.currentCity} onChange={e => F('currentCity', e.target.value)} placeholder="Dhaka" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
                    <input value={form.currentCountry} onChange={e => F('currentCountry', e.target.value)} placeholder="Bangladesh" className={iCls}/></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Approval Status</label>
                    <select value={form.approvalStatus} onChange={e => F('approvalStatus', e.target.value)} className={iCls}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Association Role</label>
                    <select value={form.associationRole} onChange={e => F('associationRole', e.target.value)} className={iCls}>
                      {ALUMNI_ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}</select></div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[['isProfilePublic','Public Profile'],['isFeatured','Featured'],['isDistinguished','Distinguished Alumni'],['isVerified','Verified'],['willingToMentor','Can Mentor'],['willingToSpeak','Can Speak']].map(([k,l]) => (
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[k as keyof FormType] as boolean}
                        onChange={e => F(k as keyof FormType, e.target.checked)} className="accent-green-600"/>
                      <span className="text-sm font-medium text-slate-700">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {tab === 'career' && (
              <div className="space-y-4">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Designation</label>
                  <input value={form.currentDesignation} onChange={e => F('currentDesignation', e.target.value)} placeholder="Senior Software Engineer" className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Organization</label>
                  <input value={form.currentOrganization} onChange={e => F('currentOrganization', e.target.value)} placeholder="Google, BUET, etc." className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry</label>
                  <select value={form.industry} onChange={e => F('industry', e.target.value)} className={iCls}>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i.replace(/_/g,' ')}</option>)}</select></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Mentorship Topics</label>
                  <input value={form.mentorshipTopics} onChange={e => F('mentorshipTopics', e.target.value)} placeholder="Web dev, competitive programming…" className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Testimonial / Quote</label>
                  <textarea rows={4} value={form.testimonial} onChange={e => F('testimonial', e.target.value)}
                    placeholder="What this department meant to me…" className={`${iCls} resize-none`}/></div>
              </div>
            )}

            {tab === 'social' && (
              <div className="space-y-4">
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">LinkedIn URL</label>
                  <input type="url" value={form.linkedinUrl} onChange={e => F('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">GitHub URL</label>
                  <input type="url" value={form.githubUrl} onChange={e => F('githubUrl', e.target.value)} placeholder="https://github.com/..." className={iCls}/></div>
                <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Personal Website</label>
                  <input type="url" value={form.websiteUrl} onChange={e => F('websiteUrl', e.target.value)} placeholder="https://..." className={iCls}/></div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing ? 'Update' : 'Add'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : list.length === 0 ? (
          <EmptyState title="No alumni records yet" description="Add the first alumni." action={<Button onClick={openNew}>Add Alumni</Button>}/>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Position</th>
              <th className="text-center px-4 py-3 hidden sm:table-cell">Batch</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {list.map((a, i) => (
                <tr key={a.id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50', i%2?'bg-white':'')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {a.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.photo} alt={a.name} className="w-8 h-8 rounded-full object-cover shrink-0"/>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0 text-xs font-bold text-blue-400">
                          {a.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{a.name}</p>
                        <p className="text-xs text-slate-500">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-slate-700 text-xs line-clamp-1">{a.currentDesignation || '—'}</p>
                    <p className="text-slate-500 text-xs line-clamp-1">{a.currentOrganization || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="text-xs text-slate-500">{a.batchYear}–{a.graduationYear}</span>
                    <br/><span className="text-xs font-bold text-green-700">{a.degree}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <Badge variant={statusColor[a.approvalStatus] ?? 'neutral'}>{a.approvalStatus}</Badge>
                      {a.isFeatured && <Badge variant="success">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(a)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId === a.id} onClick={() => del(a.id)}>Del</Button>
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
