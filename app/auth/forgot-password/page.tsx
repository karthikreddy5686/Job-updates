'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthFormField } from '@/components/auth/AuthFormField';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import type { FormEvent } from 'react';

const features = [
  { title: 'Reset securely', description: 'Recover access using a single-use verification link sent to your email.' },
  { title: 'Keep your profile', description: 'Your saved job alerts and preferences remain available after reset.' },
  { title: 'Fast support', description: 'Email-based recovery keeps the process familiar and easy to follow.' },
];

export default function AuthForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setMessage('If that email is on file, a reset link has been sent.');
  };

  return (
    <AuthPageShell
      title="Forgot your password?"
      description="Enter the email address associated with your account and we will send a secure link to reset it."
      note="Use the link in your inbox to set a new password. If you do not see the email, check your spam folder."
      actionLabel="Remembered your password?"
      actionHref="/auth/login"
      actionLinkText="Sign in"
      features={features}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Reset password</p>
          <h2 className="text-3xl font-semibold text-white">Get back into your account</h2>
          <p className="text-sm leading-6 text-slate-400">We will send a recovery link to your inbox so you can choose a new password safely.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          ) : null}

          <AuthFormField
            id="forgot-email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            required
          />

          <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Send reset link
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Want to sign in instead?{' '}
          <Link href="/auth/login" className="font-semibold text-white transition hover:text-primary-300">
            Return to login
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
