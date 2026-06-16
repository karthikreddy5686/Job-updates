'use client';

import React from 'react';
import { useJobUpdates } from '@/store/jobUpdatesStore';
import { jobCapabilities } from '@/data/jobCapabilities';
import CapabilityCard from './CapabilityCard';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import type { JobNotificationCategory } from '@/types';

interface CapabilityGridProps {
  notificationCounts: Record<JobNotificationCategory, number>;
  lastUpdated: Record<JobNotificationCategory, string>;
  subscriptions: JobNotificationCategory[];
  onToggleSubscription: (category: JobNotificationCategory) => void;
}

export default function CapabilityGrid({
  notificationCounts,
  lastUpdated,
  subscriptions,
  onToggleSubscription,
}: CapabilityGridProps) {
  const { search } = useJobUpdates();

  const filteredCapabilities = jobCapabilities.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.capabilityLabel.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {filteredCapabilities.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCapabilities.map((item, index) => (
              <CapabilityCard
                key={item.id}
                id={item.id}
                apiCategory={item.apiCategory}
                title={item.title}
                description={item.description}
                route={item.route}
                capabilityLabel={item.capabilityLabel}
                index={index}
                newCount={notificationCounts[item.apiCategory] ?? 0}
                lastUpdated={lastUpdated[item.apiCategory] ?? ''}
                isSubscribed={subscriptions.includes(item.apiCategory)}
                onToggleSubscription={onToggleSubscription}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No capabilities found</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
              We couldn't find anything matching "{search}". Try searching for categories like "MNC", "Resume", or "Internships".
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
