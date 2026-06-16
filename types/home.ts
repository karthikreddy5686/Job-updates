import type { LucideIcon } from 'lucide-react';

// Section header/metadata
export interface SectionHeader {
  eyebrow: string;
  title: string;
  description?: string;
}

// Hero section
export interface HeroStat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface HeroHighlight {
  title: string;
  description: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  stats: HeroStat[];
  highlights: HeroHighlight[];
}

// Featured jobs section
export interface FeaturedJob {
  title: string;
  company: string;
  location: string;
  badge: string;
}

export interface FeaturedJobsMetadata {
  header: SectionHeader;
  description: string;
  cta: string;
}

// Categories section
export interface CategoryItem {
  label: string;
  accent: string;
  icon: LucideIcon;
}

export interface CategoriesMetadata {
  header: SectionHeader;
  description: string;
  hint: string;
}

// Companies section
export interface CompanyProfile {
  name: string;
  type: string;
  location: string;
  openings: string;
}

export interface CompaniesMetadata {
  header: SectionHeader;
  cta: string;
}

// Testimonials section
export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
}

export interface TestimonialsMetadata {
  header: SectionHeader;
}

// Newsletter section
export interface NewsletterContent {
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  action: string;
  disclaimer: string;
}
