import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClubDocument = HydratedDocument<Club>;

@Schema({ timestamps: true, collection: 'clubs' })
export class Club {
  @Prop({ required: true, trim: true })
  name: string;                // "Programming Club"

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ trim: true })
  shortDescription: string;

  @Prop({ trim: true })
  logo: string;                // URL

  @Prop({ trim: true })
  coverImage: string;          // URL

  @Prop({ trim: true })
  founderName: string;

  @Prop({ trim: true })
  presidentName: string;

  @Prop({ trim: true })
  advisorName: string;         // faculty advisor

  @Prop({ required: true })
  foundedYear: number;

  @Prop({ type: [String], default: [] })
  activities: string[];

  @Prop({ trim: true })
  email: string;

  @Prop({ trim: true })
  websiteUrl: string;

  @Prop({ trim: true })
  facebookUrl: string;

  @Prop({ default: 0 })
  memberCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
// slug unique index is already enforced by `unique: true` on the @Prop above
ClubSchema.index({ isActive: 1, sortOrder: 1 });
ClubSchema.index({ name: 'text', description: 'text' });
