import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IsOptional, IsString, IsBoolean, MaxLength,
} from 'class-validator';
import { PrismaService } from '../../database/prisma.service';

export class CreateEventDto {
  @IsString() @MaxLength(300)  title: string;
  @IsString() @MaxLength(300)  slug: string;
  @IsString()                  description: string;
  @IsOptional() @IsString()    shortDescription?: string;
  @IsOptional() @IsString()    venue?: string;
  @IsString()                  startDate: string;
  @IsOptional() @IsString()    endDate?: string;
  @IsOptional() @IsString()    type?: string;
  @IsOptional() @IsString()    mode?: string;
  @IsOptional() @IsString()    coverImage?: string;
  @IsOptional() @IsString()    organizerName?: string;
  @IsOptional() @IsString()    organizerContact?: string;
  @IsOptional() @IsBoolean()   isPublished?: boolean;
  @IsOptional() @IsBoolean()   isFeatured?: boolean;
  @IsOptional() @IsString()    status?: string;
}

const EVENT_INCLUDE = {
  speakers: true,
  schedule: true,
} as const;

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  findUpcoming() {
    return this.prisma.event.findMany({
      where: { isPublished: true, startDate: { gte: new Date() } },
      orderBy: { startDate: 'asc' },
      take: 10,
      include: EVENT_INCLUDE,
    });
  }

  async findAll(page = 1, limit = 10, isAdmin = false) {
    const skip  = (page - 1) * limit;
    const where = isAdmin ? {} : { isPublished: true };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
        include: EVENT_INCLUDE,
      }),
      this.prisma.event.count({ where }),
    ]);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const ev = await this.prisma.event.findUnique({ where: { slug }, include: EVENT_INCLUDE });
    if (!ev) throw new NotFoundException(`Event "${slug}" not found`);
    return ev;
  }

  async findById(id: string) {
    const ev = await this.prisma.event.findUnique({ where: { id }, include: EVENT_INCLUDE });
    if (!ev) throw new NotFoundException(`Event "${id}" not found`);
    return ev;
  }

  create(dto: CreateEventDto) {
    const { startDate, endDate, ...rest } = dto;
    return this.prisma.event.create({
      data: {
        ...rest,
        venue: rest.venue ?? '',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: EVENT_INCLUDE,
    });
  }

  async update(id: string, dto: Partial<CreateEventDto>) {
    const ev = await this.prisma.event.findUnique({ where: { id } });
    if (!ev) throw new NotFoundException(`Event "${id}" not found`);
    const { startDate, endDate, ...rest } = dto;
    return this.prisma.event.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate ? { startDate: new Date(startDate) } : {}),
        ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
      },
      include: EVENT_INCLUDE,
    });
  }

  async remove(id: string) {
    const ev = await this.prisma.event.findUnique({ where: { id } });
    if (!ev) throw new NotFoundException(`Event "${id}" not found`);
    return this.prisma.event.delete({ where: { id } });
  }
}
