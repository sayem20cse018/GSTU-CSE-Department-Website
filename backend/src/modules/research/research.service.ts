import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchGroup, ResearchGroupDocument } from './schemas/research-group.schema';

@Injectable()
export class ResearchService {
  constructor(
    @InjectModel(ResearchGroup.name) private readonly researchModel: Model<ResearchGroupDocument>,
  ) {}

  async findAll(): Promise<ResearchGroup[]> {
    return this.researchModel.find().sort({ name: 1 }).exec();
  }
}
