import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true, collection: 'settings' })
export class Settings {
  // ── Identity ─────────────────────────────────────────────────────────────
  @Prop({ required: true, default: 'site_settings' })
  key: string;                  // singleton — always "site_settings"

  @Prop({ default: 'Department of Computer Science & Engineering' })
  deptName: string;

  @Prop({ default: 'Dept. of CSE' })
  deptShortName: string;

  @Prop({ default: 'Gopalganj Science & Technology University' })
  universityName: string;

  @Prop({ default: 'GSTU' })
  universityShortName: string;

  @Prop({ default: 'Advancing Computing, Shaping the Future' })
  tagline: string;

  @Prop({ trim: true })
  deptLogo: string;             // URL to dept logo image

  @Prop({ trim: true })
  universityLogo: string;       // URL to university logo image

  // ── Contact ───────────────────────────────────────────────────────────────
  @Prop({ default: 'cse@gstu.edu.bd' })
  email: string;

  @Prop({ default: '+880-468-XXXXXX' })
  phone: string;

  @Prop({ default: 'CSE Building, GSTU Campus, Gopalganj-8100, Bangladesh' })
  address: string;

  @Prop({ default: 'https://moodle.gstu.edu.bd' })
  moodleUrl: string;

  // ── Social Links ──────────────────────────────────────────────────────────
  @Prop({ default: 'https://facebook.com/gstu.cse' })
  facebookUrl: string;

  @Prop({ default: '' })
  twitterUrl: string;

  @Prop({ default: '' })
  linkedinUrl: string;

  @Prop({ default: '' })
  youtubeUrl: string;

  // ── Footer ────────────────────────────────────────────────────────────────
  @Prop({ default: 2011 })
  foundedYear: number;

  @Prop({ default: '' })
  footerText: string;           // custom footer copyright text
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
SettingsSchema.index({ key: 1 }, { unique: true });
