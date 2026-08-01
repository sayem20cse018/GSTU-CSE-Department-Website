import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { AcademicsService }           from './academics.service';
import { CreateProgramDto, UpdateProgramDto }           from './dto/program.dto';
import { CreateCourseDto, UpdateCourseDto }             from './dto/course.dto';
import { CreateAcademicResourceDto, UpdateAcademicResourceDto } from './dto/academic-resource.dto';
import { CreateLaboratoryDto, UpdateLaboratoryDto }     from './dto/laboratory.dto';
import { Public }             from '../../common/decorators/public.decorator';
import { Roles }              from '../../common/decorators/roles.decorator';
import { RolesGuard }         from '../../common/guards/roles.guard';

// ─────────────────────────────────────────────────────────────────────────────
//  PROGRAMS
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Programs')
@Controller('academics/programs')
export class ProgramsController {
  constructor(private readonly svc: AcademicsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active programs' })
  findAll() { return this.svc.findAllPrograms(); }

  @Public()
  @Get(':degree')
  @ApiOperation({ summary: 'Get program by degree (BSc | MSc | PhD)' })
  findByDegree(@Param('degree') degree: string) {
    return this.svc.findProgramByDegree(degree);
  }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create program' })
  create(@Body() dto: CreateProgramDto) { return this.svc.createProgram(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update program' })
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return this.svc.updateProgram(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete program' })
  remove(@Param('id') id: string) { return this.svc.deleteProgram(id); }
}

// ─────────────────────────────────────────────────────────────────────────────
//  COURSES
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Courses')
@Controller('academics/courses')
export class CoursesController {
  constructor(private readonly svc: AcademicsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get courses (filter by degree & semester)' })
  @ApiQuery({ name: 'degree',   required: false, enum: ['BSc','MSc','PhD'] })
  @ApiQuery({ name: 'semester', required: false, type: Number })
  findAll(@Query('degree') degree?: string, @Query('semester') semester?: number) {
    return this.svc.findAllCourses(degree, semester ? +semester : undefined);
  }

  @Public()
  @Get('curriculum/:degree')
  @ApiOperation({ summary: 'Get full curriculum grouped by semester' })
  getCurriculum(@Param('degree') degree: string) {
    return this.svc.getCurriculum(degree);
  }

  @Public()
  @Get('code/:code')
  @ApiOperation({ summary: 'Get course by code (e.g. CSE-301)' })
  findByCode(@Param('code') code: string) { return this.svc.findCourseByCode(code); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  findOne(@Param('id') id: string) { return this.svc.findCourseById(id); }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create course' })
  create(@Body() dto: CreateCourseDto) { return this.svc.createCourse(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update course' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.svc.updateCourse(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete course' })
  remove(@Param('id') id: string) { return this.svc.deleteCourse(id); }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ACADEMIC RESOURCES
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Resources')
@Controller('academics/resources')
export class ResourcesController {
  constructor(private readonly svc: AcademicsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get published resources' })
  @ApiQuery({ name: 'type',   required: false })
  @ApiQuery({ name: 'degree', required: false })
  findAll(@Query('type') type?: string, @Query('degree') degree?: string) {
    return this.svc.findAllResources(type, degree);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID' })
  findOne(@Param('id') id: string) { return this.svc.findResourceById(id); }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create resource' })
  create(@Body() dto: CreateAcademicResourceDto) { return this.svc.createResource(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update resource' })
  update(@Param('id') id: string, @Body() dto: UpdateAcademicResourceDto) {
    return this.svc.updateResource(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete resource' })
  remove(@Param('id') id: string) { return this.svc.deleteResource(id); }
}

// ─────────────────────────────────────────────────────────────────────────────
//  LABORATORIES
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Laboratories')
@Controller('academics/labs')
export class LaboratoriesController {
  constructor(private readonly svc: AcademicsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active labs' })
  findAll() { return this.svc.findAllLabs(); }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get lab by slug' })
  findBySlug(@Param('slug') slug: string) { return this.svc.findLabBySlug(slug); }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create lab' })
  create(@Body() dto: CreateLaboratoryDto) { return this.svc.createLab(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update lab' })
  update(@Param('id') id: string, @Body() dto: UpdateLaboratoryDto) {
    return this.svc.updateLab(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete lab' })
  remove(@Param('id') id: string) { return this.svc.deleteLab(id); }
}

// ─────────────────────────────────────────────────────────────────────────────
//  STATS (admin dashboard widget)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Academics — Stats')
@Controller('academics/stats')
export class AcademicsStatsController {
  constructor(private readonly svc: AcademicsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get academics stats for homepage/dashboard' })
  getStats() { return this.svc.getStats(); }
}
