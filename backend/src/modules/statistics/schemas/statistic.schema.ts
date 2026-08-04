import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatisticDocument = HydratedDocument<Statistic>;

@Schema({ timestamps: true, collection: 'statistics' })
export class Statistic {
  @Prop({ required: true, trim: true })
  key: string;                 // e.g. "faculty_members"

  @Prop({ required: true, trim: true })
  label: string;               // e.g. "Faculty Members"

  @Prop({ required: true, trim: true })
  value: string;               // e.g. "14+"

  @Prop({ trim: true })
  icon: string;                // emoji or icon name

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isVisible: boolean;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
StatisticSchema.index({ key: 1 }, { unique: true });
StatisticSchema.index({ isVisible: 1, sortOrder: 1 });
