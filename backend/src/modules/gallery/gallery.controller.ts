import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GalleryService, CreateGalleryDto } from './gallery.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly svc: GalleryService) {}

  @Public() @Get()
  findAll(@Query('admin') admin?: string) { return this.svc.findAll(admin === 'true'); }

  @Public() @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.svc.findBySlug(slug); }

  @Post() @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  create(@Body() dto: CreateGalleryDto) { return this.svc.create(dto); }

  @Patch(':id') @UseGuards(RolesGuard) @Roles('editor') @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreateGalleryDto>) { return this.svc.update(id, dto); }

  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
