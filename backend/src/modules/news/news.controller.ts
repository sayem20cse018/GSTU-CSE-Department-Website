import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService, CreateNewsDto } from './news.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly svc: NewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get paginated news' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('admin') admin?: string,
  ) {
    return this.svc.findAll(+page, +limit, admin === 'true');
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get news by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @Post()
  @UseGuards(RolesGuard) @Roles('editor')
  @ApiBearerAuth()
  create(@Body() dto: CreateNewsDto) { return this.svc.create(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('editor')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<CreateNewsDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
