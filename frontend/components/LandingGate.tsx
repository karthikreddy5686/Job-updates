'use client'
import { useState } from 'react'
import { 
  Briefcase, Bell, BookOpen, Users,
  Target, ArrowRight, CheckCircle,
  GraduationCap, TrendingUp, Shield
} from 'lucide-react'
import StudentAuthModal from './StudentAuthModal'

interface Props {
  onLogin: (student: { name: string; email: string }) => void
}

export default function LandingGate({ onLogin }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [defaultTab, setDefaultTab] = 
    useState<'login' | 'register'>('register')

  const openLogin = () => {
    setDefaultTab('login')
    setShowModal(true)
  }

  const openRegister = () => {
    setDefaultTab('register')
    setShowModal(true)
  }

  const FEATURES = [
    {
      icon: Briefcase,
      title: 'Daily Job Updates',
      desc: 'Fresh internships, MNC, banking, govt & startup roles every day',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Bell,
      title: 'Deadline Alerts',
      desc: 'Never miss application deadlines with smart notifications',
      color: 'bg-red-50 text-red-600',
    },
    {
      icon: Target,
      title: 'ATS Resume Matcher',
      desc: 'AI-powered resume analysis against any job description',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Users,
      title: 'Referral Hub',
      desc: 'Get referred by employees at Google, TCS, Flipkart & more',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: BookOpen,
      title: 'Application Tracker',
      desc: 'Track all your job applications in one organized place',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: TrendingUp,
      title: 'Saved Jobs',
      desc: 'Bookmark interesting roles and apply when ready',
      color: 'bg-indigo-50 text-indigo-600',
    },
  ]

  const STATS = [
    { value: '500+', label: 'Jobs Daily' },
    { value: '6', label: 'Categories' },
    { value: 'Free', label: 'Forever' },
    { value: 'AI', label: 'Powered' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br 
                    from-slate-50 via-orange-50/40 to-white">

      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 
                      text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 
                        bg-slate-100 border border-slate-200 
                        rounded-full text-black text-sm 
                        font-bold mb-6">
          <GraduationCap className="w-4 h-4" />
          India's Student Job Portal
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-black 
                       text-gray-900 mb-4 leading-tight">
          Find your next role with
          <span className="text-black"> confidence</span>
          <br />and speed.
        </h1>

        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
          Curated job updates, AI resume matching, referral network, 
          and deadline alerts — all in one place. Free for students.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-10">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-slate-900">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center 
                        justify-center gap-3 mb-4">
          <button
            onClick={openRegister}
            className="flex items-center gap-2 px-8 py-3.5 
                       bg-slate-900 hover:bg-black text-white 
                       font-bold text-base rounded-2xl 
                       transition-all shadow-lg shadow-black/25
                       hover:-translate-y-0.5 hover:shadow-black/35">
            <GraduationCap className="w-5 h-5" />
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={openLogin}
            className="flex items-center gap-2 px-8 py-3.5 
                       border-2 border-gray-200 hover:border-blue-300
                       text-gray-700 font-semibold text-base 
                       rounded-2xl transition-all hover:bg-blue-50">
            Already registered? Login
          </button>
        </div>

        <p className="text-xs text-gray-400">
          No credit card required · Free forever · 
          Instant access after registration
        </p>
      </div>

      {/* Features grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-center text-2xl font-bold 
                       text-gray-900 mb-2">
          Everything you need to land your dream job
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Register in 30 seconds and unlock all features instantly
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 
                        lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title}
              className="bg-white rounded-2xl border border-gray-100 
                         shadow-sm p-5 hover:shadow-md 
                         hover:border-orange-100 transition-all group">
              <div className={`w-10 h-10 rounded-xl 
                flex items-center justify-center mb-3 
                ${f.color} group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 
                        to-orange-600 rounded-3xl p-8 text-center 
                        text-white">
          <Shield className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">
            Ready to start your career journey?
          </h3>
          <p className="text-orange-100 text-sm mb-6">
            Join thousands of students finding jobs through Geonixa NextJob
          </p>
          <div className="flex flex-col sm:flex-row gap-3 
                          justify-center">
            <button onClick={openRegister}
              className="flex items-center justify-center gap-2 
                         px-6 py-3 bg-white text-orange-600 
                         font-bold rounded-xl hover:bg-orange-50 
                         transition-colors">
              <GraduationCap className="w-4 h-4" />
              Register as Student
            </button>
            <button onClick={openLogin}
              className="flex items-center justify-center gap-2 
                         px-6 py-3 bg-white/20 text-white 
                         font-semibold rounded-xl 
                         hover:bg-white/30 transition-colors
                         border border-white/30">
              Login
            </button>
          </div>

          <div className="flex justify-center gap-6 mt-6">
            {[
              'Free internship alerts',
              'AI resume matcher',
              'Referral network',
            ].map(item => (
              <div key={item}
                className="flex items-center gap-1.5 text-xs 
                           text-orange-100">
                <CheckCircle className="w-3.5 h-3.5" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student auth modal */}
      <StudentAuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={onLogin}
        defaultTab={defaultTab}
      />
    </div>
  )
}
