import { Global, Module } from '@nestjs/common';
import { ActivityLoggerService } from './activity-logger.service';

@Global()
@Module({
  providers: [ActivityLoggerService],
  exports:   [ActivityLoggerService],
})
export class ActivityLoggerModule {}
