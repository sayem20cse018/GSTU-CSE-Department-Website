import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService, UpdateStatDto } from './statistics.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly svc: StatisticsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all visible statistics' })
  findAll(@Query('admin') admin?: string) {
    return this.svc.findAll(admin !== 'true');
  }

  @Patch(':id')
  @UseGuards(RolesGuard) @Roles('admin') @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update a statistic value' })
  update(@Param('id') id: string, @Body() dto: UpdateStatDto) {
    return this.svc.update(id, dto);
  }
}
