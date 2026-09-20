import { Injectable, NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from '../../database/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

const FACULTY_INCLUDE = {
  education:    true,
  publications: true,
  awards:       true,
  officeHours:  true,
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
    const f = await this.prisma.faculty.findUnique({ where: { id }, include: FACULTY_INCLUDE });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);
    return f;
  }

  async create(dto: CreateFacultyDto) {
    const plain = instanceToPlain(dto) as Record<string, unknown>;
    const { education, publications, awards, officeHours, ...rest } = plain;
    // Provide defaults for Prisma NOT NULL columns
    const data = {
      designation: 'Lecturer',   // default if not provided
      staffType: 'faculty',
      employmentStatus: 'full_time',
      isActive: true,
      sortOrder: 0,
      ...rest,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.faculty.create({
      data: {
        ...data,
        ...(education    ? { education:    { create: education as object[] } }    : {}),
        ...(publications ? { publications: { create: publications as object[] } } : {}),
        ...(awards       ? { awards:       { create: awards as object[] } }       : {}),
        ...(officeHours  ? { officeHours:  { create: officeHours as object[] } }  : {}),
      } as any,
      include: FACULTY_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateFacultyDto) {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);
    const plain = instanceToPlain(dto) as Record<string, unknown>;
    const { education, publications, awards, officeHours, ...rest } = plain;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.faculty.update({
      where: { id },
      data: {
        ...rest,
        ...(education    ? { education:    { deleteMany: {}, create: education as object[] } }    : {}),
        ...(publications ? { publications: { deleteMany: {}, create: publications as object[] } } : {}),
        ...(awards       ? { awards:       { deleteMany: {}, create: awards as object[] } }       : {}),
        ...(officeHours  ? { officeHours:  { deleteMany: {}, create: officeHours as object[] } }  : {}),
      } as any,
      include: FACULTY_INCLUDE,
    });
  }

  async remove(id: string) {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);
    return this.prisma.faculty.delete({ where: { id } });
  }
}
