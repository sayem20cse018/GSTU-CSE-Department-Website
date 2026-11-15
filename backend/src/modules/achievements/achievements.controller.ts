import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { AchievementsService, CreateAchievementDto } from './achievements.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

function ip(req: Request) {
  return String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
}

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly svc: AchievementsService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get all published achievements' })
  findAll(@Query('limit') limit = 20, @Query('admin') admin?: string) {
    return this.svc.findAll(+limit, admin === 'true');
  }

  @Public() @Get(':id')
  @ApiOperation({ summary: 'Get achievement by ID' })
  findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post() @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  @ApiOperation({ summary: '[Editor] Create achievement' })
  async create(@Body() dto: CreateAchievementDto, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.create(dto);
    void this.logger.log(admin.id, 'CREATE_ACHIEVEMENT', ip(req));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  @ApiOperation({ summary: '[Editor] Update achievement' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateAchievementDto>, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.update(id, dto);
    void this.logger.log(admin.id, 'UPDATE_ACHIEVEMENT', ip(req));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete achievement' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.svc.remove(id);
    void this.logger.log(admin.id, 'DELETE_ACHIEVEMENT', ip(req));
    return result;
  }
}
