import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IsOptional, IsString, IsBoolean, IsNumber, IsArray, MaxLength,
} from 'class-validator';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';

export class CreateAchievementDto {
  @IsString() @MaxLength(300) title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() type?: string;
  @IsString() achievedAt: string;
  @IsOptional() @IsString() achieverName?: string;
  @IsOptional() @IsString() awardedBy?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsNumber() sortOrder?: number;
}

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name)
    private readonly model: Model<AchievementDocument>,
  ) {}

  async findAll(limit = 20, isAdmin = false) {
    const filter = isAdmin ? {} : { isPublished: true };
    return this.model.find(filter).sort({ isFeatured: -1, achievedAt: -1 }).limit(limit).lean();
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException(`Achievement ${id} not found`);
    return doc;
  }

  async create(dto: CreateAchievementDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: Partial<CreateAchievementDto>) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException(`Achievement ${id} not found`);
    return doc;
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException(`Achievement ${id} not found`);
  }
}
