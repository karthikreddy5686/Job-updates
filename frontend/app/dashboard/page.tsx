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
  ShieldCheck,
  AlertCircle,
  FileUp,
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

const defaultProfile: ProfileState = {
  name: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  experience: '',
  college: '',
  degree: '',
  graduationYear: '',
  skills: [],
  resumeName: '',
  resumeDate: '',
  preferredRoles: '',
  preferredLocations: '',
  expectedSalary: '',
};

// Popular quick skills like Naukri
const suggestedSkills = [
  'Python',
  'Java',
  'React.js',
  'SQL',
  'JavaScript',
  'Node.js',
  'Next.js',
  'C++',
  'Full Stack Development',
  'Tailwind CSS',
  'Data Structures',
  'Git',
];

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [student, setStudent] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);

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
    let currentData = { ...defaultProfile };

    if (s) {
      setStudent(s);
      currentData.name = s.name || '';
      currentData.email = s.email || '';
      currentData.phone = s.phone || '';
      currentData.college = s.collegeName || '';
    }

    // Load any user manually saved profile data
    try {
      const saved = localStorage.getItem('naukri_manual_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        currentData = { ...currentData, ...parsed };
      }
    } catch {}

    setProfile(currentData);

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
        localStorage.setItem('naukri_manual_profile', JSON.stringify(updated));
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
      const now = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date());
      saveProfileUpdate({
        resumeName: file.name,
        resumeDate: now,
      });
      showToast(`Resume uploaded: ${file.name}`);
    }
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      const updated = [...profile.skills, trimmed];
      saveProfileUpdate({ skills: updated });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = profile.skills.filter((s) => s !== skillToRemove);
    saveProfileUpdate({ skills: updated });
  };

  const handleDeleteResume = () => {
    if (confirm('Are you sure you want to delete your resume?')) {
      saveProfileUpdate({
        resumeName: '',
        resumeDate: '',
      });
      showToast('Resume removed');
    }
  };

  // Dynamic Naukri-style Completeness calculation
  const calculateCompleteness = () => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    if (profile.phone) score += 10;
    if (profile.headline) score += 15;
    if (profile.resumeName) score += 25;
    if (profile.skills.length >= 3) score += 15;
    if (profile.college || profile.degree) score += 10;
    if (profile.preferredRoles || profile.location) score += 5;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const getNextRecommendedStep = () => {
    if (!profile.resumeName) return 'Upload your resume (+25%) to get noticed by recruiters';
    if (!profile.headline) return 'Add a professional headline (+15%)';
    if (profile.skills.length < 3) return 'Add at least 3 key skills (+15%)';
    if (!profile.degree) return 'Add your education details (+10%)';
    if (!profile.phone) return 'Add your phone number (+10%)';
    return 'Your profile is strong and ready for top recruiters!';
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 text-slate-900">
      {/* 1. Header (Naukri Style) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">My Profile</h1>
            {completeness >= 70 ? (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Candidate
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Profile Incomplete
              </span>
            )}
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
                  {(profile.name || student?.name || 'U').charAt(0).toUpperCase()}
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
                    {profile.name || student?.name || 'Your Name'}
                  </h2>
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                </div>

                {profile.headline ? (
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                    {profile.headline}
                  </p>
                ) : (
                  <button
                    onClick={() => setIsEditingBasic(true)}
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add professional headline</span>
                  </button>
                )}

                {/* Contact & Location Details */}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600 font-medium">
                  {profile.location ? (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {profile.location}
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsEditingBasic(true)}
                      className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 px-2.5 py-1 rounded-lg text-slate-500"
                    >
                      <Plus className="w-3 h-3" /> Add Location
                    </button>
                  )}

                  {profile.experience ? (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      {profile.experience}
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsEditingBasic(true)}
                      className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 px-2.5 py-1 rounded-lg text-slate-500"
                    >
                      <Plus className="w-3 h-3" /> Add Experience
                    </button>
                  )}

                  {profile.phone ? (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {profile.phone}
                    </span>
                  ) : (
                    <button
                      onClick={() => setIsEditingBasic(true)}
                      className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 px-2.5 py-1 rounded-lg text-slate-500"
                    >
                      <Plus className="w-3 h-3" /> Add Phone
                    </button>
                  )}

                  {profile.email ? (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                      <Mail className="w-3 h-3 text-blue-600" />
                      {profile.email}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditingBasic(true)}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors shrink-0 rounded-full hover:bg-slate-50"
              title="Edit Profile"
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
              <span>{getNextRecommendedStep()}</span>
            </p>
          </div>
        </section>

        {/* 3. Resume Card (Naukri signature card with Manual Upload Option) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Resume</h3>
            </div>
            {profile.resumeDate ? (
              <span className="text-[11px] text-slate-400 font-medium">Uploaded: {profile.resumeDate}</span>
            ) : (
              <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                Required for 3x calls
              </span>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          {profile.resumeName ? (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{profile.resumeName}</p>
                  <p className="text-[11px] text-slate-500">Document ready for direct ATS apply</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  <Upload className="w-3 h-3" />
                  <span>Update</span>
                </button>
                <button
                  onClick={handleDeleteResume}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-full"
                  title="Remove Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 text-center cursor-pointer transition-colors group"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                <FileUp className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">Upload Resume</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supported formats: PDF, DOC, DOCX up to 5MB
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select File from Device</span>
              </button>
            </div>
          )}
        </section>

        {/* 4. Key Skills (Naukri Style Manual Chips & Add Options) */}
        <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Key Skills</h3>
              <span className="text-[11px] text-slate-400 font-medium">({profile.skills.length})</span>
            </div>
            <button
              onClick={() => setShowAddSkill((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skills</span>
            </button>
          </div>

          {/* Add skill input form */}
          {showAddSkill && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSkill(newSkill);
              }}
              className="mb-3.5 flex items-center gap-2"
            >
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Type skill name (e.g. Java, Docker, React)..."
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
                Close
              </button>
            </form>
          )}

          {/* Added Skills List */}
          {profile.skills.length > 0 ? (
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
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-xs text-slate-600 font-medium">No skills added yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Skills help match you with verified MNC and startup openings
              </p>
            </div>
          )}

          {/* Suggested Quick Add Skills (Naukri style) */}
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Suggested skills to add:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedSkills
                .filter((s) => !profile.skills.includes(s))
                .slice(0, 8)
                .map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleAddSkill(skill)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold border border-blue-200/60 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{skill}</span>
                  </button>
                ))}
            </div>
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

        {/* 6. Education Details (Naukri Style Manual Fill) */}
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
              {profile.degree || profile.college ? 'Edit' : '+ Add'}
            </button>
          </div>

          {profile.degree || profile.college ? (
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">{profile.degree || 'Degree not specified'}</h4>
              <p className="text-xs font-medium text-slate-600">{profile.college || 'College not specified'}</p>
              {profile.graduationYear && (
                <p className="text-[11px] text-slate-400">
                  Graduation: {profile.graduationYear} • Full Time
                </p>
              )}
            </div>
          ) : (
            <div
              onClick={() => setIsEditingEducation(true)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 text-center cursor-pointer transition-colors"
            >
              <p className="text-xs font-semibold text-blue-600">+ Add Education Details</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Degree, college/institute and graduation year</p>
            </div>
          )}
        </section>

        {/* 7. Career Preferences (Naukri Style Manual Fill) */}
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
              {profile.preferredRoles || profile.preferredLocations ? 'Edit' : '+ Add'}
            </button>
          </div>

          {profile.preferredRoles || profile.preferredLocations || profile.expectedSalary ? (
            <div className="grid gap-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Preferred Roles</span>
                <span className="font-semibold text-right max-w-[200px]">
                  {profile.preferredRoles || 'Any technical role'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Preferred Locations</span>
                <span className="font-semibold text-right">{profile.preferredLocations || 'Flexible'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Expected Salary</span>
                <span className="font-semibold text-right text-emerald-700">
                  {profile.expectedSalary || 'Negotiable'}
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingPreferences(true)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 text-center cursor-pointer transition-colors"
            >
              <p className="text-xs font-semibold text-blue-600">+ Add Career Preferences</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Role preferences, locations & expected salary</p>
            </div>
          )}
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
                  placeholder="e.g. Rahul Sharma"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Professional Headline</label>
                <textarea
                  rows={2}
                  placeholder="e.g. B.Tech Computer Science Fresher | Software Engineer"
                  value={profile.headline}
                  onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Location</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, India"
                  value={profile.location}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Experience Level</label>
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile((p) => ({ ...p, experience: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Select experience level</option>
                  <option value="Fresher (0 Yrs)">Fresher (0 Yrs)</option>
                  <option value="0 - 1 Years">0 - 1 Years</option>
                  <option value="1 - 3 Years">1 - 3 Years</option>
                  <option value="3 - 5 Years">3 - 5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
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
                Save Details
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
              <h3 className="text-base font-bold text-slate-900">Education Details</h3>
              <button onClick={() => setIsEditingEducation(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Degree & Major</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech in Computer Science"
                  value={profile.degree}
                  onChange={(e) => setProfile((p) => ({ ...p, degree: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">College / Institute</label>
                <input
                  type="text"
                  placeholder="e.g. IIT, NIT, or College Name"
                  value={profile.college}
                  onChange={(e) => setProfile((p) => ({ ...p, college: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Graduation Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2026"
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
              <h3 className="text-base font-bold text-slate-900">Career Preferences</h3>
              <button onClick={() => setIsEditingPreferences(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Job Roles</label>
                <input
                  type="text"
                  placeholder="e.g. Software Developer, Frontend Developer"
                  value={profile.preferredRoles}
                  onChange={(e) => setProfile((p) => ({ ...p, preferredRoles: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Cities / Remote</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Bangalore, Remote"
                  value={profile.preferredLocations}
                  onChange={(e) => setProfile((p) => ({ ...p, preferredLocations: e.target.value }))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expected Salary (Annual)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 5,00,000 - 10,00,000 LPA"
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
