import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResearchGroupDocument = ResearchGroup & Document;

@Schema({ timestamps: true })
export class ResearchGroup {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) lead: string; // Faculty name or reference
  @Prop({ type: [String], default: [] }) members: string[];
  @Prop({
    type: [{
      title: String, description: String, fundingBody: String,
      status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
      startYear: Number, endYear: Number,
    }],
    default: [],
  })
  projects: object[];
}

export const ResearchGroupSchema = SchemaFactory.createForClass(ResearchGroup);
