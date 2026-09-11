import {
  IsString, IsNumber, IsEnum, IsBoolean,
  IsOptional, IsArray, Min, MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProgramDto {
  @ApiProperty() @IsString() @MinLength(3) name: string;

  @ApiProperty({ enum: ['BSc', 'MSc', 'PhD'] })
  @IsEnum(['BSc', 'MSc', 'PhD'])
  degree: string;

  @ApiProperty({ example: '4 Years' }) @IsString() duration: string;
  @ApiProperty({ example: 160 }) @IsNumber() @Min(0) totalCredits: number;
  @ApiProperty() @IsString() @MinLength(2) description: string;
  @ApiProperty() @IsString() objectives: string;
  @ApiProperty() @IsString() eligibility: string;

  @ApiPropertyOptional() @IsOptional() @IsArray() admissionRequirements?: { label: string; value: string }[];
  @ApiPropertyOptional() @IsOptional() @IsArray() careerOpportunities?: { title: string; description?: string }[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) highlights?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) learningOutcomes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) totalSeats?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() tuitionFee?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brochureUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sortOrder?: number;
}

export class UpdateProgramDto extends PartialType(CreateProgramDto) {}
