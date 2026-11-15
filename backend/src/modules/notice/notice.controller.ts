import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { NoticeService, CreateNoticeDto } from './notice.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

@ApiTags('Notices')
@Controller('notices')
export class NoticeController {
  constructor(
    private readonly svc: NoticeService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published notices' })
  findAll(@Query('admin') admin?: string) {
    return this.svc.findAll(admin === 'true');
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get notice by ID' })
  findOne(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard) @Roles('editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create notice' })
  async create(
    @Body() dto: CreateNoticeDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.create(dto);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'CREATE_NOTICE', ip);
    return result;
  }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update notice' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateNoticeDto>,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.update(id, dto);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'UPDATE_NOTICE', ip);
    return result;
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete notice' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.remove(id);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'DELETE_NOTICE', ip);
    return result;
  }
}
