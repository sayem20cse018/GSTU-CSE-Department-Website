import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';

import { AcademicsService }                                     from './academics.service';
import { CreateProgramDto, UpdateProgramDto }                   from './dto/program.dto';
import { CreateCourseDto, UpdateCourseDto }                     from './dto/course.dto';
import { CreateAcademicResourceDto, UpdateAcademicResourceDto } from './dto/academic-resource.dto';
import { CreateLaboratoryDto, UpdateLaboratoryDto }             from './dto/laboratory.dto';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

function ip(req: Request) {
  return String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROGRAMS
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Programs')
@Controller('academics/programs')
export class ProgramsController {
  constructor(
    private readonly svc: AcademicsService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get all active programs' })
  findAll() { return this.svc.findAllPrograms(); }

  @Public() @Get(':degree')
  @ApiOperation({ summary: 'Get program by degree (BSc | MSc | PhD)' })
  findByDegree(@Param('degree') degree: string) { return this.svc.findProgramByDegree(degree); }

  @Post() @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create program' })
  async create(@Body() dto: CreateProgramDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.createProgram(dto);
    void this.logger.log(admin.id, 'CREATE_PROGRAM', ip(req));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update program' })
  async update(@Param('id') id: string, @Body() dto: UpdateProgramDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.updateProgram(id, dto);
    void this.logger.log(admin.id, 'UPDATE_PROGRAM', ip(req));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('super_admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete program' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.deleteProgram(id);
    void this.logger.log(admin.id, 'DELETE_PROGRAM', ip(req));
    return result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  COURSES
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Courses')
@Controller('academics/courses')
export class CoursesController {
  constructor(
    private readonly svc: AcademicsService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get courses (filter by degree & semester)' })
  @ApiQuery({ name: 'degree',   required: false, enum: ['BSc','MSc','PhD'] })
  @ApiQuery({ name: 'semester', required: false, type: Number })
  findAll(@Query('degree') degree?: string, @Query('semester') semester?: number) {
    return this.svc.findAllCourses(degree, semester ? +semester : undefined);
  }

  @Public() @Get('curriculum/:degree')
  @ApiOperation({ summary: 'Get full curriculum grouped by semester' })
  getCurriculum(@Param('degree') degree: string) { return this.svc.getCurriculum(degree); }

  @Public() @Get('code/:code')
  @ApiOperation({ summary: 'Get course by code (e.g. CSE-301)' })
  findByCode(@Param('code') code: string) { return this.svc.findCourseByCode(code); }

  @Public() @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  findOne(@Param('id') id: string) { return this.svc.findCourseById(id); }

  @Post() @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create course' })
  async create(@Body() dto: CreateCourseDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.createCourse(dto);
    void this.logger.log(admin.id, 'CREATE_COURSE', ip(req));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update course' })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.updateCourse(id, dto);
    void this.logger.log(admin.id, 'UPDATE_COURSE', ip(req));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('super_admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete course' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.deleteCourse(id);
    void this.logger.log(admin.id, 'DELETE_COURSE', ip(req));
    return result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ACADEMIC RESOURCES
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Resources')
@Controller('academics/resources')
export class ResourcesController {
  constructor(
    private readonly svc: AcademicsService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get published resources' })
  @ApiQuery({ name: 'type',   required: false })
  @ApiQuery({ name: 'degree', required: false })
  findAll(@Query('type') type?: string, @Query('degree') degree?: string) {
    return this.svc.findAllResources(type, degree);
  }

  @Public() @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  findOne(@Param('id') id: string) { return this.svc.findResourceById(id); }

  @Post() @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create resource' })
  async create(@Body() dto: CreateAcademicResourceDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.createResource(dto);
    void this.logger.log(admin.id, 'CREATE_RESOURCE', ip(req));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update resource' })
  async update(@Param('id') id: string, @Body() dto: UpdateAcademicResourceDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.updateResource(id, dto);
    void this.logger.log(admin.id, 'UPDATE_RESOURCE', ip(req));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('super_admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete resource' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.deleteResource(id);
    void this.logger.log(admin.id, 'DELETE_RESOURCE', ip(req));
    return result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  LABORATORIES
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Laboratories')
@Controller('academics/labs')
export class LaboratoriesController {
  constructor(
    private readonly svc: AcademicsService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get all active labs' })
  findAll() { return this.svc.findAllLabs(); }

  @Public() @Get(':slug')
  @ApiOperation({ summary: 'Get lab by slug' })
  findBySlug(@Param('slug') slug: string) { return this.svc.findLabBySlug(slug); }

  @Post() @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create lab' })
  async create(@Body() dto: CreateLaboratoryDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.createLab(dto);
    void this.logger.log(admin.id, 'CREATE_LAB', ip(req));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update lab' })
  async update(@Param('id') id: string, @Body() dto: UpdateLaboratoryDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.updateLab(id, dto);
    void this.logger.log(admin.id, 'UPDATE_LAB', ip(req));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('super_admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete lab' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.deleteLab(id);
    void this.logger.log(admin.id, 'DELETE_LAB', ip(req));
    return result;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  STATS (admin dashboard widget)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Stats')
@Controller('academics/stats')
export class AcademicsStatsController {
  constructor(private readonly svc: AcademicsService) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get academics stats for homepage/dashboard' })
  getStats() { return this.svc.getStats(); }
}
