'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function CandidateLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user || user.role !== 'candidate') {
      router.replace('/auth/login');
      return;
    }

    setChecked(true);
  }, [user, isLoading, router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
