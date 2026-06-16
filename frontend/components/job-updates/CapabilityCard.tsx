'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookmarkCheck, Bell, BellOff } from 'lucide-react';
import { useJobUpdates } from '@/store/jobUpdatesStore';
import { motion } from 'framer-motion';
import { Badge } from '@/app/components';
import type { JobNotificationCategory } from '@/types';

interface CapabilityCardProps {
  id: string;
  apiCategory: JobNotificationCategory;
  title: string;
  description: string;
  route: string;
  capabilityLabel: string;
  index: number;
  newCount: number;
  lastUpdated: string;
  isSubscribed: boolean;
  onToggleSubscription: (category: JobNotificationCategory) => void;
}

export default function CapabilityCard({
  id,
  apiCategory,
  title,
  description,
  route,
  capabilityLabel,
  index,
  newCount,
  lastUpdated,
  isSubscribed,
  onToggleSubscription,
}: CapabilityCardProps) {
  const { savedRoles, toggleSavedRole } = useJobUpdates();
  const isSaved = savedRoles.includes(id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedRole(id);
  };

  const handleToggleSubscription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSubscription(apiCategory);
  };

  const formattedUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'just now';

  return (
    <Link href={route} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="relative flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white px-6 py-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-400/50 dark:border-white/5 dark:bg-slate-900 dark:hover:border-primary-500/30"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                {capabilityLabel}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {newCount > 0 ? (
                  <Badge label={`${newCount} new today`} variant="accent" className="text-[10px] uppercase tracking-[0.2em]" />
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">No new alerts</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSubscription}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors duration-200 ${
                  isSubscribed
                    ? 'border-primary-500 bg-primary-500/10 text-primary-600 hover:bg-primary-500/15'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                }`}
                aria-label={isSubscribed ? 'Unsubscribe from notifications' : 'Subscribe to notifications'}
              >
                {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleBookmark}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition-colors duration-200 hover:border-primary-500 hover:bg-primary-100 hover:text-primary-600"
                title={isSaved ? 'Remove Bookmark' : 'Bookmark Role'}
                aria-label={isSaved ? 'Remove role from bookmarks' : 'Save role to bookmarks'}
              >
                {isSaved ? <BookmarkCheck className="h-4 w-4 text-primary-500" /> : <Bookmark className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>Last updated {formattedUpdated}</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">View</span>
        </div>
      </motion.div>
    </Link>
  );
}
