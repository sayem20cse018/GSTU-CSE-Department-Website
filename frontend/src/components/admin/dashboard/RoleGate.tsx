'use client';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  /**
   * Minimum role required to see this content.
   * Mirrors backend ROLE_RANK: super_admin(3) >= admin(2) >= editor(1).
   */
  minRole: 'editor' | 'admin' | 'super_admin';
  children: ReactNode;
}

/**
 * Client component — hides children from admins below the required role.
 *
 * SECURITY NOTE: This is a UI convenience only. All sensitive data is
 * also protected at the API level via JwtAuthGuard + RolesGuard.
 * Hiding UI elements is defense-in-depth, not the primary control.
 */
export default function RoleGate({ minRole, children }: Props) {
  const { admin, isLoading } = useAuth();

  // Show nothing while session is loading — avoids flash of content
  if (isLoading) return null;

  // Not authenticated → show nothing (layout guard handles redirect)
  if (!admin) return null;

  const RANK: Record<string, number> = { super_admin: 3, admin: 2, editor: 1 };
  const adminRank = RANK[admin.role] ?? 0;
  const requiredRank = RANK[minRole] ?? 0;

  if (adminRank < requiredRank) return null;

  return <>{children}</>;
}
