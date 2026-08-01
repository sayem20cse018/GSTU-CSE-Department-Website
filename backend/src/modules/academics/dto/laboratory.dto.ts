import {
  IsString, IsNumber, IsEnum, IsBoolean, IsEmail,
  IsOptional, IsArray, Min, MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLaboratoryDto {
  @ApiProperty() @IsString() @MinLength(3) name: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() @MinLength(20) description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() shortDescription?: string;
  @ApiProperty() @IsString() location: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) capacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) workstations?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() inCharge?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() inChargeEmail?: string;

  @ApiPropertyOptional({ enum: ['teaching','research','both'] })
  @IsOptional() @IsEnum(['teaching','research','both'])
  labType?: string;

  @ApiPropertyOptional() @IsOptional() @IsArray() equipment?: {
    name: string; quantity?: number; specification?: string;
  }[];

  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) softwareInstalled?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) facilities?: string[];

  @ApiPropertyOptional() @IsOptional() @IsArray() images?: {
    url: string; caption?: string; isCover?: boolean;
  }[];

  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFeatured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sortOrder?: number;
}

export class UpdateLaboratoryDto extends PartialType(CreateLaboratoryDto) {}
