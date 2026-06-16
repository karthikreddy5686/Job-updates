'use client';

import { motion } from 'framer-motion';
import { Briefcase, Search } from 'lucide-react';
import { Card, Badge, Button } from '@/app/components';

export default function InternshipsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Page Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-950 dark:to-primary-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Internship Opportunities
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Launch your career with internships from leading companies.
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
              placeholder="Search internships..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Internships List */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card hover className="cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-400 to-primary-400 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                          Internship Program {i + 1}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Company Name</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge label="Internship" variant="accent" />
                          <Badge label="Remote" variant="primary" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">$20 - $40/hr</p>
                      <Button size="sm" variant="primary">
                        Apply
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
