'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Search, ArrowRight, Clock, User } from 'lucide-react';
import { Card, Badge } from '@/app/components';

const tips = [
  {
    id: 1,
    title: 'How to Write the Perfect Resume',
    category: 'Resume Tips',
    readTime: '5 min',
    author: 'Sarah Johnson',
    excerpt: 'Learn the secrets to crafting a resume that catches recruiters attention.',
  },
  {
    id: 2,
    title: 'Mastering Technical Interviews',
    category: 'Interview Prep',
    readTime: '8 min',
    author: 'Mike Chen',
    excerpt: 'Practical strategies to ace your next technical interview.',
  },
  {
    id: 3,
    title: 'Salary Negotiation Guide',
    category: 'Career Growth',
    readTime: '6 min',
    author: 'Emma Davis',
    excerpt: 'How to negotiate your salary package effectively.',
  },
  {
    id: 4,
    title: 'Building Your Professional Network',
    category: 'Networking',
    readTime: '7 min',
    author: 'Alex Turner',
    excerpt: 'Strategies for building meaningful professional connections.',
  },
];

export default function CareerTipsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Page Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Career Tips & Insights
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Expert advice to accelerate your career growth and landing your dream job.
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
              placeholder="Search tips and articles..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card hover className="cursor-pointer flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <Badge label={tip.category} variant="primary" />
                  </div>

                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                    {tip.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 mb-4 flex-grow">
                    {tip.excerpt}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tip.readTime} read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{tip.author}</span>
                      </div>
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 text-slate-950 dark:text-slate-200 font-semibold hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <button className="px-8 py-3 rounded-lg border-2 border-slate-950 text-slate-950 dark:border-slate-300 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              Load More Articles
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
