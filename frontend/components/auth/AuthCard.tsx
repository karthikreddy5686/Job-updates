import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/30 sm:p-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
