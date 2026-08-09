import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IsOptional, IsString, IsBoolean, IsNumber, IsArray, MaxLength,
} from 'class-validator';
import { PrismaService } from '../../database/prisma.service';

export class CreateClubDto {
  @IsString() @MaxLength(200)  name: string;
  @IsString() @MaxLength(200)  slug: string;
  @IsString()                  description: string;
  @IsOptional() @IsString()    shortDescription?: string;
  @IsOptional() @IsString()    logo?: string;
  @IsOptional() @IsString()    coverImage?: string;
  @IsOptional() @IsString()    founderName?: string;
  @IsOptional() @IsString()    presidentName?: string;
  @IsOptional() @IsString()    advisorName?: string;
  @IsOptional() @IsNumber()    foundedYear?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) activities?: string[];
  @IsOptional() @IsString()    email?: string;
  @IsOptional() @IsString()    facebookUrl?: string;
  @IsOptional() @IsNumber()    memberCount?: number;
  @IsOptional() @IsBoolean()   isActive?: boolean;
  @IsOptional() @IsBoolean()   isFeatured?: boolean;
  @IsOptional() @IsNumber()    sortOrder?: number;
}

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(isAdmin = false) {
    return this.prisma.club.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findBySlug(slug: string) {
    const doc = await this.prisma.club.findUnique({ where: { slug } });
    if (!doc) throw new NotFoundException(`Club "${slug}" not found`);
    return doc;
  }

  async findById(id: string) {
    const doc = await this.prisma.club.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Club ${id} not found`);
    return doc;
  }

  create(dto: CreateClubDto) {
    return this.prisma.club.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateClubDto>) {
    const doc = await this.prisma.club.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Club ${id} not found`);
    return this.prisma.club.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const doc = await this.prisma.club.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Club ${id} not found`);
    return this.prisma.club.delete({ where: { id } });
  }
}
