'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function AuthLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setErrors({});

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password, remember);
      router.push(email.toLowerCase().includes('admin') ? '/admin' : '/job-updates');
    } catch (err) {
      setFormError('Invalid email or password.');
      setToast({ type: 'error', message: 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocial = (provider: string) => {
    setToast({ type: 'info', message: `${provider} login is not configured yet.` });
  };

  const inputClass = (field: 'email' | 'password') =>
    classNames(
      'w-full rounded-xl border px-4 py-3 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      errors[field] ? 'border-red-400 bg-red-50 text-slate-900' : 'border-gray-200 bg-gray-50 text-slate-900',
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-300/30">
        {toast ? (
          <div className="absolute right-4 top-4 z-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/40">
            <p className="text-sm font-medium text-slate-900">{toast.message}</p>
          </div>
        ) : null}

        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-200/40">
            <span className="text-2xl font-black">J</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">JobUpdate</p>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm leading-6 text-slate-500">Sign in to access your personalized job matches</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
            <span className="h-px flex-1 bg-slate-200"></span>
            Continue with
            <span className="h-px flex-1 bg-slate-200"></span>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocial('Google')}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-gray-50 flex items-center justify-center gap-3"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">G</span>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocial('GitHub')}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-gray-50 flex items-center justify-center gap-3"
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200"></span>
            Or sign in with email
            <span className="h-px flex-1 bg-slate-200"></span>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClass('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'login-email-error' : undefined}
              />
              {errors.email ? <p id="login-email-error" className="text-xs text-red-500">{errors.email}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className={inputClass('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
              />
              {errors.password ? <p id="login-password-error" className="text-xs text-red-500">{errors.password}</p> : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-blue-600 transition hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            {formError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div> : null}

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full rounded-xl py-3 font-semibold">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
