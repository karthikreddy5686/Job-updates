import type { FormHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  error?: string;
  children: ReactNode;
}

export function AuthForm({ error, className = '', children, ...props }: AuthFormProps) {
  return (
    <form noValidate className={cn('space-y-6', className)} {...props}>
      {error ? (
        <div role="alert" className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}
      {children}
    </form>
  );
}
