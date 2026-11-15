import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';

export interface AdminListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

@Injectable()
export class AdminManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── List all admins ────────────────────────────────────────────────────────
  async listAdmins(): Promise<AdminListItem[]> {
    const admins = await this.prisma.admin.findMany({
      orderBy: [{ role: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    return admins;
  }

  // ─── Create admin (super_admin only) ────────────────────────────────────────
  async createAdmin(dto: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<AdminListItem> {
    const allowed = ['super_admin', 'admin', 'editor'];
    if (!allowed.includes(dto.role)) {
      throw new BadRequestException(`Invalid role. Allowed: ${allowed.join(', ')}`);
    }

    const existing = await this.prisma.admin.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) throw new BadRequestException('An admin with this email already exists');

    if (dto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const admin = await this.prisma.admin.create({
      data: {
        name:         dto.name.trim(),
        email:        dto.email.toLowerCase().trim(),
        passwordHash,
        role:         dto.role,
        isActive:     true,
        isEmailVerified: true,
        permissions: this.defaultPermissions(dto.role),
      },
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
    });
    return admin;
  }

  // ─── Update admin role / active status ─────────────────────────────────────
  async updateAdmin(
    id: string,
    requesterId: string,
    dto: { name?: string; role?: string; isActive?: boolean },
  ): Promise<AdminListItem> {
    const target = await this.prisma.admin.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Admin not found');

    // Cannot demote or deactivate yourself
    if (id === requesterId && (dto.role !== undefined || dto.isActive === false)) {
      throw new ForbiddenException('You cannot change your own role or deactivate yourself');
    }

    const allowed = ['super_admin', 'admin', 'editor'];
    if (dto.role && !allowed.includes(dto.role)) {
      throw new BadRequestException(`Invalid role`);
    }

    const data: Record<string, unknown> = {};
    if (dto.name?.trim())     data.name     = dto.name.trim();
    if (dto.role)             data.role     = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    const updated = await this.prisma.admin.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
    });
    return updated;
  }

  // ─── Reset password (super_admin only) ─────────────────────────────────────
  async resetPassword(id: string, newPassword: string): Promise<{ message: string }> {
    const target = await this.prisma.admin.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Admin not found');

    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.admin.update({
      where: { id },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
    });
    return { message: 'Password reset successfully' };
  }

  // ─── Delete admin ───────────────────────────────────────────────────────────
  async deleteAdmin(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    const target = await this.prisma.admin.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Admin not found');
    await this.prisma.admin.delete({ where: { id } });
  }

  // ─── Default permissions by role ───────────────────────────────────────────
  private defaultPermissions(role: string): string[] {
    if (role === 'super_admin') {
      return ['manage_faculty','manage_news','manage_events','manage_notice',
              'manage_gallery','manage_alumni','manage_research','manage_admins'];
    }
    if (role === 'admin') {
      return ['manage_faculty','manage_news','manage_events','manage_notice',
              'manage_gallery','manage_alumni','manage_research'];
    }
    // editor
    return ['manage_news','manage_events','manage_notice','manage_gallery'];
  }
}
