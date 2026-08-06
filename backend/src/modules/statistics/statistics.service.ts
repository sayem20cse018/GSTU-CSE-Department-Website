import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Statistic, StatisticDocument } from './schemas/statistic.schema';

const DEFAULT_STATS = [
  { key: 'faculty_members',   label: 'Faculty Members',      value: '14+',  icon: '👨‍🏫', sortOrder: 1 },
  { key: 'total_students',    label: 'Total Students',        value: '800+', icon: '🎓', sortOrder: 2 },
  { key: 'alumni',            label: 'Alumni',                value: '500+', icon: '🌍', sortOrder: 3 },
  { key: 'research_pubs',     label: 'Research Publications', value: '50+',  icon: '📄', sortOrder: 4 },
  { key: 'running_batches',   label: 'Running Batches',       value: '8',    icon: '📚', sortOrder: 5 },
  { key: 'labs',              label: 'Laboratories',          value: '6',    icon: '🔬', sortOrder: 6 },
];

export class UpdateStatDto {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() value?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsNumber() sortOrder?: number;
  @IsOptional() @IsBoolean() isVisible?: boolean;
}

@Injectable()
export class StatisticsService implements OnModuleInit {
  constructor(
    @InjectModel(Statistic.name)
    private readonly model: Model<StatisticDocument>,
  ) {}

  // Seed defaults if collection is empty
  async onModuleInit() {
    const count = await this.model.countDocuments();
    if (count === 0) {
      await this.model.insertMany(DEFAULT_STATS);
    }
  }

  async findAll(visibleOnly = true) {
    const filter = visibleOnly ? { isVisible: true } : {};
    return this.model.find(filter).sort({ sortOrder: 1 }).lean();
  }

  async update(id: string, dto: UpdateStatDto) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException(`Stat ${id} not found`);
    return doc;
  }
}
