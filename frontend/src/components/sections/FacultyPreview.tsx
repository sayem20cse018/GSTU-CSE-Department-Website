import Link from 'next/link';

interface FacultyMember {
  id: string; name: string; designation: string; title?: string;
  photo?: string; email: string; slug?: string; researchInterests?: string[];
}

async function fetchFaculty(): Promise<FacultyMember[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/faculty`, { next: { revalidate: 3600 } });
    if (!res.ok) return MOCK;
    const json = await res.json() as { data: FacultyMember[] };
    return json.data?.length ? json.data.slice(0, 6) : MOCK;
  } catch { return MOCK; }
}

const MOCK: FacultyMember[] = [
  { id:'1', name:'Mrinal Kanti Baowaly', title:'Dr.', designation:'Professor', email:'baowaly@gstu.edu.bd', slug:'dr-mrinal-kanti-baowaly', researchInterests:['Machine Learning','Computer Vision'] },
  { id:'2', name:'Mohammad Rahman',       title:'Dr.', designation:'Professor', email:'mrahman@gstu.edu.bd', slug:'dr-mohammad-rahman', researchInterests:['Deep Learning','NLP'] },
  { id:'3', name:'Fatima Khatun',         title:'Dr.', designation:'Associate Professor', email:'fkhatun@gstu.edu.bd', researchInterests:['Cybersecurity','Networks'] },
  { id:'4', name:'Karim Hossain',         title:'Dr.', designation:'Associate Professor', email:'khossain@gstu.edu.bd', researchInterests:['IoT','Embedded Systems'] },
  { id:'5', name:'Nadia Islam',           title:'Ms.', designation:'Assistant Professor', email:'nislam@gstu.edu.bd', researchInterests:['Software Engineering'] },
  { id:'6', name:'Arif Ahmed',            title:'Mr.', designation:'Assistant Professor', email:'aahmed@gstu.edu.bd', researchInterests:['Algorithms','Theory'] },
];

const DESIG_STYLE: Record<string,{bg:string;text:string}> = {
  'Professor':           { bg:'rgba(22,101,52,0.12)',  text:'#166534' },
  'Associate Professor': { bg:'rgba(109,40,217,0.10)', text:'#6d28d9' },
  'Assistant Professor': { bg:'rgba(29,78,216,0.10)',  text:'#1d4ed8' },
  'Lecturer':            { bg:'rgba(180,83,9,0.10)',   text:'#b45309' },
  'Senior Lecturer':     { bg:'rgba(15,118,110,0.10)', text:'#0f766e' },
};

const AVATAR_BKGS = [
  'linear-gradient(135deg,#166534,#052e16)',
  'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
  'linear-gradient(135deg,#6d28d9,#3b0764)',
  'linear-gradient(135deg,#b45309,#78350f)',
  'linear-gradient(135deg,#0f766e,#134e4a)',
  'linear-gradient(135deg,#9f1239,#4c0519)',
];

function getInitials(name: string) {
  return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
}

export default async function FacultyPreview() {
  const faculty = await fetchFaculty();

  return (
    <section className="section-py bg-white">
      <div className="container-custom">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <h2
            className="text-2xl font-bold uppercase tracking-wide whitespace-nowrap"
            style={{ color: '#1a7a3c', fontFamily: 'var(--font-oswald)' }}>
            Faculty Members
          </h2>
          <div className="flex-1 h-[2px]" style={{ background: '#1a7a3c' }} aria-hidden="true" />
          <Link href="/faculty"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl border transition hover:shadow-sm shrink-0"
            style={{ color:'#166534', borderColor:'rgba(22,101,52,0.3)' }}>
            All Faculty
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {faculty.map((member, i) => {
            const desig = DESIG_STYLE[member.designation] ?? DESIG_STYLE.Lecturer;
            return (
              <article key={member.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

                {/* Top strip */}
                <div className="h-1.5 w-full" style={{ background:'linear-gradient(90deg,#166534,#4ade80,#166534)' }} aria-hidden="true"/>

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-md"
                      style={{ background: member.photo ? 'transparent' : AVATAR_BKGS[i % AVATAR_BKGS.length] }}>
                      {member.photo
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top"/>
                        : getInitials(member.name)
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 group-hover:text-green-700 transition leading-tight">
                        <Link href={`/faculty/${member.slug ?? member.id}`}>
                          {member.title} {member.name}
                        </Link>
                      </h3>
                      <span className="inline-block mt-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: desig.bg, color: desig.text }}>
                        {member.designation}
                      </span>
                    </div>
                  </div>

                  {/* Research interests */}
                  {member.researchInterests && member.researchInterests.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {member.researchInterests.slice(0,3).map(r => (
                        <span key={r} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Email */}
                  <a href={`mailto:${member.email}`}
                    className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-green-700 transition truncate">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span className="truncate">{member.email}</span>
                  </a>

                  {/* Profile link */}
                  <Link href={`/faculty/${member.slug ?? member.id}`}
                    className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background:'linear-gradient(135deg,#166534,#15803d)' }}>
                    View Profile
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
