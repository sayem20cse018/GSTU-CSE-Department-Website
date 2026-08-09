import { Injectable, NotFoundException } from '@nestjs/common';
import { IsOptional, IsString, IsBoolean, IsArray, MaxLength } from 'class-validator';
import { PrismaService } from '../../database/prisma.service';

export class CreateNewsDto {
  @IsString() @MaxLength(300)  title: string;
  @IsString() @MaxLength(300)  slug: string;
  @IsString() @MaxLength(600)  excerpt: string;
  @IsString()                  content: string;
  @IsOptional() @IsString()    coverImage?: string;
  @IsOptional() @IsString()    category?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsString()                  authorName: string;
  @IsOptional() @IsBoolean()   isPublished?: boolean;
  @IsOptional() @IsBoolean()   isFeatured?: boolean;
}

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, isAdmin = false) {
    const skip  = (page - 1) * limit;
    const where = isAdmin ? {} : { isPublished: true };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.news.count({ where }),
    ]);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.news.findUnique({ where: { slug } });
    if (!item) throw new NotFoundException(`News "${slug}" not found`);
    return item;
  }

  async findById(id: string) {
    const item = await this.prisma.news.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`News "${id}" not found`);
    return item;
  }

  async create(dto: CreateNewsDto, authorId?: string) {
    return this.prisma.news.create({
      data: {
        ...dto,
        authorId: authorId ?? null,
        publishedAt: dto.isPublished ? new Date() : null,
      },
    });
  }

  async update(id: string, dto: Partial<CreateNewsDto>) {
    const item = await this.prisma.news.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`News "${id}" not found`);
    return this.prisma.news.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.isPublished && !item.publishedAt ? { publishedAt: new Date() } : {}),
      },
    });
  }

  async remove(id: string) {
    const item = await this.prisma.news.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`News "${id}" not found`);
    return this.prisma.news.delete({ where: { id } });
  }

  async incrementView(id: string) {
    await this.prisma.news.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
