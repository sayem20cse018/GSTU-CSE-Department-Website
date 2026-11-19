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
  staffType: string;         // faculty | chairman | dean | staff | officer
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
  border: string;
}

export const DESIGNATION_BADGE: Record<string, BadgeStyle> = {
  Professor:             { bg: '#1d4ed8', text: '#fff', border: '#1d4ed8' },
  'Associate Professor': { bg: '#6d28d9', text: '#fff', border: '#6d28d9' },
  'Assistant Professor': { bg: '#166534', text: '#fff', border: '#166534' },
  'Senior Lecturer':     { bg: '#0f766e', text: '#fff', border: '#0f766e' },
  Lecturer:              { bg: '#b45309', text: '#fff', border: '#b45309' },
  'Adjunct Faculty':     { bg: '#475569', text: '#fff', border: '#475569' },
};

export function getBadgeStyle(designation: string): BadgeStyle {
  return (
    DESIGNATION_BADGE[designation] ?? {
      bg: '#166534', text: '#fff', border: '#166534',
    }
  );
}

// Gradient backgrounds for initials fallback (no photo).
export const AVATAR_GRADIENTS = [
  'linear-gradient(160deg,#0b3d1f,#1a7a3c)',
  'linear-gradient(160deg,#1d4ed8,#2563eb)',
  'linear-gradient(160deg,#6d28d9,#7c3aed)',
  'linear-gradient(160deg,#b45309,#d97706)',
  'linear-gradient(160deg,#0f766e,#0d9488)',
  'linear-gradient(160deg,#9f1239,#be123c)',
];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const FAKE_EMAIL = /^faculty-\d+@/i;

/** Exclude anonymous / empty-name / auto-generated-email records. */
export function isValidFacultyRecord(
  f: Partial<Pick<FacultyMember, 'name' | 'email'>>,
): boolean {
  const name = (f.name ?? '').trim();
  if (name === '' || name.toLowerCase() === 'anonymous') return false;
  if (f.email && FAKE_EMAIL.test(f.email)) return false;
  return true;
}

/** Head of Department: staffType === 'chairman' */
export function isChairman(f: Pick<FacultyMember, 'staffType'>): boolean {
  return (f.staffType ?? '').toLowerCase() === 'chairman';
}

/** Dean: staffType === 'dean' */
export function isDean(f: Pick<FacultyMember, 'staffType'>): boolean {
  return (f.staffType ?? '').toLowerCase() === 'dean';
}

/**
 * Teaching faculty (faculty | chairman | dean) belong on the public directory.
 * Staff and officers are listed on separate pages.
 */
export function isDirectoryFaculty(f: Pick<FacultyMember, 'staffType'>): boolean {
  const t = (f.staffType ?? 'faculty').toLowerCase();
  return t === 'faculty' || t === 'chairman' || t === 'dean';
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
