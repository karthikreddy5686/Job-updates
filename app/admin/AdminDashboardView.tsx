'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users as UsersIcon,
  Briefcase as BriefcaseIcon,
  ShieldAlert as ShieldAlertIcon,
  BarChart3 as BarChartIcon,
  FileText as FileTextIcon,
  Plus,
  X,
  Download,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  UserX,
  UserCheck,
  RefreshCw,
  Activity,
  Lock,
  Unlock,
  Check,
  Send,
  Eye,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Badge, Button, Card } from '@/app/components';
import { Table } from '@/components/ui/Table';
import type { Column } from '@/components/ui/Table';
import {
  mockUsers as initialUsers,
  mockRecruiters as initialRecruiters,
  mockJobs as initialJobs,
  mockReports as initialReports,
  mockAnalyticsHistory,
  AdminUser,
  AdminRecruiter,
  AdminJob,
  AdminReport
} from '@/lib/mockAdminData';

function getProgressWidthClass(percent: number) {
  const rounded = Math.round(percent / 5) * 5;
  const widthClasses: Record<number, string> = {
    0: 'w-0',
    5: 'w-[5%]',
    10: 'w-[10%]',
    15: 'w-[15%]',
    20: 'w-[20%]',
    25: 'w-[25%]',
    30: 'w-[30%]',
    35: 'w-[35%]',
    40: 'w-[40%]',
    45: 'w-[45%]',
    50: 'w-[50%]',
    55: 'w-[55%]',
    60: 'w-[60%]',
    65: 'w-[65%]',
    70: 'w-[70%]',
    75: 'w-[75%]',
    80: 'w-[80%]',
    85: 'w-[85%]',
    90: 'w-[90%]',
    95: 'w-[95%]',
    100: 'w-full',
  };
  return widthClasses[rounded] ?? 'w-full';
}

