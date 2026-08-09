import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Admin } from '@prisma/client';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── POST /api/auth/login ────────────────────────────────────────────────
  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login — returns access + refresh tokens' })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({ description: 'Account locked or inactive' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded)
      ? forwarded[0]
      : (forwarded ?? req.socket.remoteAddress ?? 'unknown');
    return this.authService.login(dto, ip);
  }

  // ─── POST /api/auth/refresh ──────────────────────────────────────────────
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtain a new access token using the refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  // ─── GET /api/auth/me ────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get currently authenticated admin profile' })
  async getMe(@CurrentUser() admin: Admin) {
    return this.authService.getProfile(admin.id);
  }

  // ─── PATCH /api/auth/update-profile ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update admin name and/or email' })
  async updateProfile(
    @CurrentUser() admin: Admin,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(admin.id, dto);
  }

  // ─── PATCH /api/auth/change-password ────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current admin password' })
  async changePassword(
    @CurrentUser() admin: Admin,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(admin.id, dto);
  }

  // ─── POST /api/auth/logout ───────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout — records activity. Client must discard tokens.' })
  async logout(@CurrentUser() admin: Admin) {
    return this.authService.logout(admin.id);
  }
}
