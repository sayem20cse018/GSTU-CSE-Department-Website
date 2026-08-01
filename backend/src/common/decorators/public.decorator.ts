import { SetMetadata } from '@nestjs/common';

/** Mark a route as public — JwtAuthGuard will skip it */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
