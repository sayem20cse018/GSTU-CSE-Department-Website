import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import type { Admin } from '@prisma/client';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user: Admin }>();
    const admin = request.user;

    if (!admin) throw new ForbiddenException('No authenticated user found');

    if (admin.role === 'super_admin') return true;

    const hasAll = required.every((perm) => admin.permissions?.includes(perm));
    if (!hasAll) {
      throw new ForbiddenException(
        `Missing required permissions: ${required.join(', ')}`,
      );
    }

    return true;
  }
}
