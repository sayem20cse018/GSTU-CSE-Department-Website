import { apiClient } from './client';

const BASE = '/academics';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Program {
  _id: string;
  name: string;
  degree: 'BSc' | 'MSc' | 'PhD';
  duration: string;
  totalCredits: number;
  description: string;
  objectives: string;
  eligibility: string;
  admissionRequirements: { label: string; value: string }[];
  careerOpportunities: { title: string; description?: string }[];
  highlights: string[];
  learningOutcomes: string[];
  totalSeats: number;
  tuitionFee?: string;
  brochureUrl?: string;
  isActive: boolean;
}

export interface Course {
  _id: string;
  code: string;
  title: string;
  credits: number;
  semester: number;
  degree: 'BSc' | 'MSc' | 'PhD';
  type: 'core' | 'elective' | 'lab' | 'sessional';
  description?: string;
  objectives?: string;
  prerequisites: string[];
  learningOutcomes: string[];
  topics: string[];
  syllabusUrl?: string;
  teacherName?: string;
  theoryHours: number;
  labHours: number;
  isActive: boolean;
}

export interface AcademicResource {
  _id: string;
  title: string;
  type: 'routine' | 'calendar' | 'exam_schedule' | 'result' | 'guideline' | 'other';
  description?: string;
  targetDegree: string;
  academicYear: string;
  term: string;
  files: { fileName: string; fileUrl: string; fileType: string }[];
  isPublished: boolean;
  isPinned: boolean;
}

export interface Laboratory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  location: string;
  capacity?: number;
  workstations?: number;
  inCharge?: string;
  inChargeEmail?: string;
  labType: string;
  equipment: { name: string; quantity?: number; specification?: string }[];
  softwareInstalled: string[];
  facilities: string[];
  images: { url: string; caption?: string; isCover?: boolean }[];
  isActive: boolean;
  isFeatured: boolean;
}

export type Curriculum = Record<number, Course[]>;

// ─── API helpers ──────────────────────────────────────────────────────────────
export const academicsApi = {
  // Programs
  getPrograms:        () => apiClient.get<Program[]>(`${BASE}/programs`, { revalidate: 3600, tags: ['programs'] }),
  getProgramByDegree: (d: string) => apiClient.get<Program>(`${BASE}/programs/${d}`, { revalidate: 3600, tags: [`program-${d}`] }),

  // Courses
  getCourses:     (degree?: string, semester?: number) =>
    apiClient.get<Course[]>(`${BASE}/courses${degree ? `?degree=${degree}${semester ? `&semester=${semester}` : ''}` : ''}`, { revalidate: 3600, tags: ['courses'] }),
  getCurriculum:  (degree: string) =>
    apiClient.get<Curriculum>(`${BASE}/courses/curriculum/${degree}`, { revalidate: 3600, tags: [`curriculum-${degree}`] }),
  getCourseByCode: (code: string) =>
    apiClient.get<Course>(`${BASE}/courses/code/${code}`, { revalidate: 3600 }),

  // Resources
  getResources: (type?: string, degree?: string) =>
    apiClient.get<AcademicResource[]>(
      `${BASE}/resources${type ? `?type=${type}${degree ? `&degree=${degree}` : ''}` : ''}`,
      { revalidate: 300, tags: ['resources'] },
    ),

  // Labs
  getLabs:      () => apiClient.get<Laboratory[]>(`${BASE}/labs`, { revalidate: 3600, tags: ['labs'] }),
  getLabBySlug: (slug: string) => apiClient.get<Laboratory>(`${BASE}/labs/${slug}`, { revalidate: 3600, tags: [`lab-${slug}`] }),
};
