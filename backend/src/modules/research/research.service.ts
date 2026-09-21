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

  async create(dto: object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { projects, ...rest } = dto as Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.researchGroup.create({
      data: {
        ...rest,
        ...(Array.isArray(projects) && projects.length ? { projects: { create: projects } } : {}),
      } as any,
      include: GROUP_INCLUDE,
    });
  }

  async update(id: string, dto: object) {
    const g = await this.prisma.researchGroup.findUnique({ where: { id } });
    if (!g) throw new NotFoundException(`Research group ${id} not found`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { projects, ...rest } = dto as Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.researchGroup.update({
      where: { id },
      data: {
        ...rest,
        ...(Array.isArray(projects)
          ? { projects: { deleteMany: {}, ...(projects.length ? { create: projects } : {}) } }
          : {}),
      } as any,
      include: GROUP_INCLUDE,
    });
  }

  async remove(id: string) {
    const g = await this.prisma.researchGroup.findUnique({ where: { id } });
    if (!g) throw new NotFoundException(`Research group ${id} not found`);
    return this.prisma.researchGroup.delete({ where: { id } });
  }
}
