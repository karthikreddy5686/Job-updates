import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JobUpdate - Modern Job Portal',
  description: 'Discover job opportunities, internships, and career tips from top companies worldwide.',
  keywords: ['jobs', 'internships', 'career', 'employment', 'hiring'],
  authors: [{ name: 'JobUpdate Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobupdate.com',
    title: 'JobUpdate - Modern Job Portal',
    description: 'Discover job opportunities, internships, and career tips from top companies worldwide.',
    images: [
      {
        url: 'https://jobupdate.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JobUpdate Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobUpdate - Modern Job Portal',
    description: 'Discover job opportunities, internships, and career tips from top companies worldwide.',
  },
};
