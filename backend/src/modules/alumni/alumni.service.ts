import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IsOptional, IsString, IsBoolean, IsNumber, MaxLength,
} from 'class-validator';
import { PrismaService } from '../../database/prisma.service';

export class CreateAlumniDto {
  @IsString() @MaxLength(200)  name: string;
  @IsString() @MaxLength(300)  email: string;
  @IsOptional() @IsString()    photo?: string;
  @IsOptional() @IsString()    phone?: string;
  @IsOptional() @IsString()    currentCity?: string;
  @IsOptional() @IsString()    currentCountry?: string;
  @IsOptional() @IsNumber()    batchYear?: number;
  @IsOptional() @IsNumber()    graduationYear?: number;
  @IsOptional() @IsString()    degree?: string;
  @IsOptional() @IsString()    studentId?: string;
  @IsOptional() @IsString()    cgpa?: string;
  @IsOptional() @IsString()    currentDesignation?: string;
  @IsOptional() @IsString()    currentOrganization?: string;
  @IsOptional() @IsString()    industry?: string;
  @IsOptional() @IsString()    testimonial?: string;
  @IsOptional() @IsString()    linkedinUrl?: string;
  @IsOptional() @IsString()    githubUrl?: string;
  @IsOptional() @IsString()    websiteUrl?: string;
  @IsOptional() @IsBoolean()   isProfilePublic?: boolean;
  @IsOptional() @IsBoolean()   isFeatured?: boolean;
  @IsOptional() @IsBoolean()   isVerified?: boolean;
  @IsOptional() @IsString()    approvalStatus?: string;
  @IsOptional() @IsBoolean()   willingToMentor?: boolean;
  @IsOptional() @IsBoolean()   willingToSpeak?: boolean;
  @IsOptional() @IsString()    mentorshipTopics?: string;
}

const ALUMNI_INCLUDE = {
  workExperience:  true,
  higherEducation: true,
  achievements:    true,
} as const;

@Injectable()
export class AlumniService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(isAdmin = false) {
    return this.prisma.alumni.findMany({
      where: isAdmin ? {} : { isProfilePublic: true, approvalStatus: 'approved' },
      orderBy: { batchYear: 'desc' },
      include: ALUMNI_INCLUDE,
    });
  }

  async findById(id: string) {
    const doc = await this.prisma.alumni.findUnique({ where: { id }, include: ALUMNI_INCLUDE });
    if (!doc) throw new NotFoundException(`Alumni ${id} not found`);
    return doc;
  }

  async create(dto: CreateAlumniDto) {
    return this.prisma.alumni.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateAlumniDto>) {
    const doc = await this.prisma.alumni.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Alumni ${id} not found`);
    return this.prisma.alumni.update({ where: { id }, data: dto, include: ALUMNI_INCLUDE });
  }

  async remove(id: string) {
    const doc = await this.prisma.alumni.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Alumni ${id} not found`);
    return this.prisma.alumni.delete({ where: { id } });
  }
}
