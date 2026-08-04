import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './schemas/settings.schema';

export class UpdateSettingsDto {
  deptName?: string;
  deptShortName?: string;
  universityName?: string;
  universityShortName?: string;
  tagline?: string;
  deptLogo?: string;
  universityLogo?: string;
  email?: string;
  phone?: string;
  address?: string;
  moodleUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  foundedYear?: number;
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
