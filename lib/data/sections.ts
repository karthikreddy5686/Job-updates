import type { FeaturedJobsMetadata, CategoriesMetadata, CompaniesMetadata, TestimonialsMetadata } from '../../types/home';

export const featuredJobsMetadata: FeaturedJobsMetadata = {
  header: {
    eyebrow: 'Featured jobs',
    title: 'High-impact roles ready to hire.',
  },
  description: 'Browse placeholder listings crafted for a polished homepage experience.',
  cta: 'See all jobs',
};

export const categoriesMetadata: CategoriesMetadata = {
  header: {
    eyebrow: 'Job categories',
    title: 'Explore roles by skill and industry.',
  },
  description: 'Placeholder categories show the breadth of today\'s high-demand job markets.',
  hint: 'Discover key areas where hiring is growing fast and where talent is in demand.',
};

export const companiesMetadata: CompaniesMetadata = {
  header: {
    eyebrow: 'Featured companies',
    title: 'Discover companies hiring now.',
  },
  cta: 'See all partners',
};

export const testimonialsMetadata: TestimonialsMetadata = {
  header: {
    eyebrow: 'Testimonials',
    title: 'Trusted stories from candidates and hiring teams.',
    description: 'Read placeholder reviews that illustrate product confidence, speed, and clarity for modern hiring journeys.',
  },
};
