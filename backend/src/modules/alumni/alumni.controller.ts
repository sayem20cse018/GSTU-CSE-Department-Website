import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { AlumniService, CreateAlumniDto } from './alumni.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

@ApiTags('Alumni')
@Controller('alumni')
export class AlumniController {
  constructor(
    private readonly svc: AlumniService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get approved alumni (public)' })
  findAll(@Query('admin') admin?: string) { return this.svc.findAll(admin === 'true'); }

  @Public() @Get(':id')
  @ApiOperation({ summary: 'Get alumni by ID' })
  findById(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create alumni record' })
  async create(@Body() dto: CreateAlumniDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.create(dto);
    void this.logger.log(admin.id, 'CREATE_ALUMNI', String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? ''));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update alumni record' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateAlumniDto>, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.update(id, dto);
    void this.logger.log(admin.id, 'UPDATE_ALUMNI', String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? ''));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete alumni record' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.remove(id);
    void this.logger.log(admin.id, 'DELETE_ALUMNI', String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? ''));
    return result;
  }
}
