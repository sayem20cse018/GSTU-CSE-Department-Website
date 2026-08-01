import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './schemas/admin.schema';
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
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  lastLoginAt: Date | null;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Login ──────────────────────────────────────────────────────────────────
  async login(dto: LoginDto, ipAddress?: string): Promise<AuthTokens & { admin: AdminProfile }> {
    const admin = await this.adminModel
      .findOne({ email: dto.email.toLowerCase().trim() })
      .select('+passwordHash +failedLoginAttempts +lockedUntil +activityLog')
      .exec();

    if (!admin) throw new UnauthorizedException('Invalid email or password');

    if (!admin.isActive) {
      throw new ForbiddenException('Account deactivated. Contact the super admin.');
    }

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const remaining = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60_000);
      throw new ForbiddenException(
        `Account locked. Try again in ${remaining} minute(s).`,
      );
    }

    const isMatch = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isMatch) {
      await this.recordFailedAttempt(admin);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset security counters & record successful login
    await this.adminModel.findByIdAndUpdate(admin._id, {
      $set: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress ?? null,
      },
      $push: {
        activityLog: {
          $each: [{ action: 'LOGIN', performedAt: new Date(), ipAddress }],
          $slice: -100,
        },
      },
    });

    const tokens = this.generateTokens(
      (admin._id as { toString(): string }).toString(),
      admin.email,
      admin.role,
    );
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

    const admin = await this.adminModel.findById(payload.sub).exec();
    if (!admin || !admin.isActive) throw new UnauthorizedException('Admin not found or inactive');

    const accessToken = this.signToken(
      { sub: (admin._id as { toString(): string }).toString(), email: admin.email, role: admin.role },
      this.configService.get<string>('JWT_SECRET') ?? '',
      this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m',
    );

    return { accessToken, expiresIn: 15 * 60 };
  }

  // ─── Get profile ────────────────────────────────────────────────────────────
  async getProfile(adminId: string): Promise<AdminProfile> {
    const admin = await this.adminModel.findById(adminId).exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return this.sanitizeAdmin(admin);
  }

  // ─── Change password ────────────────────────────────────────────────────────
  async changePassword(
    adminId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const admin = await this.adminModel.findById(adminId).select('+passwordHash').exec();
    if (!admin) throw new NotFoundException('Admin not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, admin.passwordHash);
    if (!isMatch) throw new BadRequestException('Current password is incorrect');

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must differ from the current one');
    }

    const newHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.adminModel.findByIdAndUpdate(adminId, {
      $set: { passwordHash: newHash },
      $push: {
        activityLog: {
          $each: [{ action: 'CHANGE_PASSWORD', performedAt: new Date() }],
          $slice: -100,
        },
      },
    });

    return { message: 'Password changed successfully' };
  }

  // ─── Logout ─────────────────────────────────────────────────────────────────
  async logout(adminId: string): Promise<{ message: string }> {
    await this.adminModel.findByIdAndUpdate(adminId, {
      $push: {
        activityLog: {
          $each: [{ action: 'LOGOUT', performedAt: new Date() }],
          $slice: -100,
        },
      },
    });
    return { message: 'Logged out successfully' };
  }

  // ─── Create super admin (seed) ──────────────────────────────────────────────
  async createSuperAdmin(
    name: string,
    email: string,
    password: string,
  ): Promise<AdminProfile> {
    const existing = await this.adminModel.findOne({ email: email.toLowerCase() });
    if (existing) throw new BadRequestException(`Admin with email ${email} already exists`);

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = await this.adminModel.create({
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
    });
    return this.sanitizeAdmin(admin);
  }

  // ─── Validate payload (called by JwtStrategy) ───────────────────────────────
  async validatePayload(payload: JwtPayload): Promise<AdminDocument> {
    const admin = await this.adminModel.findById(payload.sub).exec();
    if (!admin || !admin.isActive) throw new UnauthorizedException('Admin not found or inactive');
    return admin;
  }

  // ─── Private helpers ────────────────────────────────────────────────────────
  private generateTokens(id: string, email: string, role: string): AuthTokens {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = { sub: id, email, role };
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

  /** Wraps jwtService.sign with explicit secret to avoid StringValue type issue */
  private signToken(
    payload: Record<string, unknown>,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, { secret, expiresIn } as Parameters<JwtService['sign']>[1]);
  }

  private async recordFailedAttempt(admin: AdminDocument): Promise<void> {
    const attempts = (admin.failedLoginAttempts ?? 0) + 1;
    const update: Record<string, unknown> = { failedLoginAttempts: attempts };
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      update.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }
    await this.adminModel.findByIdAndUpdate(admin._id, { $set: update });
  }

  private sanitizeAdmin(admin: AdminDocument): AdminProfile {
    return {
      _id: (admin._id as { toString(): string }).toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions ?? [],
      lastLoginAt: admin.lastLoginAt ?? null,
    };
  }
}
