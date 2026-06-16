import type { JobNotificationCategory } from '@/types';

export interface JobCapability {
  id: string;
  title: string;
  description: string;
  route: string;
  capabilityLabel: string;
  apiCategory: JobNotificationCategory;
}

export const jobCapabilities: JobCapability[] = [
  {
    id: 'internships',
    title: 'Internship Listings',
    route: '/job-updates/internships',
    description: 'Latest internships from tech pharma medical and construction sectors.',
    capabilityLabel: 'INTERNSHIP',
    apiCategory: 'internships',
  },
  {
    id: 'mnc',
    title: 'MNC Jobs',
    route: '/job-updates/mnc',
    description: 'Global and Indian MNC openings.',
    capabilityLabel: 'MNC',
    apiCategory: 'mnc',
  },
  {
    id: 'banking',
    title: 'Banking Jobs',
    route: '/job-updates/banking',
    description: 'Bank recruitment and finance opportunities.',
    capabilityLabel: 'FINANCE',
    apiCategory: 'banking',
  },
  {
    id: 'government',
    title: 'Government Jobs',
    route: '/job-updates/government',
    description: 'Central and state notifications.',
    capabilityLabel: 'GOVERNMENT',
    apiCategory: 'government',
  },
  {
    id: 'cat',
    title: 'CAT / MBA Paths',
    route: '/job-updates/cat',
    description: 'MBA and CAT preparation opportunities.',
    capabilityLabel: 'EDUCATION',
    apiCategory: 'cat-mba',
  },
  {
    id: 'startups',
    title: 'Startup Roles',
    route: '/job-updates/startups',
    description: 'Startup hiring and early-stage companies.',
    capabilityLabel: 'STARTUPS',
    apiCategory: 'startup' as any,
  },
  {
    id: 'core',
    title: 'Core Jobs',
    route: '/job-updates/core',
    description: 'Embedded systems, VLSI, ECE, and EEE domain opportunities.',
    capabilityLabel: 'ENGINEERING',
    apiCategory: 'core' as any,
  },
  {
    id: 'civil',
    title: 'Civil and Mech jobs',
    route: '/job-updates/civil',
    description: 'Civil and Mechanical engineering, autocad, design, construction, and structural roles.',
    capabilityLabel: 'INFRASTRUCTURE',
    apiCategory: 'civil' as any,
  },
  {
    id: 'recommendations',
    title: 'Role Recommendations',
    route: '/job-updates/recommendations',
    description: 'AI generated role suggestions.',
    capabilityLabel: 'AI SYSTEM',
    apiCategory: 'recommendations',
  },
  {
    id: 'tracker',
    title: 'Application Tracker',
    route: '/job-updates/tracker',
    description: 'Track applications and statuses.',
    capabilityLabel: 'TRACKER',
    apiCategory: 'application-tracker',
  },
  {
    id: 'saved',
    title: 'Saved Roles',
    route: '/job-updates/saved',
    description: 'Bookmark opportunities.',
    capabilityLabel: 'COLLECTION',
    apiCategory: 'saved-roles',
  },
  {
    id: 'resume-match',
    title: 'Resume Match',
    route: '/job-updates/resume-match',
    description: 'Match profile with openings.',
    capabilityLabel: 'RESUME',
    apiCategory: 'resume-match',
  },
  {
    id: 'alerts',
    title: 'Deadline Alerts',
    route: '/job-updates/alerts',
    description: 'Upcoming application deadlines.',
    capabilityLabel: 'ALERTS',
    apiCategory: 'deadlines',
  },
  {
    id: 'referrals',
    title: 'Referral Hub',
    route: '/job-updates/referral',
    description: 'Referral opportunities.',
    capabilityLabel: 'REFERRALS',
    apiCategory: 'referral',
  },
];
