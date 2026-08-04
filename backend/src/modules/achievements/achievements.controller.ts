import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementsService, CreateAchievementDto } from './achievements.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly svc: AchievementsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published achievements' })
  findAll(@Query('limit') limit = 20, @Query('admin') admin?: string) {
    return this.svc.findAll(+limit, admin === 'true');
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get achievement by ID' })
  findOne(@Param('id') id: string) { return this.svc.findById(id); }

  @Post()
  @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  create(@Body() dto: CreateAchievementDto) { return this.svc.create(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreateAchievementDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
