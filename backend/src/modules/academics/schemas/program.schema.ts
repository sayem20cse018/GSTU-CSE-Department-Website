import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgramDocument = Program & Document;

@Schema({ timestamps: true })
export class Program {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, enum: ['BSc', 'MSc', 'PhD'] }) degree: string;
  @Prop({ required: true }) duration: string;
  @Prop({ required: true }) totalCredits: number;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) eligibility: string;
  @Prop({
    type: [{
      code: String, title: String, credits: Number,
      semester: Number, type: { type: String, enum: ['core', 'elective'] },
    }],
    default: [],
  })
  curriculum: object[];
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
