import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Program, ProgramDocument } from './schemas/program.schema';

@Injectable()
export class AcademicsService {
  constructor(@InjectModel(Program.name) private readonly programModel: Model<ProgramDocument>) {}

  async findAll(): Promise<Program[]> {
    return this.programModel.find().sort({ degree: 1 }).exec();
  }

  async findByDegree(degree: string): Promise<Program | null> {
    return this.programModel.findOne({ degree }).exec();
  }
}
