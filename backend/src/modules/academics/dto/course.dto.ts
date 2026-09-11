import {
  IsString, IsNumber, IsEnum, IsBoolean, IsOptional,
  IsArray, Min, Max, MinLength, IsInt,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'CSE-301' })
  @IsString() @MinLength(2)
  code: string;

  @ApiProperty({ example: 'Data Structures & Algorithms' })
  @IsString() @MinLength(2)
  title: string;

  @ApiProperty({ example: 3 })
  @IsNumber() @Min(0) @Max(6)
  credits: number;

  @ApiProperty({ example: 3 })
  @IsInt() @Min(1) @Max(12)
  semester: number;

  @ApiProperty({ enum: ['BSc', 'MSc', 'PhD'] })
  @IsEnum(['BSc', 'MSc', 'PhD'])
  degree: string;

  @ApiProperty({ enum: ['core', 'elective', 'lab', 'sessional', 'theory', 'practical', 'project'] })
  @IsEnum(['core', 'elective', 'lab', 'sessional', 'theory', 'practical', 'project'])
  type: string;

  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() objectives?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) prerequisites?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) learningOutcomes?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) topics?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() syllabusUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() teacherName?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) theoryHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) labHours?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sortOrder?: number;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
