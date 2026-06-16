'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquare, Sparkles, Star, Users } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { EmptyState } from './EmptyState';

interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  type: 'candidate' | 'recruiter';
  initials: string;
  accent: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: 'candidate-1',
    quote:
      'Geonixa NextJob connected me with a hiring team that understood my growth goals. I received three interview invitations within two days and landed the role in under a week.',
    name: 'Ava Chen',
    role: 'Product Designer',
    company: 'Pulse Creative',
    rating: 5,
    type: 'candidate',
    initials: 'AC',
    accent: 'from-primary-500 to-secondary-500',
  },
  {
    id: 'recruiter-1',
    quote:
      'Our talent pipeline improved dramatically with Geonixa NextJob. The curated candidate profiles are relevant, timely, and high-quality—making hiring cycles faster and more predictable.',
    name: 'Noah Simmons',
    role: 'Talent Lead',
    company: 'Nova Labs',
    rating: 5,
    type: 'recruiter',
    initials: 'NS',
    accent: 'from-secondary-500 to-accent-500',
  },
  {
    id: 'candidate-2',
    quote:
      'As a remote engineer, I found opportunities that matched both my skills and lifestyle. The portal feels premium, focused, and easy to navigate across devices.',
    name: 'Mia Patel',
    role: 'Software Engineer',
    company: 'Scale Labs',
    rating: 4,
    type: 'candidate',
    initials: 'MP',
    accent: 'from-accent-500 to-primary-500',
  },
];

export function TestimonialsSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const activeTestimonial = testimonials[activeSlide];

  if (!testimonials.length) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon={Sparkles}
            title="Stories are on the way"
            description="We are gathering candidate and recruiter success stories to share soon."
            action={<Button size="md">Refresh</Button>}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-3xl font-semibold text-slate-950 dark:bg-slate-900 dark:text-white sm:text-4xl">
              <Sparkles className="h-5 w-5 text-primary-600" />
              Candidate & recruiter success
            </div>
            <h2 id="testimonials-heading" className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Trusted hiring stories with measurable impact.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
              Read through carefully selected journeys from candidates and hiring teams who used Geonixa NextJob to make confident moves faster.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="md">Browse stories</Button>
              <Button size="md" variant="secondary">
                See recruiter insights
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Testimonials</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Real reviews from both sides of the table.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                <Users className="h-4 w-4 text-primary-600" />
                {testimonials.length}+ stories
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Card hover className="bg-white/90 border-white/60 text-left shadow-lg shadow-slate-900/5 dark:bg-slate-950/90 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold shadow-lg shadow-slate-900/10">
                    {activeTestimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{activeTestimonial.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{activeTestimonial.role} • {activeTestimonial.company}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${index < activeTestimonial.rating ? 'text-primary-500' : 'text-slate-300 dark:text-slate-700'}`}
                    />
                  ))}
                  <span className="text-slate-500 dark:text-slate-400">{activeTestimonial.rating}.0 rating</span>
                </div>
              </Card>

              <Card hover className="bg-white/90 border-white/60 shadow-lg shadow-slate-900/5 dark:bg-slate-950/90 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Fast outcomes</p>
                    <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">90% of featured candidates received interviews in 48 hours.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr] items-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-44 w-44 rounded-full bg-secondary-500/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Featured story</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">A story that reflects premium hiring momentum.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {activeTestimonial.type === 'candidate' ? 'Candidate' : 'Recruiter'} spotlight
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45 }}
                  className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50/95 p-8 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${activeTestimonial.accent} text-white text-lg font-semibold shadow-lg shadow-slate-900/10`}>
                      {activeTestimonial.initials}
                    </div>
                    <div className="space-y-3">
                      <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">“{activeTestimonial.quote}”</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{activeTestimonial.role} at {activeTestimonial.company}</p>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${index < activeTestimonial.rating ? 'text-primary-500' : 'text-slate-300 dark:text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-3">
                <Button
                  size="md"
                  variant="outline"
                  className="flex-1 rounded-full border-slate-300 bg-white/90 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-100"
                  onClick={() => setActiveSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  className="flex-1 rounded-full border-slate-300 bg-white/90 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-100"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % testimonials.length)}
                  aria-label="Next testimonial"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card hover className="rounded-[1.85rem] bg-slate-50/90 border-white/70 text-slate-950 shadow-lg shadow-slate-900/5 dark:bg-slate-950/80 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-secondary-500" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Hiring pulse</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Recruiters save 35% of screening time with curated matches.</p>
                </div>
              </div>
            </Card>

            <Card hover className="rounded-[1.85rem] bg-slate-50/90 border-white/70 text-slate-950 shadow-lg shadow-slate-900/5 dark:bg-slate-950/80 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-6 w-6 text-primary-500" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Candidate success</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">Candidates feel confident from the first message to the accepted offer.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
