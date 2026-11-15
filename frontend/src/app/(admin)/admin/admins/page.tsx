'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import PageHeader  from '@/components/admin/ui/PageHeader';
import Button      from '@/components/admin/ui/Button';
import Badge       from '@/components/admin/ui/Badge';
import EmptyState  from '@/components/admin/ui/EmptyState';
import { useToast }   from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { adminGet, adminPost, adminPatch, adminDelete } from '@/lib/api/admin-fetch';
import { cn } from '@/lib/utils/cn';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLES = ['editor', 'admin', 'super_admin'] as const;

const ROLE_BADGE: Record<string, 'danger' | 'info' | 'neutral'> = {
  super_admin: 'danger',
  admin:       'info',
  editor:      'neutral',
};

const EMPTY_FORM = { name: '', email: '', password: '', role: 'editor' as string };

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
}

export default function AdminUsersPage() {
  const { admin: me } = useAuth();
  const isSuperAdmin  = me?.role === 'super_admin';

  const [list,    setList]    = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [pwForm,  setPwForm]  = useState({ newPassword: '' });
  const [pwOpen,  setPwOpen]  = useState(false);
  const [pwTarget, setPwTarget] = useState<AdminUser | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState('');

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500';

  const load = useCallback(async () => {
    setLoading(true);
    try { setList(await adminGet<AdminUser[]>('/admins')); }
    catch { toast.error('Failed to load admin list'); setList([]); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErr('');
    setOpen(true);
  }

  function openEdit(a: AdminUser) {
    setEditing(a);
    setForm({ name: a.name, email: a.email, password: '', role: a.role });
    setErr('');
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim()) { setErr('Name and email are required.'); return; }
    if (!editing && form.password.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) {
        await adminPatch(`/admins/${editing.id}`, { name: form.name, role: form.role });
        toast.success('Admin updated');
      } else {
        await adminPost('/admins', { name: form.name, email: form.email, password: form.password, role: form.role });
        toast.success('Admin created');
      }
      setOpen(false);
      load();
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Save failed';
      setErr(m); toast.error(m);
    } finally { setSaving(false); }
  }

  async function toggleActive(a: AdminUser) {
    if (a.id === me?.id) { toast.error('You cannot deactivate yourself'); return; }
    try {
      await adminPatch(`/admins/${a.id}`, { isActive: !a.isActive });
      toast.success(a.isActive ? `${a.name} deactivated` : `${a.name} activated`);
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed'); }
  }

  async function del(a: AdminUser) {
    if (a.id === me?.id) { toast.error('You cannot delete yourself'); return; }
    const ok = await confirm({
      title: `Delete "${a.name}"?`,
      description: 'This permanently removes their admin account. All their activity logs are preserved.',
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    try {
      await adminDelete(`/admins/${a.id}`);
      toast.success('Admin deleted');
      load();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Delete failed'); }
  }

  async function resetPassword() {
    if (!pwTarget || pwForm.newPassword.length < 8) { return; }
    setSaving(true);
    try {
      await adminPatch(`/admins/${pwTarget.id}/reset-password`, { newPassword: pwForm.newPassword });
      toast.success(`Password reset for ${pwTarget.name}`);
      setPwOpen(false); setPwForm({ newPassword: '' }); setPwTarget(null);
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Reset failed'); }
    finally { setSaving(false); }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminPageTitle title="Admin Users" />
      {ConfirmDialog}

      <PageHeader
        title="Admin User Management"
        description="Create and manage admin accounts. Only super admins can create or delete accounts."
        action={
          isSuperAdmin ? (
            <Button
              onClick={openNew}
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>}
            >
              New Admin
            </Button>
          ) : null
        }
      />

      {/* Role legend */}
      <div className="flex flex-wrap gap-3 mb-5 p-4 bg-white border border-slate-200 rounded-xl">
        <span className="text-xs font-semibold text-slate-500 self-center">Roles:</span>
        <div className="flex items-center gap-1.5">
          <Badge variant="danger">super_admin</Badge>
          <span className="text-xs text-slate-500">— full access, can manage admins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="info">admin</Badge>
          <span className="text-xs text-slate-500">— all content + students, no admin management</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="neutral">editor</Badge>
          <span className="text-xs text-slate-500">— content only (news, notices, events, gallery)</span>
        </div>
      </div>

      {/* Create / Edit modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">
              {editing ? `Edit — ${editing.name}` : 'Create New Admin'}
            </h3>

            {err && (
              <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm mb-4">
                {err}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Dr. Ahmed" className={iCls}/>
              </div>

              {!editing && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="admin@gstu.ac.bd" className={iCls}/>
                </div>
              )}

              {!editing && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password * (min 8 chars)</label>
                  <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••" className={iCls}/>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role *</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={iCls}>
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                {form.role === 'super_admin' && (
                  <p className="text-[11px] text-amber-600 mt-1">⚠ Super admin has full unrestricted access.</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={save} loading={saving} className="flex-1">
                {editing ? 'Save Changes' : 'Create Admin'}
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {pwOpen && pwTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-5">for <span className="font-semibold text-slate-700">{pwTarget.name}</span></p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password (min 8 chars)</label>
              <input type="password" value={pwForm.newPassword}
                onChange={e => setPwForm({ newPassword: e.target.value })}
                placeholder="••••••••" className={iCls}/>
            </div>
            <div className="flex gap-3 mt-5">
              <Button onClick={resetPassword} loading={saving}
                disabled={pwForm.newPassword.length < 8} className="flex-1">
                Reset
              </Button>
              <Button variant="secondary" onClick={() => { setPwOpen(false); setPwForm({ newPassword: '' }); }} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            title="No admin accounts"
            description="Create the first admin account."
            action={isSuperAdmin ? <Button onClick={openNew}>Create Admin</Button> : undefined}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider bg-slate-50">
                <th className="text-left px-5 py-3">Admin</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Role</th>
                <th className="text-center px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Last Login</th>
                {isSuperAdmin && <th className="text-right px-5 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {list.map((a, i) => (
                <tr key={a.id}
                  className={cn('border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors',
                    a.id === me?.id ? 'bg-green-50/40' : i % 2 === 0 ? 'bg-white' : ''
                  )}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: a.role === 'super_admin' ? 'linear-gradient(135deg,#be123c,#9f1239)' : a.role === 'admin' ? 'linear-gradient(135deg,#1d4ed8,#1e40af)' : 'linear-gradient(135deg,#374151,#1f2937)' }}
                      >
                        {a.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {a.name}
                          {a.id === me?.id && (
                            <span className="ml-2 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">You</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <Badge variant={ROLE_BADGE[a.role] ?? 'neutral'}>
                      {a.role.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-center hidden md:table-cell">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
                      a.isActive
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', a.isActive ? 'bg-green-500' : 'bg-slate-400')} aria-hidden="true"/>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500 tabular-nums">{timeAgo(a.lastLoginAt)}</span>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(a)}>Edit</Button>
                        <Button size="sm" variant="secondary"
                          onClick={() => { setPwTarget(a); setPwForm({ newPassword: '' }); setPwOpen(true); }}>
                          Reset Pwd
                        </Button>
                        {a.id !== me?.id && (
                          <Button size="sm" variant="secondary" onClick={() => toggleActive(a)}>
                            {a.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
                        {a.id !== me?.id && (
                          <Button size="sm" variant="danger" onClick={() => del(a)}>Delete</Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
