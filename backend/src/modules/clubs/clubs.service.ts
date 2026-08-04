import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from './schemas/club.schema';

export class CreateClubDto {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  logo?: string;
  coverImage?: string;
  founderName?: string;
  presidentName?: string;
  advisorName?: string;
  foundedYear?: number;
  activities?: string[];
  email?: string;
  facebookUrl?: string;
  memberCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}

@Injectable()
export class ClubsService {
  constructor(@InjectModel(Club.name) private readonly model: Model<ClubDocument>) {}

  async findAll(isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    return this.model.find(filter).sort({ isFeatured: -1, sortOrder: 1, name: 1 }).lean();
  }

  async findBySlug(slug: string) {
    const doc = await this.model.findOne({ slug }).lean();
    if (!doc) throw new NotFoundException(`Club "${slug}" not found`);
    return doc;
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException(`Club ${id} not found`);
    return doc;
  }

  async create(dto: CreateClubDto) { return this.model.create(dto); }

  async update(id: string, dto: Partial<CreateClubDto>) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException(`Club ${id} not found`);
    return doc;
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException(`Club ${id} not found`);
  }
}
