import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';

export class CreateNewsDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  authorName: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<NewsDocument>,
  ) {}

  async findAll(page = 1, limit = 10, isAdmin = false) {
    const skip   = (page - 1) * limit;
    const filter = isAdmin ? {} : { isPublished: true };
    const [data, total] = await Promise.all([
      this.newsModel.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.newsModel.countDocuments(filter),
    ]);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string): Promise<NewsDocument> {
    const item = await this.newsModel.findOne({ slug }).lean().exec();
    if (!item) throw new NotFoundException(`News "${slug}" not found`);
    return item as unknown as NewsDocument;
  }

  async findById(id: string) {
    const item = await this.newsModel.findById(id).lean().exec();
    if (!item) throw new NotFoundException(`News "${id}" not found`);
    return item;
  }

  async create(dto: CreateNewsDto, authorId?: string) {
    const data: Record<string, unknown> = { ...dto };
    if (authorId) data.author = authorId;
    if (dto.isPublished) data.publishedAt = new Date();
    return this.newsModel.create(data);
  }

  async update(id: string, dto: Partial<CreateNewsDto>) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.isPublished) update.publishedAt = new Date();
    const item = await this.newsModel.findByIdAndUpdate(id, update, { new: true }).lean().exec();
    if (!item) throw new NotFoundException(`News "${id}" not found`);
    return item;
  }

  async remove(id: string) {
    const item = await this.newsModel.findByIdAndDelete(id).exec();
    if (!item) throw new NotFoundException(`News "${id}" not found`);
  }

  async incrementView(id: string) {
    await this.newsModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }
}
