import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Research')
@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all research groups' })
  findAll() { return this.researchService.findAll(); }
}
