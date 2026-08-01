import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type FacultyDocument = HydratedDocument<Faculty>;

// ─── Sub-schema: Education ────────────────────────────────────────────────────
@Schema({ _id: false })
class Education {
  @Prop({ required: true, trim: true })
  degree: string;             // e.g. "Ph.D. in Computer Science"

  @Prop({ required: true, trim: true })
  institution: string;        // e.g. "MIT, USA"

  @Prop({
    required: true,
    min: [1950, 'Year seems too early'],
    max: [new Date().getFullYear(), 'Year cannot be in the future'],
  })
  year: number;
}

// ─── Sub-schema: Publication ──────────────────────────────────────────────────
@Schema({ _id: false })
class Publication {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  authors: string;            // comma-separated author list

  @Prop({ required: true, trim: true })
  venue: string;              // journal or conference name

  @Prop({
    required: true,
    min: [1990, 'Year seems too early'],
    max: [new Date().getFullYear() + 1, 'Year cannot be too far in the future'],
  })
  year: number;

  @Prop({
    enum: {
      values: ['journal', 'conference', 'book_chapter', 'thesis', 'patent'],
      message: 'Invalid publication type',
    },
    default: 'journal',
  })
  type: string;

  @Prop({ trim: true })
  doi: string;                // Digital Object Identifier

  @Prop({ trim: true })
  url: string;
}

// ─── Sub-schema: Award ────────────────────────────────────────────────────────
@Schema({ _id: false })
class Award {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  awardedBy: string;

  @Prop({ required: true })
  year: number;

  @Prop({ trim: true })
  description: string;
}

// ─── Sub-schema: Office Hours ─────────────────────────────────────────────────
@Schema({ _id: false })
class OfficeHours {
  @Prop({
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  })
  day: string;

  @Prop({ required: true })   // e.g. "10:00 AM"
  startTime: string;

  @Prop({ required: true })   // e.g. "12:00 PM"
  endTime: string;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,
  collection: 'faculty',
})
export class Faculty {
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

  @Prop({
    trim: true,
    match: [/^(\+?[\d\s\-().]{7,20})$/, 'Please enter a valid phone number'],
  })
  phone: string;

  @Prop({ trim: true })
  photo: string;              // URL to uploaded image (Cloudinary / S3)

  // ── Academic Identity ────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Designation is required'],
    enum: {
      values: [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer',
        'Senior Lecturer',
        'Adjunct Faculty',
        'Visiting Professor',
      ],
      message: 'Invalid designation',
    },
  })
  designation: string;

  @Prop({ trim: true })
  title: string;              // e.g. "Dr.", "Prof.", "Engr."

  @Prop({ trim: true })
  shortBio: string;           // 1–2 sentence bio shown on cards

  @Prop({ trim: true })
  fullBio: string;            // detailed bio for profile page

  @Prop({
    trim: true,
    match: [/^[a-z0-9\-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'],
    unique: true,
    sparse: true,             // allows multiple nulls (for faculty without a slug yet)
  })
  slug: string;               // URL-friendly: /faculty/dr-john-doe

  // ── Room & Office ────────────────────────────────────────────────────────────
  @Prop({ trim: true })
  officeRoom: string;         // e.g. "Room 302, CSE Building"

  @Prop({ type: [SchemaFactory.createForClass(OfficeHours)], default: [] })
  officeHours: OfficeHours[];

  // ── Academic Details ─────────────────────────────────────────────────────────
  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (arr: string[]) => arr.length <= 10,
      message: 'Maximum 10 research interests allowed',
    },
  })
  researchInterests: string[];

  @Prop({ type: [SchemaFactory.createForClass(Education)], default: [] })
  education: Education[];

  @Prop({ type: [SchemaFactory.createForClass(Publication)], default: [] })
  publications: Publication[];

  @Prop({ type: [SchemaFactory.createForClass(Award)], default: [] })
  awards: Award[];

  @Prop({ type: [String], default: [] })
  courses: string[];          // course codes/names currently teaching

  // ── Online Presence ───────────────────────────────────────────────────────────
  @Prop({ trim: true })
  websiteUrl: string;

  @Prop({ trim: true })
  googleScholarUrl: string;

  @Prop({ trim: true })
  linkedinUrl: string;

  @Prop({ trim: true })
  researchGateUrl: string;

  @Prop({ trim: true })
  orcidId: string;            // e.g. "0000-0001-2345-6789"

  // ── Status & Ordering ────────────────────────────────────────────────────────
  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    enum: { values: ['full_time', 'part_time', 'on_leave', 'retired'], message: 'Invalid status' },
    default: 'full_time',
  })
  employmentStatus: string;

  @Prop({ default: 0 })
  sortOrder: number;          // lower number = shown first

  @Prop()
  joinedAt: Date;             // date joined the department
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const FacultySchema = SchemaFactory.createForClass(Faculty);

// Full-text search
FacultySchema.index({ name: 'text', shortBio: 'text', researchInterests: 'text' });
// Query patterns
FacultySchema.index({ designation: 1, isActive: 1 });
FacultySchema.index({ slug: 1 });
FacultySchema.index({ sortOrder: 1 });
FacultySchema.index({ employmentStatus: 1 });
