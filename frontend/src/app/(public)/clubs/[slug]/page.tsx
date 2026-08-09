import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

interface Club {
  id: string; name: string; slug: string; description: string;
  shortDescription?: string; logo?: string; coverImage?: string;
  presidentName?: string; advisorName?: string; foundedYear: number;
  memberCount: number; activities?: string[]; email?: string;
  facebookUrl?: string; isActive: boolean;
}

const MOCK: Record<string, Club> = {
  'programming-club':  { id:'1', name:'Programming Club',   slug:'programming-club',  description:'The Programming Club of GSTU CSE is dedicated to fostering competitive programming skills, algorithmic thinking, and problem-solving abilities among students. We organize regular contests, workshops, and training sessions to prepare members for national and international programming competitions including ACM ICPC, Google CodeJam, and Codeforces contests.', foundedYear:2013, memberCount:120, isActive:true, advisorName:'Dr. Mohammad Rahman', presidentName:'Md. Rafiqul Islam', activities:['Weekly Coding Contests','ACM ICPC Training','Algorithm Workshops','Competitive Programming Boot Camps','Online Judge Practice Sessions'], email:'programming@gstu-cse.edu', facebookUrl:'https://facebook.com/gstu.programming' },
  'robotics-club':     { id:'2', name:'Robotics Club',      slug:'robotics-club',     description:'The Robotics Club explores the intersection of hardware and software through hands-on robotics projects, IoT systems, and automation. Members work on building intelligent robots, embedded systems, and participate in national robotics competitions.', foundedYear:2015, memberCount:85, isActive:true, advisorName:'Mr. Arif Ahmed', presidentName:'Sabrina Akter', activities:['Robot Building Projects','IoT Prototyping','Arduino & Raspberry Pi Workshops','National Robotics Competitions'] },
  'ai-research-club':  { id:'3', name:'AI Research Club',   slug:'ai-research-club',  description:'The AI Research Club is a community of students passionate about artificial intelligence, machine learning, and data science. We conduct reading groups, research seminars, and collaborative projects in AI/ML.', foundedYear:2018, memberCount:70, isActive:true, advisorName:'Dr. Karim Hossain', presidentName:'Nasrin Begum', activities:['AI Paper Reading Groups','ML Project Workshops','Kaggle Competitions','Research Seminars','Deep Learning Study Sessions'] },
  'cybersecurity-club':{ id:'4', name:'Cyber Security Club',slug:'cybersecurity-club', description:'The Cyber Security Club builds expertise in ethical hacking, penetration testing, network security, and digital forensics. We participate in Capture The Flag (CTF) competitions and organize security awareness programs.', foundedYear:2019, memberCount:60, isActive:true, advisorName:'Dr. Fatima Khatun', presidentName:'Tanvir Hasan', activities:['CTF Competitions','Ethical Hacking Workshops','Network Security Training','Bug Bounty Programs','Security Awareness Seminars'] },
  'app-dev-club':      { id:'5', name:'App Dev Club',       slug:'app-dev-club',       description:'The App Development Club focuses on building mobile and web applications to solve real-world problems. Members learn modern frameworks and development practices through hands-on project-based learning.', foundedYear:2020, memberCount:95, isActive:true, advisorName:'Ms. Nadia Islam', presidentName:'Rafi Ahmed', activities:['Mobile App Development (Flutter/React Native)','Web Development Projects','Hackathons','Tech Startup Ideation','Industry Guest Lectures'] },
  'open-source-club':  { id:'6', name:'Open Source Club',   slug:'open-source-club',   description:'The Open Source Club promotes collaboration, transparency, and community-driven software development. Members contribute to open source projects on GitHub and participate in events like Google Summer of Code and Hacktoberfest.', foundedYear:2021, memberCount:50, isActive:true, advisorName:'Mr. Tanvir Hasan', presidentName:'Mitu Islam', activities:['GitHub Contributions','Hacktoberfest Participation','Open Source Project Development','Community Coding Sessions','Technical Documentation'] },
};

