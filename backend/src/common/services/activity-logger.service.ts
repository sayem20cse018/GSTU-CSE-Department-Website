import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

/**
 * Lightweight service for writing AdminActivityLog entries.
 * Injected into controllers that need to log CRUD actions.
 * Never throws — logs are best-effort and must not break the main request.
 */
@Injectable()
export class ActivityLoggerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @param adminId  - ID of the authenticated admin performing the action
   * @param action   - e.g. 'CREATE_FACULTY', 'UPDATE_NEWS', 'DELETE_NOTICE'
   * @param ipAddress - optional, forwarded from request headers
   */
  async log(adminId: string, action: string, ipAddress?: string): Promise<void> {
    try {
      await this.prisma.adminActivityLog.create({
        data: { adminId, action, ipAddress: ipAddress ?? null },
      });
    } catch {
      // Best-effort — never let logging failure break the response
    }
  }
}
