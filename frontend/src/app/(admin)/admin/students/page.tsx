'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader   from '@/components/admin/ui/PageHeader';
import Button       from '@/components/admin/ui/Button';
import Badge        from '@/components/admin/ui/Badge';
import EmptyState   from '@/components/admin/ui/EmptyState';
import SearchInput  from '@/components/admin/ui/SearchInput';
import Pagination   from '@/components/admin/ui/Pagination';
import { useToast } from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import { formatDate } from '@/lib/utils/format';

interface StudentRecord {
  id: string; studentId: string; name: string; session: string;
  isVerified: boolean; createdAt: string;
  user?: { id: string; email: string; lastLoginAt?: string; totalLoginCount: number } | null;
}

interface ImportRow { studentId: string; name: string; session: string }
interface ParseResult { rows: ImportRow[]; errors: string[] }
interface Stats {
  totalRecords: number; totalRegistered: number; onlineNow: number;
  todayLogins: number; totalLoginCount: number;
  lastActivity?: { name: string; studentId: string; at: string } | null;
}

const PAGE_SIZE = 20;
const EMPTY_FORM = { studentId: '', name: '', session: '' };

export default function AdminStudentsPage() {
  const [records,  setRecords]  = useState<StudentRecord[]>([]);
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [query,    setQuery]    = useState('');
  const [page,     setPage]     = useState(1);
  const [tab,      setTab]      = useState<'records' | 'import'>('records');

  // Add/Edit modal
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editing,    setEditing]    = useState<StudentRecord | null>(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [formErr,    setFormErr]    = useState('');
  const [saving,     setSaving]     = useState(false);

  // Import state
  const [parseResult,   setParseResult]   = useState<ParseResult | null>(null);
  const [importing,     setImporting]     = useState(false);
  const [importDone,    setImportDone]    = useState<{ imported: number; duplicates: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [recs, st] = await Promise.all([
        adminGet<StudentRecord[]>('/students/records'),
        adminGet<Stats>('/students/stats'),
      ]);
      setRecords(recs ?? []);
      setStats(st);
    } catch { toast.error('Failed to load student data'); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() =>
    query ? records.filter(r =>
      r.studentId.toLowerCase().includes(query.toLowerCase()) ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.session.toLowerCase().includes(query.toLowerCase())
    ) : records,
    [records, query]
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErr('');
    setModalOpen(true);
  }

  function openEdit(rec: StudentRecord) {
    setEditing(rec);
    setForm({ studentId: rec.studentId, name: rec.name, session: rec.session });
    setFormErr('');
    setModalOpen(true);
  }

  async function saveRecord() {
    if (!form.studentId.trim() || !form.name.trim() || !form.session.trim()) {
      setFormErr('All fields are required.'); return;
    }
    setSaving(true); setFormErr('');
    try {
      if (editing) {
        await adminPatch(`/students/records/${editing.id}`, { name: form.name, session: form.session });
        toast.success('Record updated!');
      } else {
        await adminPost('/students/records', { ...form, studentId: form.studentId.toUpperCase() });
        toast.success('Student record added!');
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      setFormErr(msg);
      toast.error(msg);
    } finally { setSaving(false); }
  }

  const iCls = 'w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white';

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/students/records/parse', {
        method: 'POST', body: fd, credentials: 'include',
      });
      const data = await res.json() as { data?: ParseResult; message?: string };
      if (!res.ok) { toast.error(data.message ?? 'Parse failed'); return; }
      setParseResult(data.data ?? null);
      setImportDone(null);
    } catch { toast.error('Failed to read file'); }
    finally { if (fileRef.current) fileRef.current.value = ''; }
  }

  async function confirmImport() {
    if (!parseResult?.rows.length) return;
    setImporting(true);
    try {
      const res = await fetch('/api/admin/students/records/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rows: parseResult.rows }),
      });
      const data = await res.json() as { data?: { imported: number; duplicates: number }; message?: string };
      if (!res.ok) { toast.error(data.message ?? 'Import failed'); return; }
      setImportDone(data.data ?? null);
      setParseResult(null);
      toast.success(`Imported ${data.data?.imported ?? 0} students!`);
      loadData();
    } catch { toast.error('Import failed'); }
    finally { setImporting(false); }
  }

  async function del(rec: StudentRecord) {
    const ok = await confirm({
      title: `Remove "${rec.name}"?`,
      description: `Student ID: ${rec.studentId} — This will prevent them from logging in.`,
      confirmLabel: 'Remove',
    });
    if (!ok) return;
    try {
      await adminDelete(`/students/records/${rec.id}`);
      toast.success('Student record removed');
      loadData();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Delete failed'); }
  }

  const cardCls = 'bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminPageTitle title="Students" />
      {ConfirmDialog}

      <PageHeader title="Student Management" description="Manage CSE student database and registrations"
        action={
          <Button onClick={openAdd} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}>
            Add Student
          </Button>
        }
      />

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? `Edit — ${editing.studentId}` : 'Add Student Record'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {formErr && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{formErr}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.studentId}
                  onChange={e => setForm(p => ({ ...p, studentId: e.target.value.toUpperCase() }))}
                  placeholder="e.g. 20CSE018"
                  disabled={!!editing}
                  className={`${iCls} ${editing ? 'bg-slate-50 cursor-not-allowed' : ''} uppercase`}
                />
                {editing && <p className="text-[11px] text-slate-400 mt-1">Student ID cannot be changed.</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Student's full name"
                  className={iCls}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Session / Batch <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.session}
                  onChange={e => setForm(p => ({ ...p, session: e.target.value }))}
                  placeholder="e.g. 2020-21"
                  className={iCls}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={saveRecord} loading={saving} className="flex-1">
                {editing ? 'Update Record' : 'Add Record'}
              </Button>
              <Button variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Records',  value: stats.totalRecords,    icon: '📋', color: 'bg-blue-600'  },
            { label: 'Registered',     value: stats.totalRegistered, icon: '✅', color: 'bg-emerald-600'},
            { label: 'Online Now',     value: stats.onlineNow,       icon: '🟢', color: 'bg-green-600' },
            { label: "Today's Logins", value: stats.todayLogins,     icon: '📅', color: 'bg-violet-600'},
            { label: 'Total Logins',   value: stats.totalLoginCount, icon: '🔑', color: 'bg-amber-600' },
            { label: 'Unregistered',   value: stats.totalRecords - stats.totalRegistered, icon: '⏳', color: 'bg-slate-600' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 text-white`}>
              <p className="text-xl mb-1">{s.icon}</p>
              <p className="text-2xl font-black leading-none tabular-nums">{s.value}</p>
              <p className="text-[11px] font-medium mt-1 text-white/80 truncate">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      {stats?.lastActivity && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
          <span className="text-green-700 font-semibold">🕐 Last login:</span>
          <span className="text-green-800">{stats.lastActivity.name} ({stats.lastActivity.studentId})</span>
          <span className="text-green-600 text-xs ml-auto">{formatDate(stats.lastActivity.at)}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(['records', 'import'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
              tab === t ? 'bg-green-700 text-white border-green-700' : 'bg-white text-slate-600 border-slate-200 hover:border-green-400'
            }`}>
            {t === 'records' ? `📋 Student Records (${records.length})` : '📤 Import from Excel'}
          </button>
        ))}
      </div>

      {/* ── RECORDS TAB ── */}
      {tab === 'records' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-3">
            <SearchInput value={query} onChange={v => { setQuery(v); setPage(1); }}
              placeholder="Search by ID, name, session…" className="max-w-xs"/>
            {query && <p className="text-xs text-slate-500">{filtered.length} results</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Student ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-center px-4 py-3 hidden sm:table-cell">Session</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3 hidden md:table-cell">Last Login</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i}>
                      {[1,2,3,4,5,6].map(j => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${50 + j*8}%` }}/>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paged.length === 0 ? (
                  <tr><td colSpan={6}>
                    <EmptyState title={query ? 'No matching records' : 'No students imported yet'}
                      description={query ? 'Try a different search.' : 'Use the Import tab to upload an Excel file.'}
                      action={!query ? <button onClick={() => setTab('import')} className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold">Import Students</button> : undefined}/>
                  </td></tr>
                ) : paged.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-slate-900">{rec.studentId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{rec.name}</p>
                      {rec.user && <p className="text-xs text-slate-400 truncate max-w-[150px]">{rec.user.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-xs font-medium text-slate-600">{rec.session}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {rec.user
                        ? <Badge variant="success">Registered</Badge>
                        : <Badge variant="neutral">Pending</Badge>}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-400 hidden md:table-cell">
                      {rec.user?.lastLoginAt ? formatDate(rec.user.lastLoginAt) : '—'}
                      {rec.user && rec.user.totalLoginCount > 0 &&
                        <span className="ml-1 text-slate-300">({rec.user.totalLoginCount}×)</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(rec)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => del(rec)}>Remove</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > PAGE_SIZE && (
            <div className="px-4 pb-4">
              <Pagination page={page} totalPages={totalPages} total={filtered.length}
                limit={PAGE_SIZE} onPageChange={setPage}/>
            </div>
          )}
        </div>
      )}

      {/* ── IMPORT TAB ── */}
      {tab === 'import' && (
        <div className="space-y-5">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-bold text-blue-900 text-sm mb-3">📋 Excel File Format</h3>
            <p className="text-sm text-blue-800 mb-3">
              Upload an <strong>.xlsx</strong> or <strong>.xls</strong> file with these columns (in any order):
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                ['Student ID', '20CSE018', 'Required'],
                ['Name', 'Md. Musaddikur Rahman', 'Required'],
                ['Session', '2020-21', 'Required'],
              ].map(([col, example, req]) => (
                <div key={col} className="bg-white border border-blue-100 rounded-xl p-3">
                  <p className="font-bold text-blue-900">{col} <span className="text-red-500">{req === 'Required' ? '*' : ''}</span></p>
                  <p className="text-blue-600 mt-0.5 font-mono">{example}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-700 mt-3">
              Column names can also be: <code className="bg-blue-100 px-1 rounded">StudentID</code>, <code className="bg-blue-100 px-1 rounded">Student Name</code>, <code className="bg-blue-100 px-1 rounded">Batch</code>
            </p>
          </div>

          {/* Upload button */}
          <div className="bg-white border-2 border-dashed border-slate-300 hover:border-green-400 rounded-2xl p-8 text-center transition-colors">
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden"/>
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <p className="font-semibold text-slate-700 mb-2">Click to select Excel file</p>
            <p className="text-sm text-slate-400 mb-4">Supports .xlsx, .xls</p>
            <Button onClick={() => fileRef.current?.click()}>
              Choose File
            </Button>
          </div>

          {/* Parse errors */}
          {parseResult?.errors && parseResult.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="font-semibold text-red-800 text-sm mb-2">⚠️ {parseResult.errors.length} row(s) had issues (skipped):</p>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {parseResult.errors.map((e, i) => (
                  <li key={i} className="text-xs text-red-700 font-mono">{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview table */}
          {parseResult && parseResult.rows.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900">Preview — {parseResult.rows.length} rows ready to import</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Review before confirming. Duplicates will be skipped automatically.</p>
                </div>
                <Button onClick={confirmImport} loading={importing} variant="primary">
                  ✅ Confirm Import
                </Button>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">#</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Student ID</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Name</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parseResult.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-2 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-2 font-mono font-semibold text-slate-900">{row.studentId}</td>
                        <td className="px-4 py-2 text-slate-800">{row.name}</td>
                        <td className="px-4 py-2 text-slate-600">{row.session}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success result */}
          {importDone && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-emerald-900 text-lg">Import Complete!</h3>
              <p className="text-emerald-700 mt-2">
                <strong>{importDone.imported}</strong> new students imported.
                {importDone.duplicates > 0 && <span className="text-slate-500"> {importDone.duplicates} duplicates skipped.</span>}
              </p>
              <button onClick={() => { setImportDone(null); setTab('records'); }}
                className="mt-4 px-6 py-2 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition">
                View Records →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
