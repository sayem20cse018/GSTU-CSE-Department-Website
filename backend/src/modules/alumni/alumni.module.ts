import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alumni, AlumniSchema } from './schemas/alumni.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Alumni.name, schema: AlumniSchema }])],
  exports: [MongooseModule],
})
export class AlumniModule {}
