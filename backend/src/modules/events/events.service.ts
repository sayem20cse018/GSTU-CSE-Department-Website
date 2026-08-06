import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IsOptional, IsString, IsBoolean, MaxLength,
} from 'class-validator';
import { Event, EventDocument } from './schemas/event.schema';

export class CreateEventDto {
  @IsString() @MaxLength(300) title: string;
  @IsString() @MaxLength(300) slug: string;
  @IsString() description: string;
  @IsOptional() @IsString() shortDescription?: string;
  @IsOptional() @IsString() venue?: string;
  @IsString() startDate: string;
  @IsOptional() @IsString() endDate?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() mode?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() organizerName?: string;
  @IsOptional() @IsString() organizerContact?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsString() status?: string;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async findUpcoming() {
    return this.eventModel
      .find({ isPublished: true, startDate: { $gte: new Date() } })
      .sort({ startDate: 1 }).limit(10).lean().exec();
  }

  async findAll(page = 1, limit = 10, isAdmin = false) {
    const skip   = (page - 1) * limit;
    const filter = isAdmin ? {} : { isPublished: true };
    const [data, total] = await Promise.all([
      this.eventModel.find(filter).sort({ startDate: -1 }).skip(skip).limit(limit).lean().exec(),
      this.eventModel.countDocuments(filter),
    ]);
    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findBySlug(slug: string) {
    const ev = await this.eventModel.findOne({ slug }).lean().exec();
    if (!ev) throw new NotFoundException(`Event "${slug}" not found`);
    return ev;
  }

  async findById(id: string) {
    const ev = await this.eventModel.findById(id).lean().exec();
    if (!ev) throw new NotFoundException(`Event "${id}" not found`);
    return ev;
  }

  async create(dto: CreateEventDto) {
    return this.eventModel.create(dto);
  }

  async update(id: string, dto: Partial<CreateEventDto>) {
    const ev = await this.eventModel.findByIdAndUpdate(id, dto, { new: true }).lean().exec();
    if (!ev) throw new NotFoundException(`Event "${id}" not found`);
    return ev;
  }

  async remove(id: string) {
    const ev = await this.eventModel.findByIdAndDelete(id).exec();
    if (!ev) throw new NotFoundException(`Event "${id}" not found`);
  }
}
