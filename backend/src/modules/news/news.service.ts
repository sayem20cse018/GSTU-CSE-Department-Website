import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private readonly newsModel: Model<NewsDocument>) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.newsModel.find({ isPublished: true }).sort({ publishedAt: -1 }).skip(skip).limit(limit).exec(),
      this.newsModel.countDocuments({ isPublished: true }),
    ]);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string): Promise<News> {
    const item = await this.newsModel.findOne({ slug, isPublished: true }).exec();
    if (!item) throw new NotFoundException(`News "${slug}" not found`);
    return item;
  }
}
