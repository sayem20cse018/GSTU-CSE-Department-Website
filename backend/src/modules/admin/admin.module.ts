import { Module } from '@nestjs/common';
import { AdminManagementController } from './admin.controller';
import { AdminManagementService }    from './admin.service';

@Module({
  controllers: [AdminManagementController],
  providers:   [AdminManagementService],
})
export class AdminManagementModule {}
