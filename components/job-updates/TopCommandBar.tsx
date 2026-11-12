'use client';

import React, { useState } from 'react';
import { Search, MapPin, X, ArrowRight, Sparkles, Building2, TrendingUp } from 'lucide-react';

interface TopCommandBarProps {
  roleQuery: string;
  locationQuery: string;
  onRoleChange: (query: string) => void;
  onLocationChange: (query: string) => void;
  onSearch: (role: string, loc: string) => void;
  onClear: () => void;
  totalResultsCount: number;
}

const trendingRoles = [
  'Software Developer',
  'Frontend Developer',
  'Full Stack',
  'Python Developer',
  'Data Analyst',
  'Graduate Engineer Trainee',
];

const popularLocations = ['Remote', 'Bangalore', 'Hyderabad', 'Pune', 'Noida', 'Chennai'];

export default function TopCommandBar({
  roleQuery,
  locationQuery,
  onRoleChange,
  onLocationChange,
  onSearch,
  onClear,
  totalResultsCount,
}: TopCommandBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(roleQuery, locationQuery);
  };

  const hasSearch = Boolean(roleQuery.trim() || locationQuery.trim());

  return (
    <div className="w-full rounded-[24px] border border-slate-200/90 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          {/* 1. Role / Skills Input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={roleQuery}
              onChange={(e) => onRoleChange(e.target.value)}
              placeholder="Search by role, skills, keywords (e.g. 'Software Developer', 'React')..."
              className="w-full h-12 pl-11 pr-9 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {roleQuery && (
              <button
                type="button"
                onClick={() => onRoleChange('')}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Divider */}
          <span className="hidden md:block text-slate-300 font-light text-xl">|</span>

          {/* 2. City / Remote Location Input */}
          <div className="relative w-full md:w-72 flex items-center">
            <MapPin className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="City, State, or 'Remote'..."
              className="w-full h-12 pl-11 pr-9 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {locationQuery && (
              <button
                type="button"
                onClick={() => onLocationChange('')}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Submit Search Button */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {hasSearch && (
              <button
                type="button"
                onClick={onClear}
                className="h-12 px-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Instant Autocomplete Pills */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0 text-[11px] uppercase tracking-wide">
          <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          Popular Roles:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {trendingRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                onRoleChange(role);
                onSearch(role, locationQuery);
              }}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                roleQuery.toLowerCase() === role.toLowerCase()
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <span className="hidden sm:inline text-slate-300 mx-1">|</span>

        <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0 text-[11px] uppercase tracking-wide">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          Locations:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {popularLocations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                onLocationChange(loc);
                onSearch(roleQuery, loc);
              }}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                locationQuery.toLowerCase() === loc.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
