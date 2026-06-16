'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Facebook, Github, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthForm, AuthFormField, AuthPageShell, PasswordInput } from '@/components/auth';
import { useAuth } from '@/lib/auth-context';
import type { FormEvent } from 'react';

const benefits = [
  { title: 'Fast access', description: 'Sign in quickly and get to hiring or applying without delay.' },
  { title: 'Encrypted sessions', description: 'Your credentials stay safe with modern security defaults.' },
  { title: 'Cross-device friendly', description: 'Continue your workflow from desktop, tablet, or phone.' },
];

const socialProviders = [
  {
    label: 'Google',
    icon: (
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-primary-300 text-[10px] font-semibold">
        G
      </span>
    ),
  },
  {
    label: 'GitHub',
    icon: <Github className="h-4 w-4 text-primary-300" />,
  },
  {
    label: 'Facebook',
    icon: <Facebook className="h-4 w-4 text-primary-300" />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: isAuthLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, remember);
      router.push('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Sign in to Geonixa NextJob"
      description="Access your personalized job matches, recruiter tools, and saved career insights from any device."
      note="Use a secure email and password to sign in. If you are new, register for an account and start exploring opportunities."
      actionLabel="New here?"
      actionHref="/auth/register"
      actionLinkText="Create an account"
      features={benefits}
    >
      <div className="mx-auto w-full max-w-[560px] space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Login</p>
          <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
          <p className="text-sm leading-6 text-slate-400">Sign in with your email and password, or continue with a social login.</p>
        </div>

        <AuthForm onSubmit={handleSubmit} error={error}>
          <AuthFormField
            id="login-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            required
          />

          <PasswordInput
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary-500 focus:ring-primary-400"
              />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-primary-300 transition hover:text-primary-200">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </AuthForm>

        <div className="relative py-6">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
          <p className="relative mx-auto inline-flex bg-slate-950 px-3 text-sm uppercase tracking-[0.35em] text-slate-500">
            Continue with
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {socialProviders.map((provider) => (
            <button
              key={provider.label}
              type="button"
              className="flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:border-primary-400 hover:bg-white/10"
            >
              {provider.icon}
              {provider.label}
            </button>
          ))}
        </div>
      </div>
    </AuthPageShell>
  );
}
