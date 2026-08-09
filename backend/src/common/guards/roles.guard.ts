import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { Admin } from '@prisma/client';

const ROLE_RANK: Record<string, number> = {
  super_admin: 3,
  admin: 2,
  editor: 1,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user: Admin }>();
    const admin = request.user;

    if (!admin) throw new ForbiddenException('No authenticated user found');

    const adminRank = ROLE_RANK[admin.role] ?? 0;
    const hasRole = requiredRoles.some(
      (role) => adminRank >= (ROLE_RANK[role] ?? 0),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        `This action requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
