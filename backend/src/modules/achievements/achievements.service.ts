import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IsOptional, IsString, IsBoolean, IsNumber, MaxLength,
} from 'class-validator';
import { PrismaService } from '../../database/prisma.service';

export class CreateAchievementDto {
  @IsString() @MaxLength(300)  title: string;
  @IsOptional() @IsString()    description?: string;
  @IsOptional() @IsString()    image?: string;
  @IsOptional() @IsString()    type?: string;
  @IsString()                  achievedAt: string;
  @IsOptional() @IsString()    achieverName?: string;
  @IsOptional() @IsString()    awardedBy?: string;
  @IsOptional() @IsBoolean()   isPublished?: boolean;
  @IsOptional() @IsBoolean()   isFeatured?: boolean;
  @IsOptional() @IsNumber()    sortOrder?: number;
}

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit = 20, isAdmin = false) {
    return this.prisma.achievement.findMany({
      where: isAdmin ? {} : { isPublished: true },
      orderBy: [{ isFeatured: 'desc' }, { achievedAt: 'desc' }],
      take: limit,
    });
  }

  async findById(id: string) {
    const doc = await this.prisma.achievement.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Achievement ${id} not found`);
    return doc;
  }

  async create(dto: CreateAchievementDto) {
    return this.prisma.achievement.create({
      data: {
        ...dto,
        achievedAt: new Date(dto.achievedAt),
        description: dto.description ?? '',
      },
    });
  }

  async update(id: string, dto: Partial<CreateAchievementDto>) {
    const doc = await this.prisma.achievement.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Achievement ${id} not found`);
    return this.prisma.achievement.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.achievedAt ? { achievedAt: new Date(dto.achievedAt) } : {}),
      },
    });
  }

  async remove(id: string) {
    const doc = await this.prisma.achievement.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Achievement ${id} not found`);
    return this.prisma.achievement.delete({ where: { id } });
  }
}
