import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Admin } from '@prisma/client';
import { ResearchService } from './research.service';
import { Public }                from '../../common/decorators/public.decorator';
import { Roles }                 from '../../common/decorators/roles.decorator';
import { RolesGuard }            from '../../common/guards/roles.guard';
import { CurrentUser }           from '../../common/decorators/current-user.decorator';
import { ActivityLoggerService } from '../../common/services/activity-logger.service';

function ip(req: Request) {
  return String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
}

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(
    private readonly researchService: ResearchService,
    private readonly logger: ActivityLoggerService,
  ) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get all research groups' })
  findAll() { return this.researchService.findAll(); }

  @Public() @Get(':id')
  @ApiOperation({ summary: 'Get research group by ID or slug' })
  findOne(@Param('id') id: string) { return this.researchService.findById(id); }

  @Post() @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create research group' })
  async create(@Body() dto: object, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.researchService.create(dto);
    void this.logger.log(admin.id, 'CREATE_RESEARCH', ip(req));
    return result;
  }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update research group' })
  async update(@Param('id') id: string, @Body() dto: object, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.researchService.update(id, dto);
    void this.logger.log(admin.id, 'UPDATE_RESEARCH', ip(req));
    return result;
  }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete research group' })
  async remove(@Param('id') id: string, @CurrentUser() admin: Admin, @Req() req: Request) {
    const result = await this.researchService.remove(id);
    void this.logger.log(admin.id, 'DELETE_RESEARCH', ip(req));
    return result;
  }
}
