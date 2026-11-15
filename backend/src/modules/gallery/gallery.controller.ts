import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { GalleryService, CreateGalleryDto } from './gallery.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly svc: GalleryService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  findAll(@Query('admin') admin?: string) { return this.svc.findAll(admin === 'true'); }

  @Public() @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.svc.findBySlug(slug); }

  @Post() @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  @ApiOperation({ summary: '[Editor] Create gallery album' })
  async create(
    @Body() dto: CreateGalleryDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.create(dto);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'CREATE_GALLERY', ip);
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  @ApiOperation({ summary: '[Editor] Update gallery album' })
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateGalleryDto>,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.update(id, dto);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'UPDATE_GALLERY', ip);
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete gallery album' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.remove(id);
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    void this.logger.log(admin.id, 'DELETE_GALLERY', ip);
    return result;
  }
}
