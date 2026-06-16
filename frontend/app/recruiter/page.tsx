'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  BarChart3, Briefcase, Calendar, ChevronLeft, ChevronRight, 
  FileEdit, MoreVertical, Plus, Search, Settings, 
  Star, Users, UserPlus 
} from 'lucide-react';
import { Badge, Button, Card } from '@/app/components';

const navItems = [
  { label: 'Overview', icon: BarChart3, href: '/recruiter' },
  { label: 'Active Jobs', icon: Briefcase, href: '/recruiter' },
  { label: 'Candidates', icon: Users, href: '/recruiter' },
  { label: 'Interviews', icon: Calendar, href: '/recruiter' },
  { label: 'Settings', icon: Settings, href: '/recruiter' },
];

const analytics = [
  { label: 'Active Jobs', value: '14', accent: 'bg-primary-500' },
  { label: 'Total Applicants', value: '428', accent: 'bg-secondary-500' },
  { label: 'Interviews Scheduled', value: '24', accent: 'bg-accent-500' },
  { label: 'Time to Hire', value: '18d', accent: 'bg-emerald-500' },
];

const activeJobs = [
  { id: '1', title: 'Senior Product Designer', department: 'Design', applicants: 86, new: 12, status: 'Active' },
  { id: '2', title: 'Frontend Engineer', department: 'Engineering', applicants: 142, new: 28, status: 'Active' },
  { id: '3', title: 'Marketing Manager', department: 'Marketing', applicants: 45, new: 3, status: 'Closing Soon' },
];

const applicants = [
  { id: '1', name: 'Alex Johnson', role: 'Frontend Engineer', stage: 'Interview', match: '95%', shortlisted: true },
  { id: '2', name: 'Samantha Lee', role: 'Senior Product Designer', stage: 'Screening', match: '88%', shortlisted: false },
  { id: '3', name: 'David Chen', role: 'Marketing Manager', stage: 'Offer', match: '92%', shortlisted: true },
  { id: '4', name: 'Elena Rodriguez', role: 'Frontend Engineer', stage: 'Applied', match: '75%', shortlisted: false },
];

const interviews = [
  { candidate: 'Alex Johnson', role: 'Frontend Eng.', time: 'Today, 2:00 PM', type: 'Technical' },
  { candidate: 'David Chen', role: 'Marketing Mgr.', time: 'Tomorrow, 10:30 AM', type: 'Final Round' },
];

