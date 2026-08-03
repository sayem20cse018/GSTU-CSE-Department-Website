import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";

interface Notice {
  _id: string;
  title: string;
  category: string;
  publishedAt: string;
  isUrgent?: boolean;
  isPinned?: boolean;
  attachments?: { fileUrl: string; fileName: string }[];
}

async function fetchNotices(): Promise<Notice[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

    const res = await fetch(`${apiUrl}/notices?limit=6&published=true`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return MOCK_NOTICES;

    const json = (await res.json()) as { data: { data: Notice[] } };

    return json.data?.data?.length ? json.data.data : MOCK_NOTICES;
  } catch {
    return MOCK_NOTICES;
  }
}

const MOCK_NOTICES: Notice[] = [
  {
    _id: "1",
    title: "BSc Final Semester Examination Routine — Spring 2024",
    category: "academic",
    publishedAt: new Date().toISOString(),
    isUrgent: true,
    isPinned: true,
  },

  {
    _id: "2",
    title: "Admission Test Result Published for MSc Program 2024-25",
    category: "admission",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    isPinned: true,
  },

  {
    _id: "3",
    title: "Workshop on Deep Learning with TensorFlow — Registration Open",
    category: "workshop_seminar",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },

  {
    _id: "4",
    title: "Merit Scholarship Applications Open for 2024-25 Session",
    category: "scholarship",
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },

  {
    _id: "5",
    title: "Class Schedule Revised for 6th Semester CSE Students",
    category: "academic",
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },

  {
    _id: "6",
    title: "Faculty Recruitment Notice — Assistant Professor Position",
    category: "recruitment",
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  academic: "bg-blue-50 text-blue-700",
  admission: "bg-purple-50 text-purple-700",
  scholarship: "bg-emerald-50 text-emerald-700",
  workshop_seminar: "bg-amber-50 text-amber-700",
  recruitment: "bg-rose-50 text-rose-700",
  general: "bg-slate-100 text-slate-600",
};

const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic",
  admission: "Admission",
  scholarship: "Scholarship",
  workshop_seminar: "Workshop",
  recruitment: "Recruitment",
  general: "General",
};

export default async function NoticesSection() {
  const notices = await fetchNotices();

  return (
    <section className="section-py bg-slate-50 border-y border-slate-100">
      <div className="container-custom">
        {/* Header */}

        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Official Notices
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
            Latest Notices
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-slate-500">
            Stay updated with the latest announcements, academic notices and
            department information.
          </p>
        </div>

        {/* Notice List */}

        <div className="grid gap-4">
          {notices.map((notice) => (
            <article
              key={notice._id}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left */}

                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {notice.isUrgent ? (
                      <span className="inline-flex text-[10px] font-bold text-white bg-red-500 px-2 py-1 rounded-md">
                        URGENT
                      </span>
                    ) : (
                      notice.isPinned && (
                        <span className="text-blue-600 text-lg">📌</span>
                      )
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/notices/${notice._id}`}
                      className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition line-clamp-2"
                    >
                      {notice.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span
                        className={cn(
                          "text-xs font-semibold px-3 py-1 rounded-full",
                          CATEGORY_STYLES[notice.category] ??
                            CATEGORY_STYLES.general,
                        )}
                      >
                        {CATEGORY_LABELS[notice.category] ?? notice.category}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatDate(notice.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}

                <div className="flex items-center justify-end">
                  {notice.attachments?.[0] ? (
                    <a
                      href={notice.attachments[0].fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition"
                    >
                      📄 Download
                    </a>
                  ) : (
                    <span className="text-slate-300 text-sm">No File</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Button */}

        <div className="text-center mt-10">
          <Link
            href="/notices"
            className="inline-flex px-8 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition shadow-md"
          >
            View All Notices →
          </Link>
        </div>
      </div>
    </section>
  );
}
