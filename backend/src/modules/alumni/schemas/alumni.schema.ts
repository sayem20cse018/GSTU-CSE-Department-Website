import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type AlumniDocument = HydratedDocument<Alumni>;

// ─── Sub-schema: Work Experience ─────────────────────────────────────────────
@Schema({ _id: false })
class WorkExperience {
  @Prop({ required: true, trim: true })
  company: string;

  @Prop({ required: true, trim: true })
  position: string;

  @Prop({ required: true })
  startYear: number;

  @Prop()
  endYear: number;            // null = current position

  @Prop({ default: false })
  isCurrent: boolean;

  @Prop({ trim: true })
  location: string;           // city, country
}

// ─── Sub-schema: Higher Education ────────────────────────────────────────────
@Schema({ _id: false })
class HigherEducation {
  @Prop({ required: true, trim: true })
  degree: string;             // e.g. "M.Sc.", "Ph.D."

  @Prop({ required: true, trim: true })
  institution: string;

  @Prop({ trim: true })
  country: string;

  @Prop()
  year: number;

  @Prop({ default: false })
  isCurrent: boolean;
}

// ─── Sub-schema: Achievement ──────────────────────────────────────────────────
@Schema({ _id: false })
class Achievement {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  year: number;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,
  collection: 'alumni',
})
export class Alumni {
  // ── Personal Info ────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [150, 'Name cannot exceed 150 characters'],
  })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  })
  email: string;

  @Prop({ trim: true })
  photo: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ trim: true })
  currentCity: string;

  @Prop({ trim: true })
  currentCountry: string;

  // ── Academic Info (at this department) ────────────────────────────────────────
  @Prop({
    required: [true, 'Batch year is required'],
    min: [1980, 'Batch year too early'],
    max: [new Date().getFullYear(), 'Batch year cannot be in the future'],
  })
  batchYear: number;          // year of admission e.g. 2015

  @Prop({
    required: [true, 'Graduation year is required'],
    min: [1984, 'Graduation year too early'],
  })
  graduationYear: number;     // year of graduation e.g. 2019

  @Prop({
    required: [true, 'Degree is required'],
    enum: {
      values: ['BSc', 'MSc', 'PhD'],
      message: 'Degree must be BSc, MSc, or PhD',
    },
  })
  degree: string;

  @Prop({ trim: true })
  studentId: string;          // roll/registration number during study

  @Prop({ trim: true })
  cgpa: string;               // stored as string to accommodate formats like "3.75/4.00"

  // ── Professional Info ────────────────────────────────────────────────────────
  @Prop({ trim: true })
  currentDesignation: string; // e.g. "Senior Software Engineer"

  @Prop({ trim: true })
  currentOrganization: string;

  @Prop({
    enum: {
      values: [
        'software_engineering',
        'data_science_ml',
        'research_academia',
        'entrepreneurship',
        'government',
        'finance_fintech',
        'cybersecurity',
        'product_management',
        'consulting',
        'higher_education',
        'other',
      ],
      message: 'Invalid industry',
    },
    default: 'other',
  })
  industry: string;

  @Prop({ type: [SchemaFactory.createForClass(WorkExperience)], default: [] })
  workExperience: WorkExperience[];

  @Prop({ type: [SchemaFactory.createForClass(HigherEducation)], default: [] })
  higherEducation: HigherEducation[];

  @Prop({ type: [SchemaFactory.createForClass(Achievement)], default: [] })
  achievements: Achievement[];

  // ── Testimonial / Quote ──────────────────────────────────────────────────────
  @Prop({
    trim: true,
    maxlength: [1000, 'Testimonial cannot exceed 1000 characters'],
  })
  testimonial: string;        // shown on alumni section / homepage

  // ── Online Presence ───────────────────────────────────────────────────────────
  @Prop({ trim: true })
  linkedinUrl: string;

  @Prop({ trim: true })
  githubUrl: string;

  @Prop({ trim: true })
  websiteUrl: string;

  // ── Status & Visibility ───────────────────────────────────────────────────────
  @Prop({ default: false })
  isProfilePublic: boolean;   // alumni can choose to hide their profile

  @Prop({ default: false })
  isFeatured: boolean;        // shown on homepage "Notable Alumni" section

  @Prop({ default: false })
  isVerified: boolean;        // department has verified this alumni's details

  @Prop({
    default: 'pending',
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: 'Invalid approval status',
    },
  })
  approvalStatus: string;     // alumni submit profile, admin approves

  // ── Engagement ───────────────────────────────────────────────────────────────
  @Prop({ default: false })
  willingToMentor: boolean;

  @Prop({ default: false })
  willingToSpeak: boolean;    // willing to give seminars/talks

  @Prop({ trim: true })
  mentorshipTopics: string;   // what areas they can mentor in
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const AlumniSchema = SchemaFactory.createForClass(Alumni);

AlumniSchema.index({ name: 'text', currentOrganization: 'text', testimonial: 'text' });
AlumniSchema.index({ batchYear: 1, degree: 1 });
AlumniSchema.index({ graduationYear: 1 });
AlumniSchema.index({ approvalStatus: 1, isProfilePublic: 1 });
AlumniSchema.index({ isFeatured: 1, isVerified: 1 });
AlumniSchema.index({ industry: 1 });
AlumniSchema.index({ currentCountry: 1 });
