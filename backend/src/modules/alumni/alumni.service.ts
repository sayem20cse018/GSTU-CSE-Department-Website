import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IsOptional, IsString, IsBoolean, IsNumber, MaxLength,
} from 'class-validator';
import { Alumni, AlumniDocument } from './schemas/alumni.schema';

export class CreateAlumniDto {
  @IsString() @MaxLength(200) name: string;
  @IsString() @MaxLength(300) email: string;
  @IsOptional() @IsString() photo?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() currentCity?: string;
  @IsOptional() @IsString() currentCountry?: string;
  @IsOptional() @IsNumber() batchYear?: number;
  @IsOptional() @IsNumber() graduationYear?: number;
  @IsOptional() @IsString() degree?: string;
  @IsOptional() @IsString() studentId?: string;
  @IsOptional() @IsString() cgpa?: string;
  @IsOptional() @IsString() currentDesignation?: string;
  @IsOptional() @IsString() currentOrganization?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() testimonial?: string;
  @IsOptional() @IsString() linkedinUrl?: string;
  @IsOptional() @IsString() githubUrl?: string;
  @IsOptional() @IsString() websiteUrl?: string;
  @IsOptional() @IsBoolean() isProfilePublic?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isVerified?: boolean;
  @IsOptional() @IsString() approvalStatus?: string;
  @IsOptional() @IsBoolean() willingToMentor?: boolean;
  @IsOptional() @IsBoolean() willingToSpeak?: boolean;
  @IsOptional() @IsString() mentorshipTopics?: string;
}

@Injectable()
export class AlumniService {
  constructor(
    @InjectModel(Alumni.name)
    private readonly model: Model<AlumniDocument>,
  ) {}

  async findAll(isAdmin = false) {
    const filter = isAdmin ? {} : { isProfilePublic: true, approvalStatus: 'approved' };
    return this.model.find(filter).sort({ batchYear: -1 }).lean();
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException(`Alumni ${id} not found`);
    return doc;
  }

  async create(dto: CreateAlumniDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: Partial<CreateAlumniDto>) {
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!doc) throw new NotFoundException(`Alumni ${id} not found`);
    return doc;
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException(`Alumni ${id} not found`);
  }
}
