'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X, Briefcase, LogOut, User, Bell, Target, GraduationCap, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { SectionContainer } from './SectionContainer';
import { useTheme, useNotifications } from '../../app/providers';
import { useAuth } from '../../lib/auth-context';
import { SearchInput } from '../ui/SearchInput';
import StudentAuthModal from '@/components/StudentAuthModal';
import { getStudentSession, logoutStudent } from '@/lib/student-auth';
import type { Student } from '@/lib/student-auth';

const navLinks = [
  { label: 'Main', href: '/job-updates' },
  { label: 'Application Tracker', href: '/job-updates/tracker' },
  { label: 'Deadline Alerts', href: '/job-updates/alerts' },
  { label: 'Referral Hub', href: '/job-updates/referral' },
  { label: 'Saved Jobs', href: '/job-updates/saved' },
  { label: 'Resume Match', href: '/resume-match' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const { unreadCount, recentAlerts, markAllAsRead } = useNotifications();

  const [student, setStudent] = useState<Student | null>(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentModalTab, setStudentModalTab] = useState<'login' | 'register'>('login');
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  useEffect(() => {
    const session = getStudentSession();
    setStudent(session);

    const handleStorage = () => {
      setStudent(getStudentSession());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleStudentLogin = (s: { name: string; email: string }) => {
    const session = getStudentSession();
    setStudent(session);
    window.dispatchEvent(new Event('studentLoggedIn'));
  };

  const handleStudentLogout = () => {
    logoutStudent();
    setStudent(null);
    setShowStudentMenu(false);
    window.dispatchEvent(new Event('studentLoggedOut'));
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl transition duration-300 dark:border-slate-800/80 dark:bg-slate-950/95">
      <SectionContainer className="min-w-0 flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="min-w-0 flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex h-14 items-center justify-center rounded-2xl bg-white shadow-sm overflow-hidden"
          >
            <img src="/logo.jpg" alt="Geonixa NextJob Logo" className="h-full w-auto object-contain" />
          </motion.div>

          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-950 transition hover:text-primary-600 dark:text-slate-50 dark:hover:text-primary-400"
            >
              Geonixa NextJob
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your career edge, one update at a time.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            {/* Links moved to the dashboard left sidebar */}
          </nav>

          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationMenu((value) => !value)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-primary-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-label="Toggle job notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotificationMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotificationMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Job Alerts</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{unreadCount} unread</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          markAllAsRead();
                          setShowNotificationMenu(false);
                        }}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-72 divide-y divide-slate-200 overflow-y-auto dark:divide-slate-800">
                      {recentAlerts.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                          No new alerts. Subscribe to categories to receive updates.
                        </div>
                      ) : (
                        recentAlerts.map((alert) => (
                          <div key={alert.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {alert.categoryLabel}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {new Date(alert.postedDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {alert.location}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            {student ? (
              <div className="relative">
                <button
                  onClick={() => setShowStudentMenu(p => !p)}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {student.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showStudentMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowStudentMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                        <p className="text-xs text-gray-400 truncate">{student.email}</p>
                      </div>
                      <div className="py-1">
                        <a href="/job-updates" onClick={() => setShowStudentMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          Job Updates
                        </a>
                        <a href="/resume-match" onClick={() => setShowStudentMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Target className="w-4 h-4 text-gray-400" />
                          Resume Match
                        </a>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button onClick={handleStudentLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setStudentModalTab('login')
                  setStudentModalOpen(true)
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white font-semibold text-sm rounded-xl transition-colors shadow-sm shadow-black/20"
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <div
          id="mobile-navigation"
          className={`w-full overflow-hidden transition-all duration-300 md:hidden ${
            mobileOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-4 space-y-4 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/90">
            <nav className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-200">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-3 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <SearchInput placeholder="Search jobs, companies, locations" />
            {!student && (
              <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setStudentModalTab('login');
                    setStudentModalOpen(true);
                  }}
                  className="block w-full text-left rounded-2xl px-3 py-3 font-semibold text-slate-950 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Student Login
                </button>
              </div>
            )}
            {student && (
              <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="px-3 py-2 text-sm font-medium text-slate-900 dark:text-white">
                  {student.name}
                </div>
                <button
                  onClick={() => {
                    handleStudentLogout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-3 text-sm text-slate-700 transition hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </SectionContainer>
    </header>
    <StudentAuthModal
      isOpen={studentModalOpen}
      onClose={() => setStudentModalOpen(false)}
      onSuccess={handleStudentLogin}
      defaultTab={studentModalTab}
    />
  </>
  );
}
