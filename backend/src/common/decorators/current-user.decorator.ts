import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Admin } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (field: keyof Admin | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: Admin }>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
