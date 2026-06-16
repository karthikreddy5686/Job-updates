'use client';

import Link from 'next/link';
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function AuthRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    whatsappNumber: '',
    collegeName: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const strength = useMemo(() => {
    let score = 0;
    if (formData.password.length > 7) score += 1;
    if (/[A-Z]/.test(formData.password)) score += 1;
    if (/[0-9]/.test(formData.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
    return score;
  }, [formData.password]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
  };



  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = 'Enter at least 2 characters.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email.';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      nextErrors.phoneNumber = 'Enter a valid 10-digit Indian phone number.';
    }

    if (!formData.whatsappNumber.trim()) {
      nextErrors.whatsappNumber = 'WhatsApp number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsappNumber.trim())) {
      nextErrors.whatsappNumber = 'Enter a valid 10-digit Indian phone number.';
    }

    if (!formData.collegeName.trim()) {
      nextErrors.collegeName = 'College name is required.';
    } else if (formData.collegeName.trim().length < 3) {
      nextErrors.collegeName = 'Enter at least 3 characters.';
    }

    if (!acceptedTerms) {
      nextErrors.terms = 'You must agree to the terms before continuing.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'candidate',
      });
      setToast({ type: 'success', message: 'Welcome to JobUpdate!' });
      window.setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err) {
      setErrors({ form: 'Registration failed. Please try again.' });
      setToast({ type: 'error', message: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const fieldClass = (field: string) =>
    classNames(
      'w-full rounded-xl border px-4 py-3 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      errors[field] ? 'border-red-400 bg-red-50 text-slate-900' : 'border-gray-200 bg-gray-50 text-slate-900',
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-300/30">
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
          <h1 className="text-3xl font-semibold text-slate-900">Create your account</h1>
          <p className="text-sm leading-6 text-slate-500">Join thousands finding their next role</p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.form ? <p className="text-sm text-red-500">{errors.form}</p> : null}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="register-full-name" className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="register-full-name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Jane Doe"
                className={fieldClass('fullName')}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'register-full-name-error' : undefined}
              />
              {errors.fullName ? <p id="register-full-name-error" className="text-xs text-red-500">{errors.fullName}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
                className={fieldClass('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
              />
              {errors.email ? <p id="register-email-error" className="text-xs text-red-500">{errors.email}</p> : null}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create password"
                className={fieldClass('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'register-password-error' : undefined}
              />
              {errors.password ? <p id="register-password-error" className="text-xs text-red-500">{errors.password}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="register-confirm-password" className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className={fieldClass('confirmPassword')}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'register-confirm-password-error' : undefined}
              />
              {errors.confirmPassword ? <p id="register-confirm-password-error" className="text-xs text-red-500">{errors.confirmPassword}</p> : null}
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="register-phone" className="text-sm font-medium text-slate-700">
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-blue-500" /> Phone Number</span>
                </label>
                <input
                  id="register-phone"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  maxLength={10}
                  className={fieldClass('phoneNumber')}
                  aria-invalid={Boolean(errors.phoneNumber)}
                  aria-describedby={errors.phoneNumber ? 'register-phone-error' : undefined}
                />
                {errors.phoneNumber ? <p id="register-phone-error" className="text-xs text-red-500">{errors.phoneNumber}</p> : null}
              </div>
              <div className="space-y-2">
                <label htmlFor="register-whatsapp" className="text-sm font-medium text-slate-700">
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-green-500" /> WhatsApp Number</span>
                </label>
                <input
                  id="register-whatsapp"
                  name="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  maxLength={10}
                  className={fieldClass('whatsappNumber')}
                  aria-invalid={Boolean(errors.whatsappNumber)}
                  aria-describedby={errors.whatsappNumber ? 'register-whatsapp-error' : undefined}
                />
                {errors.whatsappNumber ? <p id="register-whatsapp-error" className="text-xs text-red-500">{errors.whatsappNumber}</p> : null}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="register-college" className="text-sm font-medium text-slate-700">
                <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-indigo-500" /> College / University Name</span>
              </label>
              <input
                id="register-college"
                name="collegeName"
                type="text"
                value={formData.collegeName}
                onChange={handleInputChange}
                placeholder="e.g. IIT Delhi, Anna University"
                className={fieldClass('collegeName')}
                aria-invalid={Boolean(errors.collegeName)}
                aria-describedby={errors.collegeName ? 'register-college-error' : undefined}
              />
              {errors.collegeName ? <p id="register-college-error" className="text-xs text-red-500">{errors.collegeName}</p> : null}
            </div>
          </div>

          {formData.password ? (
            <div className="space-y-2 text-sm text-slate-500">
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={classNames(
                    'h-1 rounded-full transition-all',
                    strength <= 1 ? 'w-1/3 bg-red-400' : strength === 2 ? 'w-2/3 bg-yellow-400' : 'w-full bg-green-400',
                  )}
                />
              </div>
              <p>
                {strength <= 1
                  ? 'Add numbers or symbols'
                  : strength === 2
                  ? 'Almost there!'
                  : 'Strong password ✓'}
              </p>
            </div>
          ) : null}

          <div className="flex items-start gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              I agree to the Terms and Conditions.
            </label>
          </div>
          {errors.terms ? <p role="alert" className="text-xs text-red-500">{errors.terms}</p> : null}

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full rounded-xl py-3 font-semibold">
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-blue-600 transition hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
