'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JobsRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      router.replace(`/job-updates/mnc?q=${encodeURIComponent(q)}`);
    } else {
      router.replace('/job-updates/mnc');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading jobs portal...</p>
      </div>
    </div>
  );
}
