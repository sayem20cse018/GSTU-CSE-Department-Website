/**
 * Faculty DTO — all fields optional, no validation.
 * The service handles all data processing.
 * Frontend is responsible for user-facing validation.
 */
export class CreateFacultyDto {
  name?: string;
  title?: string;
  designation?: string;
  email?: string;
  phone?: string;
  photo?: string;
  researchInterests?: string[];
  education?: object[];
  isActive?: boolean;
  sortOrder?: number;
  staffType?: string;
  shortBio?: string;
  fullBio?: string;
  officeRoom?: string;
  googleScholarUrl?: string;
  linkedinUrl?: string;
  researchGateUrl?: string;
  orcidId?: string;
  websiteUrl?: string;
  joinedAt?: string;
  employmentStatus?: string;
  courses?: string[];
}
