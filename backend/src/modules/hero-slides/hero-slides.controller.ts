import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Hero Slides')
@Controller('hero-slides')
export class HeroSlidesController {
  constructor(private readonly svc: HeroSlidesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get active hero slides (public)' })
  findAll(@Query('admin') admin?: string) {
    return this.svc.findAll(admin === 'true');
  }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create slide' })
  create(@Body() dto: CreateHeroSlideDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update slide' })
  update(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete slide' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
