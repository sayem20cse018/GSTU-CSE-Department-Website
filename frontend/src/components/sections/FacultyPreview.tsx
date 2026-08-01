import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface FacultyMember {
  _id: string;
  name: string;
  designation: string;
  title?: string;
  photo?: string;
  researchInterests: string[];
  email: string;
  slug?: string;
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchFaculty(): Promise<FacultyMember[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/faculty`, { next: { revalidate: 3600 } });
    if (!res.ok) return MOCK_FACULTY;
    const json = await res.json() as { data: FacultyMember[] };
    const members = json.data ?? [];
    return members.length ? members.slice(0, 6) : MOCK_FACULTY;
  } catch {
    return MOCK_FACULTY;
  }
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_FACULTY: FacultyMember[] = [
  { _id: '1', name: 'Dr. Mohammad Rahman', designation: 'Professor', title: 'Dr.', email: 'mrahman@gstu.edu.bd', researchInterests: ['Machine Learning', 'Computer Vision'], slug: 'dr-mohammad-rahman' },
  { _id: '2', name: 'Dr. Fatima Khatun', designation: 'Associate Professor', title: 'Dr.', email: 'fkhatun@gstu.edu.bd', researchInterests: ['Cybersecurity', 'Networking'], slug: 'dr-fatima-khatun' },
  { _id: '3', name: 'Dr. Karim Hossain', designation: 'Associate Professor', title: 'Dr.', email: 'khossain@gstu.edu.bd', researchInterests: ['NLP', 'Deep Learning'], slug: 'dr-karim-hossain' },
  { _id: '4', name: 'Mr. Arif Ahmed', designation: 'Assistant Professor', email: 'aahmed@gstu.edu.bd', researchInterests: ['IoT', 'Embedded Systems'], slug: 'mr-arif-ahmed' },
  { _id: '5', name: 'Ms. Nadia Islam', designation: 'Assistant Professor', email: 'nislam@gstu.edu.bd', researchInterests: ['Software Engineering', 'Agile'], slug: 'ms-nadia-islam' },
  { _id: '6', name: 'Mr. Tanvir Hasan', designation: 'Lecturer', email: 'thasan@gstu.edu.bd', researchInterests: ['Algorithms', 'Theory of Computing'], slug: 'mr-tanvir-hasan' },
];

// ── Avatar initials ───────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-violet-600', 'bg-emerald-600',
  'bg-rose-600',  'bg-amber-600', 'bg-teal-600',
];

const DESIGNATION_BADGE: Record<string, string> = {
  'Professor':           'bg-blue-100 text-blue-700',
  'Associate Professor': 'bg-violet-100 text-violet-700',
  'Assistant Professor': 'bg-emerald-100 text-emerald-700',
  'Lecturer':            'bg-amber-100 text-amber-700',
  'Senior Lecturer':     'bg-teal-100 text-teal-700',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default async function FacultyPreview() {
  const faculty = await fetchFaculty();

  return (
    <section className="section-py bg-slate-50" aria-labelledby="faculty-heading">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Our People</p>
            <h2 id="faculty-heading" className="text-3xl font-bold text-slate-900">Faculty Members</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-lg">
              Our diverse team of experienced faculty drive cutting-edge research and world-class teaching.
            </p>
          </div>
          <Link
            href="/faculty"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-400 px-4 py-2 rounded-lg transition shrink-0"
          >
            All Faculty
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {faculty.map((member, idx) => (
            <article
              key={member._id}
              className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={cn(
                  'w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden',
                  member.photo ? '' : AVATAR_COLORS[idx % AVATAR_COLORS.length],
                )}>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={`${member.name} photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(member.name)
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition leading-tight truncate">
                    <Link href={`/faculty/${member.slug ?? member._id}`}>
                      {member.title} {member.name}
                    </Link>
                  </h3>
                  <span className={cn(
                    'inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md',
                    DESIGNATION_BADGE[member.designation] ?? 'bg-slate-100 text-slate-600',
                  )}>
                    {member.designation}
                  </span>
                </div>
              </div>

              {/* Research interests */}
              {member.researchInterests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {member.researchInterests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              {/* Email */}
              <a
                href={`mailto:${member.email}`}
                className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition truncate"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{member.email}</span>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/faculty" className="text-sm font-semibold text-blue-700">View All Faculty →</Link>
        </div>
      </div>
    </section>
  );
}
