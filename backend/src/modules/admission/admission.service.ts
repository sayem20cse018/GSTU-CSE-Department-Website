import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, ForbiddenException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../database/prisma.service";

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export class SubmitApplicationDto {
  session: string;
  program: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  email: string;
  phone: string;
  presentAddress?: string;
  permanentAddress?: string;
  fatherName?: string;
  motherName?: string;
  guardianPhone?: string;
  sscBoard?: string; sscRoll?: string; sscRegNo?: string; sscYear?: string; sscGpa?: string;
  hscBoard?: string; hscRoll?: string; hscRegNo?: string; hscYear?: string; hscGpa?: string;
  photoUrl?: string;
  sscDocUrl?: string;
  hscDocUrl?: string;
  otherDocUrl?: string;
  trackingPassword: string;  // applicant chooses password for status tracking
}

export class UpdateApplicationStatusDto {
  status?: string;
  adminRemarks?: string;
  assignedStudentId?: string;
  assignedBatch?: string;
}

export class VerifyPaymentDto {
  paymentMethod: string;
  transactionId: string;
  paymentAmount: number;
  adminId: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────
@Injectable()
export class AdmissionService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Generate Application ID ──────────────────────────────────────────────
  private async nextApplicationId(session: string): Promise<string> {
    const year = session.slice(0, 4);
    const count = await this.prisma.admissionApplication.count({
      where: { session },
    });
    return `APP-${year}-${String(count + 1).padStart(5, "0")}`;
  }

  // ─── Submit Application ───────────────────────────────────────────────────
  async submitApplication(dto: SubmitApplicationDto) {
    // Check admission is open
    const setting = await this.prisma.admissionSetting.findFirst({
      where: { session: dto.session, isOpen: true },
    });
    if (!setting) {
      throw new ForbiddenException(`Admissions for session ${dto.session} are currently closed.`);
    }

    // Deadline check
    if (setting.appDeadline && new Date() > setting.appDeadline) {
      throw new ForbiddenException("Application deadline has passed.");
    }

    // Duplicate check by email + session
    const dup = await this.prisma.admissionApplication.findFirst({
      where: { email: dto.email.toLowerCase(), session: dto.session },
    });
    if (dup) {
      throw new ConflictException(
        `An application for session ${dto.session} already exists for this email. Application ID: ${dup.applicationId}`,
      );
    }

    const applicationId = await this.nextApplicationId(dto.session);
    const hashedPassword = await bcrypt.hash(dto.trackingPassword, 12);

    const app = await this.prisma.admissionApplication.create({
      data: {
        applicationId,
        settingId: setting.id,
        session: dto.session,
        program: dto.program ?? "BSc",
        fullName: dto.fullName.trim(),
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone.trim(),
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        presentAddress: dto.presentAddress,
        permanentAddress: dto.permanentAddress,
        fatherName: dto.fatherName,
        motherName: dto.motherName,
        guardianPhone: dto.guardianPhone,
        sscBoard: dto.sscBoard, sscRoll: dto.sscRoll, sscRegNo: dto.sscRegNo,
        sscYear: dto.sscYear, sscGpa: dto.sscGpa,
        hscBoard: dto.hscBoard, hscRoll: dto.hscRoll, hscRegNo: dto.hscRegNo,
        hscYear: dto.hscYear, hscGpa: dto.hscGpa,
        photoUrl: dto.photoUrl,
        sscDocUrl: dto.sscDocUrl,
        hscDocUrl: dto.hscDocUrl,
        otherDocUrl: dto.otherDocUrl,
        status: "submitted",
        paymentStatus: "pending",
        paymentAmount: setting.admissionFee,
        trackingPassword: hashedPassword,
      },
    });

    // Return safe (no password)
    const { trackingPassword: _, ...safe } = app;
    return { applicationId: app.applicationId, application: safe };
  }

  // ─── Applicant Status Check (tracking login) ──────────────────────────────
  async checkStatus(applicationId: string, password: string) {
    const app = await this.prisma.admissionApplication.findUnique({
      where: { applicationId: applicationId.toUpperCase() },
    });
    if (!app) throw new NotFoundException("Application not found.");
    if (!app.trackingPassword) throw new BadRequestException("Tracking password not set.");

    const ok = await bcrypt.compare(password, app.trackingPassword);
    if (!ok) throw new ForbiddenException("Invalid password.");

    const { trackingPassword: _, ...safe } = app;
    return safe;
  }

