import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

const FACULTY_INCLUDE = {
  education:   true,
  publications: true,
  awards:      true,
  officeHours: true,
} as const;

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.faculty.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: FACULTY_INCLUDE,
    });
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findUnique({ where: { id }, include: FACULTY_INCLUDE });
    if (!faculty) throw new NotFoundException(`Faculty #${id} not found`);
    return faculty;
  }

  async create(dto: CreateFacultyDto) {
    const { education, publications, awards, officeHours, ...rest } = dto as any;
    try {
      return await this.prisma.faculty.create({
        data: {
          ...rest,
          ...(education    ? { education:    { create: education } }    : {}),
          ...(publications ? { publications: { create: publications } } : {}),
          ...(awards       ? { awards:       { create: awards } }       : {}),
          ...(officeHours  ? { officeHours:  { create: officeHours } }  : {}),
        },
        include: FACULTY_INCLUDE,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException(`Faculty create failed: ${msg}`);
    }
  }

  async update(id: string, dto: UpdateFacultyDto) {
    const faculty = await this.prisma.faculty.findUnique({ where: { id } });
    if (!faculty) throw new NotFoundException(`Faculty #${id} not found`);
    const { education, publications, awards, officeHours, ...rest } = dto as any;
    return this.prisma.faculty.update({
      where: { id },
      data: {
        ...rest,
        ...(education    ? { education:    { deleteMany: {}, create: education } }    : {}),
        ...(publications ? { publications: { deleteMany: {}, create: publications } } : {}),
        ...(awards       ? { awards:       { deleteMany: {}, create: awards } }       : {}),
        ...(officeHours  ? { officeHours:  { deleteMany: {}, create: officeHours } }  : {}),
      },
      include: FACULTY_INCLUDE,
    });
  }

  async remove(id: string) {
    const faculty = await this.prisma.faculty.findUnique({ where: { id } });
    if (!faculty) throw new NotFoundException(`Faculty #${id} not found`);
    return this.prisma.faculty.delete({ where: { id } });
  }
}
