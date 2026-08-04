import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AchievementDocument = HydratedDocument<Achievement>;

@Schema({ timestamps: true, collection: 'achievements' })
export class Achievement {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ trim: true })
  image: string;               // URL

  @Prop({
    required: true,
    enum: { values: ['student','faculty','department','research','competition','other'], message: 'Invalid type' },
    default: 'student',
  })
  type: string;

  @Prop({ required: true })
  achievedAt: Date;            // date of achievement

  @Prop({ trim: true })
  achieverName: string;        // who achieved it

  @Prop({ trim: true })
  awardedBy: string;           // organisation that gave it

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;         // shown on homepage

  @Prop({ default: 0 })
  sortOrder: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
AchievementSchema.index({ isPublished: 1, achievedAt: -1 });
AchievementSchema.index({ isFeatured: 1, isPublished: 1 });
AchievementSchema.index({ type: 1 });
AchievementSchema.index({ title: 'text', description: 'text' });
