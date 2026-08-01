import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { ResearchGroup, ResearchGroupSchema } from './schemas/research-group.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ResearchGroup.name, schema: ResearchGroupSchema }])],
  controllers: [ResearchController],
  providers: [ResearchService],
})
export class ResearchModule {}
