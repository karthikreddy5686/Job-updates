import type * as React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ children, className = '' }: SectionContainerProps) {
  return (
    <section className={`mx-auto min-w-0 w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
