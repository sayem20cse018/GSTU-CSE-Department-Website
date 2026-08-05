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

  // Logo fields accept either a URL or a base64 data URL — no @IsUrl() here
  @IsOptional() @IsString() @MaxLength(2_000_000)
  deptLogo?: string;

  @IsOptional() @IsString() @MaxLength(2_000_000)
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
