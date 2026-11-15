import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { FacultyService } from './faculty.service';
import type { CreateFacultyDto } from './dto/create-faculty.dto';
import type { UpdateFacultyDto } from './dto/update-faculty.dto';
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
  @ApiOperation({ summary: 'Get all active faculty members' })
  findAll() { return this.facultyService.findAll(); }

  @Public()
  @Get('publications/recent')
  @ApiOperation({ summary: 'Latest faculty publications — dashboard widget' })
  recentPublications(@Query('limit') limit?: string) {
    const n = limit ? parseInt(limit, 10) : 5;
    return this.facultyService.getRecentPublications(isNaN(n) ? 5 : Math.min(n, 20));
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
    @Body() dto: CreateFacultyDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.facultyService.create(dto);
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
    @Body() dto: UpdateFacultyDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.facultyService.update(id, dto);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'UPDATE_FACULTY', ip);
    return result;
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
