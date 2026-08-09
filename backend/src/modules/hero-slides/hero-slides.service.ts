import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';

@Injectable()
export class HeroSlidesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(isAdmin = false) {
    return this.prisma.heroSlide.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findById(id: string) {
    const s = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!s) throw new NotFoundException(`Slide ${id} not found`);
    return s;
  }

  create(dto: CreateHeroSlideDto) {
    return this.prisma.heroSlide.create({ data: dto });
  }

  async update(id: string, dto: UpdateHeroSlideDto) {
    const s = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!s) throw new NotFoundException(`Slide ${id} not found`);
    return this.prisma.heroSlide.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const s = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!s) throw new NotFoundException(`Slide ${id} not found`);
    return this.prisma.heroSlide.delete({ where: { id } });
  }
}
