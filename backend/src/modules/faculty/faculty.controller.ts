import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FacultyService } from './faculty.service';
import type { CreateFacultyDto } from './dto/create-faculty.dto';
import type { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  // ── Public read routes ────────────────────────────────────────────────────
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active faculty members' })
  findAll() { return this.facultyService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single faculty member by ID' })
  findOne(@Param('id') id: string) { return this.facultyService.findOne(id); }

  // ── Admin-protected write routes ──────────────────────────────────────────
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create a faculty member' })
  create(@Body() dto: CreateFacultyDto) { return this.facultyService.create(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update a faculty member' })
  update(@Param('id') id: string, @Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Super Admin] Delete a faculty member' })
  remove(@Param('id') id: string) { return this.facultyService.remove(id); }
}
