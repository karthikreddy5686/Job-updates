'use client';

import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {eyebrow && (
        <p className="text-sm uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description && <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">{description}</p>}
    </div>
  );
}
