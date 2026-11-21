import type { Metadata } from 'next';
import Link from 'next/link';
import FacultyCard from '@/components/faculty/FacultyCard';
import FacultyLoadError from '@/components/faculty/FacultyLoadError';
import { fetchFacultyList } from '@/lib/faculty/data';
import { isValidFacultyRecord, sortBySeniority } from '@/lib/faculty/shared';

export const maxDuration = 25;

export const metadata: Metadata = {
  title: 'Officers & Staff — GSTU CSE',
  description: 'Administrative officers and support staff of the Department of CSE, GSTU.',
};

function SectionHeading({ label, count, accent = '#475569' }: {
  label: string; count?: number; accent?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-5 rounded-full shrink-0" style={{ background: accent }} aria-hidden="true" />
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">{label}</h2>
        {count !== undefined && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
            style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
            {count}
          </span>
        )}
      </div>
      <div className="h-px w-full bg-slate-100" />
    </div>
  );
}

export default async function OfficerStaffPage() {
  const result = await fetchFacultyList(false);

  if (!result.ok) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-16">
        <div className="container-custom max-w-7xl">
          <PageHeader />
          <FacultyLoadError title="Couldn't load staff records" />
        </div>
      </main>
    );
  }

  const officers = sortBySeniority(
    result.members.filter(
      m => isValidFacultyRecord(m) && m.staffType === 'officer' && m.isActive !== false,
    ),
  );
  const staff = sortBySeniority(
    result.members.filter(
      m => isValidFacultyRecord(m) && m.staffType === 'staff' && m.isActive !== false,
    ),
  );
  const total = officers.length + staff.length;

  return (
    <main className="bg-white min-h-screen pt-28 pb-16">
      <div className="container-custom max-w-7xl">
        <PageHeader count={total} />

        {total === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4" aria-hidden="true">🏢</span>
            <p className="text-slate-500 font-medium">No staff or officer records found.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {officers.length > 0 && (
              <section>
                <SectionHeading label="Officers" count={officers.length} accent="#0f766e" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {officers.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}
            {staff.length > 0 && (
              <section>
                <SectionHeading label="Staff" count={staff.length} accent="#475569" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {staff.map((m, i) => <FacultyCard key={m.id} member={m} index={i} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function PageHeader({ count }: { count?: number }) {
  return (
    <div className="mb-10 pb-5 border-b border-slate-100">
      <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
        <Link href="/" className="hover:text-green-700 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Officers &amp; Staff</span>
      </nav>
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Officers &amp; Staff</h1>
        {count !== undefined && count > 0 && (
          <span className="text-sm font-semibold text-slate-400">{count} members</span>
        )}
      </div>
      <p className="text-sm text-slate-500 mt-1">
        Administrative officers and support staff — Department of CSE, GSTU
      </p>
    </div>
  );
}
