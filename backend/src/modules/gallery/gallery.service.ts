import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';

export class CreateGalleryDto {
  title: string;
  slug: string;
  description?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  albumDate: string;
  uploadedByName?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  media?: { url: string; thumbnailUrl: string; caption?: string; altText?: string; mediaType?: string }[];
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
