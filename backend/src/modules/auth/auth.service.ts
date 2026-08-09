import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import type { Admin } from '@prisma/client';
import type { LoginDto } from './dto/login.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';

// ─── Constants ────────────────────────────────────────────────────────────────
const SALT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// ─── Payload & return types ───────────────────────────────────────────────────
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  lastLoginAt: Date | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Login ──────────────────────────────────────────────────────────────────
  async login(dto: LoginDto, ipAddress?: string): Promise<AuthTokens & { admin: AdminProfile }> {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!admin) throw new UnauthorizedException('Invalid email or password');

    if (!admin.isActive) {
      throw new ForbiddenException('Account deactivated. Contact the super admin.');
    }

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const remaining = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60_000);
      throw new ForbiddenException(`Account locked. Try again in ${remaining} minute(s).`);
    }

    const isMatch = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isMatch) {
      await this.recordFailedAttempt(admin);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset security counters & record login
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress ?? null,
        activityLog: {
          create: { action: 'LOGIN', ipAddress: ipAddress ?? null },
        },
      },
    });

    const tokens = this.generateTokens(admin.id, admin.email, admin.role);
    return { ...tokens, admin: this.sanitizeAdmin(admin) };
  }

  // ─── Refresh token ──────────────────────────────────────────────────────────
  async refreshToken(token: string): Promise<{ accessToken: string; expiresIn: number }> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const admin = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive) throw new UnauthorizedException('Admin not found or inactive');

    const accessToken = this.signToken(
      { sub: admin.id, email: admin.email, role: admin.role },
      this.configService.get<string>('JWT_SECRET') ?? '',
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m',
    );

    return { accessToken, expiresIn: 15 * 60 };
  }

  // ─── Get profile ────────────────────────────────────────────────────────────
  async getProfile(adminId: string): Promise<AdminProfile> {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');
    return this.sanitizeAdmin(admin);
  }

  // ─── Update profile ─────────────────────────────────────────────────────────
  async updateProfile(
    adminId: string,
    dto: { name?: string; email?: string },
  ): Promise<{ message: string; admin: AdminProfile }> {
    const update: Record<string, string> = {};
    if (dto.name?.trim()) update.name = dto.name.trim();
    if (dto.email?.trim()) update.email = dto.email.toLowerCase().trim();

    if (Object.keys(update).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    if (update.email) {
      const existing = await this.prisma.admin.findFirst({
        where: { email: update.email, NOT: { id: adminId } },
      });
      if (existing) throw new BadRequestException('Email already in use');
    }

    const admin = await this.prisma.admin.update({
      where: { id: adminId },
      data: update,
    });
    return { message: 'Profile updated successfully', admin: this.sanitizeAdmin(admin) };
  }

  // ─── Change password ────────────────────────────────────────────────────────
  async changePassword(adminId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, admin.passwordHash);
    if (!isMatch) throw new BadRequestException('Current password is incorrect');

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must differ from the current one');
    }

    const newHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        passwordHash: newHash,
        activityLog: { create: { action: 'CHANGE_PASSWORD' } },
      },
    });

    return { message: 'Password changed successfully' };
  }

  // ─── Logout ─────────────────────────────────────────────────────────────────
  async logout(adminId: string): Promise<{ message: string }> {
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { activityLog: { create: { action: 'LOGOUT' } } },
    });
    return { message: 'Logged out successfully' };
  }

  // ─── Create super admin (seed) ──────────────────────────────────────────────
  async createSuperAdmin(name: string, email: string, password: string): Promise<AdminProfile> {
    const existing = await this.prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) throw new BadRequestException(`Admin with email ${email} already exists`);

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = await this.prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'super_admin',
        permissions: [
          'manage_faculty', 'manage_news', 'manage_events', 'manage_notice',
          'manage_gallery', 'manage_alumni', 'manage_research', 'manage_admins',
        ],
        isActive: true,
        isEmailVerified: true,
      },
    });
    return this.sanitizeAdmin(admin);
  }

  // ─── Validate payload (called by JwtStrategy) ───────────────────────────────
  async validatePayload(payload: JwtPayload): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive) throw new UnauthorizedException('Admin not found or inactive');
    return admin;
  }

  // ─── Private helpers ────────────────────────────────────────────────────────
  private generateTokens(id: string, email: string, role: string): AuthTokens {
    const payload = { sub: id, email, role };
    const accessToken = this.signToken(
      payload,
      this.configService.get<string>('JWT_SECRET') ?? '',
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m',
    );
    const refreshToken = this.signToken(
      payload,
      this.configService.get<string>('JWT_REFRESH_SECRET') ?? '',
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    );
    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }

  private signToken(
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, { secret, expiresIn } as Parameters<JwtService['sign']>[1]);
  }

  private async recordFailedAttempt(admin: Admin): Promise<void> {
    const attempts = (admin.failedLoginAttempts ?? 0) + 1;
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: {
        failedLoginAttempts: attempts,
        ...(attempts >= MAX_FAILED_ATTEMPTS
          ? { lockedUntil: new Date(Date.now() + LOCK_DURATION_MS) }
          : {}),
      },
    });
  }

  private sanitizeAdmin(admin: Admin): AdminProfile {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions ?? [],
      lastLoginAt: admin.lastLoginAt ?? null,
    };
  }
}
