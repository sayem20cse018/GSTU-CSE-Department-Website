import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AcademicsService } from './academics.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Academics')
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Public()
  @Get('programs')
  @ApiOperation({ summary: 'Get all academic programs' })
  findAll() { return this.academicsService.findAll(); }

  @Public()
  @Get('programs/:degree')
  @ApiOperation({ summary: 'Get program by degree (BSc | MSc | PhD)' })
  findByDegree(@Param('degree') degree: string) {
    return this.academicsService.findByDegree(degree);
  }
}
