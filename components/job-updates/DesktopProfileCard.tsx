'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Bookmark,
  Briefcase,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DesktopProfileCardProps {
  student: any;
}

export default function DesktopProfileCard({ student }: DesktopProfileCardProps) {
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    phone: string;
    college: string;
    resumeName: string;
    skillsCount: number;
  }>({
    name: '',
    email: '',
    phone: '',
    college: '',
    resumeName: '',
    skillsCount: 0,
  });

  const [savedCount, setSavedCount] = useState(0);
  const [appsCount, setAppsCount] = useState(0);

  useEffect(() => {
    let name = student?.name || '';
    let email = student?.email || '';
    let phone = student?.phone || student?.whatsapp || '';
    let college = student?.collegeName || '';
    let resumeName = '';
    let skillsCount = 0;

    try {
      const rawStudent = localStorage.getItem('jobupdate_student');
      if (rawStudent) {
        const list = JSON.parse(rawStudent);
        if (Array.isArray(list) && list.length > 0) {
          const found = email
            ? list.find((i: any) => i.email?.toLowerCase() === email.toLowerCase())
            : list[list.length - 1];
          if (found) {
            if (!name && found.name) name = found.name;
            if (!email && found.email) email = found.email;
            if (!phone) phone = found.phone || found.whatsapp || '';
            if (!college) college = found.collegeName || '';
          }
        }
      }
    } catch {}

    try {
      const savedProfile = localStorage.getItem('naukri_manual_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.resumeName) resumeName = p.resumeName;
        if (Array.isArray(p.skills)) skillsCount = p.skills.length;
        if (p.college) college = p.college;
      }
    } catch {}

    try {
      const savedList = localStorage.getItem('jobupdate_saved_jobs_cache');
      if (savedList) setSavedCount(JSON.parse(savedList).length);
    } catch {}

    try {
      const appsList = localStorage.getItem('jobupdate_applications_cache');
      if (appsList) setAppsCount(JSON.parse(appsList).length);
    } catch {}

    setProfileData({
      name: name || 'Job Seeker',
      email: email || '',
      phone: phone || '',
      college: college || 'Student Candidate',
      resumeName,
      skillsCount,
    });
  }, [student]);

  // Completeness score
  const completeness = (() => {
    let score = 30; // base from name, email, phone
    if (profileData.college) score += 10;
    if (profileData.resumeName) score += 35;
    if (profileData.skillsCount >= 3) score += 25;
    return Math.min(100, score);
  })();

  const initial = (profileData.name?.[0] || 'U').toUpperCase();

  return (
    <div className="rounded-[24px] border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Top Identity Block */}
      <div className="flex items-start gap-3.5">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
              {profileData.name}
            </h3>
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {profileData.college}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified Account
            </span>
          </div>
        </div>
      </div>

      {/* Completeness Gauge */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700">Profile Completeness</span>
          <span className="font-bold text-blue-600">{completeness}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
          {completeness >= 80
            ? 'Great job! Your profile is recruiter-ready.'
            : 'Add resume & skills to boost recruiter visibility.'}
        </p>
      </div>

      {/* Quick Activity Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center">
        <Link
          href="/job-updates/saved"
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer"
        >
          <span className="text-base font-extrabold text-slate-900 group-hover:text-blue-600">
            {savedCount}
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Saved Jobs</p>
        </Link>
        <Link
          href="/job-updates/tracker"
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer"
        >
          <span className="text-base font-extrabold text-slate-900 group-hover:text-blue-600">
            {appsCount}
          </span>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Applied Jobs</p>
        </Link>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-2">
        <Link
          href="/dashboard"
          className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
        >
          <span>Complete Naukri Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

