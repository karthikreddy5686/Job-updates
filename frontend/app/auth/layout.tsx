import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Authentication | JobUpdate',
  description: 'Login, create an account, or reset your password on JobUpdate.',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-900">
      <div className="min-h-screen">{children}</div>
    </div>
  );
}
