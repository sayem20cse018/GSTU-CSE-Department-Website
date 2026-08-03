import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NoticeService, CreateNoticeDto } from './notice.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Notices')
@Controller('notices')
export class NoticeController {
  constructor(private readonly svc: NoticeService) {}

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
  create(@Body() dto: CreateNoticeDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update notice' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateNoticeDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete notice' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
