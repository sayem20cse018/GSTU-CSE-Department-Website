'use client';
import { useState, useEffect, useCallback } from 'react';
import { AdminPageTitle } from '@/context/AdminPageContext';
import Button from '@/components/admin/ui/Button';
import Badge from '@/components/admin/ui/Badge';
import PageHeader from '@/components/admin/ui/PageHeader';
import SearchInput from '@/components/admin/ui/SearchInput';
import { useToast } from '@/components/admin/ui/Toast';
import { useConfirm } from '@/components/admin/ui/ConfirmDialog';
import { adminGet, adminPost, adminPatch } from '@/lib/api/admin-fetch';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

interface AdmissionApplication {
  id: string;
  applicationId: string;
  session: string;
  program: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  paymentStatus: string;
  paymentAmount: number | null;
  adminRemarks: string | null;
  assignedStudentId: string | null;
  assignedBatch: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdmissionSetting {
  id: string;
  session: string;
  isOpen: boolean;
  appStartDate: string | null;
  appDeadline: string | null;
  admissionFee: number;
  feeInstructions: string | null;
  instructions: string | null;
}

interface Stats {
  total: number;
  submitted: number;
  underReview: number;
  paymentPending: number;
  paymentVerified: number;
  approved: number;
  rejected: number;
}

const STATUS_COLOR: Record<string, 'neutral' | 'info' | 'warning' | 'success' | 'danger'> = {
  submitted:        'info',
  under_review:     'warning',
  payment_pending:  'warning',
  payment_verified: 'info',
  approved:         'success',
  rejected:         'danger',
};

const PAYMENT_COLOR: Record<string, 'neutral' | 'info' | 'success' | 'danger'> = {
  pending:  'neutral',
  paid:     'info',
  verified: 'success',
  refunded: 'neutral',
};

type TabType = 'applications' | 'settings' | 'stats';

export default function AdmissionApplicationsPage() {
  const [tab, setTab] = useState<TabType>('applications');
  const [apps, setApps] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<AdmissionSetting[]>([]);
  const [settingForm, setSettingForm] = useState({
    session: '', isOpen: false, appStartDate: '', appDeadline: '',
    admissionFee: 500, feeInstructions: '', instructions: '',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Review modal
  const [reviewing, setReviewing] = useState<AdmissionApplication | null>(null);
  const [reviewForm, setReviewForm] = useState({
    status: '', adminRemarks: '', assignedStudentId: '', assignedBatch: '',
  });
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'bKash', transactionId: '', paymentAmount: 0,
  });
  const [savingReview, setSavingReview] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const iCls = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500';

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter) q.set('status', statusFilter);
      if (sessionFilter) q.set('session', sessionFilter);
      if (search) q.set('search', search);
      q.set('limit', '50');
      const d = await adminGet<{ data: AdmissionApplication[] }>(`/admission/applications?${q}`);
      setApps((d as unknown as { data: AdmissionApplication[] }).data ?? []);
    } catch { setApps([]); } finally { setLoading(false); }
  }, [statusFilter, sessionFilter, search]);

  const loadStats = useCallback(async () => {
    try {
      const d = await adminGet<Stats>('/admission/stats');
      setStats(d);
    } catch { /* ignore */ }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const d = await adminGet<AdmissionSetting[]>('/admission/settings');
      if (Array.isArray(d)) setSettings(d);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { void loadApps(); void loadStats(); void loadSettings(); }, [loadApps, loadStats, loadSettings]);
  useEffect(() => { if (tab === 'applications') void loadApps(); }, [tab, loadApps]);

  function openReview(app: AdmissionApplication) {
    setReviewing(app);
    setReviewForm({
      status: app.status,
      adminRemarks: app.adminRemarks ?? '',
      assignedStudentId: app.assignedStudentId ?? '',
      assignedBatch: app.assignedBatch ?? '',
    });
    setPaymentForm({ paymentMethod: 'bKash', transactionId: '', paymentAmount: app.paymentAmount ?? 500 });
  }

  async function saveReview() {
    if (!reviewing) return;
    if (reviewForm.status === 'approved') {
      if (!reviewForm.assignedStudentId) {
        toast.error('Student ID is required for approval.'); return;
      }
      const ok = await confirm({
        title: `Approve application ${reviewing.applicationId}?`,
        description: `This will create a Student Record with ID "${reviewForm.assignedStudentId}". This cannot be undone.`,
        confirmLabel: 'Approve',
      });
      if (!ok) return;
    }
    setSavingReview(true);
    try {
      await adminPatch(`/admission/applications/${reviewing.id}/status`, {
        status: reviewForm.status || undefined,
        adminRemarks: reviewForm.adminRemarks || undefined,
        assignedStudentId: reviewForm.assignedStudentId || undefined,
        assignedBatch: reviewForm.assignedBatch || undefined,
      });
      toast.success('Application updated');
      setReviewing(null);
      void loadApps(); void loadStats();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Update failed'); }
    finally { setSavingReview(false); }
  }

  async function verifyPayment() {
    if (!reviewing) return;
    if (!paymentForm.transactionId) { toast.error('Transaction ID is required.'); return; }
    setVerifyingPayment(true);
    try {
      await adminPatch(`/admission/applications/${reviewing.id}/payment`, paymentForm);
      toast.success('Payment verified');
      setReviewing(null);
      void loadApps(); void loadStats();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Verification failed'); }
    finally { setVerifyingPayment(false); }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await adminPost('/admission/settings', {
        ...settingForm,
        appStartDate: settingForm.appStartDate || undefined,
        appDeadline:  settingForm.appDeadline  || undefined,
      });
      toast.success('Settings saved');
      void loadSettings();
      setSettingForm({ session: '', isOpen: false, appStartDate: '', appDeadline: '', admissionFee: 500, feeInstructions: '', instructions: '' });
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSavingSettings(false); }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AdminPageTitle title="Admission Applications" />
      {ConfirmDialog}

      <PageHeader title="Admission Management" description="Manage admission applications, settings, and payment verification." />

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {(['applications', 'settings', 'stats'] as TabType[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 text-sm font-semibold rounded-lg transition capitalize', tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
            {t === 'applications' ? 'Applications' : t === 'settings' ? 'Settings' : 'Statistics'}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ['Total', stats.total, 'bg-slate-50 border-slate-200'],
            ['Submitted', stats.submitted, 'bg-blue-50 border-blue-200'],
            ['Under Review', stats.underReview, 'bg-amber-50 border-amber-200'],
            ['Payment Pending', stats.paymentPending, 'bg-orange-50 border-orange-200'],
            ['Payment Verified', stats.paymentVerified, 'bg-cyan-50 border-cyan-200'],
            ['Approved', stats.approved, 'bg-green-50 border-green-200'],
            ['Rejected', stats.rejected, 'bg-red-50 border-red-200'],
          ].map(([label, value, cls]) => (
            <div key={String(label)} className={`border rounded-xl p-5 text-center ${cls}`}>
              <p className="text-3xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Settings tab */}
      {tab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Existing settings */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Configured Sessions</h3>
            {settings.length === 0 ? (
              <p className="text-slate-400 text-sm">No admission sessions configured yet.</p>
            ) : (
              <div className="space-y-3">
                {settings.map(s => (
                  <div key={s.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">{s.session}</span>
                      <Badge variant={s.isOpen ? 'success' : 'neutral'}>{s.isOpen ? 'Open' : 'Closed'}</Badge>
                    </div>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      {s.appDeadline && <p>Deadline: {new Date(s.appDeadline).toLocaleDateString()}</p>}
                      <p>Fee: BDT {s.admissionFee}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/update setting */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Create / Update Session</h3>
            <form onSubmit={saveSettings} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Session *</label>
                <input value={settingForm.session} onChange={e => setSettingForm(p => ({...p, session: e.target.value}))} placeholder="e.g. 2024-25" required className={iCls}/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
                  <input type="date" value={settingForm.appStartDate} onChange={e => setSettingForm(p => ({...p, appStartDate: e.target.value}))} className={iCls}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deadline</label>
                  <input type="date" value={settingForm.appDeadline} onChange={e => setSettingForm(p => ({...p, appDeadline: e.target.value}))} className={iCls}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admission Fee (BDT)</label>
                <input type="number" value={settingForm.admissionFee} onChange={e => setSettingForm(p => ({...p, admissionFee: +e.target.value}))} className={iCls}/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payment Instructions</label>
                <textarea rows={3} value={settingForm.feeInstructions} onChange={e => setSettingForm(p => ({...p, feeInstructions: e.target.value}))} placeholder="e.g. Send BDT X to bKash 01XXXXXXXXX..." className={`${iCls} resize-none`}/>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={settingForm.isOpen} onChange={e => setSettingForm(p => ({...p, isOpen: e.target.checked}))} className="accent-green-600"/>
                  <span className="text-sm text-slate-700 font-medium">Admissions Open</span>
                </label>
              </div>
              <Button type="submit" loading={savingSettings} className="w-full">Save Settings</Button>
            </form>
          </div>
        </div>
      )}

      {/* Applications tab */}
      {tab === 'applications' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <SearchInput value={search} onChange={v => setSearch(v)} placeholder="Search by ID, name or email…" className="sm:max-w-xs"/>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="payment_verified">Payment Verified</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input value={sessionFilter} onChange={e => setSessionFilter(e.target.value)}
              placeholder="Filter by session…"
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"/>
            <Button size="sm" variant="secondary" onClick={() => { void loadApps(); }}>Refresh</Button>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"/>)}</div>
            ) : apps.length === 0 ? (
              <div className="p-10 text-center text-slate-400">No applications found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Application</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Applicant</th>
                  <th className="text-center px-4 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-center px-4 py-3 hidden lg:table-cell">Payment</th>
                  <th className="text-left px-4 py-3 hidden xl:table-cell">Applied</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr></thead>
                <tbody>
                  {apps.map((app, i) => (
                    <tr key={app.id} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${i % 2 ? '' : 'bg-white'}`}>
                      <td className="px-5 py-4">
                        <p className="font-mono font-bold text-slate-900 text-xs">{app.applicationId}</p>
                        <p className="text-xs text-slate-400">{app.session} · {app.program}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="font-semibold text-slate-900">{app.fullName}</p>
                        <p className="text-xs text-slate-400">{app.email}</p>
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell">
                        <Badge variant={STATUS_COLOR[app.status] ?? 'neutral'}>
                          {app.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell">
                        <Badge variant={PAYMENT_COLOR[app.paymentStatus] ?? 'neutral'}>
                          {app.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell text-xs text-slate-400">{formatDate(app.createdAt)}</td>
                      <td className="px-5 py-4 text-right">
                        <Button size="sm" variant="secondary" onClick={() => openReview(app)}>Review</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Review modal */}
          {reviewing && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{reviewing.applicationId}</h3>
                    <p className="text-sm text-slate-500">{reviewing.fullName} · {reviewing.email}</p>
                  </div>
                  <button onClick={() => setReviewing(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                {/* Info summary */}
                <div className="bg-slate-50 rounded-xl p-4 mb-5 text-sm grid grid-cols-2 gap-2">
                  {[['Session', reviewing.session], ['Program', reviewing.program], ['Phone', reviewing.phone]].map(([l,v]) => (
                    <div key={l}><p className="text-xs text-slate-400">{l}</p><p className="font-semibold text-slate-700">{v}</p></div>
                  ))}
                </div>

                {/* Payment verification */}
                {reviewing.paymentStatus === 'pending' && (
                  <div className="border border-amber-200 rounded-xl p-4 mb-5 bg-amber-50">
                    <h4 className="font-semibold text-amber-800 mb-3 text-sm">Verify Payment</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                        <select value={paymentForm.paymentMethod} onChange={e => setPaymentForm(p => ({...p, paymentMethod: e.target.value}))} className={iCls}>
                          <option value="bKash">bKash</option>
                          <option value="bank">Bank Transfer</option>
                          <option value="cash">Cash</option>
                          <option value="nagad">Nagad</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction ID *</label>
                        <input value={paymentForm.transactionId} onChange={e => setPaymentForm(p => ({...p, transactionId: e.target.value}))} placeholder="e.g. TXN123456" className={iCls}/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (BDT)</label>
                        <input type="number" value={paymentForm.paymentAmount} onChange={e => setPaymentForm(p => ({...p, paymentAmount: +e.target.value}))} className={iCls}/>
                      </div>
                      <Button onClick={() => void verifyPayment()} loading={verifyingPayment} variant="secondary" className="w-full">
                        Mark Payment Verified
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status update */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Update Status</label>
                    <select value={reviewForm.status} onChange={e => setReviewForm(p => ({...p, status: e.target.value}))} className={iCls}>
                      <option value="">— keep current —</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="payment_pending">Payment Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {reviewForm.status === 'approved' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assign Student ID *</label>
                        <input value={reviewForm.assignedStudentId} onChange={e => setReviewForm(p => ({...p, assignedStudentId: e.target.value}))} placeholder="e.g. 24CSE001" className={`${iCls} uppercase`}/>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Batch</label>
                        <input value={reviewForm.assignedBatch} onChange={e => setReviewForm(p => ({...p, assignedBatch: e.target.value}))} placeholder="e.g. 15th" className={iCls}/>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Admin Remarks</label>
                    <textarea rows={3} value={reviewForm.adminRemarks} onChange={e => setReviewForm(p => ({...p, adminRemarks: e.target.value}))} placeholder="Notes visible to applicant…" className={`${iCls} resize-none`}/>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => void saveReview()} loading={savingReview} className="flex-1">Save</Button>
                    <Button variant="secondary" onClick={() => setReviewing(null)} className="flex-1">Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
