// ─── Site-wide constants ──────────────────────────────────────────────────────

export const SITE = {
  name: "Department of Computer Science & Engineering",
  shortName: "Dept. of CSE",
  university: "Gopalganj Science & Technology University",
  universityShort: "GSTU",
  tagline: "Advancing Computing, Shaping the Future",
  email: "cse@gstu.edu.bd",
  phone: "+8801739515598",
  address: "Academic Building, Fourth-Floor, GSTU Campus, Gopalganj-8100, Bangladesh",
  founded: 2011,
  socialLinks: {
    facebook: "https://facebook.com/gstu.cse",
    twitter:  "https://twitter.com/gstu_cse",
    linkedin: "https://linkedin.com/school/gstu-cse",
    youtube:  "https://youtube.com/@gstu_cse",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Department",   href: "/about" },
      { label: "History",            href: "/about/history" },
      { label: "Vision & Mission",   href: "/about/vision" },
      { label: "Chairman's Message", href: "/about/chairman" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Undergraduate Studies", href: "/academics/bsc" },
      { label: "Graduate Studies",      href: "/academics/msc" },
      { label: "MPhil",                 href: "/academics/mphil" },
      { label: "PhD",                   href: "/academics/phd" },
      { label: "Academic Calendar",     href: "/academics/resources?type=calendar" },
      { label: "Syllabus",              href: "/academics/resources?type=guideline" },
    ],
  },
  {
    label: "Faculty & Staff",
    href: "/faculty",
    children: [
      { label: "Active Faculty",   href: "/faculty" },
      { label: "Faculty on Leave", href: "/faculty?status=on_leave" },
      { label: "Chairman List",    href: "/faculty/chairmen" },
      { label: "Officers & Staff", href: "/faculty/staff" },
    ],
  },
  {
    label: "Students",
    href: "/students",
    children: [
      { label: "Student Portal",    href: "/student/login" },
      { label: "Class Routine",     href: "/academics/resources?type=routine" },
      { label: "Exam Routine",      href: "/academics/resources?type=exam_schedule" },
      { label: "Results",           href: "/academics/resources?type=result" },
      { label: "Academic Calendar", href: "/academics/resources?type=calendar" },
      { label: "Scholarships",      href: "/students/scholarships" },
      { label: "Clubs & Societies", href: "/students/clubs" },
      { label: "Internship",        href: "/students/internship" },
      { label: "Thesis / Projects", href: "/students/thesis" },
    ],
  },
  {
    label: "Research & Publications",
    href: "/research",
    children: [
      { label: "Research Areas",  href: "/research" },
      { label: "Journal",         href: "/research/publications?type=journal" },
      { label: "Conference",      href: "/research/publications?type=conference" },
      { label: "Year Book",       href: "/research/yearbook" },
    ],
  },
  {
    label: "Admissions",
    href: "/admissions",
    children: [
      { label: "Undergraduate Admission", href: "/admissions/undergraduate" },
      { label: "Graduate Admission",      href: "/admissions/graduate" },
      { label: "Admission Notice",        href: "/notices?cat=admission" },
      { label: "Admission Requirements",  href: "/admissions#requirements" },
      { label: "Tuition & Fees",          href: "/admissions#fees" },
    ],
  },
  {
    label: "News",
    href: "/news",
    children: [
      { label: "Latest News",     href: "/news" },
      { label: "Department News", href: "/news?cat=announcement" },
      { label: "Research News",   href: "/news?cat=research" },
      { label: "Student News",    href: "/news?cat=achievement" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "Upcoming Events",      href: "/events" },
      { label: "Seminars",             href: "/events?type=seminar" },
      { label: "Workshops",            href: "/events?type=workshop" },
      { label: "Conferences",          href: "/events?type=conference" },
      { label: "Programming Contests", href: "/events?type=competition" },
      { label: "Event Archive",        href: "/events?archive=true" },
    ],
  },
  {
    label: "Alumni",
    href: "/alumni",
    children: [
      { label: "Alumni Association",     href: "/alumni" },
      { label: "Distinguished Alumni",   href: "/alumni#distinguished" },
      { label: "Alumni Success Stories", href: "/alumni#stories" },
      { label: "Alumni Registration",    href: "/alumni/register" },
    ],
  },
  {
    label: "Forms",
    href: "/forms",
    children: [
      { label: "General Forms",    href: "/forms" },
      { label: "Evaluation Forms", href: "/forms#evaluation" },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
    children: [
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Events",        href: "/gallery?cat=event" },
      { label: "Academic",      href: "/gallery?cat=academic" },
      { label: "Cultural",      href: "/gallery?cat=cultural" },
      { label: "Sports",        href: "/gallery?cat=sports" },
    ],
  },
] as const;

export const STATS = [
  { value: "14+", label: "Faculty Members" },
  { value: "800+", label: "Students" },
  { value: "12+", label: "Research Groups" },
  { value: "2011", label: "Established" },
] as const;

export const RESEARCH_AREAS = [
  { name: "Machine Learning & AI",       icon: "🤖", count: 4 },
  { name: "Computer Vision",             icon: "👁️",  count: 3 },
  { name: "Cybersecurity",               icon: "🔐", count: 2 },
  { name: "Natural Language Processing", icon: "💬", count: 3 },
  { name: "IoT & Embedded Systems",      icon: "📡", count: 2 },
  { name: "Software Engineering",        icon: "⚙️",  count: 3 },
] as const;

export const PAGINATION_DEFAULTS = { page: 1, limit: 10 } as const;

export const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Senior Lecturer",
  "Adjunct Faculty",
] as const;
