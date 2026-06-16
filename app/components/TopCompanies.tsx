'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';

interface CompanyProfile {
  name: string;
  logo: string;
  positions: string;
  description: string;
  industry: string;
  location: string;
  accent: string;
}

const companyProfiles: CompanyProfile[] = [
  {
    name: 'Nova Labs',
    logo: 'NL',
    positions: '34',
    description: 'AI-first teams scaling intelligent products for global growth.',
    industry: 'Artificial Intelligence',
    location: 'Remote-first',
    accent: 'from-primary-500 to-secondary-500',
  },
  {
    name: 'Altitude Health',
    logo: 'AH',
    positions: '28',
    description: 'Health technology leaders reimagining care experiences.',
    industry: 'Health Tech',
    location: 'New York, NY',
    accent: 'from-secondary-500 to-accent-500',
  },
  {
    name: 'Shift Finance',
    logo: 'SF',
    positions: '18',
    description: 'Fintech builders creating fast, secure capital workflows.',
    industry: 'FinTech',
    location: 'London, UK',
    accent: 'from-primary-600 to-primary-400',
  },
  {
    name: 'Pulse Creative',
    logo: 'PC',
    positions: '22',
    description: 'Design teams crafting immersive experiences and brands.',
    industry: 'Creative',
    location: 'Los Angeles, CA',
    accent: 'from-accent-500 to-secondary-500',
  },
];

const partnerLogos = [
  'Synapse',
  'Ridge',
  'Aurora',
  'Crest',
  'Helix',
  'Nimble',
  'Vista',
  'Core',
];

export function TopCompaniesSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 dark:bg-primary-950/40 dark:text-primary-200">
              <Sparkles className="h-4 w-4" />
              Trusted hiring partners
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Top companies</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Discover the teams setting the pace in hiring.
              </h2>
              <p className="text-base leading-8 text-slate-600 dark:text-slate-400 max-w-2xl">
                Browse company profiles built for ambitious professionals, with roles that prioritize growth, culture, and flexibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="md">Browse companies</Button>
              <Button size="md" variant="secondary">See hiring trends</Button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {companyProfiles.map((company, index) => (
            <motion.article
              key={company.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card hover className="overflow-hidden p-6 bg-white/90 dark:bg-slate-950/95">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${company.accent} text-white shadow-lg shadow-slate-900/10`}
                    >
                      <span className="text-xl font-semibold">{company.logo}</span>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                        {company.industry}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                        {company.name}
                      </h3>
                    </div>
                  </div>
                  <Badge label={`${company.positions} roles`} variant="primary" />
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {company.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>{company.location}</span>
                  <Button variant="secondary" size="sm" className="rounded-full px-4 py-2">
                    View openings <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
