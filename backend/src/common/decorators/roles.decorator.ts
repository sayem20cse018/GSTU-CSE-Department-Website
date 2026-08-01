import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * Restrict a route to specific roles.
 * Usage: @Roles('super_admin') or @Roles('super_admin', 'admin')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
