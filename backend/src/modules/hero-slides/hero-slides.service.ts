import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeroSlide, HeroSlideDocument } from './schemas/hero-slide.schema';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';

@Injectable()
export class HeroSlidesService {
  constructor(
    @InjectModel(HeroSlide.name)
    private readonly model: Model<HeroSlideDocument>,
  ) {}

  findAll(isAdmin = false) {
    const filter = isAdmin ? {} : { isActive: true };
    return this.model.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();
  }

  async findById(id: string) {
    const s = await this.model.findById(id).lean();
    if (!s) throw new NotFoundException(`Slide ${id} not found`);
    return s;
  }

  create(dto: CreateHeroSlideDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateHeroSlideDto) {
    const s = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!s) throw new NotFoundException(`Slide ${id} not found`);
    return s;
  }

  async remove(id: string) {
    const s = await this.model.findByIdAndDelete(id);
    if (!s) throw new NotFoundException(`Slide ${id} not found`);
  }
}
