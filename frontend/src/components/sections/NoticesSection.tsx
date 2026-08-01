import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Notice {
  _id: string;
  title: string;
  category: string;
  publishedAt: string;
  isUrgent?: boolean;
  isPinned?: boolean;
  attachments?: { fileUrl: string; fileName: string }[];
}

// ── Server fetch ──────────────────────────────────────────────────────────────
async function fetchNotices(): Promise<Notice[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/notices?limit=6&published=true`, {
      next: { revalidate: 300 },  // ISR: revalidate every 5 min
    });
    if (!res.ok) return MOCK_NOTICES;
    const json = await res.json() as { data: { data: Notice[] } };
    return json.data?.data?.length ? json.data.data : MOCK_NOTICES;
  } catch {
    return MOCK_NOTICES;
  }
}

// ── Mock data (shown until real data exists) ──────────────────────────────────
const MOCK_NOTICES: Notice[] = [
  { _id: '1', title: 'BSc Final Semester Examination Routine — Spring 2024', category: 'academic', publishedAt: new Date().toISOString(), isUrgent: true, isPinned: true },
  { _id: '2', title: 'Admission Test Result Published for MSc Program 2024-25', category: 'admission', publishedAt: new Date(Date.now() - 86400000).toISOString(), isPinned: true },
  { _id: '3', title: 'Workshop on Deep Learning with TensorFlow — Registration Open', category: 'workshop_seminar', publishedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { _id: '4', title: 'Merit Scholarship Applications Open for 2024-25 Session', category: 'scholarship', publishedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { _id: '5', title: 'Class Schedule Revised for 6th Semester CSE Students', category: 'academic', publishedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { _id: '6', title: 'Faculty Recruitment Notice — Assistant Professor Position', category: 'recruitment', publishedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const CATEGORY_STYLES: Record<string, string> = {
  academic:         'bg-blue-100 text-blue-700',
  admission:        'bg-violet-100 text-violet-700',
  scholarship:      'bg-emerald-100 text-emerald-700',
  workshop_seminar: 'bg-amber-100 text-amber-700',
  recruitment:      'bg-rose-100 text-rose-700',
  general:          'bg-slate-100 text-slate-600',
};

const CATEGORY_LABELS: Record<string, string> = {
  academic:         'Academic',
  admission:        'Admission',
  scholarship:      'Scholarship',
  workshop_seminar: 'Workshop',
  recruitment:      'Recruitment',
  general:          'General',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default async function NoticesSection() {
  const notices = await fetchNotices();

  return (
    <section className="section-py bg-slate-50 border-y border-slate-100" aria-labelledby="notices-heading">
      <div className="container-custom">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              Official Notices
            </p>
            <h2 id="notices-heading" className="text-3xl font-bold text-slate-900">
              Latest Notices
            </h2>
          </div>
          <Link
            href="/notices"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-400 px-4 py-2 rounded-lg transition shrink-0"
          >
            All Notices
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-7">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1 text-right">File</div>
          </div>

          {/* Rows */}
          <ul>
            {notices.map((notice, idx) => (
              <li
                key={notice._id}
                className={cn(
                  'grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-slate-50 transition-colors',
                  idx < notices.length - 1 && 'border-b border-slate-100',
                )}
              >
                {/* Title */}
                <div className="sm:col-span-7 flex items-start gap-2">
                  {notice.isUrgent && (
                    <span className="mt-0.5 shrink-0 text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">
                      URGENT
                    </span>
                  )}
                  {notice.isPinned && !notice.isUrgent && (
                    <svg className="mt-0.5 w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M5.5 3A1.5 1.5 0 004 4.5v.793c-.145.045-.285.1-.42.163l-.561-.562A1.5 1.5 0 001.08 6.036L5.964 10.92a1.5 1.5 0 002.122-2.122l-.562-.562c.063-.135.118-.275.163-.42H8.5A1.5 1.5 0 0010 6.316V4.5A1.5 1.5 0 008.5 3h-3zM5.5 12.5a1 1 0 012 0V17a1 1 0 11-2 0v-4.5z" />
                    </svg>
                  )}
                  <Link
                    href={`/notices/${notice._id}`}
                    className="text-sm text-slate-800 hover:text-blue-700 font-medium leading-snug transition-colors line-clamp-2"
                  >
                    {notice.title}
                  </Link>
                </div>

                {/* Category */}
                <div className="sm:col-span-2 flex items-center">
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-1 rounded-md',
                    CATEGORY_STYLES[notice.category] ?? CATEGORY_STYLES.general,
                  )}>
                    {CATEGORY_LABELS[notice.category] ?? notice.category}
                  </span>
                </div>

                {/* Date */}
                <div className="sm:col-span-2 flex items-center text-xs text-slate-400">
                  {formatDate(notice.publishedAt)}
                </div>

                {/* Attachment */}
                <div className="sm:col-span-1 flex items-center sm:justify-end">
                  {notice.attachments?.[0] ? (
                    <a
                      href={notice.attachments[0].fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download attachment"
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-slate-200" aria-hidden="true">—</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 sm:hidden">
          <Link href="/notices" className="block text-center text-sm font-semibold text-blue-700 hover:text-blue-900 py-2">
            View All Notices →
          </Link>
        </div>
      </div>
    </section>
  );
}
