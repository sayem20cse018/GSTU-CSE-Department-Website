import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type NewsDocument = HydratedDocument<News>;

// ─── Sub-schema: SEO Meta ─────────────────────────────────────────────────────
@Schema({ _id: false })
class SeoMeta {
  @Prop({ trim: true, maxlength: [70, 'Meta title max 70 chars'] })
  metaTitle: string;

  @Prop({ trim: true, maxlength: [160, 'Meta description max 160 chars'] })
  metaDescription: string;

  @Prop({ trim: true })
  ogImage: string;            // Open Graph image for social sharing
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,
  collection: 'news',
})
export class News {
  // ── Content ──────────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [300, 'Title cannot exceed 300 characters'],
  })
  title: string;

  @Prop({
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9\-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'],
  })
  slug: string;               // URL: /news/cse-team-wins-national-hackathon

  @Prop({
    required: [true, 'Excerpt is required'],
    trim: true,
    minlength: [10, 'Excerpt must be at least 10 characters'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
  })
  excerpt: string;            // shown on listing cards

  @Prop({
    required: [true, 'Content is required'],
    minlength: [20, 'Content must be at least 20 characters'],
  })
  content: string;            // rich HTML content (from WYSIWYG editor)

  @Prop({ trim: true })
  coverImage: string;         // featured image URL

  // ── Classification ────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Category is required'],
    enum: {
      values: [
        'achievement',        // student/faculty achievements
        'research',           // research publications, breakthroughs
        'event',              // post-event coverage
        'announcement',       // department announcements
        'award',              // awards won
        'collaboration',      // industry/academic partnerships
        'general',
      ],
      message: 'Invalid category',
    },
    default: 'general',
  })
  category: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (arr: string[]) => arr.length <= 10,
      message: 'Maximum 10 tags allowed',
    },
  })
  tags: string[];

  // ── Author ────────────────────────────────────────────────────────────────────
  @Prop({
    type: Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Author is required'],
  })
  author: Types.ObjectId;

  @Prop({ required: true, trim: true })
  authorName: string;         // denormalized display name

  // ── Status & Dates ────────────────────────────────────────────────────────────
  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;        // shown in homepage hero section

  @Prop()
  publishedAt: Date;          // set when isPublished → true

  // ── SEO ───────────────────────────────────────────────────────────────────────
  @Prop({ type: SchemaFactory.createForClass(SeoMeta), default: {} })
  seo: SeoMeta;

  // ── Analytics ─────────────────────────────────────────────────────────────────
  @Prop({ default: 0, min: 0 })
  viewCount: number;

  @Prop({ type: [String], default: [] })
  relatedNewsIds: string[];   // ObjectId strings for related articles
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
// slug unique index is already enforced by `unique: true` on the @Prop above
NewsSchema.index({ isPublished: 1, publishedAt: -1 });
NewsSchema.index({ isFeatured: 1, isPublished: 1 });
NewsSchema.index({ category: 1, isPublished: 1 });
NewsSchema.index({ tags: 1 });
