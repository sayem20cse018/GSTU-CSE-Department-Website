import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min, Max, MaxLength } from 'class-validator';

export class CreateHeroSlideDto {
  @IsString() @MaxLength(300)
  title: string;

  @IsString() @MaxLength(600)
  subtitle: string;

  @IsOptional() @IsString() @MaxLength(100)
  tag?: string;

  @IsOptional() @IsString() @MaxLength(2_000_000)
  imageUrl?: string;

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  overlayOpacity?: number;

  @IsOptional() @IsString() @MaxLength(100)
  primaryBtnLabel?: string;

  @IsOptional() @IsString() @MaxLength(300)
  primaryBtnHref?: string;

  @IsOptional() @IsString() @MaxLength(100)
  secondaryBtnLabel?: string;

  @IsOptional() @IsString() @MaxLength(300)
  secondaryBtnHref?: string;

  @IsOptional() @IsEnum(['left', 'center'])
  align?: string;

  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @IsOptional() @IsNumber()
  sortOrder?: number;
}

export class UpdateHeroSlideDto {
  @IsOptional() @IsString() @MaxLength(300)
  title?: string;

  @IsOptional() @IsString() @MaxLength(600)
  subtitle?: string;

  @IsOptional() @IsString() @MaxLength(100)
  tag?: string;

  @IsOptional() @IsString() @MaxLength(2_000_000)
  imageUrl?: string;

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  overlayOpacity?: number;

  @IsOptional() @IsString() @MaxLength(100)
  primaryBtnLabel?: string;

  @IsOptional() @IsString() @MaxLength(300)
  primaryBtnHref?: string;

  @IsOptional() @IsString() @MaxLength(100)
  secondaryBtnLabel?: string;

  @IsOptional() @IsString() @MaxLength(300)
  secondaryBtnHref?: string;

  @IsOptional() @IsEnum(['left', 'center'])
  align?: string;

  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @IsOptional() @IsNumber()
  sortOrder?: number;
}
