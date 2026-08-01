import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProgramDocument = HydratedDocument<Program>;

@Schema({ _id: false })
class AdmissionRequirement {
  @Prop({ required: true }) label: string;   // e.g. "Minimum GPA"
  @Prop({ required: true }) value: string;   // e.g. "3.50 in SSC & HSC"
}

@Schema({ _id: false })
class CareerOpportunity {
  @Prop({ required: true }) title: string;
  @Prop() description: string;
}

@Schema({ timestamps: true, collection: 'programs' })
export class Program {
  @Prop({ required: true, trim: true })
  name: string;                   // "Bachelor of Science in Computer Science & Engineering"

  @Prop({ required: true, enum: { values: ['BSc','MSc','PhD'], message: 'Invalid degree' } })
  degree: string;

  @Prop({ required: true })
  duration: string;               // "4 Years"

  @Prop({ required: true, min: 0 })
  totalCredits: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  objectives: string;

  @Prop({ required: true })
  eligibility: string;

  @Prop({ type: [SchemaFactory.createForClass(AdmissionRequirement)], default: [] })
  admissionRequirements: AdmissionRequirement[];

  @Prop({ type: [SchemaFactory.createForClass(CareerOpportunity)], default: [] })
  careerOpportunities: CareerOpportunity[];

  @Prop({ type: [String], default: [] })
  highlights: string[];           // bullet points shown on overview

  @Prop({ type: [String], default: [] })
  learningOutcomes: string[];

  @Prop({ default: 0 })           totalSeats: number;
  @Prop({ trim: true })           tuitionFee: string;
  @Prop({ trim: true })           brochureUrl: string;  // PDF

  @Prop({ default: true })        isActive: boolean;
  @Prop({ default: 0 })           sortOrder: number;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
ProgramSchema.index({ degree: 1 });
