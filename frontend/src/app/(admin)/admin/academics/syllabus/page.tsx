'use client';
import { AdminPageTitle } from '@/context/AdminPageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SyllabusRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/academics/resources?type=guideline');
  }, [router]);
  return (
    <div className="p-6 flex items-center justify-center">
      <AdminPageTitle title="Syllabus" />
      <div className="text-slate-500 text-sm">Redirecting…</div>
    </div>
  );
}
