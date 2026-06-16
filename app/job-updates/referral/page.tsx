'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Send, CheckCircle, ExternalLink, Building2, X, ArrowLeft, Sparkles } from 'lucide-react'

// Real Indian companies with referral opportunities
const REAL_REFERRAL_COMPANIES = [
  {
    id: 'google-india',
    company: 'Google India',
    role: 'Software Engineer / Product Manager',
    location: 'Bangalore / Hyderabad',
    type: 'hybrid',
    referralLink: 'https://careers.google.com/locations/india/',
    logo: 'G',
    color: 'bg-slate-50 text-slate-900 dark:bg-blue-950/30 dark:text-slate-900',
    referralInstructions: 'Apply directly on Google Careers and mention a referral in your cover letter. Search LinkedIn for Google India employees in your target team.',
  },
  {
    id: 'microsoft-india',
    company: 'Microsoft India',
    role: 'Software Development Engineer',
    location: 'Hyderabad / Bangalore / Noida',
    type: 'hybrid',
    referralLink: 'https://careers.microsoft.com/us/en/search-results?lc=India',
    logo: 'M',
    color: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
    referralInstructions: 'Search Microsoft Careers for India roles. Connect with Microsoft employees on LinkedIn for referrals.',
  },
  {
    id: 'amazon-india',
    company: 'Amazon India',
    role: 'SDE / Business Analyst / Operations',
    location: 'Bangalore / Hyderabad / Chennai',
    type: 'onsite',
    referralLink: 'https://www.amazon.jobs/en/locations/india',
    logo: 'A',
    color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
    referralInstructions: 'Apply on Amazon Jobs portal. Internal referrals significantly boost chances. Reach out to Amazon India employees on LinkedIn.',
  },
  {
    id: 'flipkart',
    company: 'Flipkart',
    role: 'Product Manager / Engineering / Design',
    location: 'Bangalore',
    type: 'hybrid',
    referralLink: 'https://www.flipkartcareers.com/',
    logo: 'F',
    color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400',
    referralInstructions: 'Apply on Flipkart Careers. Employee referrals are highly valued. Network with Flipkart employees on LinkedIn.',
  },
  {
    id: 'swiggy',
    company: 'Swiggy',
    role: 'Engineering / Product / Operations',
    location: 'Bangalore / Remote',
    type: 'hybrid',
    referralLink: 'https://careers.swiggy.com/',
    logo: 'S',
    color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
    referralInstructions: 'Apply on Swiggy Careers. Very referral-friendly culture. Connect with Swiggy engineers on LinkedIn.',
  },
  {
    id: 'razorpay',
    company: 'Razorpay',
    role: 'Software Engineer / Sales / Product',
    location: 'Bangalore / Remote',
    type: 'remote',
    referralLink: 'https://razorpay.com/jobs/',
    logo: 'R',
    color: 'bg-slate-50 text-slate-900 dark:bg-blue-950/30 dark:text-slate-900',
    referralInstructions: 'Very active on LinkedIn. Apply directly and DM Razorpay employees for referrals. Strong referral bonus culture.',
  },
  {
    id: 'zomato',
    company: 'Zomato',
    role: 'Product / Engineering / Data',
    location: 'Gurugram / Bangalore',
    type: 'hybrid',
    referralLink: 'https://www.zomato.com/careers',
    logo: 'Z',
    color: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
    referralInstructions: 'Apply on Zomato Careers portal. Follow Zomato employees on LinkedIn for referral opportunities.',
  },
  {
    id: 'meesho',
    company: 'Meesho',
    role: 'Engineering / Product / Growth',
    location: 'Bangalore / Remote',
    type: 'remote',
    referralLink: 'https://meesho.io/careers',
    logo: 'M',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
    referralInstructions: 'Very referral-driven hiring. Apply on Meesho Careers and reach out to employees directly for referrals.',
  },
  {
    id: 'groww',
    company: 'Groww',
    role: 'Engineering / Product / Finance',
    location: 'Bangalore / Remote',
    type: 'remote',
    referralLink: 'https://groww.in/p/careers',
    logo: 'G',
    color: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
    referralInstructions: 'Fast-growing fintech with high referral rate. DM Groww employees on LinkedIn with your resume.',
  },
  {
    id: 'phonepe',
    company: 'PhonePe',
    role: 'SDE / Data Scientist / Product Manager',
    location: 'Bangalore',
    type: 'hybrid',
    referralLink: 'https://www.phonepe.com/en/careers.html',
    logo: 'P',
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
    referralInstructions: 'Very active hiring. Employee referrals prioritized. Connect with PhonePe team on LinkedIn.',
  },
  {
    id: 'tcs',
    company: 'Tata Consultancy Services',
    role: 'IT Analyst / Developer / Consultant',
    location: 'Pan India',
    type: 'hybrid',
    referralLink: 'https://www.tcs.com/careers',
    logo: 'T',
    color: 'bg-slate-50 text-slate-900 dark:bg-blue-950/30 dark:text-slate-900',
    referralInstructions: 'Apply on TCS NextStep portal. TCS iON also accepts applications. Referrals from current employees boost shortlisting.',
  },
  {
    id: 'infosys',
    company: 'Infosys',
    role: 'Systems Engineer / Technology Analyst',
    location: 'Bangalore / Hyderabad / Pan India',
    type: 'hybrid',
    referralLink: 'https://www.infosys.com/careers/apply.html',
    logo: 'I',
    color: 'bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400',
    referralInstructions: 'Apply via InfyTQ for freshers. Experienced roles on Infosys Careers. LinkedIn referrals from Infosys employees are very effective.',
  },
]

