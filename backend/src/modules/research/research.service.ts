import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

const GROUP_INCLUDE = { projects: true } as const;

@Injectable()
export class ResearchService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.researchGroup.findMany({
      orderBy: { name: 'asc' },
      include: GROUP_INCLUDE,
    });
  }

  async findBySlug(slug: string) {
    const g = await this.prisma.researchGroup.findUnique({ where: { slug }, include: GROUP_INCLUDE });
    if (!g) throw new NotFoundException(`Research group "${slug}" not found`);
    return g;
  }

  async findById(id: string) {
    const g = await this.prisma.researchGroup.findUnique({ where: { id }, include: GROUP_INCLUDE });
    if (!g) throw new NotFoundException(`Research group ${id} not found`);
    return g;
  }

  async create(dto: { name: string; slug: string; description: string; lead: string; members?: string[]; projects?: object[] }) {
    const { projects, ...rest } = dto as any;
    return this.prisma.researchGroup.create({
      data: {
        ...rest,
        ...(projects ? { projects: { create: projects } } : {}),
      },
      include: GROUP_INCLUDE,
    });
  }

  async update(id: string, dto: Partial<{ name: string; slug: string; description: string; lead: string; members: string[]; projects: object[] }>) {
    const g = await this.prisma.researchGroup.findUnique({ where: { id } });
    if (!g) throw new NotFoundException(`Research group ${id} not found`);
    const { projects, ...rest } = dto as any;
    return this.prisma.researchGroup.update({
      where: { id },
      data: {
        ...rest,
        ...(projects ? { projects: { deleteMany: {}, create: projects } } : {}),
      },
      include: GROUP_INCLUDE,
    });
  }

  async remove(id: string) {
    const g = await this.prisma.researchGroup.findUnique({ where: { id } });
    if (!g) throw new NotFoundException(`Research group ${id} not found`);
    return this.prisma.researchGroup.delete({ where: { id } });
  }
}
