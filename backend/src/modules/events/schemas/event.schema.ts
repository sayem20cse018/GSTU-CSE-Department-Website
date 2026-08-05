import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ─── Type ─────────────────────────────────────────────────────────────────────
export type EventDocument = HydratedDocument<Event>;

// ─── Sub-schema: Speaker ──────────────────────────────────────────────────────
@Schema({ _id: false })
class Speaker {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  title: string;              // e.g. "PhD Researcher, MIT"

  @Prop({ trim: true })
  organization: string;

  @Prop({ trim: true })
  photo: string;

  @Prop({ trim: true })
  bio: string;
}

// ─── Sub-schema: Registration Config ──────────────────────────────────────────
@Schema({ _id: false })
class RegistrationConfig {
  @Prop({ default: false })
  isRequired: boolean;        // does the event need prior registration?

  @Prop({ trim: true })
  formUrl: string;            // external Google Form or internal URL

  @Prop()
  deadline: Date;             // registration closes at this date/time

  @Prop({ min: 0 })
  maxSeats: number;           // 0 = unlimited

  @Prop({ default: 0, min: 0 })
  registeredCount: number;
}

// ─── Sub-schema: Schedule Item ────────────────────────────────────────────────
@Schema({ _id: false })
class ScheduleItem {
  @Prop({ required: true })
  time: string;               // e.g. "9:00 AM – 10:00 AM"

  @Prop({ required: true, trim: true })
  activity: string;           // e.g. "Opening Remarks"

  @Prop({ trim: true })
  speaker: string;            // optional speaker for this slot
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
@Schema({
  timestamps: true,
  collection: 'events',
})
export class Event {
  // ── Content ──────────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Event title is required'],
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
  slug: string;

  @Prop({
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
  })
  description: string;        // full rich text description

  @Prop({ trim: true })
  shortDescription: string;   // used on listing cards (max ~200 chars)

  @Prop({ trim: true })
  coverImage: string;         // banner/thumbnail URL

  // ── Classification ────────────────────────────────────────────────────────────
  @Prop({
    required: [true, 'Event type is required'],
    enum: {
      values: [
        'seminar',
        'workshop',
        'conference',
        'hackathon',
        'competition',
        'cultural',
        'webinar',
        'orientation',
        'convocation',
        'other',
      ],
      message: 'Invalid event type',
    },
    default: 'seminar',
  })
  type: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // ── Date & Venue ──────────────────────────────────────────────────────────────
  @Prop({ required: [true, 'Start date is required'] })
  startDate: Date;

  @Prop({
    validate: {
      validator: function (this: Event, val: Date) {
        return !val || val >= this.startDate;
      },
      message: 'End date must be on or after start date',
    },
  })
  endDate: Date;

  @Prop({ required: [true, 'Venue is required'], trim: true })
  venue: string;              // e.g. "Seminar Hall, CSE Building"

  @Prop({ trim: true })
  venueMapUrl: string;        // Google Maps embed / link

  @Prop({
    enum: { values: ['in_person', 'online', 'hybrid'], message: 'Invalid mode' },
    default: 'in_person',
  })
  mode: string;

  @Prop({ trim: true })
  onlineLink: string;         // Zoom / Meet link for online/hybrid events

  // ── Speakers & Schedule ───────────────────────────────────────────────────────
  @Prop({ type: [SchemaFactory.createForClass(Speaker)], default: [] })
  speakers: Speaker[];

  @Prop({ type: [SchemaFactory.createForClass(ScheduleItem)], default: [] })
  schedule: ScheduleItem[];

  // ── Registration ─────────────────────────────────────────────────────────────
  @Prop({ type: SchemaFactory.createForClass(RegistrationConfig), default: {} })
  registration: RegistrationConfig;

  // ── Organizer ────────────────────────────────────────────────────────────────
  @Prop({
    type: Types.ObjectId,
    ref: 'Admin',
  })
  organizer: Types.ObjectId;

  @Prop({ trim: true })
  organizerName: string;      // denormalized

  @Prop({ trim: true })
  organizerContact: string;   // email or phone for queries

  // ── Status & Visibility ───────────────────────────────────────────────────────
  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;        // shown on homepage events section

  @Prop({
    enum: {
      values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      message: 'Invalid event status',
    },
    default: 'upcoming',
  })
  status: string;

  // ── Analytics ─────────────────────────────────────────────────────────────────
  @Prop({ default: 0, min: 0 })
  viewCount: number;

  @Prop({ type: [String], default: [] })
  galleryImages: string[];    // post-event photo URLs
}

// ─── Schema & Indexes ─────────────────────────────────────────────────────────
export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ title: 'text', description: 'text' });
// slug unique index is already enforced by `unique: true` on the @Prop above
EventSchema.index({ isPublished: 1, startDate: 1 });
EventSchema.index({ isFeatured: 1, isPublished: 1 });
EventSchema.index({ status: 1, isPublished: 1 });
EventSchema.index({ type: 1 });
