'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Mail, ShieldCheck, Sparkles } from 'lucide-react';

const quickLinks = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'Companies', href: '/companies' },
  { label: 'Internships', href: '/internships' },
  { label: 'Remote Jobs', href: '/remote' },
];

const categories = [
  { label: 'Product Design', href: '/jobs?category=design' },
  { label: 'Engineering', href: '/jobs?category=engineering' },
  { label: 'Data & Analytics', href: '/jobs?category=data' },
  { label: 'Growth & Marketing', href: '/jobs?category=marketing' },
];

const socialLinks = [
  { label: 'Follow on Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Follow on LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'Follow on Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Follow on Facebook', href: 'https://facebook.com', icon: Facebook },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] xl:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-14 w-auto items-center justify-center rounded-2xl bg-white shadow-lg shadow-primary-500/30 overflow-hidden">
                <img src="/logo.jpg" alt="Geonixa NextJob Logo" className="h-full w-auto object-contain" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-white">Geonixa NextJob</p>
                <p className="text-sm text-slate-400">Career growth, premium roles, and hiring insights for modern teams.</p>
              </div>
            </div>
            <p className="max-w-md leading-7 text-slate-400">
              Geonixa NextJob brings a refined job search experience with curated listings, employer stories, and recruiter-ready talent that helps professionals move confidently.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-primary-500 hover:text-white hover:bg-primary-500/10"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Quick links</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Categories</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {categories.map((category) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className="transition hover:text-white"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-slate-100">
              <Sparkles className="h-5 w-5 text-primary-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Stay in the loop</p>
                <p className="mt-3 text-lg font-semibold text-white">Newsletter for hiring updates</p>
              </div>
            </div>
            <form className="mt-6 space-y-4" action="#" method="post" suppressHydrationWarning>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="relative rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 focus-within:border-primary-500">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent pl-10 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  suppressHydrationWarning
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
                suppressHydrationWarning
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              Get monthly hiring insights, curated roles, and talent market updates in your inbox.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500">
            © 2026 Geonixa. All rights reserved &middot; Verification logs are retained to prevent fraudulent probing. &middot; <Link href="/issuer" className="transition hover:text-white">Issuer Console</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
