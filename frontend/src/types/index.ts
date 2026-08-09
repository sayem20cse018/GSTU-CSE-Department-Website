// ─── Shared domain types ────────────────────────────────────────────────────

export interface Faculty {
  id: string;
  name: string;
  title: string;
  designation: string; // Professor, Associate Professor, etc.
  email: string;
  phone?: string;
  photo?: string;
  researchInterests: string[];
  education: Education[];
  publications?: Publication[];
  profileUrl?: string;
  isActive: boolean;
  joinedAt: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Publication {
  title: string;
  journal: string;
  year: number;
  url?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: NewsCategory;
  tags: string[];
  publishedAt: string;
  isPublished: boolean;
}

export type NewsCategory =
  | "announcement"
  | "achievement"
  | "research"
  | "event"
  | "general";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  venue: string;
  startDate: string;
  endDate?: string;
  coverImage?: string;
  isPublished: boolean;
}

export interface ResearchGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  lead: string; // Faculty ID
  members: string[]; // Faculty IDs
  projects: ResearchProject[];
}

export interface ResearchProject {
  title: string;
  description: string;
  fundingBody?: string;
  status: "ongoing" | "completed";
  startYear: number;
  endYear?: number;
}

export interface Program {
  id: string;
  name: string;
  degree: "BSc" | "MSc" | "PhD";
  duration: string;
  totalCredits: number;
  description: string;
  eligibility: string;
  curriculum?: CourseEntry[];
}

export interface CourseEntry {
  code: string;
  title: string;
  credits: number;
  semester: number;
  type: "core" | "elective";
}

// ─── API response wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}
