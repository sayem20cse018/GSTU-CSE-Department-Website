import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type ResearchProjectDocument = HydratedDocument<ResearchProject>;

// ─── Sub-schema: Publication ──────────────────────────────────────────────────
@Schema({ _id: false })
class ResearchPublication {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true, trim: true })
  venue: string;              // journal / conference name

  @Prop({ required: true, min: 1990 })
  year: number;

  @Prop({
    enum: { values: ['journal', 'conference', 'book_chapter', 'patent', 'thesis'], message: 'Invalid type' },
    default: 'journal',
  })
  type: string;

  @Prop({ trim: true })
  doi: string;

  @Prop({ trim: true })
  url: string;

  @Prop({ min: 0, default: 0 })
  citationCount: number;
}

// ─── Sub-schema: Team Member ─────────────────────────────────────────────────
@Schema({ _id: false })
class TeamMember {
  @Prop({ type: Types.ObjectId, ref: 'Faculty' })
  facultyId: Types.ObjectId;  // optional reference to Faculty collection

  @Prop({ required: true, trim: true })
  name: string;               // denormalized for display

  @Prop({
    required: true,
    enum: {
      values: ['principal_investigator', 'co_investigator', 'researcher',
               'phd_student', 'masters_student', 'undergraduate'],
      message: 'Invalid role',
    },
  })
  role: string;

  @Prop({ trim: true })
  affiliation: string;        // for external collaborators
}

// ─── Sub-schema: Funding ─────────────────────────────────────────────────────
@Schema({ _id: false })
class Funding {
  @Prop({ required: true, trim: true })
  agency: string;             // e.g. "ICT Division, Bangladesh", "NSF"

  @Prop({ trim: true })
  grantNumber: string;

  @Prop({ min: 0 })
  amount: number;

  @Prop({ trim: true })
  currency: string;           // e.g. "BDT", "USD"

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;
}

// ─── Sub-schema: Milestone ────────────────────────────────────────────────────
@Schema({ _id: false })
class Milestone {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true })
  targetDate: Date;

  @Prop()
  completedDate: Date;

  @Prop({
    enum: { values: ['pending', 'in_progress', 'completed', 'delayed'], message: 'Invalid status' },
    default: 'pending',
  })
  status: string;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,
  collection: 'research_projects',
})
export class ResearchProject {
  // ── Identity ────────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [400, 'Title cannot exceed 400 characters'],
  })
  title: string;

  @Prop({
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9\-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'],
  })
  slug: string;

  // ── Description ──────────────────────────────────────────────────────────────
  @Prop({ required: [true, 'Abstract is required'], minlength: [50, 'Abstract too short'] })
  abstract: string;

  @Prop()
  fullDescription: string;    // detailed research description

  @Prop({ trim: true })
  coverImage: string;

  // ── Classification ────────────────────────────────────────────────────────────
  @Prop({
    required: true,
    enum: {
      values: [
        'machine_learning',
        'artificial_intelligence',
        'computer_vision',
        'nlp',
        'cybersecurity',
        'networking',
        'software_engineering',
        'bioinformatics',
        'iot',
        'blockchain',
        'hci',
        'database_systems',
        'theory',
        'other',
      ],
      message: 'Invalid research area',
    },
    default: 'other',
  })
  researchArea: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  // ── Status & Timeline ────────────────────────────────────────────────────────
  @Prop({
    required: true,
    enum: {
      values: ['proposed', 'active', 'completed', 'suspended', 'transferred'],
      message: 'Invalid project status',
    },
    default: 'proposed',
  })
  status: string;

  @Prop({ required: [true, 'Start date is required'] })
  startDate: Date;

  @Prop()
  expectedEndDate: Date;

  @Prop()
  actualEndDate: Date;

  // ── Team ─────────────────────────────────────────────────────────────────────
  @Prop({ type: [SchemaFactory.createForClass(TeamMember)], default: [] })
  team: TeamMember[];

  // ── Funding ──────────────────────────────────────────────────────────────────
  @Prop({ type: [SchemaFactory.createForClass(Funding)], default: [] })
  funding: Funding[];

  @Prop({ default: false })
  isFunded: boolean;

  // ── Outputs ──────────────────────────────────────────────────────────────────
  @Prop({ type: [SchemaFactory.createForClass(ResearchPublication)], default: [] })
  publications: ResearchPublication[];

  @Prop({ type: [String], default: [] })
  outcomes: string[];         // e.g. "Deployed system at X hospital"

  @Prop({ type: [String], default: [] })
  datasets: string[];         // publicly released dataset URLs

  @Prop({ type: [String], default: [] })
  codeRepositories: string[]; // GitHub / GitLab links

  // ── Milestones ────────────────────────────────────────────────────────────────
  @Prop({ type: [SchemaFactory.createForClass(Milestone)], default: [] })
  milestones: Milestone[];

  // ── Visibility ────────────────────────────────────────────────────────────────
  @Prop({ default: false })
  isPublished: boolean;       // visible on public research page

  @Prop({ default: false })
  isFeatured: boolean;        // highlighted on homepage

  // ── Analytics ─────────────────────────────────────────────────────────────────
  @Prop({ default: 0, min: 0 })
  viewCount: number;
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const ResearchProjectSchema = SchemaFactory.createForClass(ResearchProject);

ResearchProjectSchema.index({ title: 'text', abstract: 'text', keywords: 'text' });
ResearchProjectSchema.index({ slug: 1 }, { unique: true });
ResearchProjectSchema.index({ status: 1, isPublished: 1 });
ResearchProjectSchema.index({ researchArea: 1 });
ResearchProjectSchema.index({ isFeatured: 1, isPublished: 1 });
ResearchProjectSchema.index({ 'team.facultyId': 1 });           // find projects by faculty
