import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IsOptional, IsString, IsBoolean, IsNumber, IsArray, MaxLength,
} from 'class-validator';
import { Club, ClubDocument } from './schemas/club.schema';

export class CreateClubDto {
  @IsString() @MaxLength(200) name: string;
  @IsString() @MaxLength(200) slug: string;
  @IsString() description: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() founderName?: string;
  @IsOptional() @IsString() presidentName?: string;
  @IsOptional() @IsString() advisorName?: string;
  @IsOptional() @IsNumber() foundedYear?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) activities?: string[];
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() facebookUrl?: string;
  @IsOptional() @IsNumber() memberCount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsNumber() sortOrder?: number;
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
