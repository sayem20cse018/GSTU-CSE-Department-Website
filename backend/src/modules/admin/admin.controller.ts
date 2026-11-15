import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { IsString, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

import { AdminManagementService } from './admin.service';
import { Roles }                  from '../../common/decorators/roles.decorator';
import { RolesGuard }             from '../../common/guards/roles.guard';
import { CurrentUser }            from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService }  from '../../common/services/activity-logger.service';

export class CreateAdminDto {
  @IsString()  name: string;
  @IsEmail()   email: string;
  @IsString() @MinLength(8) password: string;
  @IsString()  role: string;
}

export class UpdateAdminDto {
  @IsOptional() @IsString()  name?: string;
  @IsOptional() @IsString()  role?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class ResetPasswordDto {
  @IsString() @MinLength(8) newPassword: string;
}

function ip(req: Request) {
  return String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
}

@ApiTags('Admin Management')
@Controller('admins')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class AdminManagementController {
  constructor(
    private readonly svc: AdminManagementService,
    private readonly logger: ActivityLoggerService,
  ) {}

  // ─── GET /api/admins — list all (admin+) ──────────────────────────────────
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: '[Admin] List all admin accounts' })
  listAdmins() {
    return this.svc.listAdmins();
  }

  // ─── POST /api/admins — create (super_admin only) ─────────────────────────
  @Post()
  @Roles('super_admin')
  @ApiOperation({ summary: '[Super Admin] Create a new admin account' })
  async createAdmin(
    @Body() dto: CreateAdminDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.createAdmin(dto);
    void this.logger.log(admin.id, `CREATE_ADMIN:${dto.role}`, ip(req));
    return result;
  }

  // ─── PATCH /api/admins/:id — update role/name/active (super_admin only) ───
  @Patch(':id')
  @Roles('super_admin')
  @ApiOperation({ summary: '[Super Admin] Update admin role, name, or active status' })
  async updateAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.updateAdmin(id, admin.id, dto);
    void this.logger.log(admin.id, `UPDATE_ADMIN`, ip(req));
    return result;
  }

  // ─── PATCH /api/admins/:id/reset-password (super_admin only) ──────────────
  @Patch(':id/reset-password')
  @Roles('super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Super Admin] Reset another admin\'s password' })
  async resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetPasswordDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.resetPassword(id, dto.newPassword);
    void this.logger.log(admin.id, `RESET_PASSWORD_ADMIN`, ip(req));
    return result;
  }

  // ─── DELETE /api/admins/:id (super_admin only) ────────────────────────────
  @Delete(':id')
  @Roles('super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete an admin account' })
  async deleteAdmin(
    @Param('id') id: string,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    await this.svc.deleteAdmin(id, admin.id);
    void this.logger.log(admin.id, `DELETE_ADMIN`, ip(req));
  }
}
