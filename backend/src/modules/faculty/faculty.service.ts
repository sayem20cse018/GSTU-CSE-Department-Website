import { Injectable, NotFoundException } from '@nestjs/common';
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
        : {
            isActive: true,
            NOT: [
              { name: '' },
              { name: 'anonymous' },
            ],
          },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: FACULTY_INCLUDE,
    });
  }

  async findOne(id: string) {
    const f = await this.prisma.faculty.findUnique({ where: { id }, include: FACULTY_INCLUDE });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);
    return f;
  }

  async create(dto: Record<string, unknown>) {
    const d = dto;

    const str = (v: unknown) => (v != null ? String(v).trim() : '');
    const optStr = (v: unknown) => { const s = str(v); return s !== '' ? s : null; };
    const bool = (v: unknown, def: boolean) => (typeof v === 'boolean' ? v : def);
    const num  = (v: unknown, def: number)  => (typeof v === 'number'  ? v : def);
    const arr  = (v: unknown) => (Array.isArray(v) ? v : []);

    const name = str(d.name);

    // Enforce single current chairman + auto-archive displaced chairman
    if (d.isCurrentChairman === true || d.leadershipRole === 'running_chairman') {
      // Archive any currently-flagged chairman records
      const displaced = await this.prisma.faculty.findMany({
        where: { isCurrentChairman: true },
        select: { id: true, chairmanTo: true },
      });
      const today = new Date();
      for (const prev of displaced) {
        await this.prisma.faculty.update({
          where: { id: prev.id },
          data: {
            isCurrentChairman: false,
            leadershipRole: 'former_chairman',
            ...(prev.chairmanTo ? {} : { chairmanTo: today }),
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (d as any).leadershipRole = 'running_chairman';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (d as any).isCurrentChairman = true;
    }
    // Former chairman MUST NOT have isCurrentChairman=true
    if (d.leadershipRole === 'former_chairman') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (d as any).isCurrentChairman = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.prisma.faculty.create({
      data: {
        name:              name,
        email:             optStr(d.email ?? dto.email),
        designation:       str(d.designation) || 'Lecturer',
        staffType:         str(d.staffType)   || 'faculty',
        // employmentStatus comes directly from admin — do NOT apply a default fallback
        // that would silently convert on_leave → full_time
        employmentStatus:  str(d.employmentStatus) !== '' ? str(d.employmentStatus) : 'full_time',
        isActive:          bool(d.isActive, true),
        sortOrder:         num(d.sortOrder, 0),
        researchInterests: arr(d.researchInterests) as string[],
        courses:           arr(d.courses)           as string[],
        title:             optStr(d.title),
        phone:             optStr(d.phone),
        photo:             optStr(d.photo),
        shortBio:          optStr(d.shortBio),
        fullBio:           optStr(d.fullBio),
        officeRoom:        optStr(d.officeRoom),
        websiteUrl:        optStr(d.websiteUrl),
        googleScholarUrl:  optStr(d.googleScholarUrl),
        linkedinUrl:       optStr(d.linkedinUrl),
        researchGateUrl:   optStr(d.researchGateUrl),
        orcidId:           optStr(d.orcidId),
        ...(d.joinedAt      ? { joinedAt:     new Date(str(d.joinedAt))      } : {}),
        leadershipRole:    optStr(d.leadershipRole),
        isCurrentChairman: bool(d.isCurrentChairman, false),
        ...(d.chairmanFrom  ? { chairmanFrom: new Date(str(d.chairmanFrom))  } : {}),
        ...(d.chairmanTo    ? { chairmanTo:   new Date(str(d.chairmanTo))    } : {}),
      } as any,
      include: FACULTY_INCLUDE,
    });
  }

  async update(id: string, dto: Record<string, unknown>) {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);

    const d = dto;
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

    // Enforce single current chairman constraint + auto-archive displaced chairman
    if (update.isCurrentChairman === true || update.leadershipRole === 'running_chairman') {
      // Find all currently-active chairmen (excluding the record being updated)
      const displaced = await this.prisma.faculty.findMany({
        where: { isCurrentChairman: true, id: { not: id } },
        select: { id: true, chairmanTo: true },
      });
      // Archive each displaced chairman: clear current flag, set role to former_chairman,
      // and set their service end date to today if it was blank.
      const today = new Date();
      for (const prev of displaced) {
        await this.prisma.faculty.update({
          where: { id: prev.id },
          data: {
            isCurrentChairman: false,
            leadershipRole: 'former_chairman',
            // Only backfill chairmanTo if not already set
            ...(prev.chairmanTo ? {} : { chairmanTo: today }),
          },
        });
      }
      update.leadershipRole = 'running_chairman';
      update.isCurrentChairman = true;
    }
    if (update.leadershipRole === 'former_chairman') {
      update.isCurrentChairman = false;
    }

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

  /**
   * Explicitly archive a currently-serving chairman as a Former Chairman.
   * Sets isCurrentChairman=false, leadershipRole=former_chairman, and backfills
   * chairmanTo to today if not already set.  Safe to call even if the person
   * is not the current chairman — it's a no-op in that case.
   */
  async archiveChairman(id: string) {
    const f = await this.prisma.faculty.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Faculty #${id} not found`);
    return this.prisma.faculty.update({
      where: { id },
      data: {
        isCurrentChairman: false,
        leadershipRole: 'former_chairman',
        ...(f.chairmanTo ? {} : { chairmanTo: new Date() }),
      },
      include: FACULTY_INCLUDE,
    });
  }

  /**
   * Validate chairman consistency — returns a summary for admin diagnostics.
   * Does NOT modify data.
   */
  async validateChairmanState() {
    const current = await this.prisma.faculty.findMany({
      where: { isCurrentChairman: true },
      select: { id: true, name: true, staffType: true, leadershipRole: true },
    });
    const orphanedRunning = await this.prisma.faculty.findMany({
      where: { leadershipRole: 'running_chairman', isCurrentChairman: false },
      select: { id: true, name: true },
    });
    const orphanedFormer = await this.prisma.faculty.findMany({
      where: {
        isCurrentChairman: true,
        leadershipRole: 'former_chairman',
      },
      select: { id: true, name: true },
    });
    return {
      currentCount: current.length,
      current,
      issues: {
        multipleCurrentChairmen: current.length > 1,
        runningRoleWithoutFlag: orphanedRunning.length > 0 ? orphanedRunning : [],
        formerRoleWithCurrentFlag: orphanedFormer.length > 0 ? orphanedFormer : [],
      },
    };
  }

  // ─── Clean up bad records (empty names, auto-generated emails) ─────────────
  async cleanupBadRecords() {
    const all = await this.prisma.faculty.findMany({ select: { id: true, name: true, email: true } });
    const bad = all.filter(f =>
      !f.name ||
      f.name.trim() === '' ||
      f.name.trim().toLowerCase() === 'anonymous' ||
      (f.email != null && f.email.match(/^faculty-\d+@/))
    );
    if (bad.length === 0) return { deleted: 0, message: 'No bad records found.' };
    const ids = bad.map(f => f.id);
    // Delete related records first
    await this.prisma.facultyEducation.deleteMany({ where: { facultyId: { in: ids } } });
    await this.prisma.facultyPublication.deleteMany({ where: { facultyId: { in: ids } } });
    await this.prisma.facultyAward.deleteMany({ where: { facultyId: { in: ids } } });
    await this.prisma.facultyOfficeHours.deleteMany({ where: { facultyId: { in: ids } } });
    await this.prisma.faculty.deleteMany({ where: { id: { in: ids } } });
    return { deleted: bad.length, message: `Deleted ${bad.length} anonymous/invalid records.` };
  }

  // ─── Current chairman ─────────────────────────────────────────────────────
  async getCurrentChairman() {
    return this.prisma.faculty.findFirst({
      where: { isCurrentChairman: true, staffType: 'chairman' },
      include: FACULTY_INCLUDE,
    });
  }

  // ─── Ex-chairmen only ─────────────────────────────────────────────────────
  async getExChairmen() {
    return this.prisma.faculty.findMany({
      where: {
        staffType: 'chairman',
        isCurrentChairman: false,
        leadershipRole: 'former_chairman',
      },
      orderBy: [{ chairmanFrom: 'asc' }],
      include: FACULTY_INCLUDE,
    });
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
