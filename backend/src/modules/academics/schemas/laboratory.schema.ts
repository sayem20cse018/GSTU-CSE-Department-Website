import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LaboratoryDocument = HydratedDocument<Laboratory>;

@Schema({ _id: false })
class Equipment {
  @Prop({ required: true }) name: string;
  @Prop({ min: 0 })         quantity: number;
  @Prop()                   specification: string;
}

@Schema({ _id: false })
class LabImage {
  @Prop({ required: true }) url: string;
  @Prop()                   caption: string;
  @Prop({ default: false }) isCover: boolean;
}

@Schema({ _id: false })
class LabSchedule {
  @Prop({ required: true, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] })
  day: string;
  @Prop({ required: true }) startTime: string;
  @Prop({ required: true }) endTime: string;
  @Prop()                   courseCode: string;
  @Prop()                   group: string;    // "Group A", "Group B"
}

@Schema({ timestamps: true, collection: 'laboratories' })
export class Laboratory {
  @Prop({ required: true, trim: true })
  name: string;                   // "Artificial Intelligence Lab"

  @Prop({ required: true, unique: true, trim: true })
  slug: string;                   // "ai-lab"

  @Prop({ required: true })
  description: string;

  @Prop({ trim: true })
  shortDescription: string;

  @Prop({ required: true, trim: true })
  location: string;               // "Room 302, CSE Building"

  @Prop({ min: 0 })
  capacity: number;               // number of students at once

  @Prop({ min: 0 })
  workstations: number;

  @Prop({ trim: true })
  inCharge: string;               // faculty name

  @Prop({ trim: true })
  inChargeEmail: string;

  @Prop({
    enum: { values: ['teaching','research','both'], message: 'Invalid lab type' },
    default: 'both',
  })
  labType: string;

  @Prop({ type: [SchemaFactory.createForClass(Equipment)], default: [] })
  equipment: Equipment[];

  @Prop({ type: [String], default: [] })
  softwareInstalled: string[];

  @Prop({ type: [String], default: [] })
  facilities: string[];           // "24/7 Power backup", "AC", "High-speed Internet"

  @Prop({ type: [SchemaFactory.createForClass(LabImage)], default: [] })
  images: LabImage[];

  @Prop({ type: [SchemaFactory.createForClass(LabSchedule)], default: [] })
  schedule: LabSchedule[];

  @Prop({ default: true })  isActive: boolean;
  @Prop({ default: false }) isFeatured: boolean;
  @Prop({ default: 0 })     sortOrder: number;
}

export const LaboratorySchema = SchemaFactory.createForClass(Laboratory);
// slug unique index is already enforced by `unique: true` on the @Prop above
LaboratorySchema.index({ isActive: 1, sortOrder: 1 });
LaboratorySchema.index({ name: 'text', description: 'text' });
