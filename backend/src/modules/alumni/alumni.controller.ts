import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlumniService, CreateAlumniDto } from './alumni.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Alumni')
@Controller('alumni')
export class AlumniController {
  constructor(private readonly svc: AlumniService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get approved alumni (public)' })
  findAll(@Query('admin') admin?: string) {
    return this.svc.findAll(admin === 'true');
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get alumni by ID' })
  findById(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create alumni record' })
  create(@Body() dto: CreateAlumniDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update alumni record' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateAlumniDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete alumni record' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
