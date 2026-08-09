import { Module } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import {
  ProgramsController,
  CoursesController,
  ResourcesController,
  LaboratoriesController,
  AcademicsStatsController,
} from './academics.controller';

@Module({
  controllers: [
    ProgramsController,
    CoursesController,
    ResourcesController,
    LaboratoriesController,
    AcademicsStatsController,
  ],
  providers: [AcademicsService],
  exports: [AcademicsService],
})
export class AcademicsModule {}
