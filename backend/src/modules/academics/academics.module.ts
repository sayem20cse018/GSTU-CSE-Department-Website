import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AcademicsController } from './academics.controller';
import { AcademicsService } from './academics.service';
import { Program, ProgramSchema } from './schemas/program.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }])],
  controllers: [AcademicsController],
  providers: [AcademicsService],
})
export class AcademicsModule {}
