'use client';

import React, { useState } from 'react';
import { Bell, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import type { JobNotification } from '@/types';

interface DashboardHeaderProps {
  unreadCount: number;
  recentAlerts: (JobNotification & { categoryLabel: string })[];
}

export default function DashboardHeader({ unreadCount, recentAlerts }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-[2rem] border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 px-6 py-4 shadow-xl backdrop-blur-xl transition-all duration-300">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            MODULE
          </span>
          <span className="text-slate-300 dark:text-slate-700 font-medium">/</span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400">
            Job Updates
          </span>
        </div>

        <div className="flex-1 max-w-md md:mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm animate-pulse-soft">
            <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">1,250 XP</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((value) => !value)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-primary-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-label="Toggle notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                          Job Alerts
                        </p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {unreadCount} unread
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Close
                      </button>
                    </div>
                    <div className="max-h-72 divide-y divide-slate-200 overflow-y-auto dark:divide-slate-800">
                      {recentAlerts.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                          No recent alerts yet. Subscribe to categories to receive daily updates.
                        </div>
                      ) : (
                        recentAlerts.map((alert) => (
                          <div key={alert.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {alert.title}
                              </p>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {alert.categoryLabel}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {new Date(alert.postedDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {alert.location}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t border-slate-200 p-4 text-right dark:border-slate-800">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-950 cursor-pointer hover:opacity-90 transition-opacity" title="Profile">
            JK
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
          Job Updates
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-3xl text-sm sm:text-base font-medium">
          Curated internships, MNC roles, banking, government, CAT paths and startups.
        </p>
      </div>
    </div>
  );
}