export default function RecruiterDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-secondary-600/10 blur-3xl" />
        
        <div className="relative mx-auto flex min-h-screen max-w-[90rem] flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-slate-900/90 px-5 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 text-slate-100 transition hover:border-primary-500 hover:text-white lg:hidden"
                aria-label="Open navigation"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Recruiter portal</p>
                <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Acme Corp Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                size="md" 
                onClick={() => setShowJobForm(true)}
                className="hidden sm:flex rounded-full bg-primary-600 text-white hover:bg-primary-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Post new job
              </Button>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-bold shadow-lg">
                AC
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
              <nav className="sticky top-8 space-y-2 rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-black/30">
                <div className="mb-8 px-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Navigation</p>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                        item.label === 'Overview' 
                          ? 'bg-primary-500/10 text-primary-400' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Analytics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {analytics.map((stat) => (
                  <Card key={stat.label} hover className="rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-xl">
                    <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className={`h-3 w-1 rounded-full ${stat.accent}`} />
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid gap-8 xl:grid-cols-[1fr_350px]">
                <div className="space-y-8">
                  {/* Applicant Management Table */}
                  <Card hover className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl overflow-hidden">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-white">Recent Applicants</h2>
                        <p className="text-sm text-slate-400">Manage and shortlist candidates.</p>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="Search candidates..." 
                          className="rounded-full border border-white/10 bg-slate-950/50 py-2 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                          <tr>
                            <th className="px-4 py-3 font-medium rounded-tl-2xl">Candidate</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Stage</th>
                            <th className="px-4 py-3 font-medium">Match</th>
                            <th className="px-4 py-3 font-medium text-right rounded-tr-2xl">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicants.map((app, i) => (
                            <tr key={app.id} className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? 'bg-transparent' : 'bg-slate-950/20'}`}>
                              <td className="px-4 py-4 font-medium text-white flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300">
                                  {app.name.charAt(0)}
                                </div>
                                {app.name}
                                {app.shortlisted && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                              </td>
                              <td className="px-4 py-4">{app.role}</td>
                              <td className="px-4 py-4">
                                <Badge 
                                  label={app.stage} 
                                  variant={app.stage === 'Offer' ? 'success' : app.stage === 'Interview' ? 'accent' : 'secondary'} 
                                />
                              </td>
                              <td className="px-4 py-4 font-medium text-slate-300">{app.match}</td>
                              <td className="px-4 py-4 text-right">
                                <button className="p-1.5 text-slate-400 hover:text-white transition">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Active Jobs */}
                  <Card hover className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white">Active Listings</h2>
                      <Button variant="outline" size="sm" className="rounded-full border-white/10 text-slate-300">View All</Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {activeJobs.map(job => (
                        <div key={job.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:border-primary-500/50">
                          <Badge label={job.status} variant="secondary" className="mb-3" />
                          <h3 className="font-semibold text-white line-clamp-1">{job.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">{job.department}</p>
                          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                            <div className="text-sm">
                              <span className="font-semibold text-white">{job.applicants}</span> <span className="text-slate-500">total</span>
                            </div>
                            <div className="text-sm text-primary-400 font-medium">
                              +{job.new} new
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-8">
                  {/* Interview Scheduling */}
                  <Card hover className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-white">Upcoming Interviews</h2>
                      <button className="text-primary-400 hover:text-primary-300"><Plus className="h-5 w-5" /></button>
                    </div>
                    <div className="space-y-4">
                      {interviews.map((interview, i) => (
                        <div key={i} className="rounded-2xl bg-slate-950 p-4 border border-white/5">
                          <p className="font-medium text-white">{interview.candidate}</p>
                          <p className="text-sm text-slate-400 mt-0.5">{interview.role} • {interview.type}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-secondary-400 bg-secondary-500/10 w-fit px-2.5 py-1 rounded-md">
                            <Calendar className="h-3.5 w-3.5" />
                            {interview.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Post a Job Shortcut */}
                  <div className="rounded-[2rem] bg-gradient-to-br from-primary-600 to-secondary-700 p-8 shadow-xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><FileEdit className="h-24 w-24" /></div>
                    <h3 className="text-xl font-bold text-white relative z-10">Need more talent?</h3>
                    <p className="text-sm text-primary-100 mt-2 mb-6 relative z-10">Post a new role to our network of top-tier candidates.</p>
                    <Button 
                      className="w-full rounded-2xl bg-white text-primary-700 hover:bg-slate-100 relative z-10"
                      onClick={() => setShowJobForm(true)}
                    >
                      Post a Job
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="absolute left-0 top-0 z-50 flex h-full w-80 flex-col overflow-hidden rounded-r-[2rem] border-r border-white/10 bg-slate-900/95 p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/10 bg-slate-950 text-slate-200 transition hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
                <nav className="mt-8 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Posting Modal */}
        <AnimatePresence>
          {showJobForm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowJobForm(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-slate-900 p-6 sm:p-10 shadow-2xl"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">Create New Job Posting</h2>
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Job Title</label>
                      <input type="text" placeholder="e.g. Senior Developer" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Department</label>
                      <input type="text" placeholder="e.g. Engineering" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Job Description</label>
                    <textarea rows={4} placeholder="Describe the responsibilities and requirements..." className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary-500 resize-none" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button onClick={() => setShowJobForm(false)} className="flex-1 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white">Publish Job</Button>
                    <Button onClick={() => setShowJobForm(false)} variant="outline" className="flex-1 rounded-2xl border-white/10 text-slate-300 hover:text-white">Cancel</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
