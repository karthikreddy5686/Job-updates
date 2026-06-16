'use client'
import { useState, useEffect } from 'react'
import { X, LogOut, Plus, Trash2, Star, 
         Edit3, Check, ExternalLink, 
         Eye, EyeOff, Download, Zap, Briefcase } from 'lucide-react'

interface AdminJob {
  id: string
  title: string
  company: string
  logo?: string
  location: string
  jobType: string
  category: string
  salary: string
  applyLink: string
  deadline: string
  description: string
  isActive: boolean
  isPinned: boolean
  isFeatured: boolean
  createdAt: string
}

const CATEGORIES = [
  { value: 'internship', label: '🎓 Internship' },
  { value: 'mnc', label: '🏢 MNC Jobs' },
  { value: 'banking', label: '🏦 Banking' },
  { value: 'government', label: '🏛️ Government' },
  { value: 'startup', label: '🚀 Startup' },
  { value: 'cat-mba', label: '📚 CAT/MBA' },
  { value: 'core', label: '⚙️ Core Jobs' },
  { value: 'civil', label: '🏗️ Civil & Mech' },
]

const EMPTY_FORM = {
  title: '', company: '', logo: '', location: 'India',
  jobType: 'full-time', category: 'mnc',
  salary: '', applyLink: '', deadline: '',
  description: '', isFeatured: false,
}

