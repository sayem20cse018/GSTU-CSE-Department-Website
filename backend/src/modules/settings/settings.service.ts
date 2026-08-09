import { Injectable } from '@nestjs/common';
import {
  IsOptional, IsString, IsNumber, IsArray, MaxLength,
} from 'class-validator';
import { PrismaService } from '../../database/prisma.service';
import type { Settings } from '@prisma/client';

export class UpdateSettingsDto {
  @IsOptional() @IsString() @MaxLength(200)   deptName?: string;
  @IsOptional() @IsString() @MaxLength(50)    deptShortName?: string;
  @IsOptional() @IsString() @MaxLength(200)   universityName?: string;
  @IsOptional() @IsString() @MaxLength(50)    universityShortName?: string;
  @IsOptional() @IsString() @MaxLength(300)   tagline?: string;
  @IsOptional() @IsString() @MaxLength(5_000_000) deptLogo?: string;
  @IsOptional() @IsString() @MaxLength(5_000_000) universityLogo?: string;
  @IsOptional() @IsString() @MaxLength(200)   email?: string;
  @IsOptional() @IsString() @MaxLength(50)    phone?: string;
  @IsOptional() @IsString() @MaxLength(500)   address?: string;
  @IsOptional() @IsString() @MaxLength(300)   moodleUrl?: string;
  @IsOptional() @IsString() @MaxLength(300)   facebookUrl?: string;
  @IsOptional() @IsString() @MaxLength(300)   twitterUrl?: string;
  @IsOptional() @IsString() @MaxLength(300)   linkedinUrl?: string;
  @IsOptional() @IsString() @MaxLength(300)   youtubeUrl?: string;
  @IsOptional() @IsNumber()                   foundedYear?: number;
  @IsOptional() @IsString() @MaxLength(500)   footerText?: string;
  @IsOptional() @IsString() @MaxLength(3000)  aboutIntro?: string;
  @IsOptional() @IsString() @MaxLength(2000)  aboutVision?: string;
  @IsOptional() @IsString() @MaxLength(2000)  aboutMission?: string;
  @IsOptional() @IsString() @MaxLength(5000)  aboutHistory?: string;
  @IsOptional() @IsString() @MaxLength(200)   chairmanName?: string;
  @IsOptional() @IsString() @MaxLength(200)   chairmanTitle?: string;
  @IsOptional() @IsString() @MaxLength(5_000_000) chairmanPhoto?: string;
  @IsOptional() @IsString() @MaxLength(200)   chairmanEmail?: string;
  @IsOptional() @IsString() @MaxLength(200)   chairmanEmail2?: string;
  @IsOptional() @IsString() @MaxLength(10000) chairmanMessage?: string;
  @IsOptional() @IsString() @MaxLength(5_000_000) aboutImage1?: string;
  @IsOptional() @IsString() @MaxLength(5_000_000) aboutImage2?: string;
  @IsOptional() @IsString() @MaxLength(5_000_000) aboutImage3?: string;
  @IsOptional() @IsString() @MaxLength(5_000_000) aboutImage4?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) hiddenNavItems?: string[];
  @IsOptional() @IsString() @MaxLength(20_000) customNavItems?: string;
}

const SINGLETON_KEY = 'site_settings';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<Settings> {
    const doc = await this.prisma.settings.findUnique({ where: { key: SINGLETON_KEY } });
    if (!doc) {
      return this.prisma.settings.create({ data: { key: SINGLETON_KEY } });
    }
    return doc;
  }

  async update(dto: UpdateSettingsDto): Promise<Settings> {
    // Image fields: empty string = "not touched, keep existing value"
    // null = "explicitly cleared by user" (not possible via DTO currently, 
    // so we use a sentinel: if the field is exactly the string "null", treat as clear)
    const IMAGE_FIELDS = new Set([
      'deptLogo', 'universityLogo', 'chairmanPhoto',
      'aboutImage1', 'aboutImage2', 'aboutImage3', 'aboutImage4',
    ]);

    const cleanDto = Object.fromEntries(
      Object.entries(dto)
        .filter(([k, v]) => {
          if (v === undefined) return false;
          // Skip empty string for image fields — means "not changed"
          if (IMAGE_FIELDS.has(k) && v === '') return false;
          return true;
        })
        .map(([k, v]) => {
          // "__CLEAR__" sentinel from frontend means intentionally remove
          if (IMAGE_FIELDS.has(k) && v === '__CLEAR__') return [k, ''];
          return [k, v];
        })
    ) as Partial<UpdateSettingsDto>;

    return this.prisma.settings.upsert({
      where:  { key: SINGLETON_KEY },
      update: { ...cleanDto },
      create: { key: SINGLETON_KEY, ...cleanDto },
    });
  }
}
