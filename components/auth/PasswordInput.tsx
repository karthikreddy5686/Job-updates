'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
  error?: string;
}

export function PasswordInput({ label, id, error, className = '', ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative rounded-3xl border border-white/10 bg-white/5 px-4 py-3 shadow-inner shadow-black/10 transition duration-200 focus-within:border-primary-400">
        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          aria-describedby={errorId}
          className="w-full bg-transparent pl-11 pr-11 text-sm text-white outline-none placeholder:text-slate-500"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:text-white"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
