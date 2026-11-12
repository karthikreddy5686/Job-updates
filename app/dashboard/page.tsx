'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  Bookmark,
  Layers,
  Bell,
  ArrowRight,
  LogOut,
  Camera,
  Check,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { getStudentSession, logoutStudent } from '@/lib/student-auth';
import { useAuth } from '@/lib/auth-context';
import MobileBottomNav from '@/components/job-updates/MobileBottomNav';

interface ProfileState {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  college: string;
  degree: string;
  graduationYear: string;
  skills: string[];
  resumeName: string;
  resumeDate: string;
  preferredRoles: string;
  preferredLocations: string;
  expectedSalary: string;
}

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [student, setStudent] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileState>({
    name: 'Karthik Reddy',
    headline: 'B.Tech CSE | Aspiring Full-Stack Software Developer | React, Next.js, Node.js',
    email: 'karthik@example.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad, India',
    experience: 'Fresher (0-1 Yrs)',
    college: 'Vignan Institute of Technology & Science',
    degree: 'B.Tech - Computer Science & Engineering',
    graduationYear: '2026',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'SQL', 'Git & GitHub'],
    resumeName: 'Karthik_Reddy_Resume_2026.pdf',
    resumeDate: 'Nov 12, 2026',
    preferredRoles: 'Software Developer, Frontend Engineer, Full-Stack Dev',
    preferredLocations: 'Hyderabad, Bangalore, Remote',
    expectedSalary: '₹ 6,00,000 - 14,00,000 LPA',
  });

  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Counts for quick access cards
  const [savedCount, setSavedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    const s = getStudentSession();
    if (s) {
      setStudent(s);
      setProfile((prev) => ({
        ...prev,
        name: s.name || prev.name,
        email: s.email || prev.email,
        phone: s.phone || prev.phone,
        college: s.collegeName || prev.college,
      }));
    }

    // Load custom profile data from localStorage if exists
    try {
      const saved = localStorage.getItem('naukri_profile_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}

    // Load saved count & application count
    try {
      const savedCache = localStorage.getItem('cached_saved_jobs');
      if (savedCache) setSavedCount(JSON.parse(savedCache).length);
      const appCache = localStorage.getItem('cached_applications');
      if (appCache) setApplicationsCount(JSON.parse(appCache).length);
    } catch {}
  }, []);

  const saveProfileUpdate = (updates: Partial<ProfileState>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('naukri_profile_data', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Profile updated successfully');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of your account?')) {
      logoutStudent();
      if (logout) logout();
      localStorage.removeItem('jobupdate_student_session');
      localStorage.removeItem('admin_session');
      window.dispatchEvent(new Event('studentLoggedOut'));
      window.location.href = '/job-updates';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const now = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
      saveProfileUpdate({
        resumeName: file.name,
        resumeDate: now,
      });
      showToast(`Uploaded ${file.name}`);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      const updated = [...profile.skills, newSkill.trim()];
      saveProfileUpdate({ skills: updated });
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = profile.skills.filter((s) => s !== skillToRemove);
    saveProfileUpdate({ skills: updated });
  };

  // Calculate profile completeness percentage (Naukri style)
  const calculateCompleteness = () => {
    let score = 40; // Base registration score
    if (profile.headline) score += 10;
    if (profile.resumeName) score += 20;
    if (profile.skills.length >= 3) score += 10;
    if (profile.college) score += 10;
    if (profile.phone) score += 10;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 text-slate-900">
      {/* 1. Header (Naukri Style) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">My Profile</h1>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified Candidate
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* 2. Top Profile Summary Card (Naukri Style) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              {/* Avatar with edit badge */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => setIsEditingBasic(true)}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white text-slate-600 shadow-md border border-slate-200 hover:text-blue-600"
                  title="Edit Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Name & Headline */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-950 truncate leading-snug">
                    {profile.name}
                  </h2>
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                  {profile.headline}
                </p>

                {/* Contact Pills */}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {profile.location}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    {profile.experience}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {profile.phone}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                    <Mail className="w-3 h-3 text-blue-600" />
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingBasic(true)}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors shrink-0 rounded-full hover:bg-slate-50"
              title="Edit Basic Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Completeness Gauge (Naukri style) */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-800">Profile Completeness</span>
              <span className="text-blue-600 font-bold">{completeness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              Recruiters view completed profiles 3x more often.
            </p>
          </div>
        </section>

        {/* 3. Resume Card (Naukri signature card) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Resume</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Updated: {profile.resumeDate}</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{profile.resumeName}</p>
                <p className="text-[11px] text-slate-500">PDF Document • 450 KB</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Upload className="w-3 h-3" />
                <span>Update Resume</span>
              </button>
            </div>
          </div>

          <p className="mt-2.5 text-[11px] text-slate-400">
            Supported Formats: doc, docx, rtf, pdf, up to 2MB.
          </p>
        </section>

        {/* 4. Key Skills (Naukri Style Tags) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Key Skills</h3>
            </div>
            <button
              onClick={() => setShowAddSkill((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {showAddSkill && (
            <form onSubmit={handleAddSkill} className="mb-3 flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter skill (e.g. Docker, Redux, Java)"
                className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddSkill(false)}
                className="h-9 px-3 text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </form>
          )}

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-red-500"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* 5. Quick Access Cards (Applications, Saved, Resume Match, Alerts) */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/job-updates/tracker"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tracker</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {applicationsCount} Applied
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/job-updates/saved"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bookmarks</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {savedCount} Saved
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/resume-match"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Scanner</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">Resume Match</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/job-updates/alerts"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Preferences</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">Job Alerts</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* 6. Education Details (Naukri Style) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Education</h3>
            </div>
            <button
              onClick={() => setIsEditingEducation(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">{profile.degree}</h4>
            <p className="text-xs font-medium text-slate-600">{profile.college}</p>
            <p className="text-[11px] text-slate-400">
              Graduation: {profile.graduationYear} • Full Time
            </p>
          </div>
        </section>

        {/* 7. Career Preferences (Naukri Style) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Career Preferences</h3>
            </div>
            <button
              onClick={() => setIsEditingPreferences(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          </div>

          <div className="grid gap-2.5 text-xs text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Preferred Roles</span>
              <span className="font-semibold text-right max-w-[200px]">{profile.preferredRoles}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Preferred Locations</span>
              <span className="font-semibold text-right">{profile.preferredLocations}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Expected Salary</span>
              <span className="font-semibold text-right text-emerald-700">{profile.expectedSalary}</span>
            </div>
          </div>
        </section>

        {/* 8. Log Out Card */}
        <div className="pt-2 text-center">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-red-100 shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of Geonixa NextJob</span>
          </button>
          <p className="mt-2 text-[11px] text-slate-400">
            App Version 2.4.0 • Logged in securely
          </p>
        </div>
      </div>

      {/* Basic Info Edit Modal */}
      {isEditingBasic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md text-slate-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Edit Basic Details</h3>
              <button onClick={() => setIsEditingBasic(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Professional Headline</label>
                <textarea
                  rows={2}
                  value={profile.headline}
                  onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Experience Level</label>
                <input
                  type="text"
                  value={profile.experience}
                  onChange={(e) => setProfile((p) => ({ ...p, experience: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  saveProfileUpdate(profile);
                  setIsEditingBasic(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditingBasic(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education Edit Modal */}
      {isEditingEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Edit Education Details</h3>
              <button onClick={() => setIsEditingEducation(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={profile.degree}
                  onChange={(e) => setProfile((p) => ({ ...p, degree: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">College / Institute Name</label>
                <input
                  type="text"
                  value={profile.college}
                  onChange={(e) => setProfile((p) => ({ ...p, college: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Year of Graduation</label>
                <input
                  type="text"
                  value={profile.graduationYear}
                  onChange={(e) => setProfile((p) => ({ ...p, graduationYear: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  saveProfileUpdate(profile);
                  setIsEditingEducation(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
              >
                Save Education
              </button>
              <button
                onClick={() => setIsEditingEducation(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Edit Modal */}
      {isEditingPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md text-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Edit Career Preferences</h3>
              <button onClick={() => setIsEditingPreferences(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Job Roles</label>
                <input
                  type="text"
                  value={profile.preferredRoles}
                  onChange={(e) => setProfile((p) => ({ ...p, preferredRoles: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Job Locations</label>
                <input
                  type="text"
                  value={profile.preferredLocations}
                  onChange={(e) => setProfile((p) => ({ ...p, preferredLocations: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expected Salary Range</label>
                <input
                  type="text"
                  value={profile.expectedSalary}
                  onChange={(e) => setProfile((p) => ({ ...p, expectedSalary: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  saveProfileUpdate(profile);
                  setIsEditingPreferences(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setIsEditingPreferences(false)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </main>
  );
}