export default function AdminDashboard() {
  useEffect(() => {
    document.title = 'Admin Dashboard | JobUpdate';
  }, []);

  // Responsive Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'users' | 'recruiters' | 'jobs' | 'analytics' | 'reports' | 'mock-tests'>('analytics');

  // Core Data States for Interactive CRUD Simulation
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [loadingMockTests, setLoadingMockTests] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [recruiters, setRecruiters] = useState<AdminRecruiter[]>(initialRecruiters);
  const [jobs, setJobs] = useState<AdminJob[]>(initialJobs);
  const [reports, setReports] = useState<AdminReport[]>(initialReports);

  // Toast System State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Modals / Forms States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Form states for creating a new candidate
  const [newUser, setNewUser] = useState({ name: '', email: '', profileCompletion: 50 });
  // Form states for system alert
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', target: 'all', content: '' });

  // Quick statistics calculation
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    return {
      totalCandidates: users.length,
      activeCandidates: users.filter((u) => u.status === 'active').length,
      totalRecruiters: recruiters.length,
      approvedRecruiters: recruiters.filter((r) => r.status === 'approved').length,
      totalJobs: jobs.length,
      activeJobs: jobs.filter((j) => j.status === 'active').length,
      applicationsToday: 186,
      newUsersThisWeek: users.filter((u) => new Date(u.dateJoined) >= sevenDaysAgo).length,
      pendingReferrals: 18,
      alertsSent: 68,
      pendingJobs: jobs.filter((j) => j.status === 'pending').length,
      openReports: reports.filter((r) => r.status !== 'Resolved').length,
    };
  }, [users, recruiters, jobs, reports]);

  // Fetch mock tests
  useEffect(() => {
    if (activeTab === 'mock-tests' && mockTests.length === 0) {
      setLoadingMockTests(true);
      fetch('/api/admin/mock-tests')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setMockTests(data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingMockTests(false));
    }
  }, [activeTab]);

  const applicationsLast7Days = [
    { day: 'Mon', count: 42 },
    { day: 'Tue', count: 53 },
    { day: 'Wed', count: 37 },
    { day: 'Thu', count: 61 },
    { day: 'Fri', count: 54 },
    { day: 'Sat', count: 72 },
    { day: 'Sun', count: 48 },
  ];

  const jobCategoryBreakdown = useMemo(
    () => [
      { category: 'Internships', count: 28, color: '#3b82f6' },
      { category: 'MNC', count: 24, color: '#10b981' },
      { category: 'Banking', count: 18, color: '#f59e0b' },
      { category: 'Startup', count: 14, color: '#8b5cf6' },
      { category: 'CAT/MBA', count: 12, color: '#38bdf8' },
    ],
    []
  );

  const categoryPieStyle = useMemo(() => {
    const total = jobCategoryBreakdown.reduce((sum, item) => sum + item.count, 0);
    let progress = 0;
    return {
      background: `conic-gradient(${jobCategoryBreakdown
        .map((item) => {
          const percent = (item.count / total) * 100;
          const segment = `${item.color} ${progress}% ${progress + percent}%`;
          progress += percent;
          return segment;
        })
        .join(', ')})`,
    };
  }, [jobCategoryBreakdown]);

  // Handle user actions
  const handleToggleUserStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    showToast(`User account status updated to ${nextStatus}`, 'info');
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User account successfully deleted', 'success');
  };

  const handleAddUserSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    const createdUser: AdminUser = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: 'candidate',
      dateJoined: new Date().toISOString().split('T')[0],
      status: 'active',
      profileCompletion: Number(newUser.profileCompletion) || 50,
    };
    setUsers(prev => [createdUser, ...prev]);
    setShowAddUserModal(false);
    setNewUser({ name: '', email: '', profileCompletion: 50 });
    showToast('New candidate account successfully created', 'success');
  };

  // Handle recruiter actions
  const handleToggleRecruiterStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
    setRecruiters(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus } : r));
    showToast(`Recruiter account is now ${nextStatus}`, 'info');
  };

  const handleDeleteRecruiter = (id: string) => {
    setRecruiters(prev => prev.filter(r => r.id !== id));
    showToast('Recruiter account successfully removed', 'success');
  };

  // Handle job actions
  const handleToggleJobStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: nextStatus } : j));
    showToast(`Job listing is now ${nextStatus}`, 'info');
  };

  const handleApproveJob = (id: string) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'active' } : j));
    showToast('Job listing successfully approved & published', 'success');
  };

  const handleDeleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    showToast('Job listing successfully removed', 'success');
  };

  // Handle reports actions
  const handleResolveReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
    showToast('Security alert marked as resolved', 'success');
  };

  const handleDismissReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast('Security alert dismissed successfully', 'info');
  };

  // Simulate exporting report files
  const handleExportData = (format: 'CSV' | 'PDF') => {
    showToast(`Exporting dataset as ${format}...`, 'info');
    setTimeout(() => {
      // Simulate file download trigger
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify({ users, recruiters, jobs, reports }, null, 2)], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `jobupdate_admin_report_${Date.now()}.${format.toLowerCase()}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      showToast(`${format} report downloaded successfully!`, 'success');
    }, 1000);
  };

  const handleSendAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showToast('Please fill in announcement heading and content', 'error');
      return;
    }
    showToast(`Announcement sent successfully to all ${newAnnouncement.target}s!`, 'success');
    setShowAnnouncementModal(false);
    setNewAnnouncement({ title: '', target: 'all', content: '' });
  };

  const openLogoModal = (company: any) => {
    setSelectedCompany(company);
    setNewLogoUrl(company.logoUrl || '');
    setShowLogoModal(true);
  };

  const submitUpdateLogo = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    if (!newLogoUrl.trim()) {
      showToast('Logo URL cannot be empty', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/mock-tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedCompany.id, logoUrl: newLogoUrl.trim() })
      });
      const result = await res.json();
      if (res.ok) {
        setMockTests(prev => prev.map(test => test.id === selectedCompany.id ? { ...test, logoUrl: newLogoUrl.trim() } : test));
        showToast('Company logo updated successfully', 'success');
        setShowLogoModal(false);
      } else {
        showToast(result.error || 'Failed to update logo', 'error');
      }
    } catch (e) {
      showToast('Network error updating logo', 'error');
    }
  };

  // -------------------------------------------------------------
  // Columns Configurations for Reusable Tables
  // -------------------------------------------------------------
  
  // 1. Users Table Columns
  const userColumns: Column<AdminUser>[] = [
    {
      header: 'Candidate',
      accessorKey: 'name',
      sortable: true,
      cell: (row: AdminUser) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-indigo-500 text-sm font-semibold text-white">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Date Joined',
      accessorKey: 'dateJoined',
      sortable: true,
      cell: (row: AdminUser) => <span className="text-slate-500 dark:text-slate-400">{row.dateJoined}</span>
    },
    {
      header: 'Profile Strength',
      accessorKey: 'profileCompletion',
      sortable: true,
      cell: (row: AdminUser) => (
        <div className="flex items-center gap-2">
          <span className="w-8 text-right font-medium text-slate-700 dark:text-slate-300">
            {row.profileCompletion}%
          </span>
          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 ${getProgressWidthClass(row.profileCompletion)}`}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row: AdminUser) => (
        <Badge
          label={row.status}
          variant={
            row.status === 'active' ? 'success' : row.status === 'suspended' ? 'error' : 'warning'
          }
        />
      ),
    },
    {
      header: 'Actions',
      cell: (row: AdminUser) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleUserStatus(row.id, row.status)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600 transition hover:border-primary-500 hover:text-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
            title={row.status === 'active' ? 'Suspend User' : 'Activate User'}
          >
            {row.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-red-500 transition hover:border-red-500 hover:bg-red-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-red-950/20"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // 2. Recruiters Table Columns
  const recruiterColumns: Column<AdminRecruiter>[] = [
    {
      header: 'Recruiter',
      accessorKey: 'name',
      sortable: true,
      cell: (row: AdminRecruiter) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-rose-500 text-sm font-semibold text-white">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Company',
      accessorKey: 'company',
      sortable: true,
      cell: (row: AdminRecruiter) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.company}</span>
    },
    {
      header: 'Active Jobs',
      accessorKey: 'activeJobs',
      sortable: true,
      cell: (row: AdminRecruiter) => (
        <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-850 dark:text-slate-300">
          {row.activeJobs} positions
        </span>
      ),
    },
    {
      header: 'Date Joined',
      accessorKey: 'dateJoined',
      sortable: true,
      cell: (row: AdminRecruiter) => <span className="text-slate-500 dark:text-slate-400">{row.dateJoined}</span>
    },
    {
      header: 'Verification',
      accessorKey: 'status',
      sortable: true,
      cell: (row: AdminRecruiter) => (
        <Badge
          label={row.status}
          variant={
            row.status === 'approved' ? 'success' : row.status === 'suspended' ? 'error' : 'warning'
          }
        />
      ),
    },
    {
      header: 'Actions',
      cell: (row: AdminRecruiter) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleRecruiterStatus(row.id, row.status)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600 transition hover:border-primary-500 hover:text-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
            title={row.status === 'approved' ? 'Suspend Recruiter' : 'Approve Recruiter'}
          >
            {row.status === 'approved' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </button>
          <button
            onClick={() => handleDeleteRecruiter(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-red-500 transition hover:border-red-500 hover:bg-red-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-red-950/20"
            title="Remove Recruiter"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // 3. Jobs Table Columns
  const jobColumns: Column<AdminJob>[] = [
    {
      header: 'Job Title',
      accessorKey: 'title',
      sortable: true,
      cell: (row: AdminJob) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.title}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{row.location} • {row.type}</p>
        </div>
      ),
    },
    {
      header: 'Company',
      accessorKey: 'company',
      sortable: true,
      cell: (row: AdminJob) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.company}</span>
    },
    {
      header: 'Applicants',
      accessorKey: 'applicants',
      sortable: true,
      cell: (row: AdminJob) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {row.applicants}
        </span>
      ),
    },
    {
      header: 'Posted',
      accessorKey: 'postedAt',
      sortable: true,
      cell: (row: AdminJob) => <span className="text-slate-500 dark:text-slate-400">{row.postedAt}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row: AdminJob) => (
        <Badge
          label={row.status}
          variant={
            row.status === 'active' ? 'success' : row.status === 'closed' ? 'error' : 'warning'
          }
        />
      ),
    },
    {
      header: 'Actions',
      cell: (row: AdminJob) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' ? (
            <button
              onClick={() => handleApproveJob(row.id)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-100 dark:border-green-950 dark:bg-green-950/20 dark:text-green-400 dark:hover:bg-green-900/30"
              title="Approve Listing"
            >
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => handleToggleJobStatus(row.id, row.status)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600 transition hover:border-primary-500 hover:text-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-primary-500 dark:hover:text-primary-400"
              title={row.status === 'active' ? 'Close Listing' : 'Reopen Listing'}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => handleDeleteJob(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-red-500 transition hover:border-red-500 hover:bg-red-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-red-950/20"
            title="Delete Listing"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // 4. Reports Table Columns
  const reportColumns: Column<AdminReport>[] = [
    {
      header: 'Issue Type',
      accessorKey: 'type',
      sortable: true,
      cell: (row: AdminReport) => (
        <div className="flex items-center gap-2">
          {row.type === 'Technical Bug' ? (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          ) : (
            <ShieldAlertIcon className="h-4 w-4 text-rose-500" />
          )}
          <span className="font-semibold text-slate-800 dark:text-slate-100">{row.type}</span>
        </div>
      ),
    },
    {
      header: 'Target Item',
      accessorKey: 'targetItem',
      sortable: true,
      cell: (row: AdminReport) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.targetItem}</span>
    },
    {
      header: 'Reporter',
      accessorKey: 'reporterName',
      sortable: true,
      cell: (row: AdminReport) => <span className="text-slate-500 dark:text-slate-400">{row.reporterName}</span>
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row: AdminReport) => <p className="max-w-xs truncate text-xs text-slate-500 dark:text-slate-400" title={row.description}>{row.description}</p>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row: AdminReport) => (
        <Badge
          label={row.status}
          variant={
            row.status === 'Resolved' ? 'success' : row.status === 'In Review' ? 'warning' : 'accent'
          }
        />
      ),
    },
    {
      header: 'Actions',
      cell: (row: AdminReport) => (
        <div className="flex items-center gap-2">
          {row.status !== 'Resolved' && (
            <button
              onClick={() => handleResolveReport(row.id)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-100 dark:border-green-950 dark:bg-green-950/20 dark:text-green-400 dark:hover:bg-green-900/30"
              title="Resolve Alert"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleDismissReport(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-500 transition hover:border-slate-400 hover:text-slate-750 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-slate-600"
            title="Dismiss Alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // 5. Mock Tests Columns
  const mockTestColumns: Column<any>[] = [
    {
      header: 'Company Logo',
      cell: (row: any) => (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-2 relative overflow-hidden">
          {row.logoUrl ? (
            <img 
              src={row.logoUrl} 
              alt={row.company} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span className={`${row.logoUrl ? 'hidden' : ''} font-bold text-slate-400`}>
            {row.company[0]}
          </span>
        </div>
      ),
    },
    {
      header: 'Company Name',
      accessorKey: 'company',
      sortable: true,
      cell: (row: any) => <span className="font-semibold text-slate-800 dark:text-slate-100">{row.company}</span>
    },
    {
      header: 'Test Category',
      accessorKey: 'category',
      sortable: true,
      cell: (row: any) => (
        <Badge
          label={row.category}
          variant={row.category === 'Tech' ? 'accent' : row.category === 'Management' ? 'warning' : 'success'}
        />
      ),
    },
    {
      header: 'Questions',
      cell: (row: any) => <span className="text-slate-500 dark:text-slate-400">{row.questions?.length || 0}</span>
    },
    {
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openLogoModal(row)}
            className="h-8 rounded-xl px-3 py-1 text-xs"
          >
            Edit Logo
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Background ambient lighting effects */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary-500/10 blur-[80px] dark:bg-primary-600/10" />
        <div className="pointer-events-none absolute right-0 top-36 h-96 w-96 rounded-full bg-accent-500/10 blur-[80px] dark:bg-accent-600/10" />
        
        {/* Toast Toast Alert */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed right-6 top-24 z-50 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-4 shadow-xl backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/95"
            >
              <div className={`h-2.5 w-2.5 rounded-full ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-primary-500'}`} />
              <p className="text-sm font-semibold text-slate-850 dark:text-slate-100">{toast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto flex min-h-screen max-w-[90rem] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Header Panel */}
          <section className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 transition hover:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 lg:hidden"
                aria-label="Open sidebar"
              >
                <Activity className="h-5 w-5 rotate-90" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 font-bold">Admin Console</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">System Dashboard</h1>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAnnouncementModal(true)}
                className="rounded-full border border-slate-200 bg-white px-4 hover:border-primary-500 dark:border-slate-800 dark:bg-slate-950"
              >
                <Send className="mr-2 h-4 w-4" /> Send Announcement
              </Button>
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-850 dark:bg-slate-950">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Portal Online</span>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
            
            {/* Sidebar Desktop */}
            <aside className="hidden lg:block">
              <nav className="sticky top-28 space-y-2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90">
                <div className="mb-6 px-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Navigation</p>
                </div>
                
                {[
                  { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
                  { id: 'users', label: 'Candidates', icon: UsersIcon },
                  { id: 'recruiters', label: 'Recruiters', icon: BriefcaseIcon },
                  { id: 'jobs', label: 'Job Listings', icon: BriefcaseIcon },
                  { id: 'reports', label: 'Security Reports', icon: ShieldAlertIcon },
                  { id: 'mock-tests', label: 'Mock Tests', icon: FileTextIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                      {tab.id === 'reports' && stats.openReports > 0 && (
                        <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xxs font-bold text-white">
                          {stats.openReports}
                        </span>
                      )}
                      {tab.id === 'jobs' && stats.pendingJobs > 0 && (
                        <span className="ml-auto rounded-full bg-amber-500 px-2 py-0.5 text-xxs font-bold text-slate-950">
                          {stats.pendingJobs}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content Workspace */}
            <div className="space-y-8 min-w-0">
              
              {/* Analytics Section */}
              {activeTab === 'analytics' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Metric Cards Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card hover className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/5 dark:bg-slate-900/90">
                      <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Candidates</p>
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalCandidates}</span>
                        <span className="text-xs font-semibold text-green-500">+{stats.activeCandidates} active</span>
                      </div>
                    </Card>
                    <Card hover className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/5 dark:bg-slate-900/90">
                      <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Recruiters</p>
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalRecruiters}</span>
                        <span className="text-xs font-semibold text-green-500">{stats.approvedRecruiters} verified</span>
                      </div>
                    </Card>
                    <Card hover className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/5 dark:bg-slate-900/90">
                      <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Job Listings</p>
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalJobs}</span>
                        <span className="text-xs font-semibold text-amber-500">+{stats.pendingJobs} pending</span>
                      </div>
                    </Card>
                    <Card hover className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-white/5 dark:bg-slate-900/90">
                      <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Security Reports</p>
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{reports.length}</span>
                        <span className="text-xs font-semibold text-rose-500">{stats.openReports} open alerts</span>
                      </div>
                    </Card>
                  </div>

                  {/* SVG Graphs Grid */}
                  <div className="grid gap-8 md:grid-cols-2">
                    
                    {/* Signups over Time graph */}
                    <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90">
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Growth</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">New candidate and recruiter signups (Jan - May)</p>
                      </div>
                      
                      <div className="relative h-64 w-full">
                        <svg viewBox="0 0 400 200" className="h-full w-full overflow-visible">
                          {/* Grid Lines */}
                          <line x1="40" y1="20" x2="380" y2="20" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
                          <line x1="40" y1="70" x2="380" y2="70" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
                          <line x1="40" y1="120" x2="380" y2="120" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />
                          <line x1="40" y1="170" x2="380" y2="170" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1.5" />
                          
                          {/* Y-axis Labels */}
                          <text x="15" y="24" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">400</text>
                          <text x="15" y="74" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">250</text>
                          <text x="15" y="124" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">100</text>
                          <text x="15" y="174" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">0</text>

                          {/* Candidate Signups Polyline */}
                          {/* Mapping coords: Jan (40, 150), Feb (125, 120), Mar (210, 95), Apr (295, 60), May (380, 35) */}
                          <polyline
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="40,150 125,120 210,95 295,60 380,35"
                          />
                          
                          {/* Recruiter Signups Polyline */}
                          {/* Mapping coords: Jan (40, 165), Feb (125, 160), Mar (210, 155), Apr (295, 145), May (380, 135) */}
                          <polyline
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points="40,165 125,160 210,155 295,145 380,135"
                          />
                          
                          {/* Candidate Points */}
                          <circle cx="40" cy="150" r="4.5" className="fill-white stroke-primary-500" strokeWidth="2.5" />
                          <circle cx="125" cy="120" r="4.5" className="fill-white stroke-primary-500" strokeWidth="2.5" />
                          <circle cx="210" cy="95" r="4.5" className="fill-white stroke-primary-500" strokeWidth="2.5" />
                          <circle cx="295" cy="60" r="4.5" className="fill-white stroke-primary-500" strokeWidth="2.5" />
                          <circle cx="380" cy="35" r="4.5" className="fill-white stroke-primary-500" strokeWidth="2.5" />

                          {/* Recruiter Points */}
                          <circle cx="40" cy="165" r="4.5" className="fill-white stroke-accent-500" strokeWidth="2.5" />
                          <circle cx="125" cy="160" r="4.5" className="fill-white stroke-accent-500" strokeWidth="2.5" />
                          <circle cx="210" cy="155" r="4.5" className="fill-white stroke-accent-500" strokeWidth="2.5" />
                          <circle cx="295" cy="145" r="4.5" className="fill-white stroke-accent-500" strokeWidth="2.5" />
                          <circle cx="380" cy="135" r="4.5" className="fill-white stroke-accent-500" strokeWidth="2.5" />

                          {/* X-axis Labels */}
                          <text x="40" y="192" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">Jan</text>
                          <text x="125" y="192" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">Feb</text>
                          <text x="210" y="192" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">Mar</text>
                          <text x="295" y="192" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">Apr</text>
                          <text x="380" y="192" className="text-[10px] font-semibold fill-slate-400" textAnchor="middle">May</text>
                        </svg>
                      </div>

                      {/* Legend indicators */}
                      <div className="mt-4 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary-500" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Candidates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-accent-500" />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Recruiters</span>
                        </div>
                      </div>
                    </Card>

                    {/* Applications per Category Bar Chart */}
                    <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Popular Sectors</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Distribution of application submissions by industry category</p>
                      </div>
                      
                      <div className="mt-8 space-y-4">
                        {mockAnalyticsHistory.applicationsPerCategory.map((item: any) => {
                          const percent = Math.round((item.count / 1467) * 100);
                          return (
                            <div key={item.category} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-700 dark:text-slate-350">{item.category}</span>
                                <span className="text-slate-500">{item.count} applications ({percent}%)</span>
                              </div>
                              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                  className={`h-full rounded-full ${item.color} transition-all duration-500 ${getProgressWidthClass(percent)}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                  
                  {/* System Activities Feed */}
                  <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent System Logs</h3>
                    <div className="space-y-4">
                      {[
                        { time: '10 mins ago', desc: 'System auto-approved 4 verified employer listings.', type: 'info' },
                        { time: '1 hour ago', desc: 'User report flag raised on job listing #job_7.', type: 'warning' },
                        { time: '4 hours ago', desc: 'Backup routine completed successfully. 24.2GB stored.', type: 'success' },
                        { time: '1 day ago', desc: 'Daily registration target achieved (14 recruiters, 102 candidates).', type: 'success' }
                      ].map((log, i) => (
                        <div key={i} className="flex items-start gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-850">
                          <div className={`mt-1.5 h-2 w-2 rounded-full ${
                            log.type === 'success' ? 'bg-green-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-primary-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{log.desc}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Users Section */}
              {activeTab === 'users' && (
                <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90 animate-fade-in">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Candidates Management</h2>
                      <p className="text-sm text-slate-400 dark:text-slate-500">Monitor candidate accounts and profile registration details.</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddUserModal(true)}
                      className="rounded-full bg-primary-600 text-white hover:bg-primary-500"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Candidate
                    </Button>
                  </div>
                  
                  <Table
                    data={users}
                    columns={userColumns}
                    searchPlaceholder="Search candidates by name or email..."
                  />
                </Card>
              )}

              {/* Recruiters Section */}
              {activeTab === 'recruiters' && (
                <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90 animate-fade-in">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recruiters Management</h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Verify company profiles, approve hiring partners, and toggle accounts.</p>
                  </div>
                  
                  <Table
                    data={recruiters}
                    columns={recruiterColumns}
                    searchPlaceholder="Search recruiters by name, email, or company..."
                  />
                </Card>
              )}

              {/* Jobs Section */}
              {activeTab === 'jobs' && (
                <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90 animate-fade-in">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job Listings Moderation</h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Approve pending listings, close active positions, or remove invalid listings.</p>
                  </div>
                  
                  <Table
                    data={jobs}
                    columns={jobColumns}
                    searchPlaceholder="Search job titles or companies..."
                  />
                </Card>
              )}

              {/* Reports Section */}
              {activeTab === 'reports' && (
                <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90 animate-fade-in">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security & Issues Reports</h2>
                      <p className="text-sm text-slate-400 dark:text-slate-500">Review spam flags, system bug reports, and profile violations raised by users.</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleExportData('CSV')}
                        className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" /> Export CSV
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleExportData('PDF')}
                        className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <FileDown className="mr-2 h-4 w-4 text-rose-500" /> Export PDF
                      </Button>
                    </div>
                  </div>
                  
                  <Table
                    data={reports}
                    columns={reportColumns}
                    searchPlaceholder="Search alerts by target, type, or description..."
                  />
                </Card>
              )}

          {/* Mock Tests Section */}
          {activeTab === 'mock-tests' && (
            <Card hover={false} className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900/90 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Company Mock Tests Management</h2>
                <p className="text-sm text-slate-400 dark:text-slate-500">Manage the top 50 MNCs mock tests and update their company logos.</p>
              </div>
              
              {loadingMockTests ? (
                <div className="py-12 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <Table
                  data={mockTests}
                  columns={mockTestColumns}
                  searchPlaceholder="Search mock tests by company name or category..."
                />
              )}
            </Card>
          )}

        </div>
          </div>
        </div>

        {/* Sidebar Overlay Mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute left-0 top-0 z-50 flex h-full w-80 flex-col border-r border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Admin Panel</p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Console Menu</h2>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <nav className="mt-8 space-y-2">
                  {[
                    { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
                    { id: 'users', label: 'Candidates', icon: UsersIcon },
                    { id: 'recruiters', label: 'Recruiters', icon: BriefcaseIcon },
                    { id: 'jobs', label: 'Job Listings', icon: BriefcaseIcon },
                    { id: 'reports', label: 'Security Reports', icon: ShieldAlertIcon },
                    { id: 'mock-tests', label: 'Mock Tests', icon: FileTextIcon },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setSidebarOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Add Candidate */}
        <AnimatePresence>
          {showAddUserModal && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddUserModal(false)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Register New Candidate</h3>
                  <button onClick={() => setShowAddUserModal(false)} aria-label="Close add user modal" className="text-slate-400 hover:text-slate-650">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleAddUserSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="new-user-full-name" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                    <input
                      id="new-user-full-name"
                      type="text"
                      required
                      placeholder="e.g. Liam Neeson"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="new-user-email" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                    <input
                      id="new-user-email"
                      type="email"
                      required
                      placeholder="e.g. liam@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="new-user-profile-strength" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Initial Profile Strength ({newUser.profileCompletion}%)</label>
                    <input
                      id="new-user-profile-strength"
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={newUser.profileCompletion}
                      onChange={(e) => setNewUser(prev => ({ ...prev, profileCompletion: Number(e.target.value) }))}
                      className="w-full accent-primary-500"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white">
                      Create Account
                    </Button>
                    <Button onClick={() => setShowAddUserModal(false)} variant="ghost" className="flex-1 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-950">
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Announcement */}
        <AnimatePresence>
          {showAnnouncementModal && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAnnouncementModal(false)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Broadcast System Announcement</h3>
                  <button onClick={() => setShowAnnouncementModal(false)} aria-label="Close announcement modal" className="text-slate-400 hover:text-slate-650">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSendAnnouncement} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="announcement-heading" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Heading</label>
                    <input
                      id="announcement-heading"
                      type="text"
                      required
                      placeholder="e.g. Planned Database Maintenance"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="announcement-target" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Audience</label>
                    <select
                      id="announcement-target"
                      value={newAnnouncement.target}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, target: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <option value="all">Everyone (Candidates & Recruiters)</option>
                      <option value="candidate">Candidates Only</option>
                      <option value="recruiter">Recruiters Only</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="announcement-content" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Message Content</label>
                    <textarea
                      id="announcement-content"
                      required
                      rows={4}
                      placeholder="Type details to alert users on next sign-in..."
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary-500 resize-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white">
                      Broadcast Alert
                    </Button>
                    <Button onClick={() => setShowAnnouncementModal(false)} variant="ghost" className="flex-1 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-355 dark:hover:bg-slate-950">
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* Modal: Update Logo Form */}
        <AnimatePresence>
          {showLogoModal && selectedCompany && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogoModal(false)}
                className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Update Company Logo</h3>
                  <button onClick={() => setShowLogoModal(false)} aria-label="Close update logo modal" className="text-slate-400 hover:text-slate-650">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={submitUpdateLogo} className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 mb-6">
                     <div className="w-12 h-12 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                        {newLogoUrl ? (
                          <img src={newLogoUrl} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                        ) : (
                          <span className="font-bold text-slate-300">{selectedCompany.company[0]}</span>
                        )}
                     </div>
                     <div>
                       <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedCompany.company}</h4>
                       <p className="text-xs text-slate-500">Live Preview</p>
                     </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="logo-url" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Logo Image URL</label>
                    <input
                      id="logo-url"
                      type="url"
                      required
                      placeholder="https://example.com/logo.png"
                      value={newLogoUrl}
                      onChange={(e) => setNewLogoUrl(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white">
                      Save Logo
                    </Button>
                    <Button onClick={() => setShowLogoModal(false)} type="button" variant="ghost" className="flex-1 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-950">
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
