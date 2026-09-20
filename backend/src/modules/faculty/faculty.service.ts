import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

// Convert a DTO class instance to a plain object without class-transformer
// (instanceToPlain returns class constructors for some fields; JSON round-trip is safer)
function toPlain(dto: object): Record<string, unknown> {
  return JSON.parse(JSON.stringify(dto)) as Record<string, unknown>;
}

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
    const plain = toPlain(dto);
    const { education, publications, awards, officeHours, ...rest } = plain;
    const data = {
      designation: 'Lecturer',
      staffType: 'faculty',
      employmentStatus: 'full_time',
      isActive: true,
      sortOrder: 0,
      ...rest,
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await this.prisma.faculty.create({
        data: {
          ...data,
          ...(education    ? { education:    { create: education as object[] } }    : {}),
          ...(publications ? { publications: { create: publications as object[] } } : {}),
          ...(awards       ? { awards:       { create: awards as object[] } }       : {}),
          ...(officeHours  ? { officeHours:  { create: officeHours as object[] } }  : {}),
        } as any,
        include: FACULTY_INCLUDE,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new InternalServerErrorException('Faculty create failed: ' + msg.slice(0, 300));
    }
  }

  async update(id: string, dto: UpdateFacultyDto) {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);
    const plain = toPlain(dto);
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
