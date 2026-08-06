import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IsOptional, IsString, IsBoolean, IsArray, IsNumber, MaxLength,
} from 'class-validator';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';

export class CreateGalleryDto {
  @IsString() @MaxLength(300) title: string;
  @IsString() @MaxLength(300) slug: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() coverImage?: string;
  @IsString() albumDate: string;
  @IsOptional() @IsString() uploadedByName?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsArray() media?: { url: string; thumbnailUrl: string; caption?: string; altText?: string; mediaType?: string }[];
}

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<GalleryDocument>,
  ) {}

  async findAll(isAdmin = false) {
    const filter = isAdmin ? {} : { isPublished: true };
    return this.galleryModel.find(filter).sort({ albumDate: -1 }).lean().exec();
  }

  async findBySlug(slug: string) {
    const g = await this.galleryModel.findOne({ slug }).lean().exec();
    if (!g) throw new NotFoundException(`Album "${slug}" not found`);
    return g;
  }

  async findById(id: string) {
    const g = await this.galleryModel.findById(id).lean().exec();
    if (!g) throw new NotFoundException(`Album "${id}" not found`);
    return g;
  }

  async create(dto: CreateGalleryDto) {
    const mediaCount = dto.media?.length ?? 0;
    return this.galleryModel.create({ ...dto, mediaCount });
  }

  async update(id: string, dto: Partial<CreateGalleryDto>) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.media) update.mediaCount = dto.media.length;
    const g = await this.galleryModel.findByIdAndUpdate(id, update, { new: true }).lean().exec();
    if (!g) throw new NotFoundException(`Album "${id}" not found`);
    return g;
  }

  async remove(id: string) {
    const g = await this.galleryModel.findByIdAndDelete(id).exec();
    if (!g) throw new NotFoundException(`Album "${id}" not found`);
  }
}
