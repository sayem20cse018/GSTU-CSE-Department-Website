import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type NoticeDocument = HydratedDocument<Notice>;

// ─── Sub-schema: Attachment ───────────────────────────────────────────────────
@Schema({ _id: false })
class Attachment {
  @Prop({ required: true, trim: true })
  fileName: string;           // original file name

  @Prop({ required: true })
  fileUrl: string;            // hosted URL (S3 / Cloudinary)

  @Prop({
    required: true,
    enum: {
      values: ['pdf', 'doc', 'docx', 'jpg', 'png', 'xlsx'],
      message: 'File type not allowed',
    },
  })
  fileType: string;

  @Prop({ min: 0 })
  fileSizeBytes: number;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,
  collection: 'notices',
})
export class Notice {
  // ── Content ──────────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Notice title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [250, 'Title cannot exceed 250 characters'],
  })
  title: string;

  @Prop({ trim: true })
  description: string;        // optional longer description / body

  // ── Classification ────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Category is required'],
    enum: {
      values: [
        'academic',           // exam schedules, class cancellations
        'admission',          // admission test, result
        'scholarship',        // scholarship deadlines
        'administrative',     // office notices
        'workshop_seminar',   // upcoming workshops
        'result',             // exam results
        'recruitment',        // faculty/staff job postings
        'general',
      ],
      message: 'Invalid category',
    },
    default: 'general',
  })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // ── Targeting ─────────────────────────────────────────────────────────────────
  @Prop({
    type: [String],
    enum: {
      values: ['all', 'undergraduate', 'graduate', 'phd', 'faculty', 'staff'],
      message: 'Invalid audience',
    },
    default: ['all'],
  })
  targetAudience: string[];   // who should see this notice

  // ── Dates ─────────────────────────────────────────────────────────────────────
  @Prop({ default: Date.now })
  publishedAt: Date;

  @Prop()
  expiresAt: Date;            // auto-hide after this date (null = no expiry)

  // ── Attachments ───────────────────────────────────────────────────────────────
  @Prop({ type: [SchemaFactory.createForClass(Attachment)], default: [] })
  attachments: Attachment[];

  // ── Status & Visibility ───────────────────────────────────────────────────────
  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isPinned: boolean;          // pinned notices appear at the top

  @Prop({ default: false })
  isUrgent: boolean;          // shows red "URGENT" badge

  // ── Author ────────────────────────────────────────────────────────────────────
  @Prop({
    type: Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Author is required'],
  })
  postedBy: Types.ObjectId;   // references Admin

  @Prop({ trim: true })
  postedByName: string;       // denormalized for display (avoids extra query)

  // ── Analytics ─────────────────────────────────────────────────────────────────
  @Prop({ default: 0, min: 0 })
  viewCount: number;
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const NoticeSchema = SchemaFactory.createForClass(Notice);

NoticeSchema.index({ title: 'text', description: 'text' });
NoticeSchema.index({ isPublished: 1, isPinned: -1, publishedAt: -1 }); // main listing query
NoticeSchema.index({ category: 1, isPublished: 1 });
NoticeSchema.index({ targetAudience: 1 });
NoticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });       // TTL auto-delete
