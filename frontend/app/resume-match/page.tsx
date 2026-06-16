'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, Briefcase, Zap,
  CheckCircle, XCircle, AlertCircle,
  ChevronDown, ChevronUp, Star,
  TrendingUp, Target, Award,
  ArrowRight, RotateCcw, Download,
  Lightbulb, Shield, Clock, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface SectionScores {
  skills: number
  experience: number
  education: number
  formatting: number
  keywords: number
}

interface Improvement {
  priority: 'high' | 'medium' | 'low'
  title: string
  detail: string
}

interface AnalysisResult {
  atsScore: number
  scoreLabel: string
  summary: string
  matchedKeywords: string[]
  missingKeywords: string[]
  sectionScores: SectionScores
  sectionFeedback: Record<string, string>
  improvements: Improvement[]
  strengths: string[]
  atsFormatTips: string[]
  recommendedJobTitles: string[]
}

export default function ResumeMatchPage() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const jd = params.get('jd')
    if (jd) setJobDescription(decodeURIComponent(jd))
  }, [])

  // Handle file upload (reads text from PDF or TXT)
  const handleFile = useCallback(async (file: File) => {
    if (!file) return
  
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('File too large. Maximum 5MB allowed.')
      return
    }
  
    setFileName(file.name)
    setError('')
    setResumeText('')
  
    // ── Plain text files ─────────────────────────
    if (
      file.type === 'text/plain' ||
      file.name.endsWith('.txt')
    ) {
      const text = await file.text()
      if (text.trim().length < 50) {
        setError('Text file appears empty. Please check the file.')
        setFileName('')
        return
      }
      setResumeText(text)
      return
    }
  
    // ── PDF files ────────────────────────────────
    if (
      file.type === 'application/pdf' ||
      file.name.endsWith('.pdf')
    ) {
      setFileName(file.name);
      setError('');
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        
        if (res.ok && data.success) {
          setResumeText(data.text);
        } else {
          setError('Could not extract text from PDF. Please ensure it is not a scanned image.');
        }
      } catch (err) {
        setError('Failed to upload and parse PDF.');
      } finally {
        setLoading(false);
      }
      return;
    }
  
    // ── Word documents ───────────────────────────
    if (
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx') ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setError(
        'Word file detected! Please: ' +
        'Open in Word/Google Docs → Select All (Ctrl+A) → ' +
        'Copy (Ctrl+C) → Paste into the text box below.'
      )
      setFileName('')
      return
    }
  
    setError(
      'Unsupported file type. Please paste your resume text directly.'
    )
    setFileName('')
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text or upload a file.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/resume-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Analysis failed. Please try again.')
        return
      }

      setResult(data.result)

      // Save to localStorage history
      try {
        const history = JSON.parse(
          localStorage.getItem('resume_match_history') || '[]'
        )
        history.unshift({
          id: Date.now(),
          score: data.result.atsScore,
          scoreLabel: data.result.scoreLabel,
          matchedCount: data.result.matchedKeywords.length,
          missingCount: data.result.missingKeywords.length,
          analyzedAt: new Date().toISOString(),
        })
        localStorage.setItem(
          'resume_match_history',
          JSON.stringify(history.slice(0, 10))
        )
      } catch {}

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)

    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setResumeText('')
    setJobDescription('')
    setFileName('')
    setError('')
    setExpandedSection(null)
  }

  // Score color helpers
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const scoreRing = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#eab308'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  const priorityStyles = {
    high: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-500',
      badge: 'bg-red-100 text-red-700',
      label: 'High Priority',
    },
    medium: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-500',
      badge: 'bg-yellow-100 text-yellow-700',
      label: 'Medium Priority',
    },
    low: {
      bg: 'bg-slate-50 border-slate-200',
      icon: 'text-slate-900',
      badge: 'bg-slate-100 text-slate-900',
      label: 'Low Priority',
    },
  }

  const sectionIcons: Record<string, any> = {
    skills: Zap,
    experience: Briefcase,
    education: Award,
    formatting: FileText,
    keywords: Target,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br 
                    from-slate-50 via-slate-50/30 to-white">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 
                      sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 
                        flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/job-updates" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors mr-1">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-10 h-10 bg-slate-900 rounded-xl 
                            flex items-center justify-center 
                            shadow-lg shadow-black/">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                ATS Resume Matcher
              </h1>
              <p className="text-xs text-gray-500">
                Powered by Claude AI
              </p>
            </div>
          </div>
          {result && (
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 
                         border border-gray-200 rounded-xl text-sm 
                         text-gray-600 hover:bg-gray-50 
                         transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
              Analyze Again
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10">
            <div className="inline-flex items-center gap-2 
                            px-4 py-1.5 bg-slate-50 border 
                            border-slate-200 rounded-full 
                            text-slate-900 text-sm font-medium mb-4">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered ATS Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-bold 
                           text-gray-900 mb-3">
              Check your resume against
              <span className="text-slate-900"> any job</span>
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Get an instant ATS score, find missing keywords, and
              receive actionable improvements to land more interviews.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-6">
              {[
                { value: '98%', label: 'ATS Accuracy' },
                { value: '< 30s', label: 'Analysis Time' },
                { value: 'Free', label: 'No Cost' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input section */}
        {!result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Resume input */}
            <div className="bg-white rounded-2xl border border-gray-200 
                            shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 
                              flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-900" />
                  <span className="font-semibold text-gray-900 text-sm">
                    Your Resume
                  </span>
                </div>
                {fileName && (
                  <span className="text-xs text-green-600 
                                   flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {fileName}
                  </span>
                )}
              </div>

              {/* Drop zone */}
              <div
                className={`mx-4 mt-4 border-2 border-dashed 
                  rounded-xl p-4 text-center cursor-pointer 
                  transition-colors ${
                  dragOver
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-gray-200 hover:border-slate-200 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={e => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">
                  Drop PDF/TXT or{' '}
                  <span className="text-slate-900 font-medium">
                    click to upload
                  </span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleFile(file)
                  }}
                />
              </div>

              <div className="px-4 py-2 text-center">
                <span className="text-xs text-gray-400">or</span>
              </div>

              <div className="px-4 pb-4">
                <textarea
                  value={resumeText}
                  onChange={e => {
                    setResumeText(e.target.value)
                    setError('')
                  }}
                  placeholder="Paste your resume text here...

HOW TO GET TEXT FROM PDF:
1. Open your PDF
2. Press Ctrl+A (Select All)
3. Press Ctrl+C (Copy)
4. Click here and press Ctrl+V (Paste)

Example format:
John Doe | Software Engineer
john@email.com | +91 98765 43210 | LinkedIn

EXPERIENCE
Software Engineer — TCS (2022–2024)
- Built REST APIs using Node.js and Express
- Improved performance by 40% using Redis caching
- Led team of 4 engineers on payments module

EDUCATION
B.Tech Computer Science — VIT University (2022)
CGPA: 8.5/10

SKILLS
JavaScript, TypeScript, React, Node.js, Python,
AWS, Docker, MongoDB, PostgreSQL, Git"
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-200 
                             rounded-xl text-sm bg-gray-50 
                             focus:outline-none focus:ring-2 
                             focus:ring-slate-900 focus:bg-white
                             placeholder:text-gray-400 resize-none 
                             transition-all font-mono"
                />
                <p className="text-xs text-gray-400 mt-1.5 text-right">
                  {resumeText.length} characters
                </p>
              </div>
            </div>

            {/* Job description input */}
            <div className="bg-white rounded-2xl border border-gray-200 
                            shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-gray-900 text-sm">
                    Job Description
                  </span>
                </div>
              </div>
              <div className="px-4 pt-4 pb-4">
                <textarea
                  value={jobDescription}
                  onChange={e => {
                    setJobDescription(e.target.value)
                    setError('')
                  }}
                  placeholder="Paste the full job description here...

Software Engineer — Razorpay
Location: Bangalore, India

About the Role:
We are looking for a skilled Software Engineer to join our 
payments team...

Requirements:
- 3+ years of experience with Python or Node.js
- Strong knowledge of REST APIs and microservices
- Experience with AWS or GCP
- Familiarity with React or Vue.js
- Knowledge of SQL and NoSQL databases
- Good communication skills..."
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-200 
                             rounded-xl text-sm bg-gray-50 
                             focus:outline-none focus:ring-2 
                             focus:ring-purple-500 focus:bg-white
                             placeholder:text-gray-400 resize-none 
                             transition-all"
                />
                <p className="text-xs text-gray-400 mt-1.5 text-right">
                  {jobDescription.length} characters
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={`mb-4 rounded-xl px-4 py-3 border ${
            error.includes('PDF detected') || 
            error.includes('Word file') ||
            error.includes('copy and paste')
              ? 'bg-amber-50 border-amber-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                error.includes('PDF detected') || 
                error.includes('Word file') ||
                error.includes('copy and paste')
                  ? 'text-amber-500'
                  : 'text-red-500'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  error.includes('PDF detected') || 
                  error.includes('Word file') ||
                  error.includes('copy and paste')
                    ? 'text-amber-800'
                    : 'text-red-700'
                }`}>
                  {error}
                </p>
                {(error.includes('PDF') || error.includes('Word')) && (
                  <div className="mt-2 text-xs text-amber-700 
                                  bg-amber-100 rounded-lg p-2 space-y-1">
                    <p className="font-semibold">
                      Quick steps to copy resume text:
                    </p>
                    <p>1. Open your PDF/Word file</p>
                    <p>2. Press Ctrl+A (select all)</p>
                    <p>3. Press Ctrl+C (copy)</p>
                    <p>4. Click in the text box below</p>
                    <p>5. Press Ctrl+V (paste)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analyze button */}
        {!result && (
          <div className="text-center mb-8">
            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim() || 
                        !jobDescription.trim()}
              className="inline-flex items-center gap-3 px-8 py-4 
                         bg-slate-900 hover:bg-black active:bg-slate-800
                         text-white font-bold text-base rounded-2xl 
                         transition-all disabled:opacity-50 
                         disabled:cursor-not-allowed shadow-lg 
                         shadow-black/30 hover:shadow-black/40
                         hover:-translate-y-0.5 active:translate-y-0">
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 
                                   border-t-white rounded-full 
                                   animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze My Resume
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            {loading && (
              <p className="text-sm text-gray-500 mt-3">
                Claude AI is analyzing your resume... 
                This takes 15–30 seconds
              </p>
            )}
          </div>
        )}

        {/* ── RESULTS ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6">

              {/* Score hero card */}
              <div className="bg-white rounded-2xl border border-gray-100 
                              shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center 
                                gap-8">

                  {/* Circular score */}
                  <div className="flex-shrink-0 relative">
                    <svg width="160" height="160" className="rotate-[-90deg]">
                      <circle cx="80" cy="80" r="70"
                        fill="none" stroke="#f1f5f9"
                        strokeWidth="12" />
                      <circle cx="80" cy="80" r="70"
                        fill="none"
                        stroke={scoreRing(result.atsScore)}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 70 * 
                          (1 - result.atsScore / 100)
                        }`}
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col 
                                    items-center justify-center">
                      <span className={`text-4xl font-black 
                        ${scoreColor(result.atsScore)}`}>
                        {result.atsScore}
                      </span>
                      <span className="text-xs font-semibold 
                                       text-gray-500 mt-0.5">
                        ATS SCORE
                      </span>
                    </div>
                  </div>

                  {/* Score details */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 
                                    justify-center md:justify-start mb-2">
                      <span className={`text-2xl font-bold 
                        ${scoreColor(result.atsScore)}`}>
                        {result.scoreLabel}
                      </span>
                      {result.atsScore >= 80 && (
                        <span className="px-2 py-0.5 bg-green-100 
                                         text-green-700 text-xs 
                                         font-semibold rounded-full">
                          ATS Ready ✓
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed 
                                  mb-5 max-w-lg">
                      {result.summary}
                    </p>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-xl p-3 
                                      text-center">
                        <p className="text-2xl font-bold text-green-700">
                          {result.matchedKeywords.length}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          Keywords Matched
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3 
                                      text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {result.missingKeywords.length}
                        </p>
                        <p className="text-xs text-red-600 font-medium">
                          Keywords Missing
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 
                                      text-center">
                        <p className="text-2xl font-bold text-slate-900">
                          {result.improvements.length}
                        </p>
                        <p className="text-xs text-slate-900 font-medium">
                          Improvements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Matched */}
                <div className="bg-white rounded-2xl border 
                                border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg 
                                    flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Matched Keywords
                    </h3>
                    <span className="ml-auto px-2 py-0.5 
                                     bg-green-100 text-green-700 
                                     text-xs font-semibold rounded-full">
                      {result.matchedKeywords.length} found
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i}
                        className="px-3 py-1.5 bg-green-50 
                                   text-green-700 border border-green-200 
                                   rounded-full text-xs font-medium 
                                   flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        {kw}
                      </span>
                    ))}
                    {result.matchedKeywords.length === 0 && (
                      <p className="text-gray-400 text-sm">
                        No keywords matched yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="bg-white rounded-2xl border 
                                border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg 
                                    flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Missing Keywords
                    </h3>
                    <span className="ml-auto px-2 py-0.5 
                                     bg-red-100 text-red-600 
                                     text-xs font-semibold rounded-full">
                      {result.missingKeywords.length} missing
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i}
                        className="px-3 py-1.5 bg-red-50 
                                   text-red-600 border border-red-200 
                                   rounded-full text-xs font-medium 
                                   flex items-center gap-1">
                        <XCircle className="w-2.5 h-2.5" />
                        {kw}
                      </span>
                    ))}
                    {result.missingKeywords.length === 0 && (
                      <p className="text-green-600 text-sm font-medium">
                        🎉 No missing keywords!
                      </p>
                    )}
                  </div>
                  {result.missingKeywords.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3 
                                  bg-amber-50 border border-amber-100 
                                  rounded-lg p-2">
                      💡 Add these keywords naturally to your resume
                      to boost your ATS score
                    </p>
                  )}
                </div>
              </div>

              {/* Section scores */}
              <div className="bg-white rounded-2xl border border-gray-100 
                              shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-5 
                               flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-900" />
                  Section-by-Section Analysis
                </h3>
                <div className="space-y-4">
                  {Object.entries(result.sectionScores).map(
                    ([section, score]) => {
                      const Icon = sectionIcons[section] || FileText
                      const isExpanded = expandedSection === section
                      return (
                        <div key={section}>
                          <button
                            onClick={() => setExpandedSection(
                              isExpanded ? null : section
                            )}
                            className="w-full flex items-center gap-3 
                                       hover:bg-gray-50 rounded-xl 
                                       p-2 transition-colors group">
                            <div className="w-8 h-8 bg-gray-100 
                                            rounded-lg flex items-center 
                                            justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center 
                                              justify-between mb-1.5">
                                <span className="text-sm font-medium 
                                                 text-gray-700 capitalize">
                                  {section}
                                </span>
                                <span className={`text-sm font-bold 
                                  ${scoreColor(score)}`}>
                                  {score}/100
                                </span>
                              </div>
                              <div className="h-2 bg-gray-100 
                                              rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 0.8, delay: 0.1 }}
                                  className={`h-2 rounded-full 
                                    ${scoreBg(score)}`}
                                />
                              </div>
                            </div>
                            {isExpanded
                              ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            }
                          </button>
                          <AnimatePresence>
                            {isExpanded && result.sectionFeedback[section] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-11 mr-2 mb-2">
                                <p className="text-sm text-gray-600 
                                              bg-slate-50 border 
                                              border-slate-200 rounded-xl 
                                              p-3 leading-relaxed">
                                  {result.sectionFeedback[section]}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-white rounded-2xl border border-gray-100 
                              shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-5 
                               flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Improvement Suggestions
                </h3>
                <div className="space-y-3">
                  {result.improvements.map((imp, i) => {
                    const style = priorityStyles[imp.priority]
                    return (
                      <div key={i}
                        className={`border rounded-xl p-4 ${style.bg}`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className={`w-4 h-4 mt-0.5 
                            flex-shrink-0 ${style.icon}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center 
                                            gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-gray-900 
                                            text-sm">
                                {imp.title}
                              </p>
                              <span className={`px-2 py-0.5 rounded-full 
                                text-xs font-semibold ${style.badge}`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 
                                          leading-relaxed">
                              {imp.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Strengths + ATS Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Strengths */}
                <div className="bg-white rounded-2xl border 
                                border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 
                                 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Your Strengths
                  </h3>
                  <div className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <div key={i}
                        className="flex items-start gap-2 
                                   bg-green-50 rounded-xl p-3">
                        <CheckCircle className="w-4 h-4 text-green-500 
                                                mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-800">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS Tips */}
                <div className="bg-white rounded-2xl border 
                                border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 
                                 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-900" />
                    ATS Format Tips
                  </h3>
                  <div className="space-y-2">
                    {result.atsFormatTips.map((tip, i) => (
                      <div key={i}
                        className="flex items-start gap-2 
                                   bg-slate-50 rounded-xl p-3">
                        <span className="text-slate-900 font-bold 
                                         text-xs flex-shrink-0 mt-0.5">
                          {i + 1}.
                        </span>
                        <p className="text-sm text-slate-900">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended job titles */}
              {result.recommendedJobTitles.length > 0 && (
                <div className="bg-gradient-to-r from-slate-800 to-black rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Recommended Job Titles for You
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedJobTitles.map((title, i) => (
                      <a key={i}
                        href={`/job-updates?search=${encodeURIComponent(title)}`}
                        className="flex items-center gap-1.5 
                                   px-4 py-2 bg-white/20 
                                   hover:bg-white/30 rounded-xl 
                                   text-sm font-medium transition-colors 
                                   backdrop-blur-sm border border-white/30">
                        {title}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                  <p className="text-slate-900 text-xs mt-3">
                    Click to search matching jobs in our portal
                  </p>
                </div>
              )}

              {/* Analyze again */}
              <div className="text-center pb-8">
                <button onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 
                             border-2 border-slate-900 text-slate-900 
                             rounded-2xl font-semibold text-sm 
                             hover:bg-slate-50 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  Analyze Another Resume
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
