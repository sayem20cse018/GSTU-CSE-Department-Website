import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all published events (paginated)' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.eventsService.findAll(+page, +limit);
  }

  @Public()
  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  findUpcoming() { return this.eventsService.findUpcoming(); }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get event by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }
}
