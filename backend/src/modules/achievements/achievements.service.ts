import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';

export class CreateAchievementDto {
  title: string;
  description: string;
  image?: string;
  type?: string;
  achievedAt: string;
  achieverName?: string;
  awardedBy?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
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
