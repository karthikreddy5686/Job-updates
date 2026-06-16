'use client';

import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export function NewsletterSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 px-6 py-14 shadow-2xl shadow-primary-500/20 md:px-12 md:py-20">
        <div className="pointer-events-none absolute -left-24 top-6 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-36 w-36 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 bottom-10 h-28 w-28 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-white/90 shadow-sm shadow-black/10">
              <Sparkles className="h-4 w-4" />
              Stay updated
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Join our newsletter for premium hiring updates.
              </h2>
              <p className="max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                Get new job launches, recruiter tips, and market trends delivered weekly—designed for ambitious professionals who want a more thoughtful career search.
              </p>
            </div>
          </div>

          <motion.form
            action="#"
            className="relative flex w-full flex-col gap-4 rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:flex-row sm:items-center sm:p-6"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 rounded-3xl bg-white/15 px-4 py-4 text-white shadow-inner shadow-black/5 sm:flex-1">
              <Mail className="h-5 w-5 text-white/85" />
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/60"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-3xl bg-slate-950 text-white shadow-lg shadow-black/20 hover:bg-slate-800 sm:w-auto sm:px-8"
              variant="primary"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
