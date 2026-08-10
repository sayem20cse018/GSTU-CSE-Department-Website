import {
  Injectable, UnauthorizedException, BadRequestException,
  NotFoundException, ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { PrismaService } from '../../database/prisma.service';
import type { StudentRegisterDto, StudentLoginDto } from './dto/student.dto';

const ONLINE_THRESHOLD_MS = 15 * 60 * 1000; // 15 min inactivity = offline

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── REGISTRATION ───────────────────────────────────────────────────────────
  async register(dto: StudentRegisterDto, ip?: string) {
    const record = await this.prisma.studentRecord.findUnique({
      where: { studentId: dto.studentId.toUpperCase() },
    });
    if (!record) {
      throw new BadRequestException(
        'Student ID not found in CSE student database. Please contact the department.',
      );
    }

    const existing = await this.prisma.studentUser.findUnique({
      where: { studentId: dto.studentId.toUpperCase() },
    });
    if (existing) {
      throw new ConflictException('This student ID is already registered. Please log in.');
    }

    const emailTaken = await this.prisma.studentUser.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (emailTaken) throw new ConflictException('Email already in use.');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.studentUser.create({
      data: {
        studentId:    record.studentId,
        name:         record.name,
        email:        dto.email.toLowerCase(),
        passwordHash,
        session:      record.session,
        phone:        dto.phone,
        lastLoginAt:  new Date(),
        lastLoginIp:  ip,
        totalLoginCount: 1,
      },
    });

    const token = await this.createSession(user.id, ip);
    return { token, student: this.safe(user) };
  }

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  async login(dto: StudentLoginDto, ip?: string) {
    const user = await this.prisma.studentUser.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials.');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials.');

    // Update last login
    await this.prisma.studentUser.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip,
        totalLoginCount: { increment: 1 },
      },
    });

    const token = await this.createSession(user.id, ip);
    return { token, student: this.safe(user) };
  }

  // ─── LOGOUT ──────────────────────────────────────────────────────────────────
  async logout(token: string) {
    await this.prisma.studentSession.updateMany({
      where: { token },
      data:  { isActive: false, logoutAt: new Date() },
    });
  }

  // ─── ME (validate session) ────────────────────────────────────────────────────
  async me(token: string) {
    const session = await this.prisma.studentSession.findUnique({
      where: { token },
      include: { student: true },
    });
    if (!session || !session.isActive) return null;

    // Update heartbeat
    await this.prisma.studentSession.update({
      where: { token },
      data:  { lastSeenAt: new Date() },
    });
    return this.safe(session.student);
  }

  // ─── HEARTBEAT (keep session alive) ──────────────────────────────────────────
  async heartbeat(token: string) {
    await this.prisma.studentSession.updateMany({
      where: { token, isActive: true },
      data:  { lastSeenAt: new Date() },
    });
  }

  // ─── EXCEL IMPORT ────────────────────────────────────────────────────────────
  parseExcel(buffer: Buffer) {
    const wb    = XLSX.read(buffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows  = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

    const parsed: { studentId: string; name: string; session: string }[] = [];
    const errors: string[] = [];

    rows.forEach((row, i) => {
      // Accept various column name formats
      const studentId = String(
        row['Student ID'] ?? row['StudentID'] ?? row['student_id'] ?? row['ID'] ?? ''
      ).trim().toUpperCase();
      const name = String(
        row['Name'] ?? row['Student Name'] ?? row['name'] ?? ''
      ).trim();
      const session = String(
        row['Session'] ?? row['Batch'] ?? row['session'] ?? ''
      ).trim();

      if (!studentId) { errors.push(`Row ${i + 2}: Missing Student ID`); return; }
      if (!name)      { errors.push(`Row ${i + 2}: Missing Name`);       return; }
      if (!session)   { errors.push(`Row ${i + 2}: Missing Session`);    return; }
      parsed.push({ studentId, name, session });
    });

    return { rows: parsed, errors };
  }

  async importStudents(rows: { studentId: string; name: string; session: string }[]) {
    // Find existing IDs to detect duplicates
    const existing = await this.prisma.studentRecord.findMany({
      where: { studentId: { in: rows.map(r => r.studentId) } },
      select: { studentId: true },
    });
    const existingSet = new Set(existing.map(e => e.studentId));

    const newRows  = rows.filter(r => !existingSet.has(r.studentId));
    const dupCount = rows.length - newRows.length;

    if (newRows.length > 0) {
      await this.prisma.studentRecord.createMany({
        data: newRows.map(r => ({ studentId: r.studentId, name: r.name, session: r.session })),
        skipDuplicates: true,
      });
    }

    return {
      imported:   newRows.length,
      duplicates: dupCount,
      total:      rows.length,
    };
  }

  // ─── ADMIN: list all student records ──────────────────────────────────────────
  async listRecords(search?: string) {
    return this.prisma.studentRecord.findMany({
      where: search ? {
        OR: [
          { studentId: { contains: search, mode: 'insensitive' } },
          { name:      { contains: search, mode: 'insensitive' } },
          { session:   { contains: search, mode: 'insensitive' } },
        ],
      } : {},
      include: { user: { select: { id: true, email: true, lastLoginAt: true, totalLoginCount: true } } },
      orderBy: [{ session: 'asc' }, { studentId: 'asc' }],
    });
  }

  async deleteRecord(id: string) {
    const r = await this.prisma.studentRecord.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Record not found');
    return this.prisma.studentRecord.delete({ where: { id } });
  }

  // ─── ADMIN: stats ──────────────────────────────────────────────────────────────
  async getStats() {
    const now = new Date();
    const onlineThreshold = new Date(now.getTime() - ONLINE_THRESHOLD_MS);
    const todayStart      = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalRecords,
      totalRegistered,
      onlineNow,
      todayLogins,
      totalLogins,
      lastActivity,
    ] = await this.prisma.$transaction([
      this.prisma.studentRecord.count(),
      this.prisma.studentUser.count(),
      this.prisma.studentSession.count({
        where: { isActive: true, lastSeenAt: { gte: onlineThreshold } },
      }),
      this.prisma.studentSession.count({
        where: { loginAt: { gte: todayStart } },
      }),
      this.prisma.studentUser.aggregate({ _sum: { totalLoginCount: true } }),
      this.prisma.studentSession.findFirst({
        orderBy: { loginAt: 'desc' },
        include: { student: { select: { name: true, studentId: true } } },
      }),
    ]);

    return {
      totalRecords,
      totalRegistered,
      onlineNow,
      todayLogins,
      totalLoginCount: totalLogins._sum.totalLoginCount ?? 0,
      lastActivity: lastActivity
        ? { name: lastActivity.student.name, studentId: lastActivity.student.studentId, at: lastActivity.loginAt }
        : null,
    };
  }

  // ─── PRIVATE HELPERS ──────────────────────────────────────────────────────────
  private async createSession(studentUserId: string, ip?: string) {
    const token = uuidv4();
    await this.prisma.studentSession.create({
      data: { studentUserId, token, ipAddress: ip },
    });
    return token;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private safe(user: any) {
    const { passwordHash: _, ...rest } = user;
    return rest;
  }
}
