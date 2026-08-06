import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  IsEnum,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class EducationDto {
  @IsString() degree: string;
  @IsString() institution: string;
  @IsNumber() year: number;
}

export class CreateFacultyDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiProperty() @IsString() title: string;

  @ApiProperty({
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Adjunct Faculty'],
  })
  @IsEnum(['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Adjunct Faculty'])
  designation: string;

  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() photo?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  researchInterests?: string[];

  @ApiPropertyOptional({ type: [EducationDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => EducationDto)
  education?: EducationDto[];

  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sortOrder?: number;

  @ApiPropertyOptional({ enum: ['faculty', 'staff', 'officer', 'chairman'] })
  @IsOptional()
  @IsEnum(['faculty', 'staff', 'officer', 'chairman'])
  staffType?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() shortBio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() officeRoom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() googleScholarUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedinUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() orcidId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() websiteUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['full_time','part_time','on_leave','retired']) employmentStatus?: string;
}
