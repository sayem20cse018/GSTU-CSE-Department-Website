import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AcademicsService }                 from './academics.service';
import {
  ProgramsController,
  CoursesController,
  ResourcesController,
  LaboratoriesController,
  AcademicsStatsController,
}                                           from './academics.controller';

import { Program,          ProgramSchema }          from './schemas/program.schema';
import { Course,           CourseSchema }            from './schemas/course.schema';
import { AcademicResource, AcademicResourceSchema }  from './schemas/academic-resource.schema';
import { Laboratory,       LaboratorySchema }        from './schemas/laboratory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Program.name,          schema: ProgramSchema },
      { name: Course.name,           schema: CourseSchema },
      { name: AcademicResource.name, schema: AcademicResourceSchema },
      { name: Laboratory.name,       schema: LaboratorySchema },
    ]),
  ],
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
