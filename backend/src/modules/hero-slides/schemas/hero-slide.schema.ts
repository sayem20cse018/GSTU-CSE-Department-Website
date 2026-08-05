import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HeroSlideDocument = HydratedDocument<HeroSlide>;

@Schema({ timestamps: true, collection: 'hero_slides' })
export class HeroSlide {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  subtitle: string;

  @Prop({ trim: true, default: '' })
  tag: string;

  @Prop({ trim: true, default: '' })
  imageUrl: string;

  @Prop({ default: 60, min: 0, max: 100 })
  overlayOpacity: number;

  @Prop({ trim: true, default: '' })
  primaryBtnLabel: string;

  @Prop({ trim: true, default: '' })
  primaryBtnHref: string;

  @Prop({ trim: true, default: '' })
  secondaryBtnLabel: string;

  @Prop({ trim: true, default: '' })
  secondaryBtnHref: string;

  @Prop({ enum: ['left', 'center'], default: 'left' })
  align: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const HeroSlideSchema = SchemaFactory.createForClass(HeroSlide);
HeroSlideSchema.index({ isActive: 1, sortOrder: 1 });
