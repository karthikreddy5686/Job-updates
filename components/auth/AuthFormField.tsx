'use client';

import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

export function AuthFormField({
  label,
  icon,
  error,
  className = '',
  ...props
}: AuthFormFieldProps) {
  const hasIcon = Boolean(icon);

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={props.id} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <div
        className={cn(
          'relative rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner shadow-black/10 transition duration-200 focus-within:border-primary-400',
          error ? 'border-red-500' : 'border-white/10',
        )}
      >
        {hasIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-primary-300">
            {icon}
          </span>
        )}
        <input
          id={props.id}
          aria-describedby={error && props.id ? `${props.id}-error` : undefined}
          className={cn(
            'w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500',
            hasIcon ? 'pl-11' : 'pl-4',
          )}
          {...props}
        />
      </div>
      {error && props.id ? (
        <p id={`${props.id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : error ? (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
