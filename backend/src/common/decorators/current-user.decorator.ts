import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminDocument } from '../../modules/auth/schemas/admin.schema';

/**
 * Extracts the authenticated admin from the request object.
 *
 * Usage:
 *   @CurrentUser() admin: AdminDocument
 *   @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
  (field: keyof AdminDocument | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: AdminDocument }>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
