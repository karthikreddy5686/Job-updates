'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Layers, Bookmark, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname() || '';

  const isHome = pathname === '/job-updates';
  const isJobs =
    pathname.startsWith('/job-updates/') &&
    !['/job-updates/tracker', '/job-updates/saved', '/job-updates/alerts', '/job-updates/referral'].includes(pathname);
  const isTracker = pathname === '/job-updates/tracker';
  const isSaved = pathname === '/job-updates/saved';
  const isProfile = pathname === '/dashboard' || pathname.startsWith('/dashboard') || pathname === '/profile';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 shadow-lg flex items-center justify-around lg:hidden">
      <Link
        href="/job-updates"
        className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
          isHome ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.2]' : ''}`} />
        <span>Home</span>
      </Link>
      <Link
        href="/job-updates/mnc"
        className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
          isJobs ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <Briefcase className={`w-5 h-5 ${isJobs ? 'stroke-[2.2]' : ''}`} />
        <span>Jobs</span>
      </Link>
      <Link
        href="/job-updates/tracker"
        className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
          isTracker ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <Layers className={`w-5 h-5 ${isTracker ? 'stroke-[2.2]' : ''}`} />
        <span>Tracker</span>
      </Link>
      <Link
        href="/job-updates/saved"
        className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
          isSaved ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <Bookmark className={`w-5 h-5 ${isSaved ? 'stroke-[2.2]' : ''}`} />
        <span>Saved</span>
      </Link>
      <Link
        href="/dashboard"
        className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
          isProfile ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700 font-medium'
        }`}
      >
        <User className={`w-5 h-5 ${isProfile ? 'stroke-[2.2]' : ''}`} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

