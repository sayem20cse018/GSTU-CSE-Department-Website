/**
 * Shared types, constants and pure helpers for the public Faculty directory.
 *
 * These mirror the real Prisma `Faculty` model (including the `education`,
 * `publications`, `awards` and `officeHours` relations) as returned by the
 * NestJS backend wrapped in the `{ success, data }` envelope.
 *
 * Pure only — safe to import from both Server and Client Components.
 */

// ─── Relation models (match backend prisma include) ──────────────────────────

export interface FacultyEducation {
  id: string;
  degree: string;
  institution: string;
  year: number;
}

export interface FacultyPublication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  type: string; // journal | conference | book | book_chapter | thesis | other
  doi?: string | null;
  url?: string | null;
}

export interface FacultyAward {
  id: string;
  title: string;
  awardedBy: string;
  year: number;
  description?: string | null;
}

export interface FacultyOfficeHours {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

// ─── Faculty member ───────────────────────────────────────────────────────────

export interface FacultyMember {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  designation: string;
  title?: string | null;
  shortBio?: string | null;
  fullBio?: string | null;
  slug?: string | null;
  officeRoom?: string | null;
  researchInterests: string[];
  courses: string[];
  websiteUrl?: string | null;
  googleScholarUrl?: string | null;
  linkedinUrl?: string | null;
  researchGateUrl?: string | null;
  orcidId?: string | null;
  isActive: boolean;
  employmentStatus: string; // full_time | on_leave | contract | ...
  staffType: string;         // faculty | chairman | staff | officer
  sortOrder: number;
  joinedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  education: FacultyEducation[];
  publications: FacultyPublication[];
  awards: FacultyAward[];
  officeHours: FacultyOfficeHours[];
}

// ─── Designation ordering & badge styling ────────────────────────────────────

export const DESIGNATION_ORDER = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
  'Adjunct Faculty',
] as const;

export interface BadgeStyle {
  bg: string;
  text: string;
}

export const DESIGNATION_BADGE: Record<string, BadgeStyle> = {
  Professor: { bg: 'rgba(30,64,175,0.12)', text: '#1d4ed8' },
  'Associate Professor': { bg: 'rgba(109,40,217,0.12)', text: '#6d28d9' },
  'Assistant Professor': { bg: 'rgba(22,101,52,0.12)', text: '#166534' },
  'Senior Lecturer': { bg: 'rgba(15,118,110,0.12)', text: '#0f766e' },
  Lecturer: { bg: 'rgba(180,83,9,0.12)', text: '#b45309' },
  'Adjunct Faculty': { bg: 'rgba(71,85,105,0.12)', text: '#475569' },
};

export function getBadgeStyle(designation: string): BadgeStyle {
  return (
    DESIGNATION_BADGE[designation] ?? {
      bg: 'rgba(22,101,52,0.1)',
      text: '#166534',
    }
  );
}

// Gradient backgrounds for the initials fallback (no photo).
export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#0b3d1f,#0a2e1a)',
  'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
  'linear-gradient(135deg,#6d28d9,#3b0764)',
  'linear-gradient(135deg,#b45309,#78350f)',
  'linear-gradient(135deg,#0f766e,#134e4a)',
  'linear-gradient(135deg,#9f1239,#4c0519)',
];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const FAKE_EMAIL = /^faculty-\d+@/i;

/** Exclude anonymous / empty-name / auto-generated-email records from the public site. */
export function isValidFacultyRecord(
  f: Partial<Pick<FacultyMember, 'name' | 'email'>>,
): boolean {
  const name = (f.name ?? '').trim();
  if (name === '' || name.toLowerCase() === 'anonymous') return false;
  if (f.email && FAKE_EMAIL.test(f.email)) return false;
  return true;
}

/**
 * Only teaching faculty and the chairman belong on the public Faculty
 * directory. Staff and officers are listed on their own separate pages.
 */
export function isDirectoryFaculty(f: Pick<FacultyMember, 'staffType'>): boolean {
  const t = (f.staffType ?? 'faculty').toLowerCase();
  return t === 'faculty' || t === 'chairman';
}

export function designationPriority(designation: string): number {
  const idx = (DESIGNATION_ORDER as readonly string[]).indexOf(designation);
  return idx === -1 ? DESIGNATION_ORDER.length : idx;
}

/** True when the member is flagged as being on study/leave. */
export function isOnLeave(f: Pick<FacultyMember, 'employmentStatus'>): boolean {
  return (f.employmentStatus ?? '').toLowerCase() === 'on_leave';
}

export function formatEmploymentStatus(status: string): string {
  const map: Record<string, string> = {
    full_time: 'Full-time',
    on_leave: 'On Leave',
    contract: 'Contract',
    part_time: 'Part-time',
    visiting: 'Visiting',
  };
  return map[(status ?? '').toLowerCase()] ?? status.replace(/_/g, ' ');
}

/** Sort a copy by designation seniority, then backend sortOrder, then name. */
export function sortBySeniority(members: FacultyMember[]): FacultyMember[] {
  return [...members].sort((a, b) => {
    const dp = designationPriority(a.designation) - designationPriority(b.designation);
    if (dp !== 0) return dp;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Group members into designation buckets (in DESIGNATION_ORDER), with any
 * unrecognised designations collected under "Other".
 */
export function groupByDesignation(
  members: FacultyMember[],
): { designation: string; members: FacultyMember[] }[] {
  const ORDER = DESIGNATION_ORDER as readonly string[];
  const groups: { designation: string; members: FacultyMember[] }[] = [];
  for (const desig of ORDER) {
    const list = members.filter((m) => m.designation === desig);
    if (list.length) groups.push({ designation: desig, members: list });
  }
  const others = members.filter((m) => !ORDER.includes(m.designation));
  if (others.length) groups.push({ designation: 'Other Faculty', members: others });
  return groups;
}

/** Resolve the profile path for a member (slug when present, else id). */
export function profileHref(f: Pick<FacultyMember, 'slug' | 'id'>): string {
  const slug = (f.slug ?? '').trim();
  return slug ? `/faculty/${slug}` : `/faculty/${f.id}`;
}
