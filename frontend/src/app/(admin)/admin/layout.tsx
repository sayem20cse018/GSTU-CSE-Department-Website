import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/layout/AdminShell';

/**
 * Layout for all protected admin pages.
 * Does NOT apply to /admin/login — that lives in (auth) route group.
 *
 * Route structure:
 *   (admin)/admin/layout.tsx        ← this file (applies to dashboard, faculty, etc.)
 *   (admin)/admin/(auth)/login/     ← outside this layout scope
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  // Hard server-side guard — redirect to login if no access token
  if (!cookieStore.has('cse_access')) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
