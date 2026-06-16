import { ArrowRight, Briefcase, Sparkles, Users } from 'lucide-react';
import type { HeroContent, FeaturedJob, NewsletterContent } from '../../types/home';

// Re-export data from separate files for convenience
export { categories, defaultCategories } from './categories';
export { companies, defaultCompanies } from './companies';
export { testimonials, defaultTestimonials } from './testimonials';
export { featuredJobsMetadata, categoriesMetadata, companiesMetadata, testimonialsMetadata } from './sections';

// Hero section content
export const heroContent: HeroContent = {
  eyebrow: 'Job Updates Portal',
  title: 'Find your next role with confidence and speed.',
  description: 'Explore curated career opportunities, discover hiring-ready companies, and stay ahead with the latest job market updates.',
  primaryAction: 'Browse jobs',
  secondaryAction: 'Explore companies',
  stats: [
    { label: 'Live roles', value: '240+', icon: Briefcase },
    { label: 'Top companies', value: '85+', icon: Users },
    { label: 'Fast hires', value: '98%', icon: Sparkles },
  ],
  highlights: [
    { title: 'Hiring spotlight', description: 'Senior Product Designer • Remote' },
    { title: 'Company success', description: 'High-growth teams hiring fast' },
  ],
};

// Featured jobs data
export const featuredJobs: FeaturedJob[] = [
  { title: 'Frontend Engineer', company: 'Nova Labs', location: 'Remote', badge: 'Remote' },
  { title: 'Product Marketing Lead', company: 'Pulse Creative', location: 'New York, NY', badge: 'Full-time' },
  { title: 'Data Analytics Manager', company: 'Scale Labs', location: 'Austin, TX', badge: 'Hybrid' },
  { title: 'UX Researcher', company: 'Crest Studio', location: 'Los Angeles, CA', badge: 'Part-time' },
];

// Newsletter section content
export const newsletterContent: NewsletterContent = {
  eyebrow: 'Newsletter',
  title: 'Stay ahead with weekly hiring insights.',
  description: 'Receive concise career updates, company highlights, and fresh role alerts straight to your inbox.',
  placeholder: 'you@example.com',
  action: 'Subscribe now',
  disclaimer: 'No spam. Unsubscribe anytime.',
};
