import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class EducationDto {
  @IsString() degree: string;
  @IsString() institution: string;
  @IsNumber() year: number;
}

export class CreateFacultyDto {
  @IsOptional() @IsString() name?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  designation?: string;

  @IsOptional() @IsString()
  email?: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsString()
  photo?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  researchInterests?: string[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => EducationDto)
  education?: EducationDto[];

  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() sortOrder?: number;

  @IsOptional()
  @IsEnum(['faculty', 'staff', 'officer', 'chairman'])
  staffType?: string;

  @IsOptional() @IsString() shortBio?: string;
  @IsOptional() @IsString() fullBio?: string;
  @IsOptional() @IsString() officeRoom?: string;
  @IsOptional() @IsString() googleScholarUrl?: string;
  @IsOptional() @IsString() linkedinUrl?: string;
  @IsOptional() @IsString() researchGateUrl?: string;
  @IsOptional() @IsString() orcidId?: string;
  @IsOptional() @IsString() websiteUrl?: string;
  @IsOptional() @IsString() joinedAt?: string;
  @IsOptional() @IsEnum(['full_time','part_time','on_leave','retired']) employmentStatus?: string;
}
