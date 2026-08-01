import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ _id: false })
class WeeklySchedule {
  @Prop({ required: true, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] })
  day: string;
  @Prop({ required: true }) startTime: string;   // e.g. "9:00 AM"
  @Prop({ required: true }) endTime: string;
  @Prop() room: string;
}

@Schema({ timestamps: true, collection: 'courses' })
export class Course {
  @Prop({ required: true, trim: true, uppercase: true, unique: true })
  code: string;                   // e.g. "CSE-301"

  @Prop({ required: true, trim: true })
  title: string;                  // e.g. "Data Structures & Algorithms"

  @Prop({ required: true, min: 0, max: 6 })
  credits: number;

  @Prop({ required: true, min: 1, max: 12 })
  semester: number;               // 1–8 for BSc, 1–4 for MSc

  @Prop({ required: true, enum: { values: ['BSc','MSc','PhD'], message: 'Invalid degree' } })
  degree: string;

  @Prop({ required: true, enum: { values: ['core','elective','lab','sessional'], message: 'Invalid type' } })
  type: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  objectives: string;

  @Prop({ type: [String], default: [] })
  prerequisites: string[];        // course codes

  @Prop({ type: [String], default: [] })
  learningOutcomes: string[];

  @Prop({ type: [String], default: [] })
  topics: string[];               // major topics covered

  @Prop()
  syllabusUrl: string;            // PDF URL

  @Prop({ trim: true })
  teacherName: string;            // denormalized

  @Prop({ type: [SchemaFactory.createForClass(WeeklySchedule)], default: [] })
  schedule: WeeklySchedule[];

  @Prop({ default: 0 }) theoryHours: number;
  @Prop({ default: 0 }) labHours: number;

  @Prop({ default: true }) isActive: boolean;
  @Prop({ default: 0 })    sortOrder: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
CourseSchema.index({ code: 1 }, { unique: true });
CourseSchema.index({ degree: 1, semester: 1 });
CourseSchema.index({ type: 1 });
CourseSchema.index({ title: 'text', description: 'text' });