  // ─── List Applications (admin) ────────────────────────────────────────────
  async listApplications(filters: {
    status?: string; session?: string; search?: string;
    page?: number; limit?: number;
  }) {
    const { status, session, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (session) where.session = session;
    if (search) {
      where.OR = [
        { applicationId: { contains: search, mode: "insensitive" } },
        { fullName:       { contains: search, mode: "insensitive" } },
        { email:          { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.admissionApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true, applicationId: true, session: true, program: true,
          fullName: true, email: true, phone: true,
          status: true, paymentStatus: true, paymentAmount: true,
          adminRemarks: true, assignedStudentId: true, assignedBatch: true,
          createdAt: true, updatedAt: true,
        },
      }),
      this.prisma.admissionApplication.count({ where }),
    ]);

    return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ─── Get Single Application (admin) ──────────────────────────────────────
  async getApplication(id: string) {
    const app = await this.prisma.admissionApplication.findUnique({
      where: { id },
    });
    if (!app) throw new NotFoundException("Application not found.");
    const { trackingPassword: _, ...safe } = app;
    return safe;
  }

  // ─── Update Status (admin review) ────────────────────────────────────────
  async updateStatus(id: string, dto: UpdateApplicationStatusDto, adminId: string) {
    const app = await this.prisma.admissionApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException("Application not found.");

    // On approval: validate assignedStudentId provided
    if (dto.status === "approved") {
      if (!dto.assignedStudentId) throw new BadRequestException("assignedStudentId required for approval.");
      if (app.paymentStatus !== "verified") {
        throw new BadRequestException("Payment must be verified before approving.");
      }
      // Prevent duplicate Student IDs
      const existing = await this.prisma.studentRecord.findUnique({
        where: { studentId: dto.assignedStudentId },
      });
      if (existing) {
        throw new ConflictException(`Student ID ${dto.assignedStudentId} already exists in student records.`);
      }
      // Auto-create StudentRecord on approval
      await this.prisma.studentRecord.create({
        data: {
          studentId: dto.assignedStudentId,
          name:      app.fullName,
          session:   app.session,
          batch:     dto.assignedBatch ?? app.assignedBatch ?? undefined,
          email:     app.email,
          phone:     app.phone,
          enrollmentStatus: "active",
        },
      });
    }

    return this.prisma.admissionApplication.update({
      where: { id },
      data: {
        status:           dto.status,
        adminRemarks:     dto.adminRemarks,
        assignedStudentId: dto.assignedStudentId,
        assignedBatch:    dto.assignedBatch,
        reviewedBy:       adminId,
        reviewedAt:       new Date(),
        ...(dto.status === "approved"
          ? { status: "approved" }
          : dto.status === "rejected"
          ? { status: "rejected" }
          : {}),
      },
    }).then(a => { const { trackingPassword: _, ...s } = a; return s; });
  }

  // ─── Verify Payment (admin) ───────────────────────────────────────────────
  async verifyPayment(id: string, dto: VerifyPaymentDto) {
    const app = await this.prisma.admissionApplication.findUnique({ where: { id } });
    if (!app) throw new NotFoundException("Application not found.");
    if (app.paymentStatus === "verified") {
      throw new ConflictException("Payment already verified.");
    }

    return this.prisma.admissionApplication.update({
      where: { id },
      data: {
        paymentStatus:     "verified",
        paymentMethod:     dto.paymentMethod,
        transactionId:     dto.transactionId,
        paymentAmount:     dto.paymentAmount,
        paymentDate:       new Date(),
        paymentVerifiedAt: new Date(),
        paymentVerifiedBy: dto.adminId,
        status:            "under_review",
      },
    }).then(a => { const { trackingPassword: _, ...s } = a; return s; });
  }

  // ─── Admission Settings ──────────────────────────────────────────────────
  async getSettings(session?: string) {
    if (session) {
      return this.prisma.admissionSetting.findFirst({ where: { session } });
    }
    return this.prisma.admissionSetting.findMany({ orderBy: { session: "desc" } });
  }

  async upsertSettings(data: {
    session: string; isOpen?: boolean; appStartDate?: string; appDeadline?: string;
    admissionFee?: number; feeInstructions?: string; instructions?: string;
    requiredDocuments?: string[];
  }) {
    return this.prisma.admissionSetting.upsert({
      where: { session: data.session },
      update: {
        isOpen: data.isOpen,
        appStartDate: data.appStartDate ? new Date(data.appStartDate) : undefined,
        appDeadline:  data.appDeadline  ? new Date(data.appDeadline)  : undefined,
        admissionFee: data.admissionFee,
        feeInstructions: data.feeInstructions,
        instructions:    data.instructions,
        requiredDocuments: data.requiredDocuments,
      },
      create: {
        session: data.session,
        isOpen:  data.isOpen ?? false,
        appStartDate: data.appStartDate ? new Date(data.appStartDate) : null,
        appDeadline:  data.appDeadline  ? new Date(data.appDeadline)  : null,
        admissionFee: data.admissionFee ?? 500,
        feeInstructions: data.feeInstructions,
        instructions:    data.instructions,
        requiredDocuments: data.requiredDocuments ?? [],
      },
    });
  }

  // ─── Stats (admin dashboard) ─────────────────────────────────────────────
  async getAdmissionStats(session?: string) {
    const where = session ? { session } : {};
    const [total, submitted, underReview, paymentPending, paymentVerified, approved, rejected] =
      await this.prisma.$transaction([
        this.prisma.admissionApplication.count({ where }),
        this.prisma.admissionApplication.count({ where: { ...where, status: "submitted" } }),
        this.prisma.admissionApplication.count({ where: { ...where, status: "under_review" } }),
        this.prisma.admissionApplication.count({ where: { ...where, paymentStatus: "pending" } }),
        this.prisma.admissionApplication.count({ where: { ...where, paymentStatus: "verified" } }),
        this.prisma.admissionApplication.count({ where: { ...where, status: "approved" } }),
        this.prisma.admissionApplication.count({ where: { ...where, status: "rejected" } }),
      ]);
    return { total, submitted, underReview, paymentPending, paymentVerified, approved, rejected };
  }
}