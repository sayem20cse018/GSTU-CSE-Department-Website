import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { ClubsService, CreateClubDto } from './clubs.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

function ip(req: Request) {
  return String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
}

@ApiTags('Clubs')
@Controller('clubs')
export class ClubsController {
  constructor(
    private readonly svc: ClubsService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  findAll(@Query('admin') admin?: string) { return this.svc.findAll(admin === 'true'); }

  @Public() @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.svc.findBySlug(slug); }

  @Post() @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  @ApiOperation({ summary: '[Editor] Create club' })
  async create(@Body() dto: CreateClubDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.create(dto);
    void this.logger.log(admin.id, 'CREATE_CLUB', ip(req));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  @ApiOperation({ summary: '[Editor] Update club' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateClubDto>, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.update(id, dto);
    void this.logger.log(admin.id, 'UPDATE_CLUB', ip(req));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete club' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.remove(id);
    void this.logger.log(admin.id, 'DELETE_CLUB', ip(req));
    return result;
  }
}
