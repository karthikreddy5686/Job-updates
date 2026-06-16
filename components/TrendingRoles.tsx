'use client';
import React from 'react';
import { ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface TrendingRolesProps {
  categories?: any[];
  countsByCategory?: Record<string, number>;
}

export default function TrendingRoles({ categories = [], countsByCategory = {} }: TrendingRolesProps) {
  // Sort categories by most openings
  const sortedCategories = [...categories].sort((a, b) => {
    const countA = countsByCategory[a.apiCategory] || 0;
    const countB = countsByCategory[b.apiCategory] || 0;
    return countB - countA;
  }).filter(cat => (countsByCategory[cat.apiCategory] || 0) > 0).slice(0, 10);

  if (sortedCategories.length === 0) return null;
  return (
    <div className="mt-12 w-full">
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-8 tracking-tight">
        Trending job roles on Geonixa
      </h2>
      
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {sortedCategories.map((category, idx) => (
          <Link 
            key={idx} 
            href={category.route || "/job-updates"} 
            className="flex items-center justify-between w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] bg-white border border-slate-200 rounded-xl p-3 hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200 transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 truncate">{category.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{countsByCategory[category.apiCategory] || 0} openings</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link 
          href="/job-updates" 
          className="inline-flex items-center gap-2 px-6 py-2 border border-[#008060] text-[#008060] font-semibold rounded hover:bg-[#008060]/5 transition-colors text-sm"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
