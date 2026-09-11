import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all research groups' })
  findAll() { return this.researchService.findAll(); }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get research group by ID or slug' })
  findOne(@Param('id') id: string) { return this.researchService.findById(id); }

  @Post()
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create research group' })
  create(@Body() dto: object) { return this.researchService.create(dto); }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update research group' })
  update(@Param('id') id: string, @Body() dto: object) { return this.researchService.update(id, dto); }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete research group' })
  remove(@Param('id') id: string) { return this.researchService.remove(id); }
}
