// ─── Site-wide constants ─────────────────────────────────────────────────────

export const SITE = {
  name: "Department of Computer Science & Engineering",
  shortName: "CSE Department",
  university: "Your University Name",
  tagline: "Advancing Computing, Shaping the Future",
  email: "cse@university.edu",
  phone: "+880-XX-XXXXXXX",
  address: "CSE Building, University Campus, Dhaka, Bangladesh",
  founded: 1986,
  socialLinks: {
    facebook: "https://facebook.com/cse.university",
    twitter: "https://twitter.com/cse_university",
    linkedin: "https://linkedin.com/school/cse-university",
    youtube: "https://youtube.com/@cse_university",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Administration", href: "/about/administration" },
      { label: "History", href: "/about/history" },
    ],
  },
  {
    label: "People",
    href: "/faculty",
    children: [
      { label: "Faculty Members", href: "/faculty" },
      { label: "Staff", href: "/faculty/staff" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "BSc in CSE", href: "/academics/bsc" },
      { label: "MSc in CSE", href: "/academics/msc" },
      { label: "PhD Program", href: "/academics/phd" },
      { label: "Course List", href: "/academics/courses" },
    ],
  },
  {
    label: "Research",
    href: "/research",
    children: [
      { label: "Research Groups", href: "/research" },
      { label: "Publications", href: "/research/publications" },
      { label: "Projects", href: "/research/projects" },
    ],
  },
  { label: "Admissions", href: "/admissions" },
  { label: "News & Events", href: "/news" },
  { label: "Contact", href: "/contact" },
] as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
} as const;

export const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Adjunct Faculty",
] as const;
