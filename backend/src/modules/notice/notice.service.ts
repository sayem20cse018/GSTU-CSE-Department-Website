import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IsOptional, IsString, IsBoolean, IsArray, MaxLength, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrismaService } from '../../database/prisma.service';

// Attachment sub-DTO
export class AttachmentDto {
  @IsString()             fileName: string;
  @IsString()             fileUrl: string;
  @IsOptional() @IsString() fileType?: string;
  @IsOptional()           fileSizeBytes?: number;
}

export class CreateNoticeDto {
  @IsString() @MaxLength(300)                          title: string;
  @IsOptional() @IsString()                            description?: string;
  @IsOptional() @IsString()                            coverImage?: string;
  @IsOptional() @IsString()                            category?: string;
  @IsOptional() @IsArray() @IsString({ each: true })   targetAudience?: string[];
  @IsOptional() @IsBoolean()                           isPublished?: boolean;
  @IsOptional() @IsBoolean()                           isPinned?: boolean;
  @IsOptional() @IsBoolean()                           isUrgent?: boolean;
  @IsOptional() @IsString()                            expiresAt?: string;
  @IsOptional() @IsString()                            postedByName?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(isAdmin = false) {
    const now = new Date();
    return this.prisma.notice.findMany({
      where: isAdmin
        ? {}
        : { isPublished: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
      include: { attachments: true },
    });
  }

  async findById(id: string) {
    const n = await this.prisma.notice.findUnique({ where: { id }, include: { attachments: true } });
    if (!n) throw new NotFoundException(`Notice ${id} not found`);
    return n;
  }

  async create(dto: CreateNoticeDto, adminId?: string) {
    const { expiresAt, attachments, ...rest } = dto;
    return this.prisma.notice.create({
      data: {
        ...rest,
        postedById: adminId ?? null,
        publishedAt: dto.isPublished ? new Date() : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        ...(attachments?.length
          ? { attachments: { create: attachments.map(a => ({
              fileName: a.fileName,
              fileUrl:  a.fileUrl,
              fileType: (a.fileType ?? 'pdf') as 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' | 'xlsx',
              fileSizeBytes: a.fileSizeBytes ?? 0,
            })) } }
          : {}),
      },
      include: { attachments: true },
    });
  }

  async update(id: string, dto: Partial<CreateNoticeDto>) {
    const n = await this.prisma.notice.findUnique({ where: { id } });
    if (!n) throw new NotFoundException(`Notice ${id} not found`);
    const { expiresAt, attachments, ...rest } = dto;
    return this.prisma.notice.update({
      where: { id },
      data: {
        ...rest,
        ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}),
        ...(dto.isPublished && !n.isPublished ? { publishedAt: new Date() } : {}),
        // If attachments provided, replace all existing ones
        ...(attachments !== undefined
          ? { attachments: {
              deleteMany: {},
              ...(attachments.length
                ? { create: attachments.map(a => ({
                    fileName: a.fileName,
                    fileUrl:  a.fileUrl,
                    fileType: (a.fileType ?? 'pdf') as 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' | 'xlsx',
                    fileSizeBytes: a.fileSizeBytes ?? 0,
                  })) }
                : {}),
            } }
          : {}),
      },
      include: { attachments: true },
    });
  }

  async remove(id: string) {
    const n = await this.prisma.notice.findUnique({ where: { id } });
    if (!n) throw new NotFoundException(`Notice ${id} not found`);
    return this.prisma.notice.delete({ where: { id } });
  }

  async incrementView(id: string) {
    await this.prisma.notice.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  }
}
