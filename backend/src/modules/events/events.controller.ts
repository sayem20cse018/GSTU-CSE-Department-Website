import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { EventsService, CreateEventDto } from './events.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly svc: EventsService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('admin') admin?: string,
  ) { return this.svc.findAll(+page, +limit, admin === 'true'); }

  @Public() @Get('upcoming') findUpcoming() { return this.svc.findUpcoming(); }

  @Public() @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.svc.findBySlug(slug); }

  @Post() @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  async create(
    @Body() dto: CreateEventDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.create(dto);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'CREATE_EVENT', ip);
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateEventDto>,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.update(id, dto);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'UPDATE_EVENT', ip);
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.remove(id);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'DELETE_EVENT', ip);
    return result;
  }
}