async function fetchClub(slug: string): Promise<Club | null> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const r = await fetch(`${api}/clubs/${slug}`, { next: { revalidate: 3600 } });
    if (!r.ok) return MOCK[slug] ?? null;
    const d = await r.json() as { data: Club };
    return d.data ?? MOCK[slug] ?? null;
  } catch { return MOCK[slug] ?? null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const club = await fetchClub(slug);
  return { title: club ? `${club.name} — GSTU CSE Clubs` : 'Club — GSTU CSE' };
}

const GRAD_MAP: Record<string, string> = {
  'programming-club':'from-blue-600 to-indigo-700','robotics-club':'from-violet-600 to-purple-700',
  'ai-research-club':'from-emerald-600 to-teal-700','cybersecurity-club':'from-rose-600 to-pink-700',
  'app-dev-club':'from-amber-600 to-orange-700','open-source-club':'from-cyan-600 to-blue-700',
};
const ICON_MAP: Record<string, string> = {
  'programming-club':'💻','robotics-club':'🤖','ai-research-club':'🧠',
  'cybersecurity-club':'🔐','app-dev-club':'📱','open-source-club':'🌐',
};

export default async function ClubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await fetchClub(slug);
  if (!club) notFound();

  const grad = GRAD_MAP[slug] ?? 'from-green-700 to-emerald-900';
  const icon = ICON_MAP[slug] ?? '🏫';

  return (
    <>
      <SectionHero
        tag="Student Life"
        title={club.name}
        description={club.shortDescription ?? `Est. ${club.foundedYear} · ${club.memberCount} Members`}
        breadcrumbs={[{label:'Home',href:'/'},{label:'Clubs',href:'/clubs'},{label:club.name}]}
      />

      <div className="bg-white section-py">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cover */}
              <div className={`h-56 rounded-2xl bg-gradient-to-br overflow-hidden flex items-center justify-center ${grad}`}>
                {club.coverImage
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover"/>
                  : <span className="text-8xl opacity-20" aria-hidden="true">{icon}</span>
                }
              </div>

              {/* About */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">About the Club</h2>
                <p className="text-slate-600 leading-relaxed">{club.description}</p>
              </section>

              {/* Activities */}
              {club.activities && club.activities.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Activities & Programs</h2>
                  <ul className="space-y-2">
                    {club.activities.map((activity) => (
                      <li key={activity} className="flex items-center gap-3 text-slate-600">
                        <svg className="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Info card */}
              <div className="rounded-2xl text-white p-6"
                style={{ background: 'linear-gradient(160deg,#0b3d1f,#134e2a)' }}>
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl mb-4">
                  {club.logo
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={club.logo} alt="" className="w-full h-full object-cover rounded-xl"/>
                    : <span aria-hidden="true">{icon}</span>
                  }
                </div>
                <h3 className="font-bold text-lg text-white">{club.name}</h3>
                <div className="mt-4 space-y-2.5 text-sm">
                  {[
                    ['📅 Founded', String(club.foundedYear)],
                    ['👥 Members', String(club.memberCount)],
                    ...(club.presidentName ? [['👤 President', club.presidentName]] : []),
                    ...(club.advisorName   ? [['🎓 Advisor',   club.advisorName]]   : []),
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between gap-2 py-2 border-b border-white/10 last:border-0">
                      <span className="text-green-200/70">{l}</span>
                      <span className="font-medium text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact / Social */}
              <div className="border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-4 text-sm">Get in Touch</h3>
                <div className="space-y-3">
                  {club.email && (
                    <a href={`mailto:${club.email}`}
                      className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 transition">
                      <span>✉️</span>{club.email}
                    </a>
                  )}
                  {club.facebookUrl && (
                    <a href={club.facebookUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 transition">
                      <span>📘</span>Facebook Page
                    </a>
                  )}
                </div>
                {!club.email && !club.facebookUrl && (
                  <Link href="/contact" className="text-sm text-green-700 hover:underline">
                    Contact the department →
                  </Link>
                )}
              </div>

              {/* Back */}
              <Link href="/clubs"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold
                           border border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition">
                ← All Clubs
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