export default function AdminModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  
  // Forgot Password state
  const [forgotMode, setForgotMode] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Settings state
  const [settingsEmail, setSettingsEmail] = useState('')
  const [settingsPassword, setSettingsPassword] = useState('')
  const [settingsNewPassword, setSettingsNewPassword] = useState('')
  const [settingsMsg, setSettingsMsg] = useState('')

  // Jobs state
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  // Student state
  const [students, setStudents] = useState<any[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'jobs' | 'students' | 'live-feed' | 'logos' | 'mock-tests' | 'settings'>('add');
  const [liveFeedItems, setLiveFeedItems] = useState<any[]>([]);
  const [companyLogos, setCompanyLogos] = useState<any[]>([]);
  const [newLogoCompany, setNewLogoCompany] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [newLiveCompany, setNewLiveCompany] = useState('');
  const [newLiveRole, setNewLiveRole] = useState('');
  const [newLiveIsNew, setNewLiveIsNew] = useState(true);
  const [newLivePostedTime, setNewLivePostedTime] = useState('1 MIN AGO');
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Mock Tests Logo state
  const [mockTests, setMockTests] = useState<any[]>([])
  const [mockTestsLoading, setMockTestsLoading] = useState(false)
  const [newMockLogoUrl, setNewMockLogoUrl] = useState('')
  const [selectedMockCompany, setSelectedMockCompany] = useState<any>(null)
  const [showMockLogoModal, setShowMockLogoModal] = useState(false)

  // Check auth on open
  useEffect(() => {
    if (!isOpen) return
    fetch('/api/admin/check')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) {
          setIsLoggedIn(true)
          localStorage.setItem('admin_session', 'true')
          window.dispatchEvent(new Event('adminLoggedIn'))
          fetchAllJobs()
          fetchLiveFeed()
          fetchLogos()
        }
      })
      .catch(() => {})
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const fetchAllJobs = async () => {
    setJobsLoading(true)
    try {
      const res = await fetch('/api/jobs/daily?category=all')
      if (res.ok) {
        const data = await res.json()
        setJobs(data.jobs || [])
      }
    } catch {}
    finally { setJobsLoading(false) }
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id))
      }
    } catch {}
  }

  const fetchStudents = async () => {
    setStudentsLoading(true)
    try {
      const res = await fetch('/api/admin/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
      }
    } catch {}
    finally { setStudentsLoading(false) }
  }

  const fetchLiveFeed = async () => {
    try {
      const res = await fetch('/api/admin/live-feed')
      if (res.ok) {
        const data = await res.json()
        setLiveFeedItems(data.items || [])
      }
    } catch {}
  }

  const saveLiveFeed = async (newItems: any[]) => {
    try {
      await fetch('/api/admin/live-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newItems })
      })
      setLiveFeedItems(newItems)
    } catch {}
  }

  const handleAddLiveFeedItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLiveCompany || !newLiveRole) return;
    const newItem = {
      id: crypto.randomUUID(),
      company: newLiveCompany,
      role: newLiveRole,
      isNew: newLiveIsNew,
      postedTime: newLivePostedTime
    }
    const newItems = [newItem, ...liveFeedItems]
    saveLiveFeed(newItems)
    setNewLiveCompany('')
    setNewLiveRole('')
  }

  const handleRemoveLiveFeedItem = (id: string) => {
    const newItems = liveFeedItems.filter(item => item.id !== id)
    saveLiveFeed(newItems)
  }

  const fetchLogos = async () => {
    try {
      const res = await fetch('/api/admin/logos')
      if (res.ok) {
        const data = await res.json()
        setCompanyLogos(data.logos || [])
      }
    } catch {}
  }

  const fetchMockTests = async () => {
    setMockTestsLoading(true)
    try {
      const res = await fetch('/api/admin/mock-tests')
      if (res.ok) {
        const data = await res.json()
        setMockTests(data || [])
      }
    } catch {}
    finally { setMockTestsLoading(false) }
  }

  const submitUpdateMockLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMockCompany || !newMockLogoUrl.trim()) return;

    try {
      const res = await fetch('/api/admin/mock-tests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedMockCompany.id, logoUrl: newMockLogoUrl.trim() })
      });
      if (res.ok) {
        setMockTests(prev => prev.map(test => test.id === selectedMockCompany.id ? { ...test, logoUrl: newMockLogoUrl.trim() } : test));
        setShowMockLogoModal(false);
      } else {
        alert('Failed to update mock test logo');
      }
    } catch (e) {
      alert('Network error updating logo');
    }
  };

  const saveLogos = async (newLogos: any[]) => {
    try {
      await fetch('/api/admin/logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logos: newLogos })
      })
      setCompanyLogos(newLogos)
    } catch {}
  }

  const handleAddLogo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLogoCompany || !newLogoUrl) return;
    const newLogo = {
      company: newLogoCompany,
      logo: newLogoUrl
    }
    const newLogos = [newLogo, ...companyLogos]
    saveLogos(newLogos)
    setNewLogoCompany('')
    setNewLogoUrl('')
  }

  const handleRemoveLogo = (company: string) => {
    const newLogos = companyLogos.filter(item => item.company !== company)
    saveLogos(newLogos)
  }

  const downloadCSV = () => {
    if (!students || students.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'WhatsApp', 'College', 'Registered At'];
    const rows = students.map((s: any) => [
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(s.college || '').replace(/"/g, '""')}"`,
      `"${new Date(s.createdAt).toLocaleDateString()}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'registered_students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setOtpSent(true)
        alert('MOCK OTP: ' + data.mockOtp) // For demo
      } else {
        setLoginError(data.error || 'Failed to send OTP')
      }
    } catch {
      setLoginError('Connection error.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setForgotMode(false)
        setOtpSent(false)
        setOtp('')
        setNewPassword('')
        alert('Password reset successful. You can now login.')
      } else {
        setLoginError(data.error || 'Invalid OTP')
      }
    } catch {
      setLoginError('Connection error.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsMsg('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: settingsEmail,
          password: settingsPassword,
          newPassword: settingsNewPassword
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSettingsMsg('Settings updated successfully!')
        setSettingsPassword('')
        setSettingsNewPassword('')
      } else {
        setSettingsMsg('Error: ' + (data.error || 'Update failed'))
      }
    } catch {
      setSettingsMsg('Connection error.')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsLoggedIn(true)
        localStorage.setItem('admin_session', 'true')
        window.dispatchEvent(new Event('adminLoggedIn'))
        setEmail('')
        setPassword('')
        fetchAllJobs()
      } else {
        setLoginError(data.error || 'Invalid credentials')
      }
    } catch {
      setLoginError('Connection error. Try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setIsLoggedIn(false)
    localStorage.removeItem('admin_session')
    window.dispatchEvent(new Event('adminLoggedOut'))
    setJobs([])
    setShowAddForm(false)
  }

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim()) {
      setFormError('Job title is required')
      return
    }
    if (!form.company.trim()) {
      setFormError('Company is required')
      return
    }
    if (!form.applyLink.trim()) {
      setFormError('Apply link is required')
      return
    }
    if (!form.applyLink.startsWith('http')) {
      setFormError('Apply link must start with https://')
      return
    }
    setSubmitting(true)
    try {
      const url = editingId
        ? `/api/admin/jobs/${editingId}`
        : '/api/admin/jobs'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setShowAddForm(false)
        setForm(EMPTY_FORM)
        setEditingId(null)
        fetchAllJobs()
      } else {
        setFormError(data.error || 'Failed to save job')
      }
    } catch {
      setFormError('Network error. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch {
      alert('Failed to delete')
    }
  }

  const handleFeature = async (job: AdminJob) => {
    try {
      await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !job.isFeatured }),
      })
      setJobs(prev => prev.map(j =>
        j.id === job.id
          ? { ...j, isFeatured: !j.isFeatured }
          : j
      ))
    } catch {}
  }

  const openEdit = (job: AdminJob) => {
    setForm({
      title: job.title,
      company: job.company,
      logo: job.logo || '',
      location: job.location,
      jobType: job.jobType,
      category: job.category,
      salary: job.salary,
      applyLink: job.applyLink,
      deadline: job.deadline,
      description: job.description,
      isFeatured: job.isFeatured,
    })
    setEditingId(job.id)
    setActiveTab('add')
    setFormError('')
  }

  const timeAgo = (iso: string) => {
    const mins = Math.floor(
      (Date.now() - new Date(iso).getTime()) / 60000
    )
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed z-50 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isLoggedIn
          ? "inset-0 w-full h-full bg-white dark:bg-slate-900"
          : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white rounded-sm"
      }`}>

        {/* Header (Only show if logged in) */}
        {isLoggedIn && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-850 hover:text-gray-600 dark:hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* If logged out, floating close button */}
        {!isLoggedIn && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── LOGIN SECTION ── */}
          {!isLoggedIn ? (
            <div className="p-10">
              <p className="text-[11px] font-semibold text-[#8b95a5] uppercase tracking-[0.15em] mb-4">
                {forgotMode ? 'ACCOUNT RECOVERY' : 'RESTRICTED AREA'}
              </p>
              <h2 className="text-[32px] font-bold text-[#0a1118] font-serif mb-1">
                {forgotMode ? 'Reset Password' : 'Admin Sign In'}
              </h2>
              <p className="text-[15px] text-[#6c757d] mb-8">
                {forgotMode ? 'Enter your User ID or Admin Email to receive an OTP.' : 'Geonixa certificate management portal.'}
              </p>
              
              {!forgotMode ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="User ID or Email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                  />
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm bg-white text-gray-900 pr-10 focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
                    />
                    <button type="button"
                      onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {loginError && (
                    <p className="text-red-500 text-xs">
                      ⚠ {loginError}
                    </p>
                  )}

                  <button type="submit" disabled={loginLoading}
                    className="w-full py-3.5 mt-2 bg-[#0a1118] text-white font-semibold rounded-sm text-[15px] hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {loginLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                  <div className="flex items-center justify-between mt-6">
                    <button type="button" onClick={() => setForgotMode(true)} className="text-sm text-[#ff6b4a] hover:text-[#e05b3e] transition-colors">Forgot password?</button>
                    <span className="text-sm text-[#8b95a5]">Restricted access</span>
                  </div>
                </form>
              ) : (
                <form onSubmit={otpSent ? handleForgotVerifyOtp : handleForgotSendOtp} className="space-y-4">
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Admin User ID / Email"
                    required
                    disabled={otpSent}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-400 disabled:bg-gray-50"
                  />
                  {otpSent && (
                    <>
                      <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </>
                  )}
                  {loginError && <p className="text-red-500 text-xs">⚠ {loginError}</p>}
                  <button type="submit" disabled={loginLoading}
                    className="w-full py-3.5 mt-2 bg-[#0a1118] text-white font-semibold rounded-sm text-[15px] hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {loginLoading ? 'Processing...' : otpSent ? 'Reset Password' : 'Send OTP'}
                  </button>
                  <div className="flex items-center justify-between mt-6">
                    <button type="button" onClick={() => { setForgotMode(false); setOtpSent(false); setLoginError(''); }} className="text-sm text-gray-500 hover:text-gray-900">Back to login</button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="flex h-full w-full bg-[#fafafa]">
              {/* Sidebar */}
              <div className="w-[260px] bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">
                <div className="px-6 py-6 border-b border-gray-100 flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-1">Geonixa</span>
                  <span className="text-sm font-bold text-gray-900">Admin Dashboard</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="px-6 mb-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Configuration</p>
                  </div>
                  <nav className="space-y-1 px-3">

                    <button 
                      onClick={() => { setActiveTab('add'); setForm(EMPTY_FORM); setEditingId(null); setFormError(''); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'add' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Job
                    </button>
                    <button 
                      onClick={() => { setActiveTab('jobs'); fetchAllJobs(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'jobs' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Manage Jobs
                    </button>
                    <button 
                      onClick={() => { setActiveTab('students'); fetchStudents(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'students' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Students
                    </button>
                    <button 
                      onClick={() => { setActiveTab('live-feed'); fetchLiveFeed(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'live-feed' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Zap className="w-4 h-4" />
                      Scrolling Feed
                    </button>
                    <button 
                      onClick={() => { setActiveTab('logos'); fetchLogos(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'logos' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Star className="w-4 h-4" />
                      Company Logos
                    </button>
                    <button 
                      onClick={() => { setActiveTab('mock-tests'); fetchMockTests(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'mock-tests' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Star className="w-4 h-4" />
                      Mock Tests
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Eye className="w-4 h-4" />
                      Settings
                    </button>
                  </nav>
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto bg-[#fafafa]">
                <div className="px-10 py-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
                    {activeTab === 'add' ? (editingId ? 'Edit Job Posting' : 'Post a New Job') : activeTab === 'jobs' ? 'Manage All Jobs' : activeTab === 'live-feed' ? 'Scrolling Companies Feed' : activeTab === 'logos' ? 'Company Logos' : activeTab === 'mock-tests' ? 'Mock Tests Logos' : activeTab === 'settings' ? 'Account Settings' : 'Registered Students'}
                  </h1>

                  {activeTab === 'jobs' && (
                    <div className="bg-white border border-gray-200 rounded shadow-sm">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">{jobs.length} total jobs</span>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-[#f8f9fa] border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Job Title</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Source</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {jobsLoading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading jobs...</td></tr>
                          ) : (
                            jobs.map((j: any) => (
                              <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-gray-800">{j.title}</td>
                                <td className="px-6 py-4 text-gray-600">{j.company}</td>
                                <td className="px-6 py-4 text-gray-600 capitalize">{j.category}</td>
                                <td className="px-6 py-4 text-gray-400 text-xs">{j.source || 'Manual'}</td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleDeleteJob(j.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                          {!jobsLoading && jobs.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No jobs found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'students' && (
                    <div className="bg-white border border-gray-200 rounded shadow-sm">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                        <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">{students.length} of {students.length} records</span>
                        <button onClick={downloadCSV} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-xs font-semibold shadow-sm hover:bg-gray-50 flex items-center gap-2">
                          <Download className="w-3.5 h-3.5" /> Export Backup
                        </button>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-[#f8f9fa] border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">College</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Registered</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {students.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-gray-800">{s.name}</td>
                              <td className="px-6 py-4 text-gray-600">{s.email}</td>
                              <td className="px-6 py-4 text-gray-600">{s.collegeName || '-'}</td>
                              <td className="px-6 py-4 text-gray-400 text-xs">{new Date(s.registeredAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                          {students.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No students registered yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'add' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 lg:p-10 shadow-sm max-w-4xl mx-auto">
                      <form onSubmit={handleAddJob} className="space-y-8">
                        
                        {/* Categories as Pills */}
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Job Category *</label>
                          <div className="flex flex-wrap gap-3">
                             {CATEGORIES.map(cat => (
                               <label key={cat.value} className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-all duration-200 ${form.category === cat.value ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                                 <input type="radio" name="category" value={cat.value} checked={form.category === cat.value} onChange={e => setForm({ ...form, category: e.target.value })} className="hidden" />
                                 {cat.label}
                               </label>
                             ))}
                          </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Title *</label>
                              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. SDE-1, Product Manager" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors" required />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company *</label>
                              <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="e.g. Google, Microsoft" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors" required />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Logo URL (Optional)</label>
                            <input type="url" value={form.logo || ''} onChange={e => setForm({...form, logo: e.target.value})} placeholder="https://logo.clearbit.com/google.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors" />
                            <p className="text-xs text-gray-400 mt-1.5 ml-1">Leave blank to use a generic company initial avatar.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Apply Link *</label>
                              <input type="url" value={form.applyLink} onChange={e => setForm({...form, applyLink: e.target.value})} placeholder="https://careers.google.com/..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors" required />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Application Deadline (Optional)</label>
                              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Type</label>
                              <select value={form.jobType} onChange={e => setForm({...form, jobType: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors cursor-pointer appearance-none">
                                <option value="full-time">Full-time</option>
                                <option value="internship">Internship</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">On-site</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Salary / Stipend (Optional)</label>
                              <input type="text" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="e.g. 10 LPA, ₹20k/month" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-colors" />
                            </div>
                          </div>

                          {formError && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                              {formError}
                            </div>
                          )}
                          
                          <div className="pt-6 flex items-center justify-end border-t border-gray-100">
                            {editingId && (
                                <button type="button" onClick={() => { setActiveTab('add'); setEditingId(null); setForm(EMPTY_FORM); }} className="px-6 py-3.5 text-gray-500 font-semibold text-sm hover:text-gray-800 mr-4">
                                  Cancel
                                </button>
                            )}
                            <button type="submit" disabled={submitting} className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-lg shadow-md text-sm hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-70 flex items-center gap-2">
                              {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                              {submitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Post Job')}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'live-feed' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Company to Feed</h2>
                        <form onSubmit={handleAddLiveFeedItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name *</label>
                            <input type="text" value={newLiveCompany} onChange={e => setNewLiveCompany(e.target.value)} placeholder="e.g. TCS" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" required />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role *</label>
                            <input type="text" value={newLiveRole} onChange={e => setNewLiveRole(e.target.value)} placeholder="e.g. Software Engineer" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" required />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Posted Time</label>
                            <input type="text" value={newLivePostedTime} onChange={e => setNewLivePostedTime(e.target.value)} placeholder="e.g. 1 MIN AGO" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" required />
                          </div>
                          <div className="flex items-center gap-3 mt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={newLiveIsNew} onChange={e => setNewLiveIsNew(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                              <span className="text-sm font-semibold text-gray-700">Show "NEW" badge</span>
                            </label>
                          </div>
                          <div className="md:col-span-2 pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg shadow-md text-sm hover:bg-gray-800 transition-all flex items-center gap-2">
                              <Plus className="w-4 h-4" /> Add to Feed
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f8f9fa] border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</th>
                              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</th>
                              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time / Badge</th>
                              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {liveFeedItems.map((item: any) => (
                              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-gray-900">{item.company}</td>
                                <td className="px-6 py-4 text-gray-600">{item.role}</td>
                                <td className="px-6 py-4">
                                  <span className="text-xs text-gray-500 block">{item.postedTime}</span>
                                  {item.isNew && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">New</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleRemoveLiveFeedItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {liveFeedItems.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                  No companies in the live feed.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'logos' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Assign Logo to Company</h2>
                        <form onSubmit={handleAddLogo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name *</label>
                            <input type="text" value={newLogoCompany} onChange={e => setNewLogoCompany(e.target.value)} placeholder="e.g. Infosys, TCS, Amazon" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" required />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Logo URL *</label>
                            <input type="url" value={newLogoUrl} onChange={e => setNewLogoUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" required />
                          </div>
                          <div className="md:col-span-2 pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg shadow-md text-sm hover:bg-gray-800 transition-all flex items-center gap-2">
                              <Plus className="w-4 h-4" /> Assign Logo
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-[#f8f9fa] border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logo</th>
                              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</th>
                              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {companyLogos.map((item: any) => (
                              <tr key={item.company} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <img src={item.logo} alt={item.company} className="w-8 h-8 object-contain rounded bg-white border border-gray-100" />
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{item.company}</td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleRemoveLogo(item.company)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {companyLogos.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                  No custom logos assigned.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'mock-tests' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                           <h2 className="text-xl font-bold text-gray-900">Manage Mock Test Logos</h2>
                           <p className="text-sm text-gray-500 mt-1">Update the logos for the top 50 MNC mock tests.</p>
                        </div>
                        <table className="w-full text-sm">
                          <thead className="bg-[#f8f9fa] border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logo</th>
                              <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</th>
                              <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {mockTestsLoading ? (
                              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Loading mock tests...</td></tr>
                            ) : mockTests.map((item: any) => (
                              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  {item.logoUrl ? (
                                     <img src={item.logoUrl} alt={item.company} className="w-8 h-8 object-contain rounded bg-white border border-gray-100" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                                  ) : (
                                     <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-300 border border-gray-100 rounded">{item.company[0]}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{item.company}</td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => {
                                      setSelectedMockCompany(item);
                                      setNewMockLogoUrl(item.logoUrl || '');
                                      setShowMockLogoModal(true);
                                  }} className="px-3 py-1.5 bg-gray-900 text-white font-semibold text-xs rounded shadow-sm hover:bg-gray-800 transition-colors">
                                    Update Logo
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {!mockTestsLoading && mockTests.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                  No mock tests found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-6 max-w-xl mx-auto">
                      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                        <form onSubmit={handleSettingsSave} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New User ID / Email (Optional)</label>
                            <input type="text" value={settingsEmail} onChange={e => setSettingsEmail(e.target.value)} placeholder="Leave blank to keep current" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password *</label>
                            <input type="password" value={settingsPassword} onChange={e => setSettingsPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password (Optional)</label>
                            <input type="password" value={settingsNewPassword} onChange={e => setSettingsNewPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
                          </div>
                          
                          {settingsMsg && (
                            <p className={`text-xs font-bold ${settingsMsg.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                              {settingsMsg}
                            </p>
                          )}

                          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg shadow-md text-sm hover:bg-gray-800 transition-all flex items-center gap-2">
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showMockLogoModal && selectedMockCompany && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMockLogoModal(false)} />
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Update Logo</h3>
              <button onClick={() => setShowMockLogoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submitUpdateMockLogo} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Name</label>
                  <input type="text" value={selectedMockCompany.company} disabled className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Logo URL</label>
                  <input type="url" value={newMockLogoUrl} onChange={(e) => setNewMockLogoUrl(e.target.value)} required placeholder="https://..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none" />
               </div>
               <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowMockLogoModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
