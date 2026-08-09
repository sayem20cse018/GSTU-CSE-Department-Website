import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IsOptional, IsString, IsBoolean, IsArray, MaxLength,
} from 'class-validator';
import { PrismaService } from '../../database/prisma.service';

export class CreateGalleryDto {
  @IsString() @MaxLength(300)  title: string;
  @IsString() @MaxLength(300)  slug: string;
  @IsOptional() @IsString()    description?: string;
  @IsOptional() @IsString()    category?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString()    coverImage?: string;
  @IsString()                  albumDate: string;
  @IsOptional() @IsString()    uploadedByName?: string;
  @IsOptional() @IsBoolean()   isPublished?: boolean;
  @IsOptional() @IsBoolean()   isFeatured?: boolean;
  @IsOptional() @IsArray()     media?: {
    url: string;
    thumbnailUrl: string;
    caption?: string;
    altText?: string;
    mediaType?: string;
  }[];
}

const GALLERY_INCLUDE = { media: { orderBy: { sortOrder: 'asc' as const } } } as const;

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(isAdmin = false) {
    return this.prisma.gallery.findMany({
      where: isAdmin ? {} : { isPublished: true },
      orderBy: { albumDate: 'desc' },
      include: GALLERY_INCLUDE,
    });
  }

  async findBySlug(slug: string) {
    const g = await this.prisma.gallery.findUnique({ where: { slug }, include: GALLERY_INCLUDE });
    if (!g) throw new NotFoundException(`Album "${slug}" not found`);
    return g;
  }

  async findById(id: string) {
    const g = await this.prisma.gallery.findUnique({ where: { id }, include: GALLERY_INCLUDE });
    if (!g) throw new NotFoundException(`Album "${id}" not found`);
    return g;
  }

  async create(dto: CreateGalleryDto) {
    const { media, albumDate, ...rest } = dto;
    const mediaCount = media?.length ?? 0;
    return this.prisma.gallery.create({
      data: {
        ...rest,
        albumDate: new Date(albumDate),
        mediaCount,
        ...(media
          ? { media: { create: media.map((m, i) => ({ ...m, sortOrder: i })) } }
          : {}),
      },
      include: GALLERY_INCLUDE,
    });
  }

  async update(id: string, dto: Partial<CreateGalleryDto>) {
    const g = await this.prisma.gallery.findUnique({ where: { id } });
    if (!g) throw new NotFoundException(`Album "${id}" not found`);
    const { media, albumDate, ...rest } = dto;
    return this.prisma.gallery.update({
      where: { id },
      data: {
        ...rest,
        ...(albumDate ? { albumDate: new Date(albumDate) } : {}),
        ...(media
          ? {
              mediaCount: media.length,
              media: {
                deleteMany: {},
                create: media.map((m, i) => ({ ...m, sortOrder: i })),
              },
            }
          : {}),
      },
      include: GALLERY_INCLUDE,
    });
  }

  async remove(id: string) {
    const g = await this.prisma.gallery.findUnique({ where: { id } });
    if (!g) throw new NotFoundException(`Album "${id}" not found`);
    return this.prisma.gallery.delete({ where: { id } });
  }
}
