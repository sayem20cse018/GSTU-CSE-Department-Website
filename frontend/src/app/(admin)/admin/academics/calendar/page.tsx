'use client';
import { AdminPageTitle } from '@/context/AdminPageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect to resources page filtered by calendar type
export default function CalendarRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/academics/resources?type=calendar');
  }, [router]);
  return (
    <div className="p-6 flex items-center justify-center">
      <AdminPageTitle title="Academic Calendar" />
      <div className="text-slate-500 text-sm">Redirecting…</div>
    </div>
  );
}
