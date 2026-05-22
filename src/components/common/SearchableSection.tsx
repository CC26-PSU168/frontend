'use client';

import React, { ReactNode } from 'react';

interface SearchableSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  scrollMargin?: string;
}

/**
 * Wrapper component for sections that need to be searchable.
 * Adds the required id for global search functionality.
 */
export default function SearchableSection({
  id,
  title,
  subtitle,
  children,
  className = '',
  scrollMargin = 'mt-8',
}: SearchableSectionProps) {
  return (
    <section id={id} className={`space-y-4 ${scrollMargin} ${className}`}>
      <div>
        <h2 className="text-2xl font-[900] tracking-[-0.03em] text-[#F4F4F0]">
          {title}
          <span className="text-[#BCFF4F]">.</span>
        </h2>
        {subtitle && (
          <p className="text-[#888888] text-sm font-bold mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