interface ReferralRequest {
  id: string
  company: string
  jobTitle: string
  jobLink: string
  message: string
  status: 'pending' | 'sent' | 'accepted'
  createdAt: string
}

export default function ReferralHubPage() {
  const [activeTab, setActiveTab] = useState<'find' | 'request' | 'mine'>('find')
  const [requests, setRequests] = useState<ReferralRequest[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [showInstructions, setShowInstructions] = useState<string | null>(null)

  // AI generation state
  const [showResumeInput, setShowResumeInput] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  // Request form
  const [reqForm, setReqForm] = useState({
    company: '',
    jobTitle: '',
    jobLink: '',
    message: '',
    resumeLink: '',
  })

  // Load saved requests from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('referral_requests')
      if (saved) setRequests(JSON.parse(saved))
    } catch {}
  }, [])

  const saveRequests = (reqs: ReferralRequest[]) => {
    setRequests(reqs)
    try {
      localStorage.setItem('referral_requests', JSON.stringify(reqs))
    } catch {}
  }

  const handleRequestReferral = (company: typeof REAL_REFERRAL_COMPANIES[0]) => {
    setReqForm(p => ({
      ...p,
      company: company.company,
      jobLink: company.referralLink,
    }))
    setActiveTab('request')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGenerateMessage = async () => {
    if (!resumeText.trim()) return
    setIsGenerating(true)
    setGenError('')
    
    try {
      const res = await fetch('/api/generate-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: reqForm.company,
          jobTitle: reqForm.jobTitle,
          resumeText,
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate message')
      }
      
      setReqForm(p => ({ ...p, message: data.message }))
      setShowResumeInput(false)
    } catch (err: any) {
      setGenError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqForm.company || !reqForm.jobTitle || !reqForm.jobLink) {
      return
    }
    setSubmitting(true)

    // Simulate API call / save locally
    await new Promise(r => setTimeout(r, 800))

    const newReq: ReferralRequest = {
      id: `req_${Date.now()}`,
      company: reqForm.company,
      jobTitle: reqForm.jobTitle,
      jobLink: reqForm.jobLink,
      message: reqForm.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    saveRequests([newReq, ...requests])
    setSubmitSuccess(
      `Referral request for ${reqForm.company} saved! Now reach out to employees on LinkedIn with your resume.`
    )
    setReqForm({
      company: '', jobTitle: '', jobLink: '',
      message: '', resumeLink: '',
    })
    setSubmitting(false)
    setActiveTab('mine')
  }

  const inputCls = `w-full px-4 py-3 border border-gray-200 dark:border-slate-800
    rounded-xl text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-slate-900 
    placeholder:text-gray-405`

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24 md:pt-28">


      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-slate-900 dark:text-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link href="/job-updates" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-900 uppercase tracking-wider">
                  REFERRAL HUB
                </p>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Get referred by employees at top companies.
              </h1>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                Browse real referral opportunities at Indian companies and track your requests.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 text-center min-w-[100px] border border-gray-100 dark:border-slate-850">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                Companies
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {REAL_REFERRAL_COMPANIES.length}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-950 rounded-xl p-4 text-center min-w-[100px] border border-gray-100 dark:border-slate-850">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                My Requests
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {requests.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-slate-950 p-1 rounded-xl w-fit border border-gray-200 dark:border-slate-800">
        {[
          { key: 'find', label: 'Find Referrers' },
          { key: 'request', label: 'Request Referral' },
          { key: 'mine', label: `My Requests (${requests.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any)
              setSubmitSuccess('')
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-gray-650 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: FIND REFERRERS ── */}
      {activeTab === 'find' && (
        <div className="space-y-3">
          {REAL_REFERRAL_COMPANIES.map(co => (
            <div key={co.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Logo */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${co.color}`}>
                    {co.logo}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {co.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-450 truncate">
                      {co.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        📍 {co.location}
                      </span>
                      <span className="px-1.5 py-0.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded text-[10px] font-semibold uppercase tracking-wider">
                        Referral Available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setShowInstructions(showInstructions === co.id ? null : co.id)}
                    className="px-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-medium text-gray-650 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-950 transition-colors">
                    Instructions
                  </button>
                  <button
                    onClick={() => handleRequestReferral(co)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1">
                    Request <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Instructions Expandable */}
              {showInstructions === co.id && (
                <div className="mt-4 p-4 bg-slate-50/50 dark:bg-blue-950/10 border border-slate-200/50 dark:border-blue-950/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-slate-900 dark:text-slate-900 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-900 uppercase tracking-wider mb-1">
                        Referral Instructions
                      </p>
                      <p className="text-sm text-gray-700 dark:text-slate-350">
                        {co.referralInstructions}
                      </p>
                      <a href={co.referralLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-slate-900 hover:underline mt-2 font-medium">
                        Go to Careers Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: REQUEST REFERRAL ── */}
      {activeTab === 'request' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Submit your referral request
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
            Enter the details of the job posting you want to request a referral for.
          </p>

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-650 dark:text-slate-400 mb-1.5">
                Company *
              </label>
              <input
                type="text"
                value={reqForm.company}
                onChange={e => setReqForm(p => ({ ...p, company: e.target.value }))}
                placeholder="e.g. Google India, Swiggy"
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-650 dark:text-slate-400 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                value={reqForm.jobTitle}
                onChange={e => setReqForm(p => ({ ...p, jobTitle: e.target.value }))}
                placeholder="e.g. Frontend Developer Intern"
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-650 dark:text-slate-400 mb-1.5">
                Job Posting Link *
              </label>
              <input
                type="url"
                value={reqForm.jobLink}
                onChange={e => setReqForm(p => ({ ...p, jobLink: e.target.value }))}
                placeholder="https://..."
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-650 dark:text-slate-400 mb-1.5">
                Resume Link (Google Drive / Dropbox)
              </label>
              <input
                type="url"
                value={reqForm.resumeLink}
                onChange={e => setReqForm(p => ({ ...p, resumeLink: e.target.value }))}
                placeholder="https://drive.google.com/..."
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-650 dark:text-slate-400">
                  Message / Cover Note
                </label>
                <button
                  type="button"
                  onClick={() => setShowResumeInput(!showResumeInput)}
                  className="text-xs font-medium text-slate-900 hover:text-slate-900 dark:text-slate-900 dark:hover:text-slate-900 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Auto-generate with AI
                </button>
              </div>

              {showResumeInput && (
                <div className="mb-3 p-3 bg-slate-50/50 dark:bg-blue-950/20 border border-slate-200 dark:border-slate-200 rounded-xl space-y-3">
                  <textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here to generate a tailored message..."
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!resumeText.trim()) {
                        setGenError("Please paste your resume text in this box first.")
                        return
                      }
                      handleGenerateMessage()
                    }}
                    disabled={isGenerating}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Message'}
                  </button>
                  {genError && <p className="text-xs text-red-500">{genError}</p>}
                </div>
              )}

              <textarea
                value={reqForm.message}
                onChange={e => setReqForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Brief summary of your profile & why you match this role..."
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? 'Saving Request...' : 'Submit Request →'}
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 3: MY REQUESTS ── */}
      {activeTab === 'mine' && (
        <div className="space-y-3">
          {submitSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-700 dark:text-green-400 text-sm flex items-start gap-2 mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 p-10 text-center shadow-sm">
              <Building2 className="w-10 h-10 text-gray-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                No referral requests submitted yet.
              </p>
              <button
                onClick={() => setActiveTab('find')}
                className="mt-2 text-slate-900 dark:text-slate-900 text-sm font-semibold hover:underline">
                Find a company to request →
              </button>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {req.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {req.company}
                    </p>
                    <p className="text-[11px] text-gray-450 dark:text-slate-500 mt-2">
                      Requested on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {req.status}
                  </span>
                </div>
                {req.jobLink && (
                  <a href={req.jobLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-900 dark:text-slate-900 hover:underline mt-4">
                    View job posting <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
