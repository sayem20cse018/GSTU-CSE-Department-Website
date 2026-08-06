import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alumni, AlumniSchema } from './schemas/alumni.schema';
import { AlumniController } from './alumni.controller';
import { AlumniService }    from './alumni.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Alumni.name, schema: AlumniSchema }])],
  controllers: [AlumniController],
  providers:   [AlumniService],
  exports:     [AlumniService],
})
export class AlumniModule {}
