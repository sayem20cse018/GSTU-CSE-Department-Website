import {
  Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common";
import type { Request } from "express";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import type { Admin } from "@prisma/client";
import {
  AdmissionService,
  SubmitApplicationDto,
  UpdateApplicationStatusDto,
  VerifyPaymentDto,
} from "./admission.service";
import { Public }                from "../../common/decorators/public.decorator";
import { Roles }                 from "../../common/decorators/roles.decorator";
import { RolesGuard }            from "../../common/guards/roles.guard";
import { CurrentUser }           from "../../common/decorators/current-user.decorator";
import { ActivityLoggerService } from "../../common/services/activity-logger.service";

@ApiTags("Admission")
@Controller("admission")
export class AdmissionController {
  constructor(
    private readonly svc: AdmissionService,
    private readonly logger: ActivityLoggerService,
  ) {}

  // ── PUBLIC: submit application ────────────────────────────────────────────
  @Public()
  @Post("apply")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Submit a new admission application" })
  async apply(@Body() dto: SubmitApplicationDto) {
    return this.svc.submitApplication(dto);
  }

  // ── PUBLIC: check application status (tracking login) ────────────────────
  @Public()
  @Post("status")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Check admission application status" })
  async checkStatus(@Body() body: { applicationId: string; password: string }) {
    return this.svc.checkStatus(body.applicationId, body.password);
  }

  // ── PUBLIC: get admission settings for a session ──────────────────────────
  @Public()
  @Get("settings")
  @ApiOperation({ summary: "Get current admission settings" })
  async getPublicSettings(@Query("session") session?: string) {
    // Return only public fields (no admin-only internals)
    const s = await this.svc.getSettings(session ?? undefined);
    if (!s) return null;
    // Can be array or single — return as-is (no password fields in this model)
    return s;
  }

  // ── ADMIN: list all applications ──────────────────────────────────────────
  @Get("applications")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] List all admission applications" })
  async list(
    @Query("status") status?: string,
    @Query("session") session?: string,
    @Query("search") search?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.svc.listApplications({
      status,
      session,
      search,
      page:  page  ? parseInt(page,  10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  // ── ADMIN: get single application ─────────────────────────────────────────
  @Get("applications/:id")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] Get single admission application" })
  async getOne(@Param("id") id: string) {
    return this.svc.getApplication(id);
  }

  // ── ADMIN: update application status ─────────────────────────────────────
  @Patch("applications/:id/status")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] Review and update application status" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.updateStatus(id, dto, admin.id);
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "");
    void this.logger.log(admin.id, `UPDATE_ADMISSION_STATUS:${dto.status}`, ip);
    return result;
  }

  // ── ADMIN: verify payment ─────────────────────────────────────────────────
  @Patch("applications/:id/payment")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] Verify payment for an application" })
  async verifyPayment(
    @Param("id") id: string,
    @Body() dto: Omit<VerifyPaymentDto, "adminId">,
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.verifyPayment(id, { ...dto, adminId: admin.id });
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "");
    void this.logger.log(admin.id, "VERIFY_ADMISSION_PAYMENT", ip);
    return result;
  }

  // ── ADMIN: upsert settings ────────────────────────────────────────────────
  @Post("settings")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] Create or update admission settings for a session" })
  async upsertSettings(
    @Body() body: {
      session: string; isOpen?: boolean; appStartDate?: string; appDeadline?: string;
      admissionFee?: number; feeInstructions?: string; instructions?: string;
      requiredDocuments?: string[];
    },
    @CurrentUser() admin: Admin,
    @Req() req: Request,
  ) {
    const result = await this.svc.upsertSettings(body);
    const ip = String(req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "");
    void this.logger.log(admin.id, "UPDATE_ADMISSION_SETTINGS", ip);
    return result;
  }

  // ── ADMIN: stats ──────────────────────────────────────────────────────────
  @Get("stats")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] Admission statistics" })
  async stats(@Query("session") session?: string) {
    return this.svc.getAdmissionStats(session);
  }
}