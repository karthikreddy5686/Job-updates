'use client';

import { motion } from 'framer-motion';
import { Briefcase, Search, Globe } from 'lucide-react';
import { Card, Badge } from '@/app/components';

export default function RemoteJobsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Page Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-950 dark:to-primary-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Remote Jobs
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Work from anywhere with these remote-first opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search remote jobs..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Remote Jobs Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card hover className="cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary-400 to-primary-400 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        Remote Position {i + 1}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Company Name</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge label="Remote" variant="secondary" />
                    <Badge label="Full-time" variant="primary" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                    Join our team and work from anywhere in the world. We&apos;re looking for talented professionals to join our growing team.
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">$70k - $110k</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
