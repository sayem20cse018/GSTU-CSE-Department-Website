// ─── Site-wide constants ──────────────────────────────────────────────────────

export const SITE = {
  name: "Department of Computer Science & Engineering",
  shortName: "Dept. of CSE",
  university: "Gopalganj Science & Technology University",
  universityShort: "GSTU",
  tagline: "Advancing Computing, Shaping the Future",
  email: "cse@gstu.edu.bd",
  phone: "+880-468-XXXXXX",
  address: "CSE Building, GSTU Campus, Gopalganj-8100, Bangladesh",
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
      { label: "Overview",         href: "/about" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "History",          href: "/about#history" },
    ],
  },
  {
    label: "People",
    href: "/faculty",
    children: [
      { label: "Faculty Members", href: "/faculty" },
      { label: "Staff",           href: "/faculty/staff" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "BSc in CSE",   href: "/academics/bsc" },
      { label: "MSc in CSE",   href: "/academics/msc" },
      { label: "PhD Program",  href: "/academics/phd" },
      { label: "Course List",  href: "/academics/courses" },
    ],
  },
  {
    label: "Research",
    href: "/research",
    children: [
      { label: "Research Groups", href: "/research" },
      { label: "Publications",    href: "/research/publications" },
      { label: "Projects",        href: "/research/projects" },
    ],
  },
  { label: "Admissions",   href: "/admissions" },
  { label: "News & Events", href: "/news" },
  { label: "Contact",      href: "/contact" },
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
