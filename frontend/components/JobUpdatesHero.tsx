'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Zap, Target, Briefcase, Rocket, Building2 } from 'lucide-react';
import { Button } from '@/app/components';
import Link from 'next/link';

interface JobUpdatesHeroProps {
  totalNewJobs: number;
  lastFetch?: string;
  onRefresh: () => void;
}

export default function JobUpdatesHero({
  totalNewJobs,
  lastFetch,
  onRefresh,
}: JobUpdatesHeroProps) {
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const lastRefreshLabel = lastFetch
    ? new Date(lastFetch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Pending';

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200 shadow-sm min-h-[420px] backdrop-blur-lg bg-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDFD] via-[#FFF7ED] to-[#FFF1F2]" />
      <div className="absolute -left-16 -top-12 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-amber-100/80 blur-3xl" />
      <div className="relative z-10 grid gap-10 px-6 py-8 lg:grid-cols-[1.55fr_1fr] lg:px-10 lg:py-10">
        <motion.div variants={heroVariants} initial="hidden" animate="visible" className="space-y-6 relative z-30">

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Your Next Opportunity
              <span className="block">
                Is Just One{' '}
                <span className="bg-gradient-to-r from-slate-900 to-black bg-clip-text text-transparent">
                  Update Away
                </span>
              </span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              AI-powered job tracking with real-time internship, MNC, banking, government, startup and referral opportunities.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
            <Button
              variant="primary"
              size="lg"
              onClick={onRefresh}
              className="w-full max-w-[240px] bg-gradient-to-r from-slate-800 to-black text-white shadow-lg shadow-black/20"
            >
              <RefreshCcw className="h-5 w-5" />
              Refresh Jobs Now
            </Button>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-slate-500">Updated {lastRefreshLabel}</p>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="relative mt-4 sm:mt-0 inline-block">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none">
                  <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[11px] font-extrabold uppercase tracking-wide text-orange-600 drop-shadow-md"
                  >
                    click here to check your Ats score ↓
                  </motion.div>
                </div>
                <Link href="/ats-resume-checker" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border-2 border-transparent bg-orange-600 text-lg font-extrabold text-white hover:bg-orange-500 transition-all shadow-sm shadow-orange-500/20 tracking-tight">
                  ATS Resume Checker
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">New Today</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{totalNewJobs}</p>
            </div>
            <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Matches Found</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">98%</p>
            </div>
            <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Last Refresh</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{lastRefreshLabel}</p>
            </div>
            <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Live Updates</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">Real-time</p>
            </div>
          </div>

        </motion.div>

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative hidden lg:flex items-end justify-end pointer-events-none"
        >
          <img 
            src="/hero-person.jpg" 
            alt="Person holding Geonixa App" 
            className="object-contain max-h-[480px] absolute -bottom-10 -right-4 z-20 mix-blend-darken scale-110 origin-bottom-right drop-shadow-2xl" 
          />
        </motion.div>
      </div>
    </section>
  );
}
