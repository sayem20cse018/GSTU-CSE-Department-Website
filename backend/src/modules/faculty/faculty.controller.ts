import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { FacultyService } from './faculty.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly logger: ActivityLoggerService,
  ) {}

  // ── Public read routes ────────────────────────────────────────────────────
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all faculty members (active only for public, all for admin)' })
  findAll(@Query('admin') admin?: string) {
    return this.facultyService.findAll(admin === 'true');
  }

  @Public()
  @Get('publications/recent')
  @ApiOperation({ summary: 'Latest faculty publications — dashboard widget' })
  recentPublications(@Query('limit') limit?: string) {
    const n = limit ? parseInt(limit, 10) : 5;
    return this.facultyService.getRecentPublications(isNaN(n) ? 5 : Math.min(n, 20));
  }

  @Public()
  @Get('current-chairman')
  @ApiOperation({ summary: 'Get the currently serving Chairman/Head' })
  getCurrentChairman() {
    return this.facultyService.getCurrentChairman();
  }

  @Public()
  @Get('ex-chairmen')
  @ApiOperation({ summary: 'Get all ex-chairmen / former chairmen' })
  getExChairmen() {
    return this.facultyService.getExChairmen();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single faculty member by ID' })
  findOne(@Param('id') id: string) { return this.facultyService.findOne(id); }

  // ── Admin-protected write routes ──────────────────────────────────────────
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create a faculty member' })
  async create(
    @Body() body: Record<string, unknown>,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.facultyService.create(body as any);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'CREATE_FACULTY', ip);
    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update a faculty member' })
  async update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.facultyService.update(id, body as any);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'UPDATE_FACULTY', ip);
    return result;
  }

  @Delete('cleanup')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Delete records with empty names or auto-generated emails' })
  async cleanup(
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.facultyService.cleanupBadRecords();
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'CLEANUP_FACULTY', ip);
    return result;
  }

  @Patch(':id/archive-chairman')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Archive a currently serving chairman as Former Chairman' })
  async archiveChairman(
    @Param('id') id: string,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.facultyService.archiveChairman(id);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'ARCHIVE_CHAIRMAN', ip);
    return result;
  }

  @Get('chairman/validate')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Validate chairman state — diagnostic only, no changes' })
  validateChairmanState() {
    return this.facultyService.validateChairmanState();
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete a faculty member' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.facultyService.remove(id);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'DELETE_FACULTY', ip);
    return result;
  }
}
