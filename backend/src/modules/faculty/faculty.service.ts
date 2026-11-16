import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  findAll(isAdmin = false) {
    return this.prisma.faculty.findMany({
      where: isAdmin
        ? {}
        : { isActive: true, NOT: { name: '' } },
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
    const safeStr = (v: unknown) => (v != null && typeof v !== 'function' ? String(v).trim() : undefined);
    const safeBool = (v: unknown, def: boolean) => (typeof v === 'boolean' ? v : def);
    const safeNum = (v: unknown, def: number) => (typeof v === 'number' ? v : def);
    const safeArr = (v: unknown): object[] => (Array.isArray(v) ? v : []);

    const d = dto as unknown as Record<string, unknown>;

    // Name is the only hard requirement — never create an "anonymous" record
    const name = safeStr(d.name);
    if (!name) {
      throw new BadRequestException('Name is required.');
    }

    const email = safeStr(d.email) ?? '';
    // Email is optional at DB level but recommended — use empty string if not provided
    // Prisma requires unique email, so use a generated one if empty to avoid conflicts
    const finalEmail = email || `faculty-${Date.now()}@gstu.edu.bd`;

    const data: Record<string, unknown> = {
      name:             name,
      email:            finalEmail,
      designation:      safeStr(d.designation) ?? 'Lecturer',
      staffType:        safeStr(d.staffType) ?? 'faculty',
      employmentStatus: safeStr(d.employmentStatus) ?? 'full_time',
      isActive:         safeBool(d.isActive, true),
      sortOrder:        safeNum(d.sortOrder, 0),
      researchInterests: safeArr(d.researchInterests),
      courses:          safeArr(d.courses),
    };

    // Optional string fields
    const optionalStrings = ['title','phone','photo','shortBio','fullBio','slug','officeRoom',
      'websiteUrl','googleScholarUrl','linkedinUrl','researchGateUrl','orcidId'] as const;    for (const key of optionalStrings) {
      const v = safeStr(d[key]);
      if (v !== undefined && v !== '') data[key] = v;
    }
    if (d.joinedAt) data.joinedAt = new Date(safeStr(d.joinedAt) ?? '');

    const education    = safeArr(d.education);
    const publications = safeArr(d.publications);
    const awards       = safeArr(d.awards);
    const officeHours  = safeArr(d.officeHours);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.faculty.create({
      data: {
        ...data,
        ...(education.length    ? { education:    { create: education    } } : {}),
        ...(publications.length ? { publications: { create: publications } } : {}),
        ...(awards.length       ? { awards:       { create: awards       } } : {}),
        ...(officeHours.length  ? { officeHours:  { create: officeHours  } } : {}),
      } as any,
      include: FACULTY_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateFacultyDto) {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);

    const d = dto as unknown as Record<string, unknown>;
    const safeStr = (v: unknown) => (v != null && typeof v !== 'function' ? String(v) : undefined);
    const safeArr = (v: unknown): object[] => (Array.isArray(v) ? v : []);

    // Build update payload with only provided non-function values
    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(d)) {
      if (v === undefined || typeof v === 'function') continue;
      if (['education','publications','awards','officeHours'].includes(k)) continue;
      update[k] = typeof v === 'string' ? safeStr(v) : v;
    }

    const education    = d.education    !== undefined ? safeArr(d.education)    : null;
    const publications = d.publications !== undefined ? safeArr(d.publications) : null;
    const awards       = d.awards       !== undefined ? safeArr(d.awards)       : null;
    const officeHours  = d.officeHours  !== undefined ? safeArr(d.officeHours)  : null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.faculty.update({
      where: { id },
      data: {
        ...update,
        ...(education    !== null ? { education:    { deleteMany: {}, ...(education.length    ? { create: education    } : {}) } } : {}),
        ...(publications !== null ? { publications: { deleteMany: {}, ...(publications.length ? { create: publications } : {}) } } : {}),
        ...(awards       !== null ? { awards:       { deleteMany: {}, ...(awards.length       ? { create: awards       } : {}) } } : {}),
        ...(officeHours  !== null ? { officeHours:  { deleteMany: {}, ...(officeHours.length  ? { create: officeHours  } : {}) } } : {}),
      } as any,
      include: FACULTY_INCLUDE,
    });
  }

  async remove(id: string) {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);
    return this.prisma.faculty.delete({ where: { id } });
  }

  // ─── Recent publications (dashboard widget) ──────────────────────────────
  async getRecentPublications(limit = 5) {
    const pubs = await this.prisma.facultyPublication.findMany({
      orderBy: [{ year: 'desc' }],
      take: limit,
      include: {
        faculty: { select: { name: true, designation: true, photo: true } },
      },
    });
    return pubs.map(p => ({
      id:          p.id,
      title:       p.title,
      authors:     p.authors,
      venue:       p.venue,
      year:        p.year,
      type:        p.type,
      doi:         p.doi,
      url:         p.url,
      facultyName: p.faculty.name,
    }));
  }
}
