import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faculty, FacultyDocument } from './schemas/faculty.schema';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultyModel: Model<FacultyDocument>,
  ) {}

  async findAll(): Promise<Faculty[]> {
    return this.facultyModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Faculty> {
    const faculty = await this.facultyModel.findById(id).exec();
    if (!faculty) throw new NotFoundException(`Faculty #${id} not found`);
    return faculty;
  }

  async create(dto: CreateFacultyDto): Promise<Faculty> {
    const created = new this.facultyModel(dto);
    return created.save();
  }

  async update(id: string, dto: UpdateFacultyDto): Promise<Faculty> {
    const updated = await this.facultyModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Faculty #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.facultyModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Faculty #${id} not found`);
  }
}
