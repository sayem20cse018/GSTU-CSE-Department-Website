import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from './database/prisma.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check — includes DB connectivity probe' })
  async healthCheck(): Promise<{
    status: string;
    db: string;
    timestamp: string;
    version: string;
  }> {
    let db = 'ok';
    try {
      // Minimal query — just checks the connection is alive, returns nothing sensitive
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'error';
    }

    return {
      status: db === 'ok' ? 'ok' : 'degraded',
      db,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
