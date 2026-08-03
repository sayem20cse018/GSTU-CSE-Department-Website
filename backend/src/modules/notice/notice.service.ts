import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';

export class CreateNoticeDto {
  title: string;
  description?: string;
  category?: string;
  targetAudience?: string[];
  isPublished?: boolean;
  isPinned?: boolean;
  isUrgent?: boolean;
  expiresAt?: string;
  postedByName?: string;
}

@Injectable()
export class NoticeService {
  constructor(
    @InjectModel(Notice.name)
    private readonly noticeModel: Model<NoticeDocument>,
  ) {}

  async findAll(isAdmin = false) {
    const filter: Record<string, unknown> = {};
    if (!isAdmin) {
      filter.isPublished = true;
      filter.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];
    }
    return this.noticeModel
      .find(filter)
      .sort({ isPinned: -1, publishedAt: -1 })
      .lean()
      .exec();
  }

  async findById(id: string) {
    const n = await this.noticeModel.findById(id).lean().exec();
    if (!n) throw new NotFoundException(`Notice ${id} not found`);
    return n;
  }

  async create(dto: CreateNoticeDto, adminId?: string) {
    const data: Record<string, unknown> = { ...dto };
    if (adminId) data.postedBy = adminId;
    if (dto.isPublished) data.publishedAt = new Date();
    return this.noticeModel.create(data);
  }

  async update(id: string, dto: Partial<CreateNoticeDto>) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.isPublished !== undefined && dto.isPublished) {
      update.publishedAt = new Date();
    }
    const n = await this.noticeModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean()
      .exec();
    if (!n) throw new NotFoundException(`Notice ${id} not found`);
    return n;
  }

  async remove(id: string) {
    const n = await this.noticeModel.findByIdAndDelete(id).exec();
    if (!n) throw new NotFoundException(`Notice ${id} not found`);
  }

  async incrementView(id: string) {
    await this.noticeModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }
}
