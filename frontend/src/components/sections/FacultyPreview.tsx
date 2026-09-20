import Link from 'next/link';

interface FacultyMember {
  id: string; name: string; designation: string; title?: string;
  photo?: string; email: string; slug?: string; researchInterests?: string[];
}

async function fetchFaculty(): Promise<FacultyMember[]> {
  try {
    const api = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/faculty`, { next: { revalidate: 3600 } });
    if (!res.ok) return MOCK;
    const json = await res.json() as { data?: FacultyMember[] };
    const arr = Array.isArray(json.data) ? json.data.slice(0, 5) : [];
    return arr.length ? arr : MOCK;
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
        </div>

        {/* Cards — max 4 preview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {faculty.slice(0, 4).map((member, i) => {
            const desig = DESIG_STYLE[member.designation] ?? { bg:'rgba(26,122,60,0.1)', text:'#166534' };
            return (
              <article key={member.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                {/* Big photo area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo} alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white"
                      style={{ background: AVATAR_BKGS[i % AVATAR_BKGS.length] }}>
                      {getInitials(member.name)}
                    </div>
                  )}
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true"/>
                </div>

                {/* Content below image */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 group-hover:text-green-700 transition leading-tight text-base mb-1">
                    <Link href={`/faculty/${member.slug ?? member.id}`}>
                      {member.title} {member.name}
                    </Link>
                  </h3>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-3"
                    style={{ background: desig.bg, color: desig.text }}>
                    {member.designation}
                  </span>

                  {/* Research interests */}
                  {member.researchInterests && member.researchInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {member.researchInterests.slice(0,2).map(r => (
                        <span key={r} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                    </div>
                  )}

                  <Link href={`/faculty/${member.slug ?? member.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#166534,#15803d)' }}>
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

        {/* View All Faculty — centered below cards */}
        <div className="mt-10 flex justify-center">
          <Link href="/faculty"
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #166534, #15803d)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            View All Faculty Members
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
