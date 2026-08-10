'use client';
/**
 * Students section guard.
 * Redirects to /student/login if the student is not authenticated.
 * Shows a loading skeleton while the session is being checked.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentAuth } from '@/context/StudentAuthContext';

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useStudentAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/student/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // While checking session — show skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-green-700 border-t-transparent animate-spin mx-auto"/>
          <p className="text-slate-500 text-sm">Loading student portal…</p>
        </div>
      </div>
    );
  }

  // Not authenticated — blank while redirect happens
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
