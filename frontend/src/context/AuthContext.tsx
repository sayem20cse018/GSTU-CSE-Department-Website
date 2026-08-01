'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  AdminProfile,
  AuthContextValue,
  LoginResponse,
  MeResponse,
} from '@/types/auth';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Role rank — mirrors backend ─────────────────────────────────────────────
const ROLE_RANK: Record<string, number> = {
  super_admin: 3,
  admin: 2,
  editor: 1,
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current session on mount (reads httpOnly cookie server-side)
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const json: MeResponse = await res.json();
          setAdmin(json.data);
        } else {
          setAdmin(null);
        }
      } catch {
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const json: LoginResponse = await res.json();

    if (!res.ok) {
      // Backend wraps errors — pull the message out
      const errMsg =
        (json as unknown as { message?: string }).message ??
        'Login failed. Please try again.';
      throw new Error(errMsg);
    }

    setAdmin(json.data.admin);
  }, []);

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setAdmin(null);
    }
  }, []);

  // ─── Role helper ───────────────────────────────────────────────────────────
  const hasRole = useCallback(
    (role: AdminProfile['role']): boolean => {
      if (!admin) return false;
      return (ROLE_RANK[admin.role] ?? 0) >= (ROLE_RANK[role] ?? 0);
    },
    [admin],
  );

  // ─── Permission helper ─────────────────────────────────────────────────────
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!admin) return false;
      if (admin.role === 'super_admin') return true;
      return admin.permissions.includes(permission);
    },
    [admin],
  );

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: admin !== null,
        login,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
