import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AcademicResourceDocument = HydratedDocument<AcademicResource>;

@Schema({ _id: false })
class ResourceFile {
  @Prop({ required: true }) fileName: string;
  @Prop({ required: true }) fileUrl: string;
  @Prop({ enum: ['pdf','xlsx','doc','docx','jpg','png'], default: 'pdf' }) fileType: string;
  @Prop({ min: 0 }) fileSizeBytes: number;
  @Prop({ default: Date.now }) uploadedAt: Date;
}

@Schema({ timestamps: true, collection: 'academic_resources' })
export class AcademicResource {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({
    required: true,
    enum: {
      values: ['routine','calendar','exam_schedule','result','guideline','other'],
      message: 'Invalid resource type',
    },
  })
  type: string;

  @Prop({ trim: true })
  description: string;

  @Prop({
    enum: { values: ['BSc','MSc','PhD','all'], message: 'Invalid target' },
    default: 'all',
  })
  targetDegree: string;

  @Prop({ required: true })
  academicYear: string;           // e.g. "2024-25"

  @Prop({
    required: true,
    enum: { values: ['Spring','Summer','Fall','Annual'], message: 'Invalid semester/term' },
    default: 'Spring',
  })
  term: string;

  @Prop({ type: [SchemaFactory.createForClass(ResourceFile)], default: [] })
  files: ResourceFile[];

  @Prop({ default: false }) isPublished: boolean;
  @Prop({ default: false }) isPinned: boolean;
  @Prop({ default: 0 })     viewCount: number;
  @Prop({ default: 0 })     sortOrder: number;
}

export const AcademicResourceSchema = SchemaFactory.createForClass(AcademicResource);
AcademicResourceSchema.index({ type: 1, isPublished: 1 });
AcademicResourceSchema.index({ targetDegree: 1, academicYear: 1 });
AcademicResourceSchema.index({ title: 'text' });
