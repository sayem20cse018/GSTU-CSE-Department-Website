import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

import type { CreateProgramDto, UpdateProgramDto }                   from './dto/program.dto';
import type { CreateCourseDto, UpdateCourseDto }                     from './dto/course.dto';
import type { CreateAcademicResourceDto, UpdateAcademicResourceDto } from './dto/academic-resource.dto';
import type { CreateLaboratoryDto, UpdateLaboratoryDto }             from './dto/laboratory.dto';

// Prisma data helper — direct cast (DTO is already a plain object from NestJS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function plain(dto: unknown): Record<string, any> {
  return dto as Record<string, any>;
}

@Injectable()
export class AcademicsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Programs ────────────────────────────────────────────────────────────────
  findAllPrograms(isAdmin = false) {
    return this.prisma.program.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { degree: 'asc' }],
      include: { admissionRequirements: true, careerOpportunities: true },
    });
  }

  async findProgramByDegree(degree: string) {
    const p = await this.prisma.program.findFirst({
      where: { degree, isActive: true },
      include: { admissionRequirements: true, careerOpportunities: true },
    });
    if (!p) throw new NotFoundException(`Program "${degree}" not found`);
    return p;
  }

  async findProgramById(id: string) {
    const p = await this.prisma.program.findUnique({
      where: { id },
      include: { admissionRequirements: true, careerOpportunities: true },
    });
    if (!p) throw new NotFoundException(`Program ${id} not found`);
    return p;
  }

  async createProgram(dto: CreateProgramDto) {
    const { admissionRequirements, careerOpportunities, ...rest } = plain(dto);
    return this.prisma.program.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        ...rest,
        ...(admissionRequirements ? { admissionRequirements: { create: admissionRequirements } } : {}),
        ...(careerOpportunities   ? { careerOpportunities:   { create: careerOpportunities } }   : {}),
      } as any,
      include: { admissionRequirements: true, careerOpportunities: true },
    });
  }

  async updateProgram(id: string, dto: UpdateProgramDto) {
    const p = await this.prisma.program.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Program ${id} not found`);
    const { admissionRequirements, careerOpportunities, ...rest } = plain(dto);
    return this.prisma.program.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        ...rest,
        ...(admissionRequirements ? { admissionRequirements: { deleteMany: {}, create: admissionRequirements } } : {}),
        ...(careerOpportunities   ? { careerOpportunities:   { deleteMany: {}, create: careerOpportunities } }   : {}),
      } as any,
      include: { admissionRequirements: true, careerOpportunities: true },
    });
  }

  async deleteProgram(id: string) {
    const p = await this.prisma.program.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Program ${id} not found`);
    return this.prisma.program.delete({ where: { id } });
  }

  // ── Courses ─────────────────────────────────────────────────────────────────
  findAllCourses(degree?: string, semester?: number, isAdmin = false) {
    return this.prisma.course.findMany({
      where: {
        ...(isAdmin   ? {} : { isActive: true }),
        ...(degree    ? { degree }   : {}),
        ...(semester  ? { semester } : {}),
      },
      orderBy: [{ semester: 'asc' }, { sortOrder: 'asc' }, { code: 'asc' }],
      include: { schedule: true },
    });
  }

  async findCourseById(id: string) {
    const c = await this.prisma.course.findUnique({ where: { id }, include: { schedule: true } });
    if (!c) throw new NotFoundException(`Course ${id} not found`);
    return c;
  }

  async findCourseByCode(code: string) {
    const c = await this.prisma.course.findUnique({ where: { code: code.toUpperCase() }, include: { schedule: true } });
    if (!c) throw new NotFoundException(`Course "${code}" not found`);
    return c;
  }

  async createCourse(dto: CreateCourseDto) {
    const { schedule, ...rest } = plain(dto);
    return this.prisma.course.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...rest, ...(schedule ? { schedule: { create: schedule } } : {}) } as any,
      include: { schedule: true },
    });
  }

  async updateCourse(id: string, dto: UpdateCourseDto) {
    const c = await this.prisma.course.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Course ${id} not found`);
    const { schedule, ...rest } = plain(dto);
    return this.prisma.course.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...rest, ...(schedule ? { schedule: { deleteMany: {}, create: schedule } } : {}) } as any,
      include: { schedule: true },
    });
  }

  async deleteCourse(id: string) {
    const c = await this.prisma.course.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Course ${id} not found`);
    return this.prisma.course.delete({ where: { id } });
  }

  async getCurriculum(degree: string) {
    const courses = await this.prisma.course.findMany({
      where: { degree, isActive: true },
      orderBy: [{ semester: 'asc' }, { sortOrder: 'asc' }, { code: 'asc' }],
      include: { schedule: true },
    });
    const grouped: Record<number, typeof courses> = {};
    for (const c of courses) {
      if (!grouped[c.semester]) grouped[c.semester] = [];
      grouped[c.semester].push(c);
    }
    return grouped;
  }

  // ── Academic Resources ──────────────────────────────────────────────────────
  findAllResources(type?: string, degree?: string, isAdmin = false) {
    return this.prisma.academicResource.findMany({
      where: {
        ...(isAdmin ? {} : { isPublished: true }),
        ...(type   ? { type }                                   : {}),
        ...(degree ? { targetDegree: { in: [degree, 'all'] } } : {}),
      },
      orderBy: [{ isPinned: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { files: true },
    });
  }

  async findResourceById(id: string) {
    const r = await this.prisma.academicResource.findUnique({ where: { id }, include: { files: true } });
    if (!r) throw new NotFoundException(`Resource ${id} not found`);
    return r;
  }

  async createResource(dto: CreateAcademicResourceDto) {
    const { files, ...rest } = plain(dto);
    return this.prisma.academicResource.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...rest, ...(files ? { files: { create: files } } : {}) } as any,
      include: { files: true },
    });
  }

  async updateResource(id: string, dto: UpdateAcademicResourceDto) {
    const r = await this.prisma.academicResource.findUnique({ where: { id } });
    if (!r) throw new NotFoundException(`Resource ${id} not found`);
    const { files, ...rest } = plain(dto);
    return this.prisma.academicResource.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...rest, ...(files ? { files: { deleteMany: {}, create: files } } : {}) } as any,
      include: { files: true },
    });
  }

  async deleteResource(id: string) {
    const r = await this.prisma.academicResource.findUnique({ where: { id } });
    if (!r) throw new NotFoundException(`Resource ${id} not found`);
    return this.prisma.academicResource.delete({ where: { id } });
  }

  // ── Laboratories ────────────────────────────────────────────────────────────
  findAllLabs(isAdmin = false) {
    return this.prisma.laboratory.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { equipment: true, images: true, schedule: true },
    });
  }

  async findLabBySlug(slug: string) {
    const lab = await this.prisma.laboratory.findUnique({
      where: { slug },
      include: { equipment: true, images: true, schedule: true },
    });
    if (!lab) throw new NotFoundException(`Lab "${slug}" not found`);
    return lab;
  }

  async findLabById(id: string) {
    const lab = await this.prisma.laboratory.findUnique({
      where: { id },
      include: { equipment: true, images: true, schedule: true },
    });
    if (!lab) throw new NotFoundException(`Lab ${id} not found`);
    return lab;
  }

  async createLab(dto: CreateLaboratoryDto) {
    const { equipment, images, schedule, ...rest } = plain(dto);
    return this.prisma.laboratory.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        ...rest,
        ...(equipment ? { equipment: { create: equipment } } : {}),
        ...(images    ? { images:    { create: images } }    : {}),
        ...(schedule  ? { schedule:  { create: schedule } }  : {}),
      } as any,
      include: { equipment: true, images: true, schedule: true },
    });
  }

  async updateLab(id: string, dto: UpdateLaboratoryDto) {
    const lab = await this.prisma.laboratory.findUnique({ where: { id } });
    if (!lab) throw new NotFoundException(`Lab ${id} not found`);
    const { equipment, images, schedule, ...rest } = plain(dto);
    return this.prisma.laboratory.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        ...rest,
        ...(equipment ? { equipment: { deleteMany: {}, create: equipment } } : {}),
        ...(images    ? { images:    { deleteMany: {}, create: images } }    : {}),
        ...(schedule  ? { schedule:  { deleteMany: {}, create: schedule } }  : {}),
      } as any,
      include: { equipment: true, images: true, schedule: true },
    });
  }

  async deleteLab(id: string) {
    const lab = await this.prisma.laboratory.findUnique({ where: { id } });
    if (!lab) throw new NotFoundException(`Lab ${id} not found`);
    return this.prisma.laboratory.delete({ where: { id } });
  }

  // ── Stats ───────────────────────────────────────────────────────────────────
  async getStats() {
    const [programs, courses, resources, labs] = await this.prisma.$transaction([
      this.prisma.program.count({ where: { isActive: true } }),
      this.prisma.course.count({ where: { isActive: true } }),
      this.prisma.academicResource.count({ where: { isPublished: true } }),
      this.prisma.laboratory.count({ where: { isActive: true } }),
    ]);
    return { programs, courses, resources, labs };
  }
}
