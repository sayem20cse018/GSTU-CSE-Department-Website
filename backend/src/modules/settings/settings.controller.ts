import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService, UpdateSettingsDto } from './settings.service';
import { Public }     from '../../common/decorators/public.decorator';
import { Roles }      from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get site settings (public) — base64 images stripped' })
  get() { return this.svc.getPublic(); }

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Super Admin] Get full settings including images' })
  getAdmin() { return this.svc.get(); }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Super Admin] Update site settings' })
  update(@Body() dto: UpdateSettingsDto) { return this.svc.update(dto); }
}
