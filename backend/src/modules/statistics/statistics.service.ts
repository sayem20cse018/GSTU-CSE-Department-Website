import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { PrismaService } from '../../database/prisma.service';

const DEFAULT_STATS = [
  { key: 'faculty_members',  label: 'Faculty Members',      value: '14+',  icon: '👨‍🏫', sortOrder: 1 },
  { key: 'total_students',   label: 'Total Students',        value: '800+', icon: '🎓',  sortOrder: 2 },
  { key: 'alumni',           label: 'Alumni',                value: '500+', icon: '🌍',  sortOrder: 3 },
  { key: 'research_pubs',    label: 'Research Publications', value: '50+',  icon: '📄',  sortOrder: 4 },
  { key: 'running_batches',  label: 'Running Batches',       value: '8',    icon: '📚',  sortOrder: 5 },
  { key: 'labs',             label: 'Laboratories',          value: '6',    icon: '🔬',  sortOrder: 6 },
];

export class UpdateStatDto {
  @IsOptional() @IsString()  label?: string;
  @IsOptional() @IsString()  value?: string;
  @IsOptional() @IsString()  icon?: string;
  @IsOptional() @IsNumber()  sortOrder?: number;
  @IsOptional() @IsBoolean() isVisible?: boolean;
}

@Injectable()
export class StatisticsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.statistic.count();
    if (count === 0) {
      await this.prisma.statistic.createMany({ data: DEFAULT_STATS });
    }
  }

  async findAll(visibleOnly = true) {
    return this.prisma.statistic.findMany({
      where: visibleOnly ? { isVisible: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async update(id: string, dto: UpdateStatDto) {
    const doc = await this.prisma.statistic.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Stat ${id} not found`);
    return this.prisma.statistic.update({ where: { id }, data: dto });
  }
}
