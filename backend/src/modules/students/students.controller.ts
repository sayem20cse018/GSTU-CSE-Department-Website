import {
  Controller, Post, Get, Delete, Body, Req, Res,
  Param, Query, UploadedFile, UseInterceptors,
  HttpCode, HttpStatus, UseGuards, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { StudentRegisterDto, StudentLoginDto } from './dto/student.dto';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

const SESSION_COOKIE = 'cse_student';
const COOKIE_OPTS = {
  httpOnly:  true,
  sameSite:  'lax' as const,
  secure:    process.env.NODE_ENV === 'production',
  maxAge:    7 * 24 * 60 * 60 * 1000, // 7 days
  path:      '/',
};

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly svc: StudentsService) {}

  // ─── Public: register ────────────────────────────────────────────────────
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: StudentRegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    const result = await this.svc.register(dto, ip);
    res.cookie(SESSION_COOKIE, result.token, COOKIE_OPTS);
    return { student: result.student };
  }

  // ─── Public: login ────────────────────────────────────────────────────────
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: StudentLoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '');
    const result = await this.svc.login(dto, ip);
    res.cookie(SESSION_COOKIE, result.token, COOKIE_OPTS);
    return { student: result.student };
  }

  // ─── Public: me (session check) ───────────────────────────────────────────
  @Public()
  @Get('me')
  async me(@Req() req: Request) {
    const token = (req.cookies as Record<string, string>)?.[SESSION_COOKIE];
    if (!token) return { student: null };
    const student = await this.svc.me(token);
    return { student };
  }

  // ─── Public: logout ───────────────────────────────────────────────────────
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = (req.cookies as Record<string, string>)?.[SESSION_COOKIE];
    if (token) await this.svc.logout(token);
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    return { message: 'Logged out' };
  }

  // ─── Public: heartbeat (keep session alive) ───────────────────────────────
  @Public()
  @Post('heartbeat')
  @HttpCode(HttpStatus.NO_CONTENT)
  async heartbeat(@Req() req: Request) {
    const token = (req.cookies as Record<string, string>)?.[SESSION_COOKIE];
    if (token) await this.svc.heartbeat(token);
  }

  // ─── Admin: list imported student records ─────────────────────────────────
  @Get('records')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async listRecords(@Query('search') search?: string) {
    return this.svc.listRecords(search);
  }

  // ─── Admin: delete a student record ──────────────────────────────────────
  @Delete('records/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRecord(@Param('id') id: string) {
    return this.svc.deleteRecord(id);
  }

  // ─── Admin: parse Excel (preview) ────────────────────────────────────────
  @Post('records/parse')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async parseExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.svc.parseExcel(file.buffer);
  }

  // ─── Admin: confirm import ────────────────────────────────────────────────
  @Post('records/import')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async importStudents(@Body() body: { rows: { studentId: string; name: string; session: string }[] }) {
    if (!Array.isArray(body?.rows) || body.rows.length === 0) {
      throw new BadRequestException('No rows to import');
    }
    return this.svc.importStudents(body.rows);
  }

  // ─── Admin: stats ─────────────────────────────────────────────────────────
  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Student system statistics for admin dashboard' })
  async getStats() {
    return this.svc.getStats();
  }
}
