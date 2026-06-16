import type { TestimonialItem } from '../../types/home';

export const testimonials: TestimonialItem[] = [
  {
    quote: 'The platform helped me land a motivated team within days. The experience felt modern and highly relevant.',
    name: 'Ava Chen',
    role: 'Product Designer',
    company: 'Pulse Creative',
    rating: 5,
  },
  {
    quote: 'Our hiring velocity improved significantly. The candidate flow is clear, fast, and backed by strong company insight.',
    name: 'Noah Simmons',
    role: 'Talent Lead',
    company: 'Nova Labs',
    rating: 5,
  },
  {
    quote: 'I found a remote role that matched my career goals and preferred work style. The experience felt premium and easy.',
    name: 'Mia Patel',
    role: 'Software Engineer',
    company: 'Scale Labs',
    rating: 4,
  },
];

// Default fallback for empty/loading states
export const defaultTestimonials: TestimonialItem[] = [];
