'use client';
/**
 * StudentAuthContext — manages CSE student session.
 * Session token stored in httpOnly cookie `cse_student` (set by backend).
 * Frontend reads student profile via /api/student/me proxy.
 */
import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from 'react';

export interface StudentProfile {
  id: string;
  studentId: string;
  name: string;
  email: string;
  session: string;
  phone?: string;
  photo?: string;
  lastLoginAt?: string;
}

interface StudentAuthValue {
  student:         StudentProfile | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  login:           (email: string, password: string) => Promise<void>;
  register:        (studentId: string, email: string, password: string, phone?: string) => Promise<void>;
  logout:          () => Promise<void>;
  refresh:         () => Promise<void>;
}

const Ctx = createContext<StudentAuthValue | null>(null);

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [student,   setStudent]   = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/student/me', { credentials: 'include', cache: 'no-store' });
      if (r.ok) {
        const d = await r.json() as { student: StudentProfile | null };
        setStudent(d.student);
      } else {
        setStudent(null);
      }
    } catch {
      setStudent(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Heartbeat every 5 minutes to keep session alive
  useEffect(() => {
    if (!student) return;
    const id = setInterval(() => {
      fetch('/api/student/heartbeat', { method: 'POST', credentials: 'include' }).catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [student]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await fetch('/api/student/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json() as { student?: StudentProfile; message?: string };
    if (!r.ok) throw new Error(d.message ?? 'Login failed');
    setStudent(d.student ?? null);
  }, []);

  const register = useCallback(async (studentId: string, email: string, password: string, phone?: string) => {
    const r = await fetch('/api/student/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ studentId, email, password, phone }),
    });
    const d = await r.json() as { student?: StudentProfile; message?: string };
    if (!r.ok) throw new Error(d.message ?? 'Registration failed');
    setStudent(d.student ?? null);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/student/logout', { method: 'POST', credentials: 'include' });
    setStudent(null);
  }, []);

  return (
    <Ctx.Provider value={{ student, isLoading, isAuthenticated: student !== null, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStudentAuth(): StudentAuthValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStudentAuth must be inside <StudentAuthProvider>');
  return ctx;
}
