import {
  IsString, IsEnum, IsBoolean, IsOptional,
  IsArray, IsNumber, MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAcademicResourceDto {
  @ApiProperty() @IsString() @MinLength(3) title: string;

  @ApiProperty({ enum: ['routine','calendar','exam_schedule','result','guideline','other'] })
  @IsEnum(['routine','calendar','exam_schedule','result','guideline','other'])
  type: string;

  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;

  @ApiProperty({ enum: ['BSc','MSc','PhD','all'], default: 'all' })
  @IsEnum(['BSc','MSc','PhD','all'])
  targetDegree: string;

  @ApiProperty({ example: '2024-25' }) @IsString() academicYear: string;

  @ApiProperty({ enum: ['Spring','Summer','Fall','Annual'] })
  @IsEnum(['Spring','Summer','Fall','Annual'])
  term: string;

  @ApiPropertyOptional() @IsOptional() @IsArray() files?: {
    fileName: string; fileUrl: string; fileType?: string; fileSizeBytes?: number;
  }[];

  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPinned?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber()  sortOrder?: number;
}

export class UpdateAcademicResourceDto extends PartialType(CreateAcademicResourceDto) {}
