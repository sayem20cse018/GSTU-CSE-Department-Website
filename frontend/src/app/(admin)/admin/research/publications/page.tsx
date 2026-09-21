'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button    from '@/components/admin/ui/Button';
import Badge     from '@/components/admin/ui/Badge';
import EmptyState from '@/components/admin/ui/EmptyState';
import { cn }    from '@/lib/utils/cn';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import { formatDate } from '@/lib/utils/format';

type PubType = 'journal' | 'conference';

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: PubType;
  doi?: string;
  url?: string;
  isPublished: boolean;
  createdAt: string;
  facultyId?: string;
  facultyName?: string;
}

const EMPTY: Omit<Publication, 'id' | 'createdAt'> = {
  title: '', authors: '', venue: '', year: new Date().getFullYear(),
  type: 'journal', doi: '', url: '', isPublished: true,
};

const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';
const lCls = 'block text-xs font-semibold text-slate-700 mb-1.5';

export default function PublicationsPage() {
  const [list,      setList]      = useState<Publication[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState<PubType>('journal');
  const [form,      setForm]      = useState<typeof EMPTY>(EMPTY);
  const [editing,   setEditing]   = useState<Publication | null>(null);
  const [open,      setOpen]      = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [delId,     setDelId]     = useState<string | null>(null);
  const [err,       setErr]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Aggregate publications from all faculty members
      const faculty = await adminGet<{id:string; name:string; publications?:{id:string;title:string;authors:string;venue:string;year:number;type:string;doi?:string;url?:string}[]}[]>('/faculty');
      const pubs: Publication[] = [];
      for (const f of (Array.isArray(faculty) ? faculty : [])) {
        for (const p of (f.publications ?? [])) {
          pubs.push({
            id: p.id, title: p.title, authors: p.authors, venue: p.venue,
            year: p.year, type: (p.type === 'conference' ? 'conference' : 'journal') as PubType,
            doi: p.doi, url: p.url, isPublished: true, createdAt: '', facultyId: f.id, facultyName: f.name,
          });
        }
      }
      setList(pubs);
    } catch { setList([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = list.filter(p => p.type === activeTab);
  const F = (k: keyof typeof EMPTY, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  function openNew() { setEditing(null); setForm({ ...EMPTY, type: activeTab }); setErr(''); setOpen(true); }
  function openEdit(p: Publication) {
    setEditing(p);
    setForm({ title: p.title, authors: p.authors, venue: p.venue, year: p.year,
              type: p.type, doi: p.doi ?? '', url: p.url ?? '', isPublished: p.isPublished });
    setErr(''); setOpen(true);
  }

  async function save() {
    if (!form.title.trim() || !form.authors.trim() || !form.venue.trim()) {
      setErr('Title, authors and venue are required.'); return;
    }
    setSaving(true); setErr('');
    try {
      // Publications are managed via Faculty profile
      // This is a read-only aggregate view — editing redirects to faculty page
      setErr('To edit publications, please use the Faculty & Staff page and edit the faculty member\'s profile.');
    } catch (e) { setErr(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }

  async function del(_id: string) {
    setErr('To delete publications, edit the faculty member\'s profile in the Faculty & Staff page.');
  }

  const journalCount    = list.filter(p => p.type === 'journal').length;
  const conferenceCount = list.filter(p => p.type === 'conference').length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminPageTitle title="Publications" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Research Publications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {journalCount} journal · {conferenceCount} conference · aggregated from faculty profiles
          </p>
        </div>
        <a href="/admin/faculty"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add via Faculty Profile
        </a>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 mb-5">
        {([['journal', 'Journal Papers', journalCount], ['conference', 'Conference Papers', conferenceCount]] as [PubType, string, number][]).map(([t, label, count]) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition',
              activeTab === t
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700'
            )}>
            {label}
            <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-bold',
              activeTab === t ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              {editing ? 'Edit' : 'Add'} {form.type === 'journal' ? 'Journal' : 'Conference'} Publication
            </h3>
            {err && <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm mb-4">{err}</p>}
            <div className="space-y-4">
              <div>
                <label className={lCls}>Publication Type</label>
                <select value={form.type} onChange={e => F('type', e.target.value as PubType)} className={iCls}>
                  <option value="journal">Journal Paper</option>
                  <option value="conference">Conference Paper</option>
                </select>
              </div>
              <div>
                <label className={lCls}>Title *</label>
                <input value={form.title} onChange={e => F('title', e.target.value)} placeholder="Publication title" className={iCls}/>
              </div>
              <div>
                <label className={lCls}>Authors * <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                <input value={form.authors} onChange={e => F('authors', e.target.value)} placeholder="Rahman M., Islam K., Ahmed R." className={iCls}/>
              </div>
              <div>
                <label className={lCls}>{form.type === 'journal' ? 'Journal Name' : 'Conference Name'} *</label>
                <input value={form.venue} onChange={e => F('venue', e.target.value)}
                  placeholder={form.type === 'journal' ? 'IEEE Transactions on…' : 'ICSE 2024, …'} className={iCls}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lCls}>Year *</label>
                  <input type="number" value={form.year} onChange={e => F('year', +e.target.value)} className={iCls}/>
                </div>
                <div>
                  <label className={lCls}>DOI (optional)</label>
                  <input value={form.doi} onChange={e => F('doi', e.target.value)} placeholder="10.1109/…" className={iCls}/>
                </div>
              </div>
              <div>
                <label className={lCls}>URL (optional)</label>
                <input type="url" value={form.url} onChange={e => F('url', e.target.value)} placeholder="https://…" className={iCls}/>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => F('isPublished', e.target.checked)} className="accent-green-600 w-4 h-4"/>
                <span className="text-sm font-medium text-slate-700">Published (visible on website)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">{editing ? 'Update' : 'Add'}</Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={`No ${activeTab} publications yet`}
            description={`Add the first ${activeTab} paper.`}
            action={<Button onClick={openNew}>Add {activeTab === 'journal' ? 'Journal' : 'Conference'} Paper</Button>}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <th className="text-left px-5 py-3">Publication</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Venue</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Year</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50', i % 2 ? 'bg-white' : '')}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900 line-clamp-1">{p.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.authors}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600 text-xs line-clamp-2 max-w-xs">{p.venue}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="text-sm font-bold text-slate-700">{p.year}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={p.isPublished ? 'success' : 'neutral'}>
                      {p.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="sm" variant="danger" loading={delId === p.id} onClick={() => del(p.id)}>Del</Button>
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
