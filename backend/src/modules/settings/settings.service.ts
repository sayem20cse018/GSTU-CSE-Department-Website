import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IsOptional, IsString, IsNumber, MaxLength,
} from 'class-validator';
import { Settings, SettingsDocument } from './schemas/settings.schema';

export class UpdateSettingsDto {
  @IsOptional() @IsString() @MaxLength(200)
  deptName?: string;

  @IsOptional() @IsString() @MaxLength(50)
  deptShortName?: string;

  @IsOptional() @IsString() @MaxLength(200)
  universityName?: string;

  @IsOptional() @IsString() @MaxLength(50)
  universityShortName?: string;

  @IsOptional() @IsString() @MaxLength(300)
  tagline?: string;

  // Logo fields — base64 can be large, use generous limit
  @IsOptional() @IsString() @MaxLength(5_000_000)
  deptLogo?: string;

  @IsOptional() @IsString() @MaxLength(5_000_000)
  universityLogo?: string;

  @IsOptional() @IsString() @MaxLength(200)
  email?: string;

  @IsOptional() @IsString() @MaxLength(50)
  phone?: string;

  @IsOptional() @IsString() @MaxLength(500)
  address?: string;

  @IsOptional() @IsString() @MaxLength(300)
  moodleUrl?: string;

  @IsOptional() @IsString() @MaxLength(300)
  facebookUrl?: string;

  @IsOptional() @IsString() @MaxLength(300)
  twitterUrl?: string;

  @IsOptional() @IsString() @MaxLength(300)
  linkedinUrl?: string;

  @IsOptional() @IsString() @MaxLength(300)
  youtubeUrl?: string;

  @IsOptional() @IsNumber()
  foundedYear?: number;

  @IsOptional() @IsString() @MaxLength(500)
  footerText?: string;

  // About section
  @IsOptional() @IsString() @MaxLength(3000)
  aboutIntro?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  aboutVision?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  aboutMission?: string;

  @IsOptional() @IsString() @MaxLength(5000)
  aboutHistory?: string;

  // Chairman
  @IsOptional() @IsString() @MaxLength(200)
  chairmanName?: string;

  @IsOptional() @IsString() @MaxLength(200)
  chairmanTitle?: string;

  @IsOptional() @IsString() @MaxLength(5_000_000)
  chairmanPhoto?: string;

  @IsOptional() @IsString() @MaxLength(200)
  chairmanEmail?: string;

  @IsOptional() @IsString() @MaxLength(200)
  chairmanEmail2?: string;

  @IsOptional() @IsString() @MaxLength(10000)
  chairmanMessage?: string;

  // About section images (shown in the photo grid on homepage About section)
  @IsOptional() @IsString() @MaxLength(5_000_000)
  aboutImage1?: string;

  @IsOptional() @IsString() @MaxLength(5_000_000)
  aboutImage2?: string;

  @IsOptional() @IsString() @MaxLength(5_000_000)
  aboutImage3?: string;

  @IsOptional() @IsString() @MaxLength(5_000_000)
  aboutImage4?: string;

  // Nav control
  @IsOptional() @IsArray() @IsString({ each: true })
  hiddenNavItems?: string[];
}

const SINGLETON_KEY = 'site_settings';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly model: Model<SettingsDocument>,
  ) {}

  /** Get the single settings document. Creates it with defaults if missing. */
  async get(): Promise<Settings> {
    let doc = await this.model.findOne({ key: SINGLETON_KEY }).lean();
    if (!doc) {
      doc = await this.model.create({ key: SINGLETON_KEY });
      return doc as Settings;
    }
    return doc as Settings;
  }

  /** Patch the single settings document */
  async update(dto: UpdateSettingsDto): Promise<Settings> {
    const doc = await this.model.findOneAndUpdate(
      { key: SINGLETON_KEY },
      { $set: dto },
      { new: true, upsert: true },
    ).lean();
    return doc as Settings;
  }
}
