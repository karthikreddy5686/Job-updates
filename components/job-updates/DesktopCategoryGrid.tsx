'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Briefcase,
  Rocket,
  TrendingUp,
  ShieldCheck,
  Cpu,
  HardHat,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

interface DesktopCategoryGridProps {
  countsByCategory: Record<string, number>;
}

export default function DesktopCategoryGrid({ countsByCategory }: DesktopCategoryGridProps) {
  const categories = [
    {
      id: 'mnc',
      title: 'Jobs in MNCs',
      subtitle: 'Top Tech & Multinationals',
      icon: Building2,
      bgColor: 'bg-amber-50/60',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200/60',
      hoverBorder: 'hover:border-amber-400',
      href: '/job-updates/mnc',
    },
    {
      id: 'internships',
      title: 'Internships',
      subtitle: 'Summer & Winter Paid',
      icon: Briefcase,
      bgColor: 'bg-emerald-50/60',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200/60',
      hoverBorder: 'hover:border-emerald-400',
      href: '/job-updates/internships',
    },
    {
      id: 'startups',
      title: 'Startup Roles',
      subtitle: 'High Growth & Fast Track',
      icon: Rocket,
      bgColor: 'bg-purple-50/60',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200/60',
      hoverBorder: 'hover:border-purple-400',
      href: '/job-updates/startups',
    },
    {
      id: 'banking',
      title: 'Banking & Finance',
      subtitle: 'RBI, SBI & FinTech',
      icon: TrendingUp,
      bgColor: 'bg-orange-50/60',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200/60',
      hoverBorder: 'hover:border-orange-400',
      href: '/job-updates/banking',
    },
    {
      id: 'government',
      title: 'Government Jobs',
      subtitle: 'UPSC, SSC & PSU Direct',
      icon: ShieldCheck,
      bgColor: 'bg-indigo-50/60',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200/60',
      hoverBorder: 'hover:border-indigo-400',
      href: '/job-updates/government',
    },
    {
      id: 'core',
      title: 'Core Engineering',
      subtitle: 'VLSI, ECE, EEE & Embedded',
      icon: Cpu,
      bgColor: 'bg-teal-50/60',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200/60',
      hoverBorder: 'hover:border-teal-400',
      href: '/job-updates/core',
    },
    {
      id: 'civil',
      title: 'Civil & Mechanical',
      subtitle: 'Design, Site & CAD',
      icon: HardHat,
      bgColor: 'bg-rose-50/60',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-200/60',
      hoverBorder: 'hover:border-rose-400',
      href: '/job-updates/civil',
    },
    {
      id: 'cat-mba',
      title: 'CAT & MBA Jobs',
      subtitle: 'Consulting & Marketing',
      icon: GraduationCap,
      bgColor: 'bg-pink-50/60',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-200/60',
      hoverBorder: 'hover:border-pink-400',
      href: '/job-updates/cat-mba',
    },
  ];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Explore Jobs by Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curated openings verified daily for students and graduates
          </p>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          8 Core Domains
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = countsByCategory[cat.id] ?? 0;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className={`p-3.5 rounded-2xl border ${cat.borderColor} ${cat.hoverBorder} ${cat.bgColor} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm group flex items-start gap-3`}
            >
              <div
                className={`h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center ${cat.textColor} shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h3>
                  {count > 0 && (
                    <span className="text-[10px] font-extrabold bg-white px-1.5 py-0.5 rounded-full text-slate-700 border border-slate-200/60">
                      +{count}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
