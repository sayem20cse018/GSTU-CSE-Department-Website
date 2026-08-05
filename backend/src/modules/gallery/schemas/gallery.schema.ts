import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type GalleryDocument = HydratedDocument<Gallery>;

// ─── Sub-schema: Media Item ───────────────────────────────────────────────────
@Schema({ _id: true })       // _id: true so each image has its own ID
class MediaItem {
  @Prop({ required: true })
  url: string;                // full-size image/video URL

  @Prop({ required: true })
  thumbnailUrl: string;       // compressed thumbnail for fast loading

  @Prop({
    required: true,
    enum: {
      values: ['image', 'video'],
      message: 'Media type must be image or video',
    },
    default: 'image',
  })
  mediaType: string;

  @Prop({ trim: true })
  caption: string;            // optional caption shown on lightbox

  @Prop({ trim: true })
  altText: string;            // accessibility alt text

  @Prop({
    enum: { values: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov'], message: 'Unsupported format' },
  })
  format: string;

  @Prop({ min: 0 })
  fileSizeBytes: number;

  @Prop({ min: 0 })
  width: number;

  @Prop({ min: 0 })
  height: number;

  @Prop({ default: 0 })
  sortOrder: number;          // controls display order within album

  @Prop({ default: Date.now })
  uploadedAt: Date;
}
const MediaItemSchema = SchemaFactory.createForClass(MediaItem);

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,
  collection: 'galleries',
})
export class Gallery {
  // ── Identity ────────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Album title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  })
  title: string;              // e.g. "CSE Fest 2024", "Convocation Ceremony"

  @Prop({
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9\-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'],
  })
  slug: string;

  @Prop({
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  })
  description: string;

  // ── Classification ────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Category is required'],
    enum: {
      values: [
        'event',              // photos from events (seminars, workshops)
        'lab',                // lab and research environment photos
        'student_life',       // extracurricular, cultural programs
        'faculty',            // faculty-related photos
        'infrastructure',     // building, classrooms, facilities
        'convocation',        // graduation ceremony
        'sports',             // sports events
        'competition',        // programming contest, hackathon
        'other',
      ],
      message: 'Invalid category',
    },
    default: 'event',
  })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // ── Cover ─────────────────────────────────────────────────────────────────────
  @Prop({ trim: true })
  coverImage: string;         // URL used as the album thumbnail on listing page

  // ── Media Items ───────────────────────────────────────────────────────────────
  @Prop({ type: [MediaItemSchema], default: [] })
  media: MediaItem[];

  @Prop({ default: 0, min: 0 })
  mediaCount: number;         // denormalized count for fast display

  // ── Event Link ────────────────────────────────────────────────────────────────
  @Prop({ type: Types.ObjectId, ref: 'Event' })
  relatedEvent: Types.ObjectId; // optional link to Events collection

  // ── Date ─────────────────────────────────────────────────────────────────────
  @Prop({ required: [true, 'Album date is required'] })
  albumDate: Date;            // date the photos were taken

  // ── Uploader ─────────────────────────────────────────────────────────────────
  @Prop({ type: Types.ObjectId, ref: 'Admin', required: [true, 'Uploader is required'] })
  uploadedBy: Types.ObjectId;

  @Prop({ trim: true })
  uploadedByName: string;     // denormalized

  // ── Status & Visibility ───────────────────────────────────────────────────────
  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;        // shown on homepage gallery section

  // ── Analytics ─────────────────────────────────────────────────────────────────
  @Prop({ default: 0, min: 0 })
  viewCount: number;
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const GallerySchema = SchemaFactory.createForClass(Gallery);

GallerySchema.index({ title: 'text', description: 'text', tags: 'text' });
// slug unique index is already enforced by `unique: true` on the @Prop above
GallerySchema.index({ isPublished: 1, albumDate: -1 });
GallerySchema.index({ isFeatured: 1, isPublished: 1 });
GallerySchema.index({ category: 1, isPublished: 1 });
GallerySchema.index({ relatedEvent: 1 });
