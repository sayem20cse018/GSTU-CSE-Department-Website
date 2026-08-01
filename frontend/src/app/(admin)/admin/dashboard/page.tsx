import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = { title: 'Dashboard — CSE Admin' };

export default async function DashboardPage() {
  // Server-side auth check — redirect before any HTML is rendered
  const cookieStore = await cookies();
  const hasToken = cookieStore.has('cse_access');
  if (!hasToken) redirect('/admin/login');

  return <AdminDashboardClient />;
}
